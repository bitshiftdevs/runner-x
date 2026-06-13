import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

async function getUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value ?? null;
}

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ messages: [] }, { status: 401 });

  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ messages: [] });

  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.jobId, jobId))
    .orderBy(asc(messages.createdAt));

  return NextResponse.json({ messages: result });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId, content, imageUrl } = await request.json();
  if (!jobId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [msg] = await db
    .insert(messages)
    .values({
      jobId,
      senderId: userId,
      content,
      imageUrl: imageUrl ?? null,
    })
    .returning();

  return NextResponse.json({ message: msg });
}
