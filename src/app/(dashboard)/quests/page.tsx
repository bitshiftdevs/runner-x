"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuestStore, useAuthStore } from "@/stores";
import { Icon } from "@/components/ui/icon";
import { formatCurrency, formatDistance, formatRelativeTime, api } from "@/lib";
import { JOB_CATEGORIES, URGENCY_OPTIONS } from "@/constants";
import type { Job, JobCategory, UrgencyLevel } from "@/types";

type ViewMode = "grid" | "list";

const CATEGORY_CHIP: Record<string, { label: string; color: string }> = {
  food_drinks: { label: "FOOD", color: "text-primary bg-primary/10 border-primary/30" },
  academic_materials: { label: "ACADEMIC", color: "text-secondary bg-secondary/10 border-secondary/30" },
  pickup_delivery: { label: "LOGISTICS", color: "text-tertiary bg-tertiary/10 border-tertiary/30" },
  general_errands: { label: "ERRAND", color: "text-success bg-success/10 border-success/30" },
  others: { label: "OTHER", color: "text-primary bg-primary/10 border-primary/30" },
};

const URGENCY_BADGE: Record<UrgencyLevel, { label: string; color: string; pulse: boolean }> = {
  "10min": { label: "CRITICAL", color: "text-error bg-error/10 border-error/30", pulse: true },
  "15min": { label: "URGENT", color: "text-error bg-error/10 border-error/30", pulse: true },
  "30min": { label: "FLEXIBLE", color: "text-secondary bg-secondary/10 border-secondary/30", pulse: false },
  normal: { label: "STABLE", color: "text-success bg-success/10 border-success/30", pulse: false },
};

function QuestCard({ quest }: { quest: Job }) {
  const router = useRouter();
  const cat = CATEGORY_CHIP[quest.category] ?? CATEGORY_CHIP.others;
  const urg = URGENCY_BADGE[quest.urgency] ?? URGENCY_BADGE.normal;
  const isUrgent = quest.urgency === "10min" || quest.urgency === "15min";

  return (
    <div
      onClick={() => router.push(`/quests/${quest.id}`)}
      className="h-64 quest-card-gradient border border-outline-variant rounded-xl p-lg flex flex-col justify-between hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-sm">
        <span className={`border px-sm py-xs rounded font-mono text-xs ${cat.color}`}>
          {cat.label}
        </span>
        <span className={`border px-sm py-xs rounded font-mono text-xs flex items-center gap-xs ${urg.color}`}>
          {urg.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
          {urg.label}
        </span>
      </div>

      <h3 className="font-sans text-lg font-semibold text-on-surface line-clamp-2 flex-1 mt-sm">
        {quest.title}
      </h3>

      <div className="space-y-md">
        <div className="flex items-center gap-lg text-on-surface-variant font-mono text-xs">
          <span className="flex items-center gap-xs">
            <Icon name="near_me" size={14} />
            {formatDistance(1.2)}
          </span>
          <span className="flex items-center gap-xs">
            <Icon name="schedule" size={14} />
            {formatRelativeTime(quest.createdAt)}
          </span>
        </div>

        <div className="border-t border-outline-variant pt-md flex items-center justify-between">
          <span className="font-mono text-2xl font-bold text-primary">
            {formatCurrency(quest.runnerEarnings)}
          </span>
          {isUrgent ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); router.push(`/quests/${quest.id}`); }}
              className="bg-primary text-on-primary px-lg py-2 rounded-lg font-mono font-bold text-sm hover:shadow-[0_0_15px_rgba(208,188,255,0.4)] active:scale-95 transition-all"
            >
              Accept
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); router.push(`/quests/${quest.id}`); }}
              className="bg-surface-container-highest text-on-surface px-lg py-2 rounded-lg font-mono font-bold text-sm hover:bg-outline-variant active:scale-95 transition-all"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type CommanderPanelProps = {
  user: import("@/types").Profile | null;
  activeMissions: Job[];
  todayEarnings: number;
  level: number;
  xpPct: number;
  rank: string;
};

