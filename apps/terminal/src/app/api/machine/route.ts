import { NextResponse } from "next/server";
import { supabaseSelect, supabaseInsert } from "@/lib/supabase";

let isKillSwitchActive = false;
let currentTier = "TIER_1_WATCH";

const cronSchedules = [
  {
    id: "cron-001",
    job_name: "REALTIME_INGESTION_PASS",
    cron_expression: "*/5 * * * *",
    cadence: "EVERY_5_MIN",
    next_run_iso: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  },
  {
    id: "cron-002",
    job_name: "HOURLY_MACRO_PASS",
    cron_expression: "0 * * * *",
    cadence: "HOURLY",
    next_run_iso: new Date(Date.now() + 60 * 60 * 1000).toISOString()
  },
  {
    id: "cron-003",
    job_name: "DAILY_BRIEF_GENERATION",
    cron_expression: "0 6 * * *",
    cadence: "DAILY_0600_UTC",
    next_run_iso: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
];

const fallbackAuditLogs = [
  {
    id: "log-001",
    job_name: "INGESTION_PASS_WAVE_1",
    trigger_type: "CADENCE_PASS",
    status: "SUCCESS",
    duration_ms: 142,
    rows_processed: 21,
    cost_usd_scaled: "25",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: "log-002",
    job_name: "EDGE_DETECTION_PASS",
    trigger_type: "AFTER_INGESTION",
    status: "SUCCESS",
    duration_ms: 38,
    rows_processed: 4,
    cost_usd_scaled: "0",
    timestamp: new Date(Date.now() - 5 * 60 * 1000 + 1000).toISOString()
  },
  {
    id: "log-003",
    job_name: "DAILY_BRIEF_GENERATION",
    trigger_type: "CRON_0600_UTC",
    status: "SUCCESS",
    duration_ms: 85,
    rows_processed: 1,
    cost_usd_scaled: "0",
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

export async function GET() {
  const dbLogs = await supabaseSelect("audit_logs", "*", 20);
  const dbState = await supabaseSelect("machine_state", "*", 1);

  if (dbState && dbState.length > 0) {
    isKillSwitchActive = !!dbState[0].kill_switch_active;
    if (dbState[0].tier) currentTier = dbState[0].tier;
  }

  const logs = (dbLogs && dbLogs.length > 0) ? dbLogs : fallbackAuditLogs;

  return NextResponse.json({
    kill_switch_active: isKillSwitchActive,
    current_tier: currentTier,
    schedules: cronSchedules.map(s => ({
      ...s,
      status: isKillSwitchActive ? "HALTED" : "ACTIVE"
    })),
    audit_logs: logs.map((l: any) => ({
      ...l,
      status: isKillSwitchActive && l.status === "SUCCESS" ? "REJECTED_KILL_SWITCH" : l.status
    })),
    persisted: !!(dbLogs && dbLogs.length > 0)
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.kill_switch_active === "boolean") {
      isKillSwitchActive = body.kill_switch_active;
    }
    if (typeof body.tier === "string") {
      currentTier = body.tier;
    }

    // Persist to Supabase audit log
    await supabaseInsert("audit_logs", {
      id: `log-${Date.now()}`,
      job_name: "KILL_SWITCH_TOGGLE",
      trigger_type: "MANUAL_OPERATOR",
      status: isKillSwitchActive ? "KILL_SWITCH_ENGAGED" : "KILL_SWITCH_DISENGAGED",
      duration_ms: 5,
      rows_processed: 0,
      cost_usd_scaled: "0",
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      kill_switch_active: isKillSwitchActive,
      current_tier: currentTier
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 500 });
  }
}
