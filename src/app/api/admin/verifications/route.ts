import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { and, eq, isNotNull } from "drizzle-orm";

export async function GET() {
  const users = await db
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
      phone: profiles.phone,
      studentIdUrl: profiles.studentIdUrl,
      campus: profiles.campus,
      createdAt: profiles.createdAt,
    })
    .from(profiles)
    .where(and(isNotNull(profiles.studentIdUrl), eq(profiles.studentIdVerified, false)));

  return NextResponse.json({ users });
}
