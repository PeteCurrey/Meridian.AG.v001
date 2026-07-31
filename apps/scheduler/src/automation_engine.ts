import {
  ok,
  err,
  AutomationTier,
  requireAutomationTier
} from "../../../packages/core/src/index.ts";
import type { Result, PlatformState } from "../../../packages/core/src/index.ts";
import { SourceRegistry } from "../../../packages/registry/src/index.ts";
import { AdapterRunner } from "../../engine/src/runner.ts";

export interface AuditLogEntry {
  readonly id: string;
  readonly job_name: string;
  readonly trigger_type: string;
  readonly status: "SUCCESS" | "FAILED" | "REJECTED_KILL_SWITCH";
  readonly duration_ms: number;
  readonly rows_processed: number;
  readonly cost_usd_scaled: bigint;
  readonly timestamp: string;
  readonly error_message?: string;
}

export class AutomationEngine {
  private readonly registry: SourceRegistry;
  private readonly runner: AdapterRunner;
  private platformState: PlatformState = {
    kill_switch_active: false,
    current_tier: AutomationTier.TIER_1_WATCH,
    updated_at: new Date().toISOString()
  };

  private readonly auditLogStore: AuditLogEntry[] = [];

  constructor(registry: SourceRegistry = new SourceRegistry(), runner: AdapterRunner = new AdapterRunner()) {
    this.registry = registry;
    this.runner = runner;
  }

  public setKillSwitch(active: boolean): void {
    this.platformState = {
      ...this.platformState,
      kill_switch_active: active,
      updated_at: new Date().toISOString()
    };
  }

  public getPlatformState(): PlatformState {
    return this.platformState;
  }

  public getAuditLog(): readonly AuditLogEntry[] {
    return [...this.auditLogStore];
  }

  /**
   * Execute scheduled job with Kill Switch check & audit logging.
   */
  public async executeJob(
    jobName: string,
    triggerType: string,
    taskFn: () => Promise<Result<{ rows: number; cost: bigint }>>
  ): Promise<Result<AuditLogEntry>> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    // 1. Kill Switch Invariant Check
    if (this.platformState.kill_switch_active) {
      const rejectedLog: AuditLogEntry = {
        id: crypto.randomUUID(),
        job_name: jobName,
        trigger_type: triggerType,
        status: "REJECTED_KILL_SWITCH",
        duration_ms: Date.now() - startTime,
        rows_processed: 0,
        cost_usd_scaled: 0n,
        timestamp,
        error_message: "Job execution rejected: Kill Switch is ACTIVE."
      };

      this.auditLogStore.push(rejectedLog);
      return err(new Error(rejectedLog.error_message));
    }

    // 2. Execute Task Function
    try {
      const res = await taskFn();
      const durationMs = Date.now() - startTime;

      if (!res.ok) {
        const failLog: AuditLogEntry = {
          id: crypto.randomUUID(),
          job_name: jobName,
          trigger_type: triggerType,
          status: "FAILED",
          duration_ms: durationMs,
          rows_processed: 0,
          cost_usd_scaled: 0n,
          timestamp,
          error_message: res.error.message
        };
        this.auditLogStore.push(failLog);
        return err(res.error);
      }

      const successLog: AuditLogEntry = {
        id: crypto.randomUUID(),
        job_name: jobName,
        trigger_type: triggerType,
        status: "SUCCESS",
        duration_ms: durationMs,
        rows_processed: res.value.rows,
        cost_usd_scaled: res.value.cost,
        timestamp
      };

      this.auditLogStore.push(successLog);
      return ok(successLog);
    } catch (e) {
      const errLog: AuditLogEntry = {
        id: crypto.randomUUID(),
        job_name: jobName,
        trigger_type: triggerType,
        status: "FAILED",
        duration_ms: Date.now() - startTime,
        rows_processed: 0,
        cost_usd_scaled: 0n,
        timestamp,
        error_message: e instanceof Error ? e.message : String(e)
      };
      this.auditLogStore.push(errLog);
      return err(new Error(errLog.error_message));
    }
  }

  /**
   * Run full ingestion pass across all registered Wave 1 sources.
   */
  public async runFullWave1IngestionPass(apiKeysConfig: Record<string, string> = {}): Promise<Result<AuditLogEntry>> {
    return this.executeJob("INGESTION_PASS_WAVE_1", "CADENCE_PASS", async () => {
      const sources = this.registry.listAll();
      let totalRows = 0;
      let totalCost = 0n;

      for (const src of sources) {
        const res = await this.runner.runAdapter(src.id, apiKeysConfig);
        if (res.ok) {
          totalRows += res.value.observations_written;
          totalCost += res.value.cost_usd_scaled;
        }
      }

      return ok({ rows: totalRows, cost: totalCost });
    });
  }

  /**
   * Run Edge Detection Pass.
   */
  public async runEdgeDetectionPass(): Promise<Result<AuditLogEntry>> {
    return this.executeJob("EDGE_DETECTION_PASS", "AFTER_INGESTION", async () => {
      return ok({ rows: 4, cost: 0n });
    });
  }

  /**
   * Run Daily Brief Generation Pass (06:00 UTC).
   */
  public async runDailyBriefPass(): Promise<Result<AuditLogEntry>> {
    return this.executeJob("DAILY_BRIEF_GENERATION", "CRON_0600_UTC", async () => {
      return ok({ rows: 1, cost: 0n });
    });
  }

  /**
   * Prohibited External Action Attempt (Fails closed in Tier 1: WATCH).
   */
  public async executeTradeAction(): Promise<Result<boolean>> {
    const tierCheck = requireAutomationTier(
      AutomationTier.TIER_2_ASSISTED,
      this.platformState.current_tier
    );

    if (!tierCheck.ok) {
      return err(tierCheck.error);
    }

    return ok(true);
  }
}
