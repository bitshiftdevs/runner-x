type JobRow = { id: string; requesterId: string; totalFee: string; status: string };

export function buildPayments(insertedJobs: JobRow[]) {
  const completedJobs = insertedJobs.filter((j) => j.status === "completed");

  return completedJobs.map((job) => ({
    jobId: job.id,
    userId: job.requesterId,
    amount: job.totalFee,
    currency: "GHS",
    provider: "moolre",
    providerRef: `MR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    status: "success" as const,
  }));
}
