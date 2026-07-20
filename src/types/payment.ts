export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type Payment = {
  id: string;
  jobId: string;
  userId: string;
  amount: number;
  currency: string;
  channel: string | null;
  payer: string | null;
  providerRef: string | null;
  externalRef: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};
