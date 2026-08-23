/**
 * Client-side API layer that talks directly to the backend GraphQL.
 *
 * Auth routes (session, logout) still go through Next.js API routes because
 * they need httpOnly cookie access. Everything else hits the backend directly.
 */

import { gqlFetch, invalidateToken } from "@/lib/gql-client-browser";
import {
  ALL_ERRANDS,
  ALL_PAYMENTS,
  ALL_USERS,
  ALL_WALLETS,
  DISPUTED_ERRANDS,
  PLATFORM_STATS,
  PENDING_VERIFICATIONS,
  RESOLVE_DISPUTE,
  VERIFY_STUDENT_ID,
} from "@/lib/graphql/operations";
import {
  type BackendErrand,
  type BackendPayment,
  type BackendProfileRaw,
  type BackendWallet,
} from "@/lib/graphql/adapters";
import type { Profile } from "@/types";

// ── Helpers ────────────────────────────────────────────────────────────

type AdminVerification = {
  id: string;
  fullName: string;
  phone: string;
  studentIdUrl: string;
  campus: string;
  createdAt: string;
};

type AdminDispute = {
  id: string;
  title: string;
  description: string;
  totalFee: string;
  runnerEarnings: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type PaginatedQuery = { limit?: number; offset?: number };

// ── API ────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    /**
     * Reads the session from the server (httpOnly cookie → server → JSON).
     * This must remain a server route because the cookies are httpOnly.
     */
    session: () =>
      fetch("/api/auth/session").then(
        (r) => r.json() as Promise<{ user: Profile | null }>,
      ),

    logout: async () => {
      invalidateToken();
      return fetch("/api/auth/logout", { method: "POST" });
    },
  },

  admin: {
    stats: async () => {
      const data = await gqlFetch<{ platformStats: Record<string, number> }>(
        PLATFORM_STATS,
      );
      const s = data.platformStats;
      return {
        pendingVerifications: s.pendingVerifications,
        activeDisputes: s.activeDisputes,
        totalUsers: s.totalUsers,
        totalRevenue: s.totalRevenue,
        totalPayments: s.totalPayments,
        totalWalletBalance: s.totalWalletBalance,
        activeWallets: s.activeWallets,
        totalErrands: s.totalErrands,
        activeErrands: s.activeErrands,
        completedErrands: s.completedErrands,
      };
    },

    verifications: {
      list: async () => {
        const data = await gqlFetch<{
          pendingVerifications: BackendProfileRaw[];
        }>(PENDING_VERIFICATIONS);
        return {
          users: data.pendingVerifications.map((u) => ({
            id: u.id,
            fullName: u.fullName,
            phone: u.phoneNumber ?? "",
            studentIdUrl: u.avatarUrl ?? "",
            campus: u.defaultCampus ?? "",
            createdAt: u.createdAt,
          })),
        };
      },

      approve: (id: string) =>
        gqlFetch<{ verifyStudentId: { id: string } }>(VERIFY_STUDENT_ID, {
          userId: id,
          status: "approved",
        }),

      reject: (id: string) =>
        gqlFetch<{ verifyStudentId: { id: string } }>(VERIFY_STUDENT_ID, {
          userId: id,
          status: "rejected",
        }),
    },

    disputes: {
      list: async () => {
        const data = await gqlFetch<{ disputedErrands: BackendErrand[] }>(
          DISPUTED_ERRANDS,
        );
        return {
          disputes: data.disputedErrands.map((d) => ({
            id: d.id,
            title: d.title,
            description: d.description ?? "",
            totalFee: String(d.totalFee),
            runnerEarnings: "",
            status: d.status,
            createdAt: d.createdAt,
            updatedAt: d.createdAt,
          })),
        };
      },

      resolve: (id: string) =>
        gqlFetch(RESOLVE_DISPUTE, {
          errandId: id,
          resolution: "resolved",
          refundRequester: false,
        }),
    },

    users: {
      list: async (
        opts?: PaginatedQuery & { role?: string; status?: string; search?: string },
      ) => {
        const limit = opts?.limit ?? 50;
        const offset = opts?.offset ?? 0;
        const page = Math.floor(offset / limit);
        const data = await gqlFetch<{ allUsers: BackendProfileRaw[] }>(
          ALL_USERS,
          {
            search: opts?.search ?? null,
            page,
            size: limit,
          },
        );
        const users = data.allUsers.map((u) => ({
          id: u.id,
          full_name: u.fullName,
          role: u.isAdmin ? "admin" : "both",
          default_campus: u.defaultCampus,
          rating: u.rating,
          student_id_status: u.studentIdStatus,
          created_at: u.createdAt,
        }));
        return { users, total: users.length };
      },
    },

    jobs: {
      list: async (
        opts?: PaginatedQuery & { status?: string; category?: string },
      ) => {
        const limit = opts?.limit ?? 50;
        const offset = opts?.offset ?? 0;
        const page = Math.floor(offset / limit);
        const data = await gqlFetch<{ allErrands: BackendErrand[] }>(
          ALL_ERRANDS,
          {
            status: opts?.status ?? null,
            page,
            size: limit,
          },
        );
        const jobs = data.allErrands.map((e) => ({
          id: e.id,
          title: e.title,
          category: e.category,
          status: e.status,
          total_fee: e.totalFee,
          created_at: e.createdAt,
        }));
        return { jobs, total: jobs.length };
      },
    },

    wallets: {
      list: async (opts?: PaginatedQuery) => {
        const limit = opts?.limit ?? 50;
        const offset = opts?.offset ?? 0;
        const page = Math.floor(offset / limit);
        const data = await gqlFetch<{ allWallets: BackendWallet[] }>(
          ALL_WALLETS,
          { page, size: limit },
        );
        const wallets = data.allWallets.map((w) => ({
          id: w.id,
          profiles: null as { full_name: string } | null,
          available_balance: w.availableBalance,
          pending_balance: w.pendingBalance,
          total_earned: w.totalEarned,
          total_withdrawn: w.totalWithdrawn,
          updated_at: new Date().toISOString(),
        }));
        return { wallets, total: wallets.length };
      },
    },

    payments: {
      list: async (opts?: PaginatedQuery & { status?: string }) => {
        const limit = opts?.limit ?? 50;
        const offset = opts?.offset ?? 0;
        const page = Math.floor(offset / limit);
        const data = await gqlFetch<{ allPayments: BackendPayment[] }>(
          ALL_PAYMENTS,
          {
            status: opts?.status ?? null,
            page,
            size: limit,
          },
        );
        const payments = data.allPayments.map((p) => ({
          id: p.id,
          external_ref: p.externalRef,
          amount: p.amount,
          channel: p.channel,
          status: p.status,
          created_at: p.createdAt,
        }));
        return { payments, total: payments.length };
      },
    },
  },
};
