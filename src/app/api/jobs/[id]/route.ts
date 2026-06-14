import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data: job } = await db.from("jobs").select("*").eq("id", id).single();

  if (!job) return NextResponse.json({ job: null }, { status: 404 });
  return NextResponse.json({ job });
}
