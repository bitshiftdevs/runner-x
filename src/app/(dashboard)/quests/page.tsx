"use client";

import { useEffect, useState } from "react";
import { useQuestStore } from "@/stores";
import { QuestCard } from "@/components/quest";
import { SectionHeader, Icon } from "@/components/ui";
import { formatCurrency, formatTimeLeft, formatDistance } from "@/lib";
import { JOB_CATEGORIES, URGENCY_OPTIONS } from "@/constants";
import type { Job, JobCategory, UrgencyLevel } from "@/types";
import Link from "next/link";

export default function QuestBoardPage() {
  const { quests, setQuests, filters, setFilters, isLoading, setLoading } =
    useQuestStore();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchQuests() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.set("category", filters.category);
        if (filters.urgency) params.set("urgency", filters.urgency);
        const res = await fetch(`/api/jobs?${params.toString()}`);
        const data = await res.json();
        setQuests(data.jobs ?? []);
      } finally {
        setLoading(false);
      }
    }
    fetchQuests();
  }, [filters, setQuests, setLoading]);

  const filteredQuests = quests.filter(
    (q) => q.status === "posted" || q.status === "pending_approval",
  );

  return (
    <div className="space-y-lg">
      <div className="flex items-center justify-between">
        <SectionHeader title="Quest Board" moduleLabel="LIVE FEED" />
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors"
        >
          <Icon name="tune" size={20} />
          <span className="font-mono text-xs">Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-surface border border-outline-variant rounded-lg p-md flex flex-wrap gap-md">
          <div className="space-y-xs">
            <span className="font-mono text-xs text-on-surface-variant">Category</span>
            <div className="flex flex-wrap gap-xs">
              <button
                type="button"
                onClick={() => setFilters({ category: null })}
                className={`px-sm py-xs rounded text-xs font-mono ${!filters.category ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}
              >
                All
              </button>
              {JOB_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFilters({ category: cat.value as JobCategory })}
                  className={`px-sm py-xs rounded text-xs font-mono ${filters.category === cat.value ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-xs">
            <span className="font-mono text-xs text-on-surface-variant">Urgency</span>
            <div className="flex flex-wrap gap-xs">
              <button
                type="button"
                onClick={() => setFilters({ urgency: null })}
                className={`px-sm py-xs rounded text-xs font-mono ${!filters.urgency ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}
              >
                All
              </button>
              {URGENCY_OPTIONS.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() => setFilters({ urgency: u.value as UrgencyLevel })}
                  className={`px-sm py-xs rounded text-xs font-mono ${filters.urgency === u.value ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {[1, 2, 3].map((i) => (
            <div
              key={`skel-${i}`}
              className="bg-surface border border-outline-variant p-md rounded-lg animate-pulse h-48"
            />
          ))}
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="text-center py-3xl">
          <Icon name="radar" className="text-primary text-[64px] animate-pulse" />
          <h3 className="font-sans text-xl font-semibold mt-md">
            Scanning for Quests...
          </h3>
          <p className="text-on-surface-variant mt-xs">
            No quests available right now. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredQuests.map((quest: Job) => (
            <Link key={quest.id} href={`/quests/${quest.id}`}>
              <QuestCard
                title={quest.title}
                description={quest.description}
                category={quest.category}
                bounty={formatCurrency(quest.runnerEarnings)}
                variant={quest.urgency !== "normal" ? "urgent" : "default"}
                timeLeft={quest.expiresAt ? formatTimeLeft(quest.expiresAt) : undefined}
                distance={formatDistance(1.2)}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
