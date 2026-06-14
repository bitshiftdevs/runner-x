"use client";
import { useEffect, useState } from "react";
import { api, formatCurrency, formatRelativeTime } from "@/lib";
import { Icon } from "@/components/ui/icon";

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

type AdminStats = {
  pendingVerifications: number;
  activeDisputes: number;
  dailyJobs: number;
};

function MetricCard({
  label,
  value,
  sub,
  color,
  progress,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  progress?: number;
}) {
  return (
    <div className="bg-surface border border-outline-variant p-lg rounded-xl relative overflow-hidden">
      <div className="scanline-animate" />
      <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-sm">{label}</p>
      <p className={`font-mono text-4xl font-bold ${color}`}>{value}</p>
      {sub && <p className="font-mono text-xs text-on-surface-variant mt-xs">{sub}</p>}
      {progress !== undefined && (
        <div className="w-full h-1 bg-outline-variant rounded-full mt-md overflow-hidden">
          <div
            className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [verifications, setVerifications] = useState<AdminVerification[]>([]);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loadingVerif, setLoadingVerif] = useState(true);
  const [loadingDisputes, setLoadingDisputes] = useState(true);

  useEffect(() => {
    api.admin.stats().then(setStats);
    api.admin.verifications.list().then((d) => {
      setVerifications(d.users ?? []);
      setLoadingVerif(false);
    });
    api.admin.disputes.list().then((d) => {
      setDisputes(d.disputes ?? []);
      setLoadingDisputes(false);
    });
  }, []);

  async function handleApprove(id: string) {
    await api.admin.verifications.approve(id);
    setVerifications((prev) => prev.filter((u) => u.id !== id));
  }

  async function handleReject(id: string) {
    await api.admin.verifications.reject(id);
    setVerifications((prev) => prev.filter((u) => u.id !== id));
  }

  async function handleResolve(id: string) {
    await api.admin.disputes.resolve(id);
    setDisputes((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-xl p-md lg:p-0">
      <div>
        <h1 className="font-sans text-4xl font-bold text-primary">Admin Console</h1>
        <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mt-xs">Mission Control</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <MetricCard
          label="Pending Verifications"
          value={stats?.pendingVerifications ?? "—"}
          sub="Awaiting review"
          color="text-tertiary"
          progress={stats ? Math.min(stats.pendingVerifications * 10, 100) : 0}
        />
        <MetricCard
          label="Active Disputes"
          value={stats?.activeDisputes ?? "—"}
          sub="Needs resolution"
          color="text-error"
          progress={stats ? Math.min(stats.activeDisputes * 20, 100) : 0}
        />
        <MetricCard
          label="Daily Jobs"
          value={stats?.dailyJobs ?? "—"}
          sub="Posted today"
          color="text-success"
          progress={stats ? Math.min(stats.dailyJobs, 100) : 0}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-7 space-y-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-2xl font-bold text-on-surface">Verification Queue</h2>
            <button
              type="button"
              className="font-mono text-xs text-primary border border-primary/30 px-md py-xs rounded-lg hover:bg-primary/10 transition-colors"
            >
              View All
            </button>
          </div>

          {loadingVerif ? (
            <div className="space-y-md">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-surface border border-outline-variant rounded-xl animate-pulse" />
              ))}
            </div>
          ) : verifications.length === 0 ? (
            <div className="text-center py-xl bg-surface border border-outline-variant rounded-xl">
              <Icon name="check_circle" size={48} className="text-success mx-auto" />
              <p className="font-mono text-sm text-on-surface-variant mt-sm">No pending verifications</p>
            </div>
          ) : (
            <div className="space-y-md">
              {verifications.map((user) => (
                <div
                  key={user.id}
                  className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col md:flex-row gap-lg items-start md:items-center hover:border-primary/50 transition-all"
                >
                  <div className="w-24 h-16 bg-surface-variant rounded-lg flex items-center justify-center border border-outline-variant shrink-0">
                    <Icon name="badge" size={32} className="text-on-surface-variant" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-lg font-semibold text-on-surface">{user.fullName}</p>
                    <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
                      {user.campus} · Runner Applicant
                    </p>
                  </div>
                  <div className="flex gap-sm shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(user.id)}
                      className="bg-success/10 text-success border border-success/30 rounded-lg px-md py-sm font-mono text-xs hover:bg-success hover:text-on-primary transition-all active:scale-95"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(user.id)}
                      className="bg-error/10 text-error border border-error/30 rounded-lg px-md py-sm font-mono text-xs hover:bg-error hover:text-on-error transition-all active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-2xl font-bold text-on-surface">Dispute Center</h2>
            <div className="flex items-center gap-sm">
              <span className="font-mono text-xs bg-error/10 text-error border border-error/30 px-sm py-xs rounded animate-pulse">
                CRITICAL
              </span>
              <span className="font-mono text-xs bg-surface-container-low border border-outline-variant px-sm py-xs rounded">
                {disputes.length}
              </span>
            </div>
          </div>

          {loadingDisputes ? (
            <div className="space-y-md">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-surface border border-outline-variant rounded-lg animate-pulse" />
              ))}
            </div>
          ) : disputes.length === 0 ? (
            <div className="text-center py-xl bg-surface border border-outline-variant rounded-xl">
              <Icon name="gavel" size={48} className="text-on-surface-variant mx-auto" />
              <p className="font-mono text-sm text-on-surface-variant mt-sm">No active disputes</p>
            </div>
          ) : (
            <div className="space-y-md">
              {disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="bg-surface-variant/50 border border-outline-variant rounded-lg p-md border-l-4 border-l-secondary hover:bg-surface-variant transition-colors"
                >
                  <div className="flex items-center justify-between gap-sm mb-sm">
                    <span className="font-mono text-xs bg-secondary/10 text-secondary border border-secondary/30 px-sm py-xs rounded">
                      #{dispute.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">
                      {formatRelativeTime(dispute.updatedAt)}
                    </span>
                  </div>
                  <p className="font-sans text-base font-semibold text-on-surface">{dispute.title}</p>
                  <p className="font-mono text-xs text-on-surface-variant line-clamp-2 mt-xs">{dispute.description}</p>
                  <div className="flex items-center justify-between mt-md gap-sm">
                    <span className="font-mono text-sm text-primary font-bold">
                      {formatCurrency(dispute.totalFee)}
                    </span>
                    <div className="flex gap-sm">
                      <button
                        type="button"
                        className="font-mono text-xs text-on-surface-variant border border-outline-variant px-md py-sm rounded-lg hover:border-primary hover:text-primary transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolve(dispute.id)}
                        className="font-mono text-xs bg-primary text-on-primary px-md py-sm rounded-lg hover:shadow-[0_0_15px_rgba(208,188,255,0.4)] active:scale-95 transition-all"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="pt-lg border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-lg text-on-surface-variant">
        <div className="flex items-center gap-md">
          <span className="flex h-2 w-2 rounded-full bg-success" />
          <span className="font-mono text-xs">Platform Operational: All Systems Nominal</span>
        </div>
        <div className="flex gap-xl font-mono text-xs">
          <span>Server Cluster 4A (Accra)</span>
          <span>Admin Session Active</span>
        </div>
      </footer>

      <button
        type="button"
        title="Broadcast Alert"
        className="fixed bottom-xl right-xl bg-error text-on-error rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(255,180,171,0.5)] active:scale-90 transition-all z-40 group"
      >
        <Icon name="broadcast_on_home" size={24} />
        <span className="absolute right-16 bg-surface border border-outline-variant px-sm py-xs rounded font-mono text-xs text-on-surface whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Broadcast Alert
        </span>
      </button>
    </div>
  );
}
