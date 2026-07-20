import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  if (!userId) return NextResponse.json({ payments: [] }, { status: 401 });

  const { data: payments } = await db
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ payments: payments ?? [] });
}
