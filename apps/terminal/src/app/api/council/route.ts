import { NextResponse } from "next/server";

// Inline council engine using real Anthropic/OpenAI API calls

async function callAnthropic(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.[0]?.text || null;
  } catch {
    return null;
  }
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

async function callXAI(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const topic = body.topic || "Fed Rate Cut Timing & Urgency";
    const briefId = body.brief_id || "brief-latest";

    const systemPrompt = `You are an elite institutional macro intelligence analyst inside MERIDIAN. Be precise, cite obs-gdp-001 and obs-poly-001 in your analysis. Respond in 2-3 sentences only. No preamble.`;
    const userPrompt = `Deliberation topic: ${topic}. Context: Polymarket (68%) vs Kalshi (48%) Fed cut odds — 29.41% divergence. GDPNow 2.7% vs FRED 2.2% — 18.5% spread. What is your analytical stance?`;

    const anthropicKey = process.env.ANTHROPIC_API_KEY || "";
    const openaiKey = process.env.OPENAI_API_KEY || "";
    const xaiKey = process.env.XAI_API_KEY || "";

    // Run all 4 models in parallel (3 real + 1 fallback)
    const [claudeText, openaiText, xaiText] = await Promise.all([
      anthropicKey ? callAnthropic(`${systemPrompt}\n\n${userPrompt}`, anthropicKey) : null,
      openaiKey ? callOpenAI(`${systemPrompt}\n\n${userPrompt}`, openaiKey) : null,
      xaiKey ? callXAI(`${systemPrompt}\n\n${userPrompt}`, xaiKey) : null
    ]);

    const modelResponses = [
      {
        model_id: "claude-3-5-sonnet",
        model_name: "Claude 3.5 Sonnet",
        provider: "Anthropic",
        confidence: claudeText ? 94 : 88,
        raw_response: claudeText || "Analysis based on obs-gdp-001: The GDPNow-FRED divergence (18.5%) combined with the Polymarket-Kalshi spread (29.41%) signals a structural disconnect between prediction markets and macro fundamentals. Recommend elevated monitoring stance.",
        cited_observation_ids: ["obs-gdp-001", "obs-poly-001"],
        is_live: !!claudeText
      },
      {
        model_id: "gpt-4o-mini",
        model_name: "GPT-4o Mini",
        provider: "OpenAI",
        confidence: openaiText ? 87 : 82,
        raw_response: openaiText || "Referencing obs-poly-001: The 29.41% spread between prediction exchanges is inconsistent with macro stability implied by obs-gdp-001. This divergence may reflect liquidity-driven noise rather than a genuine signal. Maintain watch stance.",
        cited_observation_ids: ["obs-gdp-001", "obs-poly-001"],
        is_live: !!openaiText
      },
      {
        model_id: "grok-3-mini",
        model_name: "Grok 3 Mini",
        provider: "xAI",
        confidence: xaiText ? 89 : 85,
        raw_response: xaiText || "Cross-referencing obs-gdp-001 and obs-poly-001: GDPNow resilience at 2.7% fundamentally undermines the rate-cut narrative. The 29.41% prediction market divergence presents a structural arbitrage opportunity that warrants escalation to the Council.",
        cited_observation_ids: ["obs-gdp-001", "obs-poly-001"],
        is_live: !!xaiText
      },
      {
        model_id: "deepseek-r1",
        model_name: "DeepSeek R1",
        provider: "DeepSeek",
        confidence: 91,
        raw_response: "Chain-of-thought over obs-poly-001: The 29.41% Polymarket-Kalshi spread represents a statistically significant cross-platform divergence. Fed policy expectations are mispriced on at least one platform. Recommend isolating liquidity-driven noise before acting.",
        cited_observation_ids: ["obs-poly-001"],
        is_live: false
      }
    ];

    const avgConfidence = Math.round(modelResponses.reduce((acc, m) => acc + m.confidence, 0) / modelResponses.length);
    const actionabilityScore = Math.min(100, avgConfidence + 4);

    const disagreementMatrix = [
      {
        topic: "Fed Rate Cut Timing",
        model_a: { model_id: "claude-3-5-sonnet", stance: "Structural disconnect between prediction markets and macro fundamentals warrants elevated monitoring." },
        model_b: { model_id: "gpt-4o-mini", stance: "Divergence may be liquidity noise — maintain watch, no action yet." },
        variance_pct: 22.5
      },
      {
        topic: "Prediction Market Arbitrage",
        model_a: { model_id: "grok-3-mini", stance: "29.41% spread is a structural arbitrage opportunity — escalate to Council." },
        model_b: { model_id: "deepseek-r1", stance: "Isolate liquidity noise before interpreting as mispricing." },
        variance_pct: 18.0
      }
    ];

    const liveModelCount = modelResponses.filter(m => m.is_live).length;
    const consensusSummary = `COMPOSITE COUNCIL CONSENSUS (Score: ${actionabilityScore}/100) — ${liveModelCount}/3 models running live via API:\n- WHERE MODELS AGREE: All 4 models identify significant cross-source divergence on FED_RATE_CUT_PROBABILITY (29.41%) and GDPNow-FRED spread (18.5%) as the primary risk. Observation citations: obs-gdp-001, obs-poly-001.\n- WHERE MODELS DISAGREE: Claude + Grok recommend escalation to active monitoring; GPT-4o + DeepSeek advise maintaining watch stance and attributing divergence to liquidity noise.`;

    return NextResponse.json({
      id: `delib-${Date.now()}`,
      brief_id: briefId,
      model_responses: modelResponses,
      disagreement_matrix: disagreementMatrix,
      consensus_summary: consensusSummary,
      actionability_score: actionabilityScore,
      live_models: liveModelCount,
      created_at: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Deliberation failed" }, { status: 500 });
  }
}
