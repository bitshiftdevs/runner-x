import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  const { data: users } = await db
    .from("profiles")
    .select("id, full_name, phone_number, avatar_url, default_campus, created_at")
    .eq("student_id_status", "pending");

  return NextResponse.json({
    users: (users ?? []).map((u) => ({
      id: u.id,
      fullName: u.full_name,
      phone: u.phone_number,
      studentIdUrl: u.avatar_url,
      campus: u.default_campus,
      createdAt: u.created_at,
    })),
  });
}
