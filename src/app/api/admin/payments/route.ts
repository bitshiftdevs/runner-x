import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = Number(searchParams.get("limit") || "50");
  const offset = Number(searchParams.get("offset") || "0");

  let query = db.from("payments").select("*", { count: "exact" });

  if (status) query = query.eq("status", status);

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ payments: data, total: count ?? 0 });
}
