"use client";
import { useEffect, useState } from "react";
import { api, formatCurrency, formatRelativeTime } from "@/lib";
import { Icon } from "@/components/ui/icon";

type Tab = "overview" | "users" | "jobs" | "wallets" | "payments";

type AdminStats = {
  pendingVerifications: number;
  activeDisputes: number;
  dailyJobs: number;
  totalUsers: number;
  totalRevenue: number;
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

function MetricCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-surface border border-outline-variant p-lg rounded-xl relative overflow-hidden">
      <div className="scanline-animate" />
      <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-sm">{label}</p>
      <p className={`font-mono text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="font-mono text-xs text-on-surface-variant mt-xs">{sub}</p>}
    </div>
  );
}

function TabButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-sm px-md py-sm rounded-lg font-mono text-sm transition-all ${
        active
          ? "bg-primary text-on-primary"
          : "text-on-surface-variant hover:bg-surface-container-high"
      }`}
    >
      <Icon name={icon} size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ─── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ stats, verifications, disputes, loadingVerif, loadingDisputes, onApprove, onReject, onResolve }: {
  stats: AdminStats | null;
  verifications: AdminVerification[];
  disputes: AdminDispute[];
  loadingVerif: boolean;
  loadingDisputes: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-md">
        <MetricCard label="Total Users" value={stats?.totalUsers ?? "—"} color="text-primary" />
        <MetricCard label="Daily Jobs" value={stats?.dailyJobs ?? "—"} sub="Posted today" color="text-success" />
        <MetricCard label="Revenue" value={stats ? formatCurrency(stats.totalRevenue) : "—"} sub="All time" color="text-secondary" />
        <MetricCard label="Active Disputes" value={stats?.activeDisputes ?? "—"} color="text-error" />
        <MetricCard label="Pending Verifs" value={stats?.pendingVerifications ?? "—"} color="text-tertiary" />
        <MetricCard label="Total Payments" value={stats?.totalPayments ?? "—"} color="text-on-surface" />
        <MetricCard label="Wallet Balance" value={stats ? formatCurrency(stats.totalWalletBalance) : "—"} sub="All runners" color="text-primary" />
        <MetricCard label="Active Wallets" value={stats?.activeWallets ?? "—"} color="text-secondary" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        {/* Verification Queue */}
        <div className="space-y-md">
          <h2 className="font-sans text-xl font-bold text-on-surface">Verification Queue</h2>
          {loadingVerif ? (
            <div className="h-24 bg-surface border border-outline-variant rounded-xl animate-pulse" />
          ) : verifications.length === 0 ? (
            <div className="text-center py-lg bg-surface border border-outline-variant rounded-xl">
              <Icon name="check_circle" size={36} className="text-success mx-auto" />
              <p className="font-mono text-xs text-on-surface-variant mt-sm">All clear</p>
            </div>
          ) : (
            <div className="space-y-sm max-h-[400px] overflow-y-auto">
              {verifications.map((user) => (
                <div key={user.id} className="bg-surface border border-outline-variant rounded-lg p-md flex items-center gap-md">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-on-surface truncate">{user.fullName}</p>
                    <p className="font-mono text-xs text-on-surface-variant">{user.campus}</p>
                  </div>
                  <div className="flex gap-xs shrink-0">
                    <button type="button" onClick={() => onApprove(user.id)} className="bg-success/10 text-success border border-success/30 rounded px-sm py-xs font-mono text-xs hover:bg-success hover:text-on-primary transition-all">✓</button>
                    <button type="button" onClick={() => onReject(user.id)} className="bg-error/10 text-error border border-error/30 rounded px-sm py-xs font-mono text-xs hover:bg-error hover:text-on-error transition-all">✗</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disputes */}
        <div className="space-y-md">
          <h2 className="font-sans text-xl font-bold text-on-surface">Disputes</h2>
          {loadingDisputes ? (
            <div className="h-24 bg-surface border border-outline-variant rounded-xl animate-pulse" />
          ) : disputes.length === 0 ? (
            <div className="text-center py-lg bg-surface border border-outline-variant rounded-xl">
              <Icon name="gavel" size={36} className="text-on-surface-variant mx-auto" />
              <p className="font-mono text-xs text-on-surface-variant mt-sm">No disputes</p>
            </div>
          ) : (
            <div className="space-y-sm max-h-[400px] overflow-y-auto">
              {disputes.map((d) => (
                <div key={d.id} className="bg-surface border border-outline-variant rounded-lg p-md border-l-4 border-l-error">
                  <div className="flex justify-between items-start mb-xs">
                    <p className="font-sans font-semibold text-on-surface text-sm">{d.title}</p>
                    <span className="font-mono text-xs text-on-surface-variant">{formatRelativeTime(d.updatedAt)}</span>
                  </div>
                  <p className="font-mono text-xs text-on-surface-variant line-clamp-1">{d.description}</p>
                  <div className="flex justify-between items-center mt-sm">
                    <span className="font-mono text-sm text-primary font-bold">{formatCurrency(d.totalFee)}</span>
                    <button type="button" onClick={() => onResolve(d.id)} className="font-mono text-xs bg-primary text-on-primary px-md py-xs rounded hover:opacity-90 transition-all">Resolve</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Users Tab ──────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    api.admin.users.list({ search: search || undefined, role: roleFilter || undefined, limit: 50 }).then((d) => {
      setUsers(d.users);
      setTotal(d.total);
      setLoading(false);
    });
  }, [search, roleFilter]);

  return (
    <div className="space-y-md">
      <div className="flex flex-col sm:flex-row gap-sm">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-surface border border-outline-variant rounded-lg px-md py-sm font-mono text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-surface border border-outline-variant rounded-lg px-md py-sm font-mono text-sm text-on-surface focus:outline-none focus:border-primary"
        >
          <option value="">All Roles</option>
          <option value="runner">Runner</option>
          <option value="requester">Requester</option>
          <option value="both">Both</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <p className="font-mono text-xs text-on-surface-variant">{total} users</p>

      {loading ? (
        <div className="space-y-sm">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-surface border border-outline-variant rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr className="font-mono text-xs text-on-surface-variant uppercase">
                <th className="text-left p-sm">Name</th>
                <th className="text-left p-sm">Role</th>
                <th className="text-left p-sm">Campus</th>
                <th className="text-left p-sm">Rating</th>
                <th className="text-left p-sm">Status</th>
                <th className="text-left p-sm">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {users.map((u) => (
                <tr key={u.id as string} className="hover:bg-surface-hover transition-colors">
                  <td className="p-sm font-sans text-on-surface">{u.full_name as string}</td>
                  <td className="p-sm"><span className="font-mono text-xs bg-primary/10 text-primary px-sm rounded">{u.role as string}</span></td>
                  <td className="p-sm font-mono text-xs text-on-surface-variant">{(u.default_campus as string) || "—"}</td>
                  <td className="p-sm font-mono text-xs">{u.rating as number || 0}</td>
                  <td className="p-sm"><StatusBadge status={u.student_id_status as string} /></td>
                  <td className="p-sm font-mono text-xs text-on-surface-variant">{formatRelativeTime(u.created_at as string)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Jobs Tab ────────────────────────────────────────────────────────────────────
function JobsTab() {
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    api.admin.jobs.list({ status: statusFilter || undefined, limit: 50 }).then((d) => {
      setJobs(d.jobs);
      setTotal(d.total);
      setLoading(false);
    });
  }, [statusFilter]);

  return (
    <div className="space-y-md">
      <div className="flex gap-sm items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface border border-outline-variant rounded-lg px-md py-sm font-mono text-sm text-on-surface focus:outline-none focus:border-primary"
        >
          <option value="">All Statuses</option>
          <option value="posted">Posted</option>
          <option value="accepted">Accepted</option>
          <option value="heading_to_vendor">Heading to Vendor</option>
          <option value="at_vendor">At Vendor</option>
          <option value="heading_to_delivery">Heading to Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="disputed">Disputed</option>
        </select>
        <p className="font-mono text-xs text-on-surface-variant">{total} jobs</p>
      </div>

      {loading ? (
        <div className="space-y-sm">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-surface border border-outline-variant rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr className="font-mono text-xs text-on-surface-variant uppercase">
                <th className="text-left p-sm">Title</th>
                <th className="text-left p-sm">Category</th>
                <th className="text-left p-sm">Status</th>
                <th className="text-left p-sm">Fee</th>
                <th className="text-left p-sm">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {jobs.map((j) => (
                <tr key={j.id as string} className="hover:bg-surface-hover transition-colors">
                  <td className="p-sm font-sans text-on-surface max-w-[200px] truncate">{j.title as string}</td>
                  <td className="p-sm font-mono text-xs text-on-surface-variant">{j.category as string}</td>
                  <td className="p-sm"><StatusBadge status={j.status as string} /></td>
                  <td className="p-sm font-mono text-sm text-primary font-bold">{formatCurrency(j.total_fee as number)}</td>
                  <td className="p-sm font-mono text-xs text-on-surface-variant">{formatRelativeTime(j.created_at as string)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Wallets Tab ─────────────────────────────────────────────────────────────────
function WalletsTab() {
  const [wallets, setWallets] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.wallets.list({ limit: 50 }).then((d) => {
      setWallets(d.wallets);
      setTotal(d.total);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-md">
      <p className="font-mono text-xs text-on-surface-variant">{total} runner wallets</p>

      {loading ? (
        <div className="space-y-sm">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-surface border border-outline-variant rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr className="font-mono text-xs text-on-surface-variant uppercase">
                <th className="text-left p-sm">Runner</th>
                <th className="text-left p-sm">Available</th>
                <th className="text-left p-sm">Pending</th>
                <th className="text-left p-sm">Total Earned</th>
                <th className="text-left p-sm">Withdrawn</th>
                <th className="text-left p-sm">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {wallets.map((w) => {
                const profile = w.profiles as Record<string, unknown> | null;
                return (
                  <tr key={w.id as string} className="hover:bg-surface-hover transition-colors">
                    <td className="p-sm font-sans text-on-surface">{profile?.full_name as string ?? "Unknown"}</td>
                    <td className="p-sm font-mono text-sm text-success font-bold">{formatCurrency(w.available_balance as number)}</td>
                    <td className="p-sm font-mono text-sm text-secondary">{formatCurrency(w.pending_balance as number)}</td>
                    <td className="p-sm font-mono text-sm text-primary">{formatCurrency(w.total_earned as number)}</td>
                    <td className="p-sm font-mono text-sm text-on-surface-variant">{formatCurrency(w.total_withdrawn as number)}</td>
                    <td className="p-sm font-mono text-xs text-on-surface-variant">{formatRelativeTime(w.updated_at as string)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Payments Tab ────────────────────────────────────────────────────────────────
function PaymentsTab() {
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    api.admin.payments.list({ status: statusFilter || undefined, limit: 50 }).then((d) => {
      setPayments(d.payments);
      setTotal(d.total);
      setLoading(false);
    });
  }, [statusFilter]);

  return (
    <div className="space-y-md">
      <div className="flex gap-sm items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface border border-outline-variant rounded-lg px-md py-sm font-mono text-sm text-on-surface focus:outline-none focus:border-primary"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <p className="font-mono text-xs text-on-surface-variant">{total} payments</p>
      </div>

      {loading ? (
        <div className="space-y-sm">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-surface border border-outline-variant rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full text-sm">
            <thead className="bg-surface-container">
              <tr className="font-mono text-xs text-on-surface-variant uppercase">
                <th className="text-left p-sm">Ref</th>
                <th className="text-left p-sm">Amount</th>
                <th className="text-left p-sm">Channel</th>
                <th className="text-left p-sm">Status</th>
                <th className="text-left p-sm">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {payments.map((p) => (
                <tr key={p.id as string} className="hover:bg-surface-hover transition-colors">
                  <td className="p-sm font-mono text-xs text-on-surface">{(p.external_ref as string)?.slice(0, 12) ?? "—"}</td>
                  <td className="p-sm font-mono text-sm text-primary font-bold">{formatCurrency(p.amount as number)}</td>
                  <td className="p-sm font-mono text-xs text-on-surface-variant">{(p.channel as string) || "—"}</td>
                  <td className="p-sm"><StatusBadge status={p.status as string} /></td>
                  <td className="p-sm font-mono text-xs text-on-surface-variant">{formatRelativeTime(p.created_at as string)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Shared StatusBadge ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-secondary/10 text-secondary border-secondary/30",
    approved: "bg-success/10 text-success border-success/30",
    verified: "bg-success/10 text-success border-success/30",
    success: "bg-success/10 text-success border-success/30",
    confirmed: "bg-success/10 text-success border-success/30",
    completed: "bg-success/10 text-success border-success/30",
    rejected: "bg-error/10 text-error border-error/30",
    failed: "bg-error/10 text-error border-error/30",
    cancelled: "bg-error/10 text-error border-error/30",
    disputed: "bg-error/10 text-error border-error/30",
    refunded: "bg-tertiary/10 text-tertiary border-tertiary/30",
    posted: "bg-primary/10 text-primary border-primary/30",
    accepted: "bg-primary/10 text-primary border-primary/30",
  };
  const c = colors[status] || "bg-surface-variant text-on-surface-variant border-outline-variant";
  return <span className={`font-mono text-xs border px-sm py-xs rounded ${c}`}>{status}</span>;
}

// ─── Main Page ───────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [verifications, setVerifications] = useState<AdminVerification[]>([]);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loadingVerif, setLoadingVerif] = useState(true);
  const [loadingDisputes, setLoadingDisputes] = useState(true);

  useEffect(() => {
    api.admin.stats().then(setStats);
    api.admin.verifications.list().then((d) => { setVerifications(d.users ?? []); setLoadingVerif(false); });
    api.admin.disputes.list().then((d) => { setDisputes(d.disputes ?? []); setLoadingDisputes(false); });
  }, []);

  return (
    <div className="space-y-xl p-md lg:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <h1 className="font-sans text-3xl font-bold text-primary">Admin Console</h1>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mt-xs">Mission Control</p>
        </div>
      </div>

      {/* Tab bar */}
      <nav className="flex gap-xs overflow-x-auto hide-scrollbar border-b border-outline-variant pb-sm">
        <TabButton active={tab === "overview"} label="Overview" icon="dashboard" onClick={() => setTab("overview")} />
        <TabButton active={tab === "users"} label="Users" icon="group" onClick={() => setTab("users")} />
        <TabButton active={tab === "jobs"} label="Jobs" icon="work" onClick={() => setTab("jobs")} />
        <TabButton active={tab === "wallets"} label="Wallets" icon="account_balance_wallet" onClick={() => setTab("wallets")} />
        <TabButton active={tab === "payments"} label="Payments" icon="payments" onClick={() => setTab("payments")} />
      </nav>

      {/* Tab content */}
      {tab === "overview" && (
        <OverviewTab
          stats={stats}
          verifications={verifications}
          disputes={disputes}
          loadingVerif={loadingVerif}
          loadingDisputes={loadingDisputes}
          onApprove={(id) => { api.admin.verifications.approve(id); setVerifications((p) => p.filter((u) => u.id !== id)); }}
          onReject={(id) => { api.admin.verifications.reject(id); setVerifications((p) => p.filter((u) => u.id !== id)); }}
          onResolve={(id) => { api.admin.disputes.resolve(id); setDisputes((p) => p.filter((d) => d.id !== id)); }}
        />
      )}
      {tab === "users" && <UsersTab />}
      {tab === "jobs" && <JobsTab />}
      {tab === "wallets" && <WalletsTab />}
      {tab === "payments" && <PaymentsTab />}

      <footer className="pt-lg border-t border-outline-variant flex justify-between items-center text-on-surface-variant">
        <div className="flex items-center gap-sm">
          <span className="flex h-2 w-2 rounded-full bg-success" />
          <span className="font-mono text-xs">All Systems Nominal</span>
        </div>
        <span className="font-mono text-xs">Admin Session Active</span>
      </footer>
    </div>
  );
}
