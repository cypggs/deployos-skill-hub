import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visitor_id } = body;

    if (!visitor_id || typeof visitor_id !== "string") {
      return NextResponse.json(
        { error: "visitor_id is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("visits").insert({
      visitor_id,
      ip_hash: null,
      user_agent_hash: null,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : "Failed to record visit") },
      { status: 500 }
    );
  }
}
