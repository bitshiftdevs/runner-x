import type { Profile } from "@/types";

type AdminVerification = { id: string; fullName: string; phone: string; studentIdUrl: string; campus: string; createdAt: string };
type AdminDispute = { id: string; title: string; description: string; totalFee: string; runnerEarnings: string; status: string; createdAt: string; updatedAt: string };

type PaginatedQuery = { limit?: number; offset?: number };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  return res.json() as Promise<T>;
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
