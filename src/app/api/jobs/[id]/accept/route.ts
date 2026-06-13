import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { jobs, messages } from "@/db/schema";
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

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.status !== "posted") {
    return NextResponse.json({ error: "Job not available" }, { status: 400 });
  }
  if (job.requesterId === userId) {
    return NextResponse.json({ error: "Cannot accept own job" }, { status: 400 });
  }

  const [updated] = await db
    .update(jobs)
    .set({ runnerId: userId, status: "accepted", updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  // System message
  await db.insert(messages).values({
    jobId: id,
    senderId: userId,
    content: "Runner has accepted this quest!",
    isSystem: true,
  });

  return NextResponse.json({ job: updated });
}
