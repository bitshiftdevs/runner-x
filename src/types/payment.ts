export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type Payment = {
  id: string;
  jobId: string;
  userId: string;
  amount: number;
  currency: string;
  provider: string;
  providerRef: string | null;
  status: PaymentStatus;
  createdAt: string;
};
