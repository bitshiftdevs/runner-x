import type { Payment, PaymentStatus } from "@/types";

export type InitiatePaymentParams = {
  amount: number;
  currency: string;
  phoneNumber: string;
  description: string;
  jobId: string;
  userId: string;
};

export type PaymentResult = {
  success: boolean;
  providerRef: string | null;
  status: PaymentStatus;
  message: string;
};

export abstract class PaymentService {
  abstract initiatePayment(
    params: InitiatePaymentParams,
  ): Promise<PaymentResult>;
  abstract verifyPayment(providerRef: string): Promise<PaymentResult>;
  abstract refundPayment(paymentId: string): Promise<PaymentResult>;
  abstract getPaymentHistory(userId: string): Promise<Payment[]>;
}
