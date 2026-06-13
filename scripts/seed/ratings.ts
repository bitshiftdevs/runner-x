type JobRow = { id: string; requesterId: string; runnerId: string | null; status: string };

const REVIEWS = [
  "Super fast and reliable. Will post again!",
  "Delivered everything perfectly.",
  "No issues at all. Great runner.",
  "Arrived on time, items intact.",
  "Excellent service. Five stars easily.",
  "Very professional, communicated well.",
];

export function buildRatings(insertedJobs: JobRow[]) {
  const completedJobs = insertedJobs.filter((j) => j.status === "completed");

  return completedJobs.flatMap((job) => {
    if (!job.runnerId) return [];
    return [
      {
        jobId: job.id,
        raterId: job.requesterId,
        rateeId: job.runnerId,
        score: 4 + Math.floor(Math.random() * 2),
        comment: REVIEWS[Math.floor(Math.random() * REVIEWS.length)],
      },
    ];
  });
}
