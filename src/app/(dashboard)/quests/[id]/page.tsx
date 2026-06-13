"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon, StatusChip, SlideToAccept } from "@/components/ui";
import { formatCurrency, api } from "@/lib";
import { JOB_STAGE_LABELS } from "@/constants";
import type { Job } from "@/types";
import { useAuthStore } from "@/stores";

function CountdownTimer({ expiresAt }: { expiresAt: string | null }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("00:00");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) return null;
  return <span className="font-mono text-2xl font-bold text-error">{timeLeft}</span>;
}

export default function QuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [quest, setQuest] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuest() {
      try {
        const data = await api.jobs.get(id);
        setQuest(data.job ?? null);
      } finally {
        setLoading(false);
      }
    }
    fetchQuest();
  }, [id]);

  const handleAccept = useCallback(async () => {
    const data = await api.jobs.accept(id);
    if (data.job) setQuest(data.job);
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-lg p-lg">
        <div className="h-8 bg-surface-container-high rounded w-1/3" />
        <div className="h-64 bg-surface-container-high rounded" />
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="text-center py-3xl">
        <Icon name="search_off" className="text-on-surface-variant text-[48px]" />
        <p className="text-on-surface-variant mt-md">Quest not found</p>
        <button
          type="button"
          onClick={() => router.push("/quests")}
          className="mt-md text-primary font-mono text-sm hover:underline"
        >
          Back to Board
        </button>
      </div>
    );
  }

  const isOwner = user?.id === quest.requesterId;
  const isRunner = user?.id === quest.runnerId;
  const canAccept = !isOwner && quest.status === "posted";
  const isUrgent = quest.urgency !== "normal";
  const pickupAddress =
    (quest.pickupLocation as { address?: string })?.address ?? "Pickup Point";
  const deliveryAddress =
    (quest.deliveryLocation as { address?: string })?.address ?? "Delivery Point";

  return (
    <div className="flex flex-col lg:flex-row lg:-m-lg lg:h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Panel: Map */}
      <section className="w-full lg:w-3/5 h-64 lg:h-full relative bg-surface-container-lowest border-b lg:border-b-0 lg:border-r border-outline-variant overflow-hidden">
        <div className="absolute inset-0 bg-surface-container-lowest flex items-center justify-center">
          <div className="text-center text-on-surface-variant">
            <Icon name="map" className="text-[64px] opacity-30" />
            <p className="font-mono text-xs mt-sm opacity-50">MAP VIEW</p>
          </div>
        </div>

        {/* Route info overlay */}
        <div className="absolute top-lg left-lg flex flex-col gap-sm z-10">
          <div className="bg-surface/90 backdrop-blur-md border border-outline-variant p-md rounded-lg flex items-center gap-md">
            <div className="flex flex-col items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-px h-8 bg-outline-variant" />
              <span className="w-2 h-2 rounded-full bg-secondary" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-text-secondary uppercase">
                PICKUP
              </span>
              <span className="text-sm text-text-primary">{pickupAddress}</span>
              <div className="h-3" />
              <span className="font-mono text-[10px] text-text-secondary uppercase">
                DELIVERY
              </span>
              <span className="text-sm text-text-primary">{deliveryAddress}</span>
            </div>
          </div>
        </div>

        {/* Distance & time overlay */}
        <div className="absolute bottom-lg left-lg z-10">
          <div className="bg-surface/90 backdrop-blur-md border border-outline-variant px-lg py-md rounded-lg">
            <div className="flex items-center gap-xl">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-text-secondary uppercase">
                  DISTANCE
                </span>
                <span className="font-mono text-xl font-bold text-primary">
                  {quest.distanceFee
                    ? `${(quest.distanceFee / 2.5).toFixed(1)} KM`
                    : "—"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-text-secondary uppercase">
                  EST. TIME
                </span>
                <span className="font-mono text-xl font-bold text-secondary">
                  {quest.distanceFee
                    ? `${Math.ceil((quest.distanceFee / 2.5) * 7)} MIN`
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Job Details */}
      <section className="w-full lg:w-2/5 flex flex-col h-full bg-surface overflow-y-auto">
        <div className="p-lg lg:p-xl flex-1 flex flex-col gap-xl">
          {/* Header & Tags */}
          <div className="flex flex-col gap-md">
            <div className="flex items-center justify-between">
              {isUrgent ? (
                <span className="px-md py-xs bg-error/10 border border-error/30 text-error font-mono text-xs rounded-full flex items-center gap-xs">
                  <Icon name="bolt" size={14} />
                  URGENT QUEST
                </span>
              ) : (
                <StatusChip
                  label={JOB_STAGE_LABELS[quest.status] ?? quest.status}
                  variant={quest.status === "completed" ? "success" : "primary"}
                />
              )}
              <CountdownTimer expiresAt={quest.expiresAt} />
            </div>
            <h1 className="font-sans text-2xl lg:text-[32px] font-semibold leading-tight text-text-primary">
              {quest.title}
            </h1>
          </div>

          {/* Bounty Breakdown */}
          <div className="p-lg bg-surface-container-high rounded-xl border border-outline-variant">
            <span className="font-mono text-xs text-text-secondary mb-md block uppercase tracking-wider">
              BOUNTY BREAKDOWN
            </span>
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Base Errand Fee</span>
                <span className="font-mono text-text-primary">
                  {formatCurrency(quest.baseFee)}
                </span>
              </div>
              {quest.urgencyFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Urgency Bonus</span>
                  <span className="font-mono text-success">
                    + {formatCurrency(quest.urgencyFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">
                  Distance Adjustment
                </span>
                <span className="font-mono text-text-primary">
                  {formatCurrency(quest.distanceFee)}
                </span>
              </div>
              <div className="pt-md mt-md border-t border-outline-variant flex justify-between items-center">
                <span className="font-sans text-lg font-semibold text-primary">
                  Total Earnings
                </span>
                <span className="font-mono text-2xl font-bold text-primary">
                  {formatCurrency(quest.runnerEarnings)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-md">
            <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
              Quest Description
            </span>
            <p className="text-base text-on-surface-variant leading-relaxed">
              {quest.description}
            </p>
            <div className="flex flex-wrap gap-sm">
              {quest.category && (
                <span className="px-md py-xs bg-surface-container-highest border border-outline-variant rounded-lg font-mono text-xs text-text-secondary">
                  {quest.category.replace(/_/g, " ")}
                </span>
              )}
              {quest.vendorName && (
                <span className="px-md py-xs bg-surface-container-highest border border-outline-variant rounded-lg font-mono text-xs text-text-secondary">
                  {quest.vendorName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Swipe Action Area */}
        {canAccept && (
          <div className="p-lg lg:p-xl bg-background border-t border-outline-variant">
            <SlideToAccept
              label="DRAG TO ACCEPT QUEST"
              onAccept={handleAccept}
            />
          </div>
        )}

        {isRunner && quest.status !== "completed" && (
          <div className="p-lg bg-background border-t border-outline-variant">
            <button
              type="button"
              onClick={() => router.push("/missions")}
              className="w-full bg-primary text-on-primary font-mono text-sm font-bold py-md rounded-lg glow-primary active:scale-95 transition-transform"
            >
              Go to Active Mission
            </button>
          </div>
        )}

        {isOwner && quest.status === "posted" && (
          <div className="p-lg bg-background border-t border-outline-variant text-center">
            <p className="text-on-surface-variant text-sm font-mono">
              Waiting for a runner to accept...
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
