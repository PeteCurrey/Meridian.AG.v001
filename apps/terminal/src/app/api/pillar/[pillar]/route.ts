import { NextResponse } from "next/server";
import { SourceRegistry } from "@meridian/registry";

const registry = new SourceRegistry();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pillar: string }> }
) {
  const { pillar } = await params;
  const pillarName = pillar.toUpperCase();
  const allSources = registry.listAll();
  const matchedSources = allSources.filter(s => s.pillar === pillarName);

  return NextResponse.json({
    pillar: pillarName,
    sources_count: matchedSources.length,
    sources: matchedSources,
    sample_metrics: [
      { key: `${pillarName}_MACRO_INDEX`, value: 104.2, unit: "INDEX", status: "HEALTHY", updated_at: new Date().toISOString() },
      { key: `${pillarName}_CONVICTION_SCORE`, value: 88, unit: "SCORE_0_100", status: "HEALTHY", updated_at: new Date().toISOString() }
    ]
  });
}
