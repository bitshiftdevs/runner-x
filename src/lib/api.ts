import type {
  AppNotification,
  Job,
  JobCategory,
  Message,
  Payment,
  Profile,
  UrgencyLevel,
} from "@/types";

type JobsQuery = { mine?: boolean; category?: JobCategory; urgency?: UrgencyLevel };

type AdminVerification = { id: string; fullName: string; phone: string; studentIdUrl: string; campus: string; createdAt: string };
type AdminDispute = { id: string; title: string; description: string; totalFee: string; runnerEarnings: string; status: string; createdAt: string; updatedAt: string };

type CreateJobPayload = {
  title: string;
  description: string;
  category: JobCategory;
  urgency: UrgencyLevel;
  vendorName: string | null;
  pickupLocation: { lat: number; lng: number; address: string };
  deliveryLocation: { lat: number; lng: number; address: string };
  distanceKm: number;
};

type ReviewPayload = { score: number; comment: string; tags: string[] };

type PaginatedQuery = { limit?: number; offset?: number };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  return res.json() as Promise<T>;
}

function json(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const api = {
  auth: {
    session: () => request<{ user: Profile | null }>("/api/auth/session"),
    logout: () => fetch("/api/auth/logout", { method: "POST" }),
  },

  jobs: {
    list: (query?: JobsQuery) => {
      const params = new URLSearchParams();
      if (query?.mine) params.set("mine", "true");
      if (query?.category) params.set("category", query.category);
      if (query?.urgency) params.set("urgency", query.urgency);
      const s = params.toString();
      return request<{ jobs: Job[] }>(`/api/jobs${s ? `?${s}` : ""}`);
    },
    get: (id: string) => request<{ job: Job }>(`/api/jobs/${id}`),
    create: (payload: CreateJobPayload) =>
      request<{ job: Job }>("/api/jobs", json(payload)),
    accept: (id: string) =>
      request<{ job: Job }>(`/api/jobs/${id}/accept`, { method: "POST" }),
    advance: (id: string) =>
      request<{ job: Job }>(`/api/jobs/${id}/advance`, { method: "POST" }),
    confirm: (id: string) =>
      request<{ job: Job }>(`/api/jobs/${id}/confirm`, { method: "POST" }),
    review: (id: string, payload: ReviewPayload) =>
      fetch(`/api/jobs/${id}/review`, json(payload)),
  },

  messages: {
    list: (jobId: string) =>
      request<{ messages: Message[] }>(`/api/messages?jobId=${jobId}`),
    send: (jobId: string, content: string) =>
      fetch("/api/messages", json({ jobId, content })),
  },

  notifications: {
    list: () => request<{ notifications: AppNotification[] }>("/api/notifications"),
    markAllRead: () => fetch("/api/notifications/read", { method: "POST" }),
  },

  payments: {
    list: () => request<{ payments: Payment[] }>("/api/payments"),
  },

  admin: {
    stats: () => request<{
      pendingVerifications: number;
      activeDisputes: number;
      dailyJobs: number;
      totalUsers: number;
      totalRevenue: number;
      totalPayments: number;
      totalWalletBalance: number;
      activeWallets: number;
    }>("/api/admin/stats"),

    verifications: {
      list: () => request<{ users: AdminVerification[] }>("/api/admin/verifications"),
      approve: (id: string) => fetch(`/api/admin/verifications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve" }) }),
      reject: (id: string) => fetch(`/api/admin/verifications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reject" }) }),
    },

    disputes: {
      list: () => request<{ disputes: AdminDispute[] }>("/api/admin/disputes"),
      resolve: (id: string) => fetch(`/api/admin/disputes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "resolve" }) }),
    },

    users: {
      list: (opts?: PaginatedQuery & { role?: string; status?: string; search?: string }) =>
        request<{ users: Record<string, unknown>[]; total: number }>(
          `/api/admin/users${qs({ ...opts })}`
        ),
    },

    jobs: {
      list: (opts?: PaginatedQuery & { status?: string; category?: string }) =>
        request<{ jobs: Record<string, unknown>[]; total: number }>(
          `/api/admin/jobs${qs({ ...opts })}`
        ),
    },

    wallets: {
      list: (opts?: PaginatedQuery) =>
        request<{ wallets: Record<string, unknown>[]; total: number }>(
          `/api/admin/wallets${qs({ ...opts })}`
        ),
    },

    payments: {
      list: (opts?: PaginatedQuery & { status?: string }) =>
        request<{ payments: Record<string, unknown>[]; total: number }>(
          `/api/admin/payments${qs({ ...opts })}`
        ),
    },
  },
};
