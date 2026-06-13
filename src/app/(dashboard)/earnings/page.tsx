"use client";

import { useEffect, useState } from "react";
import { MetricCard, SectionHeader, Icon } from "@/components/ui";
import { formatCurrency } from "@/lib";
import type { Payment } from "@/types";

export default function EarningsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch("/api/payments");
        const data = await res.json();
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

  const thisWeek = payments
    .filter((p) => {
      const d = new Date(p.createdAt);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return p.status === "success" && d >= weekAgo;
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-xl">
      <SectionHeader title="Earnings" moduleLabel="RUNNER" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <MetricCard
          label="Total Earned"
          value={formatCurrency(totalEarned)}
          trend={{ direction: "up", label: "All time" }}
        />
        <MetricCard
          label="This Week"
          value={formatCurrency(thisWeek)}
          colorClass="text-secondary"
        />
        <MetricCard
          label="Pending"
          value={formatCurrency(0)}
          subtitle="No pending payouts"
          colorClass="text-tertiary"
        />
      </div>

      <div className="bg-surface border border-outline-variant rounded-lg">
        <div className="p-md border-b border-outline-variant">
          <h3 className="font-mono text-sm text-on-surface-variant uppercase">
            Transaction History
          </h3>
        </div>
        {loading ? (
          <div className="p-md animate-pulse space-y-sm">
            {[1, 2, 3].map((i) => (
              <div key={`eh-${i}`} className="h-12 bg-surface-container-high rounded" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="p-xl text-center">
            <Icon name="payments" className="text-on-surface-variant text-[36px]" />
            <p className="text-on-surface-variant text-sm mt-sm">
              No transactions yet. Complete quests to earn!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {payments.map((p) => (
              <div key={p.id} className="p-md flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    p.status === "success" ? "bg-success/10" : "bg-error/10"
                  }`}>
                    <Icon
                      name={p.status === "success" ? "arrow_downward" : "arrow_upward"}
                      size={16}
                      className={p.status === "success" ? "text-success" : "text-error"}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Quest Payment</p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`font-mono font-bold ${
                  p.status === "success" ? "text-success" : "text-error"
                }`}>
                  {p.status === "success" ? "+" : "-"}{formatCurrency(Number(p.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
