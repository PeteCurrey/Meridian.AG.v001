import { NextResponse } from "next/server";
import { supabaseSelect, supabaseInsert } from "@/lib/supabase";

export interface ThesisItem {
  id: string;
  text: string;
  falsification_condition: string;
  review_date: string;
  confidence: number;
}

let globalTheses: ThesisItem[] = [
  {
    id: "th-001",
    text: "US Fed will cut rates in Q4 2026 due to cooling labor dynamics.",
    falsification_condition: "Core PCE inflation accelerates above 3.2% year-over-year.",
    review_date: "2026-10-01",
    confidence: 75
  },
  {
    id: "th-002",
    text: "Semiconductor ASPs will remain elevated through Q3 on enterprise AI CapEx.",
    falsification_condition: "TSMC monthly revenue drops > 5% YoY for two consecutive months.",
    review_date: "2026-11-15",
    confidence: 82
  }
];

export async function GET() {
  // Attempt Supabase query first
  const dbTheses = await supabaseSelect<ThesisItem>("theses", "*", 50);
  const thesesList = (dbTheses && dbTheses.length > 0) ? dbTheses : globalTheses;

  return NextResponse.json({
    total: thesesList.length,
    theses: thesesList,
    persisted: !!(dbTheses && dbTheses.length > 0)
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, falsification_condition, confidence } = body;

    // INVARIANT: Thesis WITHOUT falsification condition MUST BE REJECTED
    if (!falsification_condition || typeof falsification_condition !== "string" || falsification_condition.trim().length === 0) {
      return NextResponse.json(
        { error: "REJECTED: A thesis without a mandatory falsification condition cannot be saved." },
        { status: 400 }
      );
    }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Thesis statement text is required." }, { status: 400 });
    }

    const newThesis: ThesisItem = {
      id: `th-${Date.now()}`,
      text: text.trim(),
      falsification_condition: falsification_condition.trim(),
      review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      confidence: typeof confidence === "number" ? Math.min(100, Math.max(0, confidence)) : 75
    };

    // Attempt Supabase insert
    const inserted = await supabaseInsert("theses", newThesis);

    // Update in-memory cache
    globalTheses = [newThesis, ...globalTheses];

    return NextResponse.json(inserted || newThesis, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 500 });
  }
}
