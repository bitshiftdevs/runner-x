import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { jobs, jobStages, messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { JobStatus } from "@/types";
import { JOB_STAGE_LABELS } from "@/constants";

const STAGE_FLOW: Record<string, JobStatus> = {
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
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);

  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.runnerId !== userId) {
    return NextResponse.json({ error: "Not your mission" }, { status: 403 });
  }

  const nextStage = STAGE_FLOW[job.status];
  if (!nextStage) {
    return NextResponse.json({ error: "Cannot advance from this stage" }, { status: 400 });
  }

  const [updated] = await db
    .update(jobs)
    .set({ status: nextStage, updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  await db.insert(jobStages).values({
    jobId: id,
    stage: nextStage,
    actorId: userId,
  });

  await db.insert(messages).values({
    jobId: id,
    senderId: userId,
    content: `Stage updated: ${JOB_STAGE_LABELS[nextStage]}`,
    isSystem: true,
  });

  return NextResponse.json({ job: updated });
}