function CommanderPanel({ user, activeMissions, todayEarnings, level, xpPct, rank }: CommanderPanelProps) {
  const router = useRouter();
  return (
    <div className="sticky top-24 bg-surface border border-outline-variant rounded-xl p-lg space-y-lg">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-lg font-bold text-on-surface">Commander Panel</h2>
        <span className="font-mono text-xs bg-primary/10 text-primary border border-primary/30 px-sm py-xs rounded">
          {rank}
        </span>
      </div>

      <div className="space-y-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">Level</span>
          <span className="font-mono text-sm font-bold text-primary">{level}</span>
        </div>
        <div className="w-full h-2 bg-outline-variant rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-xs text-on-surface-variant">
          <span>{xpPct * 10} XP</span>
          <span>{xpPct}%</span>
        </div>
      </div>

      <div className="border-t border-outline-variant pt-lg space-y-sm">
        <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
          Active Quests ({activeMissions.length})
        </h3>
        {activeMissions.length === 0 ? (
          <div className="text-center py-md">
            <Icon name="radar" className="text-on-surface-variant" size={32} />
            <p className="font-mono text-xs text-on-surface-variant mt-xs">No active missions</p>
          </div>
        ) : (
          activeMissions.slice(0, 2).map((m) => (
            <div
              key={m.id}
              onClick={() => router.push(`/quests/${m.id}`)}
              className="bg-surface-container-low rounded-lg p-sm border border-outline-variant cursor-pointer hover:border-primary/40 transition-colors"
            >
              <p className="font-sans text-sm font-medium text-on-surface line-clamp-1">{m.title}</p>
              <p className="font-mono text-xs text-on-surface-variant mt-xs">{m.status.replace(/_/g, " ")}</p>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-outline-variant pt-lg">
        <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-sm">Total Earned Today</p>
        <p className="font-mono text-3xl font-bold text-success">{formatCurrency(todayEarnings)}</p>
      </div>

      <div className="bg-surface-container-low rounded-lg p-md border border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <Icon name="star" size={16} className="text-tertiary" />
          <span className="font-mono text-sm text-on-surface">{Number(user?.rating ?? 0).toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-sm">
          <Icon name="assignment_turned_in" size={16} className="text-primary" />
          <span className="font-mono text-sm text-on-surface">{user?.totalJobs ?? 0} jobs</span>
        </div>
      </div>
    </div>
  );
}

export default function QuestBoardPage() {
  const router = useRouter();
  const { quests, setQuests, filters, setFilters, isLoading, setLoading } = useQuestStore();
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeMissions, setActiveMissions] = useState<Job[]>([]);
  const [todayEarnings, setTodayEarnings] = useState(0);

  useEffect(() => {
    async function fetchQuests() {
      setLoading(true);
      try {
        const data = await api.jobs.list({
          category: filters.category ?? undefined,
          urgency: filters.urgency ?? undefined,
        });
        setQuests(data.jobs ?? []);
      } finally {
        setLoading(false);
      }
    }
    fetchQuests();
  }, [filters, setQuests, setLoading]);

  useEffect(() => {
    api.jobs.list({ mine: true }).then((d) => {
      setActiveMissions(
        (d.jobs ?? []).filter(
          (j) => !["completed", "cancelled", "expired", "draft"].includes(j.status),
        ),
      );
    });
    api.payments.list().then((d) => {
      const midnight = new Date();
      midnight.setHours(0, 0, 0, 0);
      const earned = (d.payments ?? [])
        .filter((p) => p.status === "success" && new Date(p.createdAt) >= midnight)
        .reduce((s, p) => s + Number(p.amount), 0);
      setTodayEarnings(earned);
    });
  }, []);

  const totalJobs = user?.totalJobs ?? 0;
  const level = Math.floor(totalJobs / 2) + 1;
  const xp = (totalJobs % 2) * 500;
  const xpPct = Math.round((xp / 1000) * 100);
  const RANKS = ["Bronze", "Silver", "Gold I", "Gold II", "Gold III", "Gold IV", "Platinum", "Diamond"];
  const rank = RANKS[Math.min(Math.floor(level / 5), RANKS.length - 1)];

  const filteredQuests = quests.filter((q) => {
    const validStatus = q.status === "posted" || q.status === "pending_approval";
    const matchSearch =
      !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return validStatus && matchSearch;
  });

  return (
    <>
      <section className="lg:hidden p-md space-y-md sticky top-14 bg-background/80 backdrop-blur-md z-30">
        <div className="relative flex items-center">
          <Icon
            name="search"
            className="absolute left-md text-on-surface-variant pointer-events-none"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm pl-11 pr-md text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface"
            placeholder="Search available quests..."
            type="text"
          />
        </div>
        <div className="flex gap-sm overflow-x-auto hide-scrollbar py-xs">
          <button
            type="button"
            onClick={() => setFilters({ category: null })}
            className={`flex items-center gap-xs px-md py-xs rounded-full font-mono text-xs whitespace-nowrap transition-colors ${
              !filters.category
                ? "bg-primary-container text-on-primary-container glow-primary"
                : "bg-surface border border-outline-variant text-on-surface-variant hover:border-primary"
            }`}
          >
            <Icon name="dashboard" filled={!filters.category} size={16} />
            All Quests
          </button>
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() =>
                setFilters({
                  category: filters.category === cat.value ? null : (cat.value as JobCategory),
                })
              }
              className={`flex items-center gap-xs px-md py-xs rounded-full font-mono text-xs whitespace-nowrap transition-colors ${
                filters.category === cat.value
                  ? "bg-primary-container text-on-primary-container glow-primary"
                  : "bg-surface border border-outline-variant text-on-surface-variant hover:border-primary"
              }`}
            >
              <Icon name={cat.icon} size={16} />
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-lg p-md lg:p-0">
        <section className="flex-1 min-w-0 space-y-lg">
          <div className="hidden lg:block space-y-xs">
            <h1 className="font-sans text-5xl font-bold text-on-surface tracking-tight">Quest Board</h1>
            <p className="font-sans text-base text-on-surface-variant">High-priority errands waiting for a Runner.</p>
          </div>

          <div className="hidden lg:flex flex-wrap items-center gap-md bg-surface p-md rounded-xl border border-outline-variant">
            <div className="bg-surface-container-low rounded-lg border border-outline-variant px-md py-2 flex items-center gap-sm">
              <Icon name="category" size={14} className="text-on-surface-variant" />
              <select
                value={filters.category ?? ""}
                onChange={(e) =>
                  setFilters({ category: (e.target.value as JobCategory) || null })
                }
                className="bg-transparent border-none focus:ring-0 font-mono text-xs text-on-surface outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {JOB_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-surface-container-low rounded-lg border border-outline-variant px-md py-2 flex items-center gap-sm">
              <Icon name="bolt" size={14} className="text-on-surface-variant" />
              <select
                value={filters.urgency ?? ""}
                onChange={(e) =>
                  setFilters({ urgency: (e.target.value as UrgencyLevel) || null })
                }
                className="bg-transparent border-none focus:ring-0 font-mono text-xs text-on-surface outline-none cursor-pointer"
              >
                <option value="">All Urgencies</option>
                {URGENCY_OPTIONS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto flex items-center gap-sm">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-sm rounded-lg border transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-container border-primary/30 text-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                <Icon name="grid_view" size={18} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-sm rounded-lg border transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-container border-primary/30 text-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                <Icon name="view_list" size={18} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className={`grid gap-md ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={`skel-${i}`}
                  className="h-64 bg-surface border border-outline-variant rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredQuests.length === 0 ? (
            <div className="text-center py-3xl">
              <Icon name="radar" className="text-primary text-[64px] animate-pulse" />
              <h3 className="font-sans text-xl font-semibold mt-md">Scanning for Quests...</h3>
              <p className="text-on-surface-variant mt-xs text-sm">No quests match your filter.</p>
            </div>
          ) : (
            <div className={`grid gap-md ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
              {filteredQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          )}
        </section>

        <aside className="hidden lg:block w-80 shrink-0">
          <CommanderPanel
            user={user}
            activeMissions={activeMissions}
            todayEarnings={todayEarnings}
            level={level}
            xpPct={xpPct}
            rank={rank}
          />
        </aside>
      </div>

      <button
        type="button"
        onClick={() => router.push("/quests/new")}
        className="fixed bottom-24 right-md w-14 h-14 bg-primary text-on-primary-container rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Icon name="add" size={32} />
      </button>
    </>
  );
}
