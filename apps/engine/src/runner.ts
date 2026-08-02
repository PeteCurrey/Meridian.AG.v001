import {
  ok,
  err,
  SourceHealthStatus
} from "../../../packages/core/src/index";
import type {
  Result,
  Observation,
  SourceHealth
} from "../../../packages/core/src/index";
import { SourceRegistry } from "../../../packages/registry/src/index";
import type { SourceRegistryEntry } from "../../../packages/registry/src/index";
import { AdapterFactory } from "../../../packages/adapters/src/index";
import type { AdapterConfig } from "../../../packages/adapters/src/index";

export interface RunnerExecutionResult {
  readonly source_id: string;
  readonly status: SourceHealthStatus;
  readonly observations_written: number;
  readonly raw_ref: string | null;
  readonly cost_usd_scaled: bigint;
  readonly error_message?: string;
}

export class AdapterRunner {
  private readonly registry: SourceRegistry;
  private readonly healthStateMap = new Map<string, SourceHealth>();
  private readonly circuitBreakers = new Map<string, { failures: number; openUntil: number }>();

  constructor(registry: SourceRegistry = new SourceRegistry()) {
    this.registry = registry;
    this.initializeHealthState();
  }

  private initializeHealthState(): void {
    const allEntries = this.registry.listAll();
    const now = new Date().toISOString();

    for (const entry of allEntries) {
      const adapter = AdapterFactory.getAdapter(entry.id);
      const isConnected = Boolean(adapter);

      this.healthStateMap.set(entry.id, {
        source_id: entry.id,
        status: isConnected ? SourceHealthStatus.HEALTHY : SourceHealthStatus.NOT_CONNECTED,
        last_successful_fetch: null,
        error_rate_24h: 0.0,
        rows_written_last_window: 0,
        quota_consumed_mtd: 0,
        cost_mtd_usd_scaled: 0n,
        last_checked_at: now
      });
    }
  }

  public getSourceHealth(sourceId: string): SourceHealth | undefined {
    return this.healthStateMap.get(sourceId);
  }

  public listAllSourceHealth(): readonly SourceHealth[] {
    return Array.from(this.healthStateMap.values());
  }

