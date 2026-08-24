"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, formatRelativeTime } from "@/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Wallet,
  Briefcase,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type AdminStats = {
  pendingVerifications: number;
  activeDisputes: number;
  totalUsers: number;
  totalRevenue: number;
  totalPlatformRevenue: number;
  totalPaystackFees: number;
  totalPayments: number;
  totalWalletBalance: number;
  activeWallets: number;
};

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

const metrics = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "text-primary" },
  { key: "totalRevenue", label: "GMV", icon: DollarSign, color: "text-primary", isCurrency: true },
  { key: "totalPlatformRevenue", label: "Platform Revenue", icon: DollarSign, color: "text-emerald-600", isCurrency: true },
  { key: "totalPaystackFees", label: "Paystack Fees", icon: CreditCard, color: "text-muted-foreground", isCurrency: true },
  { key: "activeDisputes", label: "Active Disputes", icon: AlertTriangle, color: "text-destructive" },
  { key: "pendingVerifications", label: "Pending Verifs", icon: ShieldCheck, color: "text-amber-600" },
  { key: "totalPayments", label: "Total Payments", icon: CreditCard, color: "text-primary" },
  { key: "totalWalletBalance", label: "Wallet Balance", icon: Wallet, color: "text-primary", isCurrency: true },
  { key: "activeWallets", label: "Active Wallets", icon: Wallet, color: "text-emerald-600" },
];

export default function OverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [verifications, setVerifications] = useState<AdminVerification[]>([]);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loadingVerif, setLoadingVerif] = useState(true);
  const [loadingDisputes, setLoadingDisputes] = useState(true);

  useEffect(() => {
    api.admin.stats().then(setStats);
    api.admin.verifications
      .list()
      .then((d) => {
        setVerifications(d.users ?? []);
        setLoadingVerif(false);
      });
    api.admin.disputes
      .list()
      .then((d) => {
        setDisputes(d.disputes ?? []);
        setLoadingDisputes(false);
      });
  }, []);

  const handleApprove = (id: string) => {
    api.admin.verifications.approve(id);
    setVerifications((prev) => prev.filter((u) => u.id !== id));
  };

  const handleReject = (id: string) => {
    api.admin.verifications.reject(id);
    setVerifications((prev) => prev.filter((u) => u.id !== id));
  };

  const handleResolve = (id: string) => {
    api.admin.disputes.resolve(id);
    setDisputes((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Platform statistics and pending actions
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {m.label}
              </CardTitle>
              <m.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${m.color}`}>
                {stats
                  ? m.isCurrency
                    ? formatCurrency(stats[m.key as keyof AdminStats] as number)
                    : stats[m.key as keyof AdminStats]
                  : "—"}
              </div>
              {(m.key === "totalRevenue" || m.key === "totalPlatformRevenue" || m.key === "totalPaystackFees" || m.key === "totalWalletBalance") && (
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Verification Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5" />
              Verification Queue
              {!loadingVerif && verifications.length > 0 && (
                <Badge variant="secondary">{verifications.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingVerif ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : verifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="size-10 text-emerald-500 mb-2" />
                <p className="text-sm text-muted-foreground">All clear</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                {verifications.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.campus}
                      </span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApprove(user.id)}
                        className="inline-flex items-center justify-center size-8 rounded-md text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                      >
                        <CheckCircle2 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(user.id)}
                        className="inline-flex items-center justify-center size-8 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <XCircle className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disputes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5" />
              Disputes
              {!loadingDisputes && disputes.length > 0 && (
                <Badge variant="destructive">{disputes.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDisputes ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : disputes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="size-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No disputes</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                {disputes.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-lg border border-l-4 border-l-destructive p-3"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{d.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(d.updatedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      {d.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-primary">
                        {formatCurrency(d.totalFee)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResolve(d.id)}
                        className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>All Systems Nominal</span>
        </div>
        <span>Admin Session Active</span>
      </div>
    </div>
  );
}
