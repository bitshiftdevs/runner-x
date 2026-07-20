import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const limit = Number(searchParams.get("limit") || "50");
  const offset = Number(searchParams.get("offset") || "0");

  let query = db.from("profiles").select("*", { count: "exact" });

  if (role) query = query.eq("role", role);
  if (status) query = query.eq("student_id_status", status);
  if (search) query = query.or(`full_name.ilike.%${search}%,phone_number.ilike.%${search}%`);

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data, total: count ?? 0 });
}
