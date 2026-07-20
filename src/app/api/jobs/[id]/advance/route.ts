import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";

const STAGE_FLOW: Record<string, string> = {
  accepted: "heading_to_vendor",
  heading_to_vendor: "at_vendor",
  at_vendor: "heading_to_delivery",
  heading_to_delivery: "delivered",
};

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
  if (job.runner_id !== userId) return NextResponse.json({ error: "Not your mission" }, { status: 403 });

  const nextStage = STAGE_FLOW[job.status];
  if (!nextStage) return NextResponse.json({ error: "Cannot advance from this stage" }, { status: 400 });

  const { data: updated } = await db
    .from("jobs")
    .update({ status: nextStage })
    .eq("id", id)
    .select()
    .single();

  await db.from("job_stages").insert({ job_id: id, stage: nextStage, actor_id: userId });
  await db.from("messages").insert({ job_id: id, sender_id: userId, content: `Stage updated: ${nextStage}` });

  return NextResponse.json({ job: updated });
}
