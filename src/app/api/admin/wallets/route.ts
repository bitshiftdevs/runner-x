import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || "50");
  const offset = Number(searchParams.get("offset") || "0");

  const { data, count, error } = await db
    .from("runner_wallets")
    .select("*, profiles!runner_wallets_runner_id_fkey(full_name, phone_number)", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ wallets: data, total: count ?? 0 });
}
