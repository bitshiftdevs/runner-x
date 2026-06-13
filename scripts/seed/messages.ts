type JobRow = { id: string; requesterId: string; runnerId: string | null; status: string };

export function buildMessages(insertedJobs: JobRow[]) {
  const activeJobs = insertedJobs.filter((j) =>
    ["accepted", "heading_to_vendor", "at_vendor", "heading_to_delivery"].includes(j.status),
  );

  return activeJobs.flatMap((job) => [
    { jobId: job.id, senderId: job.requesterId, content: "Hey, are you on your way yet?", isSystem: false },
    { jobId: job.id, senderId: job.runnerId ?? job.requesterId, content: "Yes! Just picked it up, heading to you now.", isSystem: false },
    { jobId: job.id, senderId: job.requesterId, content: "Thanks! I'm in my room.", isSystem: false },
  ]);
}
