export type WalletTxType = "credit" | "withdrawal" | "refund";
export type WalletTxStatus = "pending" | "completed" | "failed";
export type PaymentMethodStatus = "pending" | "verified" | "failed";

export type RunnerWallet = {
  id: string;
  runnerId: string;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type WalletTransaction = {
  id: string;
  walletId: string;
  runnerId: string;
  jobId: string | null;
  type: WalletTxType;
  amount: number;
  status: WalletTxStatus;
  providerRef: string | null;
  description: string | null;
  createdAt: string;
};

export type RunnerPaymentMethod = {
  id: string;
  runnerId: string;
  provider: string;
  channel: string;
  phoneNumber: string;
  accountName: string | null;
  moolreSubaccountId: string | null;
  status: PaymentMethodStatus;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationPreferences = {
  userId: string;
  pushEnabled: boolean;
  smsEnabled: boolean;
  notifyFoodJobs: boolean;
  notifyAcademicJobs: boolean;
  notifyDeliveryJobs: boolean;
  notifyGeneralJobs: boolean;
  notifyJobAccepted: boolean;
  notifyJobStatusChange: boolean;
  notifyJobCompleted: boolean;
  notifyJobCancelled: boolean;
  notifyPaymentReceived: boolean;
  notifyPromotions: boolean;
};
