"use client";

import { useAuthStore } from "@/stores";
import { MetricCard, ProgressBar, Icon } from "@/components/ui";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-xl">
      <div>
        <h1 className="font-sans text-3xl font-bold text-primary">
          Welcome back, {user?.fullName?.split(" ")[0] || "Runner"}
        </h1>
        <p className="text-on-surface-variant mt-xs">
          Here&apos;s your activity overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <MetricCard
          label="Total Earnings"
          value="₵0.00"
          trend={{ direction: "up", label: "New account" }}
        />
        <MetricCard
          label="Jobs Completed"
          value="0"
          colorClass="text-secondary"
        />
        <MetricCard
          label="Rating"
          value="—"
          subtitle="No ratings yet"
          colorClass="text-tertiary"
        />
      </div>

      <ProgressBar
        progress={0}
        label="RANK PROGRESS"
        valueLabel="0 / 1,000 XP"
        sublabelLeft="BRONZE I"
        sublabelRight="BRONZE II"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <Link
          href="/quests"
          className="bg-surface border border-outline-variant p-lg rounded-lg hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-md mb-md">
            <Icon name="grid_view" className="text-primary" />
            <h3 className="font-sans text-lg font-semibold">Quest Board</h3>
          </div>
          <p className="text-on-surface-variant text-sm">
            Browse available quests and accept jobs
          </p>
        </Link>
        <Link
          href="/quests/new"
          className="bg-surface border border-outline-variant p-lg rounded-lg hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-md mb-md">
            <Icon name="add_circle" className="text-primary" />
            <h3 className="font-sans text-lg font-semibold">Post a Quest</h3>
          </div>
          <p className="text-on-surface-variant text-sm">
            Need something done? Post it and find a runner
          </p>
        </Link>
      </div>
    </div>
  );
}
