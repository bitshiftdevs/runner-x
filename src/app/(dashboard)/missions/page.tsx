"use client";

import { useEffect, useState } from "react";
import { Button, Icon, StatusChip } from "@/components/ui";
import { formatCurrency, api } from "@/lib";
import { JOB_STAGE_LABELS } from "@/constants";
import type { Job, JobStatus } from "@/types";
import Link from "next/link";

const STAGE_ORDER: JobStatus[] = [
  "accepted",
  "heading_to_vendor",
  "at_vendor",
  "heading_to_delivery",
  "delivered",
  "confirmed",
  "completed",
];

export default function MissionsPage() {
  const [missions, setMissions] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMissions() {
      try {
        const data = await api.jobs.list({ mine: true });
        setMissions(data.jobs ?? []);
      } finally {
        setLoading(false);
      }
    }
    fetchMissions();
  }, []);

  const activeMissions = missions.filter(
    (m) => !["completed", "cancelled", "expired", "disputed"].includes(m.status),
  );
  const pastMissions = missions.filter((m) =>
    ["completed", "cancelled", "expired"].includes(m.status),
  );

  async function advanceStage(jobId: string) {
    const data = await api.jobs.advance(jobId);
    if (data.job) {
      setMissions((prev) => prev.map((m) => (m.id === jobId ? data.job : m)));
    }
  }

  async function confirmDelivery(jobId: string) {
    const data = await api.jobs.confirm(jobId);
    if (data.job) {
      setMissions((prev) => prev.map((m) => (m.id === jobId ? data.job : m)));
    }
  }

  if (loading) {
    return (
      <div className="space-y-lg">
        {[1, 2].map((i) => (
          <div key={`load-${i}`} className="h-32 bg-surface-container-high rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-xl">
      <h1 className="font-sans text-3xl font-bold text-primary">My Missions</h1>

      {activeMissions.length === 0 && pastMissions.length === 0 && (
        <div className="text-center py-3xl">
          <Icon name="assignment" className="text-on-surface-variant text-[48px]" />
          <p className="text-on-surface-variant mt-md">No missions yet</p>
          <Link href="/quests">
            <Button variant="secondary" className="mt-md">Browse Quests</Button>
          </Link>
        </div>
      )}

      {activeMissions.length > 0 && (
        <div className="space-y-lg">
          <h2 className="font-mono text-sm text-on-surface-variant uppercase">Active</h2>
          {activeMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onAdvance={() => advanceStage(mission.id)}
              onConfirm={() => confirmDelivery(mission.id)}
            />
          ))}
        </div>
      )}

      {pastMissions.length > 0 && (
        <div className="space-y-lg">
          <h2 className="font-mono text-sm text-on-surface-variant uppercase">Completed</h2>
          {pastMissions.map((mission) => (
            <div key={mission.id} className="bg-surface border border-outline-variant rounded-lg p-md flex justify-between items-center opacity-70">
              <div>
                <p className="font-semibold">{mission.title}</p>
                <StatusChip
                  label={JOB_STAGE_LABELS[mission.status] ?? mission.status}
                  variant={mission.status === "completed" ? "success" : "error"}
                />
              </div>
              <span className="font-mono text-lg font-bold text-success">
                {formatCurrency(mission.runnerEarnings)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MissionCard({
  mission,
  onAdvance,
  onConfirm,
}: {
  mission: Job;
  onAdvance: () => void;
  onConfirm: () => void;
}) {
  const currentIdx = STAGE_ORDER.indexOf(mission.status as JobStatus);

  return (
    <div className="bg-surface border border-primary/30 rounded-lg p-lg space-y-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-sans text-lg font-semibold text-primary">{mission.title}</h3>
          <StatusChip label={JOB_STAGE_LABELS[mission.status] ?? mission.status} variant="primary" />
        </div>
        <Link href={`/inbox?job=${mission.id}`}>
          <Icon name="chat_bubble" className="text-on-surface-variant hover:text-primary cursor-pointer" />
        </Link>
      </div>

      {/* Stage progress */}
      <div className="flex items-center gap-xs overflow-x-auto pb-sm">
        {STAGE_ORDER.slice(0, -1).map((stage, i) => (
          <div key={stage} className="flex items-center gap-xs">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i <= currentIdx
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {i <= currentIdx ? <Icon name="check" size={14} /> : i + 1}
            </div>
            {i < STAGE_ORDER.length - 2 && (
              <div className={`w-6 h-[2px] ${i < currentIdx ? "bg-primary" : "bg-outline-variant"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="font-mono text-lg font-bold text-primary">
          {formatCurrency(mission.runnerEarnings)}
        </span>
        <div className="flex gap-sm">
          {mission.status === "delivered" ? (
            <Button onClick={onConfirm}>Confirm Delivery</Button>
          ) : mission.status !== "completed" && mission.status !== "confirmed" ? (
            <Button onClick={onAdvance}>
              Next Stage
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
