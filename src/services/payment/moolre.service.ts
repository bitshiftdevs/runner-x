import type { Payment } from "@/types";
import {
  type InitiatePaymentParams,
  type PaymentResult,
  PaymentService,
} from "./payment.service";

export class MoolrePaymentService extends PaymentService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    super();
    this.baseUrl = process.env.NEXT_PUBLIC_MOOLRE_API_URL ?? "";
    this.apiKey = process.env.MOOLRE_API_KEY ?? "";
  }

  async initiatePayment(params: InitiatePaymentParams): Promise<PaymentResult> {
    const res = await fetch(`${this.baseUrl}/collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        phone_number: params.phoneNumber,
        description: params.description,
        reference: `${params.jobId}_${Date.now()}`,
      }),
    });

    const data = await res.json();

    return {
      success: res.ok,
      providerRef: data.reference ?? null,
      status: res.ok ? "pending" : "failed",
      message: data.message ?? "Payment initiated",
    };
  }

  async verifyPayment(providerRef: string): Promise<PaymentResult> {
    const res = await fetch(`${this.baseUrl}/collections/${providerRef}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    const data = await res.json();

    return {
      success: data.status === "success",
      providerRef,
      status: data.status ?? "pending",
      message: data.message ?? "",
    };
  }

  async refundPayment(paymentId: string): Promise<PaymentResult> {
    const res = await fetch(`${this.baseUrl}/refunds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ payment_id: paymentId }),
    });

    const data = await res.json();

    return {
      success: res.ok,
      providerRef: data.reference ?? null,
      status: res.ok ? "refunded" : "failed",
      message: data.message ?? "",
    };
  }

  async getPaymentHistory(_userId: string): Promise<Payment[]> {
    // Payments are stored in our DB, not fetched from Moolre
    return [];
  }
}
