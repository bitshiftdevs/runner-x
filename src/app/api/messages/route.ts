import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";

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

  const { data: messages } = await db
    .from("messages")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  return NextResponse.json({ messages: messages ?? [] });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId, content, imageUrl } = await request.json();
  if (!jobId || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data: msg } = await db
    .from("messages")
    .insert({ job_id: jobId, sender_id: userId, content, image_url: imageUrl ?? null })
    .select()
    .single();

  return NextResponse.json({ message: msg });
}
