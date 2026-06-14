import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: job } = await db.from("jobs").select("*").eq("id", id).single();

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.status !== "posted") return NextResponse.json({ error: "Job not available" }, { status: 400 });
  if (job.requester_id === userId) return NextResponse.json({ error: "Cannot accept own job" }, { status: 400 });

  const { data: updated } = await db
    .from("jobs")
    .update({ runner_id: userId, status: "accepted" })
    .eq("id", id)
    .select()
    .single();

  await db.from("messages").insert({
    job_id: id,
    sender_id: userId,
    content: "Runner has accepted this quest!",
  });

  return NextResponse.json({ job: updated });
}
