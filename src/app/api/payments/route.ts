import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  if (!userId) return NextResponse.json({ payments: [] }, { status: 401 });

  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt));

  return NextResponse.json({ payments: result });
}