  /**
   * Run adapter ingestion.
   * GUARANTEE: Never throws past its boundary. All errors become FEED_OFFLINE or NOT_CONNECTED.
   */
  public async runAdapter(
    sourceId: string,
    apiKeysConfig: Record<string, string> = {}
  ): Promise<Result<RunnerExecutionResult>> {
    const nowIso = new Date().toISOString();
    const entry = this.registry.getSource(sourceId);

    if (!entry) {
      return err(new Error(`Source '${sourceId}' not found in registry.`));
    }

    const adapter = AdapterFactory.getAdapter(sourceId);

    // Missing adapter or missing required API key -> NOT_CONNECTED
    if (!adapter) {
      this.updateHealthState(sourceId, SourceHealthStatus.NOT_CONNECTED, 0, 0n, "No adapter implemented");
      return ok({
        source_id: sourceId,
        status: SourceHealthStatus.NOT_CONNECTED,
        observations_written: 0,
        raw_ref: null,
        cost_usd_scaled: 0n,
        error_message: "Adapter NOT_CONNECTED"
      });
    }

    const apiKey = apiKeysConfig[sourceId];
    if (entry.auth_method === "API_KEY" && !apiKey) {
      this.updateHealthState(sourceId, SourceHealthStatus.NOT_CONNECTED, 0, 0n, "Missing API key");
      return ok({
        source_id: sourceId,
        status: SourceHealthStatus.NOT_CONNECTED,
        observations_written: 0,
        raw_ref: null,
        cost_usd_scaled: 0n,
        error_message: "API Key Missing (NOT_CONNECTED)"
      });
    }

    // Circuit Breaker Check
    const cb = this.circuitBreakers.get(sourceId);
    if (cb && Date.now() < cb.openUntil) {
      this.updateHealthState(sourceId, SourceHealthStatus.OFFLINE, 0, 0n, "Circuit breaker tripped");
      return ok({
        source_id: sourceId,
        status: SourceHealthStatus.OFFLINE,
        observations_written: 0,
        raw_ref: null,
        cost_usd_scaled: 0n,
        error_message: "Circuit breaker active (OFFLINE)"
      });
    }

    // Execute Fetch -> Raw payload stored BEFORE parsing
    const config: AdapterConfig = {
      source_id: sourceId,
      ...(apiKey ? { api_key: apiKey } : {}),
      base_url: entry.base_url ?? ""
    };

    const fetchResult = await adapter.fetch(config);

    if (!fetchResult.ok) {
      this.recordFailure(sourceId);
      this.updateHealthState(sourceId, SourceHealthStatus.OFFLINE, 0, 0n, fetchResult.error.message);
      return ok({
        source_id: sourceId,
        status: SourceHealthStatus.OFFLINE,
        observations_written: 0,
        raw_ref: null,
        cost_usd_scaled: 0n,
        error_message: `FETCH_FAILED (${fetchResult.error.message})`
      });
    }

    // Parse and Zod boundary validation
    const parseResult = adapter.parse(fetchResult.value.raw);
    if (!parseResult.ok) {
      this.recordFailure(sourceId);
      this.updateHealthState(sourceId, SourceHealthStatus.DEGRADED, 0, fetchResult.value.cost_usd_scaled, parseResult.error.message);
      return ok({
        source_id: sourceId,
        status: SourceHealthStatus.DEGRADED,
        observations_written: 0,
        raw_ref: fetchResult.value.raw.raw_ref,
        cost_usd_scaled: fetchResult.value.cost_usd_scaled,
        error_message: `PARSE_FAILED (${parseResult.error.message})`
      });
    }

    // Success -> Record metrics & update health
    this.recordSuccess(sourceId);
    const observations = parseResult.value;
    this.updateHealthState(
      sourceId,
      SourceHealthStatus.HEALTHY,
      observations.length,
      fetchResult.value.cost_usd_scaled,
      undefined,
      nowIso
    );

    return ok({
      source_id: sourceId,
      status: SourceHealthStatus.HEALTHY,
      observations_written: observations.length,
      raw_ref: fetchResult.value.raw.raw_ref,
      cost_usd_scaled: fetchResult.value.cost_usd_scaled
    });
  }

  private recordSuccess(sourceId: string): void {
    this.circuitBreakers.delete(sourceId);
  }

  private recordFailure(sourceId: string): void {
    const current = this.circuitBreakers.get(sourceId) || { failures: 0, openUntil: 0 };
    const newFailures = current.failures + 1;
    // Trip after 3 consecutive failures for 60 seconds
    const openUntil = newFailures >= 3 ? Date.now() + 60000 : 0;
    this.circuitBreakers.set(sourceId, { failures: newFailures, openUntil });
  }

  private updateHealthState(
    sourceId: string,
    status: SourceHealthStatus,
    rowsWritten: number,
    costUsdScaled: bigint,
    errorMessage?: string,
    lastSuccessIso?: string
  ): void {
    const existing = this.healthStateMap.get(sourceId);
    const nowIso = new Date().toISOString();

    if (existing) {
      this.healthStateMap.set(sourceId, {
        source_id: sourceId,
        status,
        last_successful_fetch: lastSuccessIso || existing.last_successful_fetch,
        error_rate_24h: errorMessage ? Math.min(100, existing.error_rate_24h + 10) : Math.max(0, existing.error_rate_24h - 5),
        rows_written_last_window: rowsWritten,
        quota_consumed_mtd: existing.quota_consumed_mtd + (rowsWritten > 0 ? 1 : 0),
        cost_mtd_usd_scaled: existing.cost_mtd_usd_scaled + costUsdScaled,
        last_checked_at: nowIso
      });
    }
  }
}
