import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const limit = Number(searchParams.get("limit") || "50");
  const offset = Number(searchParams.get("offset") || "0");

  let query = db.from("jobs").select("*", { count: "exact" });

  if (status) query = query.eq("status", status);
  if (category) query = query.eq("category", category);

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ jobs: data, total: count ?? 0 });
}
