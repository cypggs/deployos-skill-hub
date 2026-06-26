import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

export async function GET() {
  try {
    const { data: votes, error } = await supabaseAdmin
      .from("phase_votes")
      .select("phase");

    if (error) throw error;

    const counts = [0, 0, 0, 0, 0, 0];
    (votes || []).forEach((v) => {
      if (v.phase >= 1 && v.phase <= 6) counts[v.phase - 1]++;
    });

    return NextResponse.json({ counts });
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : "Failed to fetch votes") },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visitor_id, phase } = body;

    if (!visitor_id || typeof phase !== "number" || phase < 1 || phase > 6) {
      return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
    }

    // One vote per visitor per phase? Actually unique on (visitor_id, phase) allows multiple phases.
    const { error } = await supabaseAdmin.from("phase_votes").upsert(
      { visitor_id, phase },
      { onConflict: "visitor_id,phase" }
    );

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : "Failed to vote") },
      { status: 500 }
    );
  }
}
