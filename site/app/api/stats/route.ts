import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

export async function GET() {
  try {
    const [
      { count: totalVisits, error: visitsError },
      { count: uniqueVisitors, error: uniqueError },
      { count: totalChecklistCompletions, error: checklistError },
      { count: totalVotes, error: votesError },
      { count: totalFeedbacks, error: feedbacksError },
      { data: voteDistribution, error: voteDistError },
    ] = await Promise.all([
      supabaseAdmin.from("visits").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("visits")
        .select("visitor_id", { count: "exact", head: true }),
      supabaseAdmin
        .from("user_checklists")
        .select("*", { count: "exact", head: true })
        .eq("completed", true),
      supabaseAdmin
        .from("phase_votes")
        .select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("feedbacks")
        .select("*", { count: "exact", head: true }),
      supabaseAdmin.from("phase_votes").select("phase"),
    ]);

    const errors = [
      visitsError,
      uniqueError,
      checklistError,
      votesError,
      feedbacksError,
      voteDistError,
    ].filter(Boolean);
    if (errors.length) throw errors[0];

    const votesByPhase = [0, 0, 0, 0, 0, 0];
    (voteDistribution || []).forEach((v) => {
      if (v.phase >= 1 && v.phase <= 6) votesByPhase[v.phase - 1]++;
    });

    return NextResponse.json({
      totalVisits: totalVisits || 0,
      uniqueVisitors: uniqueVisitors || 0,
      totalChecklistCompletions: totalChecklistCompletions || 0,
      totalVotes: totalVotes || 0,
      totalFeedbacks: totalFeedbacks || 0,
      votesByPhase,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : "Failed to fetch stats") },
      { status: 500 }
    );
  }
}
