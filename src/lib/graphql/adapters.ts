import { pesewasToGhs } from "@/lib/money";
import type {
  JobCategory,
  Message,
  Payment,
  PaymentStatus,
  Profile,
  UrgencyLevel,
} from "@/types";
import type {
  NotificationPreferences,
  RunnerPaymentMethod,
  RunnerWallet,
  WalletTransaction,
} from "@/types/wallet";

/**
 * Type adapters between the backend GraphQL schema and the pre-existing
 * client TypeScript types. Kept in one place so route handlers stay tiny.
 *
 * Note: some fields (e.g. Profile.role) don't have a 1:1 backend equivalent
 * yet; we synthesize the client shape with the closest defensible mapping.
 */

// ── Errand ↔ Job ────────────────────────────────────────────────────────

const backendCategoryToClient: Record<string, JobCategory> = {
  food: "food_drinks",
  academic: "academic_materials",
  delivery: "pickup_delivery",
  general: "general_errands",
  other: "others",
};

export const clientCategoryToBackend: Record<JobCategory, string> = {
  food_drinks: "food",
  academic_materials: "academic",
  pickup_delivery: "delivery",
  general_errands: "general",
  others: "other",
};

const backendUrgencyToClient: Record<string, UrgencyLevel> = {
  normal: "normal",
  min_10: "10min",
  min_15: "15min",
  min_30: "30min",
};

export const clientUrgencyToBackend: Record<UrgencyLevel, string> = {
  normal: "normal",
  "10min": "min_10",
  "15min": "min_15",
  "30min": "min_30",
};

export type BackendErrandProfile = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  rating: number;
};

export type BackendErrand = {
  id: string;
  requesterId: string;
  runnerId: string | null;
  title: string;
  category: string;
  description: string | null;
  pickupLat: number | null;
  pickupLng: number | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  pickupAddress: string | null;
  deliveryAddress: string | null;
  urgency: string;
  baseFee: number;
  distanceFee: number;
  urgencyFee: number;
  categoryFee: number;
  totalFee: number;
  status: string;
  createdAt: string;
  expiresAt: string | null;
  confirmedAt: string | null;
  rejectedRunnerIds: string[];
  runnerAcceptedAt: string | null;
  trackingLink: string | null;
  runnerLat: number | null;
  runnerLng: number | null;
  requester: BackendErrandProfile | null;
  runner: BackendErrandProfile | null;
};

// ── Message ─────────────────────────────────────────────────────────────

export type BackendMessage = {
  id: string;
  errandId: string;
  senderId: string;
  content: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  messageType: string;
  createdAt: string;
};

export function toClientMessage(m: BackendMessage): Message {
  return {
    id: m.id,
    jobId: m.errandId,
    senderId: m.senderId,
    content: m.content ?? "",
    imageUrl: m.imageUrl,
    isSystem: m.messageType === "system",
    createdAt: m.createdAt,
  };
}

// ── Payment ─────────────────────────────────────────────────────────────

