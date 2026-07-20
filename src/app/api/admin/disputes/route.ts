import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  const { data: disputes } = await db
    .from("jobs")
    .select("*")
    .eq("status", "disputed")
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ disputes: disputes ?? [] });
}
