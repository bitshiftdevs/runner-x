"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { formatCurrency, api } from "@/lib";
import type { Payment } from "@/types";

const CHART_POINTS = [
  { day: "Mon", y: 180 },
  { day: "Tue", y: 140 },
  { day: "Wed", y: 160 },
  { day: "Thu", y: 80 },
  { day: "Fri", y: 100 },
  { day: "Sat", y: 40 },
  { day: "Sun", y: 60 },
];

function EarningsChart() {
  const width = 800;
  const height = 200;
  const points = CHART_POINTS.map((p, i) => ({
    x: (i / (CHART_POINTS.length - 1)) * width,
    y: p.y,
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <div className="h-52 lg:h-64 w-full relative">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[50, 100, 150].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke="var(--color-border)"
            strokeDasharray="4"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="url(#chartGrad)" />
        <path
          d={line}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {points.map((p) => (
          <circle
            key={`${p.x}-${p.y}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--color-primary)"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-md font-mono text-xs text-text-secondary px-xs">
        {CHART_POINTS.map((p) => (
          <span key={p.day}>{p.day}</span>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: "bg-success/10 text-success border-success/30",
    disputed: "bg-secondary/10 text-secondary border-secondary/30",
    pending: "bg-tertiary/10 text-tertiary border-tertiary/30",
  };
  const labels: Record<string, string> = {
    success: "Completed",
    disputed: "Disputed",
    pending: "Pending",
  };
  const key =
    status === "success" ? "success" : status === "disputed" ? "disputed" : "pending";
  return (
    <span
      className={`px-sm py-xs border rounded font-mono text-[10px] ${styles[key]}`}
    >
      {labels[key]}
    </span>
  );
}

export default function EarningsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const data = await api.payments.list();
        setPayments(data.payments ?? []);
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  const totalEarned = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const completedCount = payments.filter((p) => p.status === "success").length;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = payments
    .filter((p) => p.status === "success" && new Date(p.createdAt) >= weekAgo)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const weeklyGoalTarget = 800;
  const weeklyProgress = Math.min(100, Math.round((thisWeek / weeklyGoalTarget) * 100));

  return (
    <div className="space-y-xl p-md lg:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div>
          <h2 className="font-sans text-2xl lg:text-[32px] font-semibold">
            Earnings Dashboard
          </h2>
          <p className="text-text-secondary">
            Tracking your high-performance hustle.
          </p>
        </div>
        <button
          type="button"
          className="bg-success text-white font-mono text-sm font-bold py-md px-xl rounded-lg shadow-[0_0_20px_2px_rgba(16,185,129,0.25)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-sm"
        >
          <Icon name="account_balance_wallet" />
          Request Payout
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="bg-surface border border-outline-variant p-lg rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon name="payments" className="text-[120px]" />
          </div>
          <p className="font-mono text-xs text-text-secondary uppercase mb-sm">
            Total Earned
          </p>
          <div className="flex items-baseline gap-xs">
            <span className="text-primary font-sans text-xl font-bold">GH₵</span>
            <h3 className="font-mono text-2xl font-bold text-text-primary">
              {totalEarned > 0 ? totalEarned.toLocaleString("en", { minimumFractionDigits: 2 }) : "0.00"}
            </h3>
          </div>
          {thisWeek > 0 && (
            <div className="mt-md flex items-center gap-xs text-success">
              <Icon name="trending_up" size={14} />
              <span className="font-mono text-xs">+{((thisWeek / Math.max(totalEarned - thisWeek, 1)) * 100).toFixed(1)}% this week</span>
            </div>
          )}
        </div>

        <div className="bg-surface border border-outline-variant p-lg rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon name="task_alt" className="text-[120px]" />
          </div>
          <p className="font-mono text-xs text-text-secondary uppercase mb-sm">
            Quests Completed
          </p>
          <h3 className="font-mono text-2xl font-bold text-text-primary">
            {completedCount}
          </h3>
          <div className="mt-md flex items-center gap-xs text-primary">
            <Icon name="bolt" size={14} />
            <span className="font-mono text-xs">Keep hustling!</span>
          </div>
        </div>

        <div className="bg-surface border border-outline-variant p-lg rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon name="star" className="text-[120px]" />
          </div>
          <p className="font-mono text-xs text-text-secondary uppercase mb-sm">
            Average Rating
          </p>
          <div className="flex items-center gap-sm">
            <h3 className="font-mono text-2xl font-bold text-text-primary">4.95</h3>
            <Icon name="star" filled className="text-tertiary" />
          </div>
          <div className="mt-md flex items-center gap-xs text-text-secondary">
            <span className="font-mono text-xs">Based on {completedCount} reviews</span>
          </div>
        </div>
      </div>

      {/* Chart & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <div className="lg:col-span-8 bg-surface border border-outline-variant p-lg rounded-xl">
          <div className="flex items-center justify-between mb-xl">
            <h4 className="font-sans text-lg font-semibold">Performance Analysis</h4>
            <select className="bg-background border border-outline-variant rounded-lg font-mono text-xs py-xs px-md focus:border-primary focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <EarningsChart />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-lg">
          <div className="bg-surface border border-outline-variant p-lg rounded-xl flex-grow">
            <h4 className="font-sans text-lg font-semibold mb-lg">Weekly Goal</h4>
            <div className="space-y-lg">
              <div>
                <div className="flex justify-between mb-sm">
                  <span className="font-mono text-xs">
                    {formatCurrency(weeklyGoalTarget)} Target
                  </span>
                  <span className="font-mono text-xs text-primary">
                    {weeklyProgress}%
                  </span>
                </div>
                <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full shadow-[0_0_8px_rgba(208,188,255,0.5)] transition-all duration-500"
                    style={{ width: `${weeklyProgress}%` }}
                  />
                </div>
              </div>
              <div className="bg-background border border-outline-variant p-md rounded-lg">
                <div className="flex items-center gap-md">
                  <div className="bg-primary/10 text-primary p-sm rounded">
                    <Icon name="emoji_events" />
                  </div>
                  <div>
                    <p className="font-mono text-xs font-medium">Next Reward</p>
                    <p className="text-sm text-text-secondary">
                      Earn {formatCurrency(weeklyGoalTarget - thisWeek)} more for the
                      &quot;Hyper Runner&quot; badge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-lg flex items-center justify-between border-b border-outline-variant">
          <h4 className="font-sans text-lg font-semibold">Recent Activity</h4>
          <button
            type="button"
            className="text-primary font-mono text-xs flex items-center gap-xs hover:underline"
          >
            View Statement <Icon name="arrow_forward" size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-lg animate-pulse space-y-sm">
              {[1, 2, 3].map((i) => (
                <div key={`s-${i}`} className="h-16 bg-surface-container-high rounded" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="p-xl text-center">
              <Icon name="payments" className="text-on-surface-variant text-[48px]" />
              <p className="text-on-surface-variant text-sm mt-sm">
                No transactions yet. Complete quests to earn!
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background/50 text-text-secondary font-mono text-xs border-b border-outline-variant">
                  <th className="px-lg py-md">Quest Name</th>
                  <th className="px-lg py-md hidden sm:table-cell">Date</th>
                  <th className="px-lg py-md">Status</th>
                  <th className="px-lg py-md text-right">Bounty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-lg py-lg">
                      <div className="flex items-center gap-md">
                        <span className="bg-surface-container-high p-sm rounded-lg">
                          <Icon name="receipt_long" className="text-primary" size={20} />
                        </span>
                        <div>
                          <p className="text-sm font-medium">Quest Payment</p>
                          <p className="text-xs text-text-secondary font-mono">
                            ID: #{p.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-lg font-mono text-xs text-text-secondary hidden sm:table-cell">
                      {new Date(p.createdAt).toLocaleDateString("en-GB", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-lg py-lg">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-lg py-lg text-right font-mono font-bold text-text-primary">
                      {formatCurrency(Number(p.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
