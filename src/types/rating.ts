export type Rating = {
  id: string;
  jobId: string;
  raterId: string;
  rateeId: string;
  score: number;
  comment: string | null;
  createdAt: string;
};