export type BackendPayment = {
  id: string;
  errandId: string;
  userId: string;
  amount: number;
  currency: string;
  channel: string | null;
  payer: string | null;
  providerRef: string | null;
  externalRef: string;
  runnerShare: number;
  platformShare: number;
  paystackFee: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function toClientPayment(p: BackendPayment): Payment {
  return {
    id: p.id,
    jobId: p.errandId,
    userId: p.userId,
    amount: pesewasToGhs(p.amount),
    currency: p.currency,
    channel: p.channel,
    payer: p.payer,
    providerRef: p.providerRef,
    externalRef: p.externalRef,
    status: (p.status as PaymentStatus) ?? "pending",
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// ── Wallet ──────────────────────────────────────────────────────────────

export type BackendWallet = {
  id: string;
  runnerId: string;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  currency: string;
};

export function toClientWallet(w: BackendWallet): RunnerWallet {
  return {
    id: w.id,
    runnerId: w.runnerId,
    availableBalance: pesewasToGhs(w.availableBalance),
    pendingBalance: pesewasToGhs(w.pendingBalance),
    totalEarned: pesewasToGhs(w.totalEarned),
    totalWithdrawn: pesewasToGhs(w.totalWithdrawn),
    currency: w.currency,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export type BackendWalletTx = {
  id: string;
  runnerId: string;
  errandId: string | null;
  type: string;
  amount: number;
  status: string;
  providerRef: string | null;
  description: string | null;
  createdAt: string;
};

export function toClientWalletTx(t: BackendWalletTx): WalletTransaction {
  return {
    id: t.id,
    walletId: "",
    runnerId: t.runnerId,
    jobId: t.errandId,
    type: (t.type as WalletTransaction["type"]) ?? "credit",
    amount: pesewasToGhs(t.amount),
    status: (t.status as WalletTransaction["status"]) ?? "pending",
    providerRef: t.providerRef,
    description: t.description,
    createdAt: t.createdAt,
  };
}

export type BackendPaymentMethod = {
  id: string;
  runnerId: string;
  provider: string;
  channel: string;
  phoneNumber: string;
  accountName: string | null;
  status: string;
  isDefault: boolean;
};

export function toClientPaymentMethod(
  m: BackendPaymentMethod,
): RunnerPaymentMethod {
  return {
    id: m.id,
    runnerId: m.runnerId,
    provider: m.provider,
    channel: m.channel,
    phoneNumber: m.phoneNumber,
    accountName: m.accountName,
    moolreSubaccountId: null,
    status: (m.status as RunnerPaymentMethod["status"]) ?? "pending",
    isDefault: m.isDefault,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ── Profile ─────────────────────────────────────────────────────────────

export type BackendProfileRaw = {
  id: string;
  email: string | null;
  fullName: string;
  avatarUrl: string | null;
  idUrl: string | null;
  isAdmin: boolean;
  studentIdStatus: "pending" | "approved" | "rejected";
  defaultCampus: string | null;
  phoneNumber: string | null;
  rating: number;
  banned: boolean;
  createdAt: string;
};

export function toClientProfile(p: BackendProfileRaw): Profile {
  return {
    id: p.id,
    fullName: p.fullName,
    email: p.email ?? "",
    phone: p.phoneNumber ?? "",
    photoUrl: p.avatarUrl,
    bio: null,
    role: p.isAdmin ? "admin" : "both",
    studentIdUrl: null,
    studentIdVerified: p.studentIdStatus === "approved",
    campus: p.defaultCampus ?? "",
    rating: p.rating,
    totalJobs: 0,
    createdAt: p.createdAt,
  };
}

// ── Notifications ───────────────────────────────────────────────────────

export type BackendNotifPrefs = {
  pushEnabled: boolean;
  smsEnabled: boolean;
  notifyFoodErrands: boolean;
  notifyAcademicErrands: boolean;
  notifyDeliveryErrands: boolean;
  notifyGeneralErrands: boolean;
  notifyErrandAccepted: boolean;
  notifyErrandStatusChange: boolean;
  notifyErrandCompleted: boolean;
  notifyErrandCancelled: boolean;
  notifyPaymentReceived: boolean;
  notifyPromotions: boolean;
};

export function toClientNotifPrefs(
  n: BackendNotifPrefs,
  userId: string,
): NotificationPreferences {
  return {
    userId,
    pushEnabled: n.pushEnabled,
    smsEnabled: n.smsEnabled,
    notifyFoodJobs: n.notifyFoodErrands,
    notifyAcademicJobs: n.notifyAcademicErrands,
    notifyDeliveryJobs: n.notifyDeliveryErrands,
    notifyGeneralJobs: n.notifyGeneralErrands,
    notifyJobAccepted: n.notifyErrandAccepted,
    notifyJobStatusChange: n.notifyErrandStatusChange,
    notifyJobCompleted: n.notifyErrandCompleted,
    notifyJobCancelled: n.notifyErrandCancelled,
    notifyPaymentReceived: n.notifyPaymentReceived,
    notifyPromotions: n.notifyPromotions,
  };
}
