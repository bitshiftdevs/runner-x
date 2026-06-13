"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Icon, StatusChip, SlideToAccept } from "@/components/ui";
import { formatCurrency } from "@/lib";
import { JOB_STAGE_LABELS } from "@/constants";
import type { Job } from "@/types";
import { useAuthStore } from "@/stores";

export default function QuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [quest, setQuest] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuest() {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        setQuest(data.job ?? null);
      } finally {
        setLoading(false);
      }
    }
    fetchQuest();
  }, [id]);

  async function handleAccept() {
    const res = await fetch(`/api/jobs/${id}/accept`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setQuest(data.job);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-lg">
        <div className="h-8 bg-surface-container-high rounded w-1/3" />
        <div className="h-48 bg-surface-container-high rounded" />
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="text-center py-3xl">
        <p className="text-on-surface-variant">Quest not found</p>
        <Button variant="ghost" onClick={() => router.push("/quests")}>
          Back to Board
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === quest.requesterId;
  const isRunner = user?.id === quest.runnerId;
  const canAccept = !isOwner && quest.status === "posted";

  return (
    <div className="max-w-2xl mx-auto space-y-xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-xs text-on-surface-variant hover:text-primary"
      >
        <Icon name="arrow_back" size={20} />
        <span className="font-mono text-sm">Back</span>
      </button>

      <div className="bg-surface border border-outline-variant rounded-lg p-lg space-y-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-sans text-2xl font-bold text-primary">
              {quest.title}
            </h1>
            <StatusChip
              label={JOB_STAGE_LABELS[quest.status] ?? quest.status}
              variant={quest.status === "completed" ? "success" : "primary"}
            />
          </div>
          {quest.urgency !== "normal" && (
            <span className="bg-primary/20 text-primary px-sm py-xs rounded font-mono text-xs">
              {quest.urgency.toUpperCase()}
            </span>
          )}
        </div>

        <p className="text-on-surface-variant">{quest.description}</p>

        {quest.vendorName && (
          <div className="flex items-center gap-sm text-on-surface-variant">
            <Icon name="store" size={18} />
            <span className="text-sm">{quest.vendorName}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-md">
          <div className="bg-surface-container-low p-md rounded-lg">
            <p className="font-mono text-xs text-on-surface-variant uppercase">Pickup</p>
            <p className="text-sm mt-xs">
              {(quest.pickupLocation as { address: string })?.address ?? "—"}
            </p>
          </div>
          <div className="bg-surface-container-low p-md rounded-lg">
            <p className="font-mono text-xs text-on-surface-variant uppercase">Delivery</p>
            <p className="text-sm mt-xs">
              {(quest.deliveryLocation as { address: string })?.address ?? "—"}
            </p>
          </div>
        </div>

        {/* Pricing breakdown */}
        <div className="border-t border-outline-variant pt-lg space-y-sm">
          <h3 className="font-mono text-xs text-on-surface-variant uppercase">
            Fee Breakdown
          </h3>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Base fee</span>
            <span>{formatCurrency(quest.baseFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Distance</span>
            <span>{formatCurrency(quest.distanceFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Urgency</span>
            <span>{formatCurrency(quest.urgencyFee)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t border-outline-variant pt-sm">
            <span>Total Fee</span>
            <span className="text-primary">{formatCurrency(quest.totalFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Runner earns</span>
            <span className="text-success">
              {formatCurrency(quest.runnerEarnings)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {canAccept && (
          <SlideToAccept onAccept={handleAccept} />
        )}

        {isRunner && quest.status !== "completed" && (
          <Button className="w-full" onClick={() => router.push(`/missions`)}>
            Go to Active Mission
          </Button>
        )}

        {isOwner && quest.status === "posted" && (
          <p className="text-center text-on-surface-variant text-sm">
            Waiting for a runner to accept...
          </p>
        )}
      </div>
    </div>
  );
}
