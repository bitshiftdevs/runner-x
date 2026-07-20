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

  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.requester_id !== userId) return NextResponse.json({ error: "Only requester can confirm" }, { status: 403 });
  if (job.status !== "delivered") return NextResponse.json({ error: "Job not at delivered stage" }, { status: 400 });

  const { data: updated } = await db
    .from("jobs")
    .update({ status: "confirmed" })
    .eq("id", id)
    .select()
    .single();

  await db.from("job_stages").insert({ job_id: id, stage: "confirmed", actor_id: userId });
  await db.from("messages").insert({ job_id: id, sender_id: userId, content: "Delivery confirmed! Quest completed. 🎉" });

  return NextResponse.json({ job: updated });
}
