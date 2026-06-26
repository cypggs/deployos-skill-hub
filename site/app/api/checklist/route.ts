import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitor_id");

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("checklist_items")
      .select("*")
      .order("item_order", { ascending: true });

    if (itemsError) throw itemsError;

    let completions: string[] = [];
    if (visitorId) {
      const { data: userItems, error: userError } = await supabaseAdmin
        .from("user_checklists")
        .select("item_id, completed")
        .eq("visitor_id", visitorId);

      if (userError) throw userError;
      completions = (userItems || [])
        .filter((u) => u.completed)
        .map((u) => u.item_id);
    }

    return NextResponse.json({ items, completions });
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : "Failed to fetch checklist") },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visitor_id, item_id, completed } = body;

    if (!visitor_id || !item_id || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("user_checklists").upsert(
      {
        visitor_id,
        item_id,
        completed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "visitor_id,item_id" }
    );

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : "Failed to update checklist") },
      { status: 500 }
    );
  }
}
