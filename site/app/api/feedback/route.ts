import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ feedbacks: data });
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : "Failed to fetch feedbacks") },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visitor_id, author, content } = body;

    if (!visitor_id || !content || typeof content !== "string") {
      return NextResponse.json(
        { error: "visitor_id and content are required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("feedbacks").insert({
      visitor_id,
      author: author || "Anonymous",
      content: content.slice(0, 500),
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : "Failed to submit feedback") },
      { status: 500 }
    );
  }
}
