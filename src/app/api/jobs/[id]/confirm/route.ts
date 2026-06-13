import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { jobs, jobStages, messages, payments } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  if (job.requesterId !== userId) {
    return NextResponse.json({ error: "Only requester can confirm" }, { status: 403 });
  }
  if (job.status !== "delivered") {
    return NextResponse.json({ error: "Job not at delivered stage" }, { status: 400 });
  }

  const [updated] = await db
    .update(jobs)
    .set({ status: "completed", updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  await db.insert(jobStages).values({
    jobId: id,
    stage: "completed",
    actorId: userId,
  });

  // Create payment record for runner
  if (job.runnerId) {
    await db.insert(payments).values({
      jobId: id,
      userId: job.runnerId,
      amount: job.runnerEarnings,
      status: "success",
    });
  }

  await db.insert(messages).values({
    jobId: id,
    senderId: userId,
    content: "Delivery confirmed! Quest completed. 🎉",
    isSystem: true,
  });

  return NextResponse.json({ job: updated });
}
