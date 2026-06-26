import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

export async function GET() {
  try {
    const start = Date.now();
    const { error } = await supabaseAdmin
      .from("checklist_items")
      .select("id")
      .limit(1);
    const latency = Date.now() - start;

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      latency,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 }
    );
  }
}
