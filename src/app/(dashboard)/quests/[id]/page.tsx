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

function StaticMap({
  pickup,
  delivery,
}: {
  pickup: { lat: number; lng: number; address: string };
  delivery: { lat: number; lng: number; address: string };
}) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (!key || key === "your-maps-key") {
    // Styled fallback when no API key
    return (
      <div className="absolute inset-0 bg-surface-container-lowest flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_40%,var(--color-primary)_0%,transparent_50%),radial-gradient(circle_at_70%_60%,var(--color-secondary)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23494454' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>
    );
  }

  const center = `${(pickup.lat + delivery.lat) / 2},${(pickup.lng + delivery.lng) / 2}`;
  const markers = `markers=color:0xd0bcff%7C${pickup.lat},${pickup.lng}&markers=color:0xffb0cd%7C${delivery.lat},${delivery.lng}`;
  const path = `path=color:0xd0bcff80%7Cweight:4%7C${pickup.lat},${pickup.lng}%7C${delivery.lat},${delivery.lng}`;
  const style = "style=feature:all%7Celement:geometry%7Ccolor:0x18181b&style=feature:all%7Celement:labels.text.fill%7Ccolor:0xa1a1aa&style=feature:water%7Celement:geometry%7Ccolor:0x0e0e10&style=feature:road%7Celement:geometry%7Ccolor:0x27272a";
  const src = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=15&size=800x600&maptype=roadmap&${markers}&${path}&${style}&key=${key}`;

  return (
    <img
      src={src}
      alt="Quest route map"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
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
  const pickup = quest.pickupLocation as { lat: number; lng: number; address: string };
  const delivery = quest.deliveryLocation as { lat: number; lng: number; address: string };
  const pickupAddress = pickup?.address ?? "Pickup Point";
  const deliveryAddress = delivery?.address ?? "Delivery Point";
  const distanceKm = quest.distanceFee ? (quest.distanceFee / 2.5).toFixed(1) : "—";
  const estMinutes = quest.distanceFee ? Math.ceil((quest.distanceFee / 2.5) * 7) : "—";

  return (
    <div className="flex flex-col lg:flex-row lg:-m-lg lg:h-[calc(100vh-4rem)] overflow-hidden">
      {/* Map Panel */}
      <section className="w-full lg:w-3/5 h-44 sm:h-56 lg:h-full relative bg-surface-container-lowest border-b lg:border-b-0 lg:border-r border-outline-variant overflow-hidden shrink-0">
        <StaticMap pickup={pickup} delivery={delivery} />

        {/* Route overlay */}
        <div className="absolute top-sm left-sm lg:top-lg lg:left-lg z-10">
          <div className="bg-surface/90 backdrop-blur-md border border-outline-variant p-sm lg:p-md rounded-lg flex items-center gap-sm lg:gap-md text-xs lg:text-sm">
            <div className="flex flex-col items-center gap-[2px]">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-px h-5 lg:h-8 bg-outline-variant" />
              <span className="w-2 h-2 rounded-full bg-secondary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[9px] lg:text-[10px] text-text-secondary uppercase">
                PICKUP
              </span>
              <span className="text-text-primary truncate">{pickupAddress}</span>
              <div className="h-1 lg:h-2" />
              <span className="font-mono text-[9px] lg:text-[10px] text-text-secondary uppercase">
                DELIVERY
              </span>
              <span className="text-text-primary truncate">{deliveryAddress}</span>
            </div>
          </div>
        </div>

        {/* Distance/time overlay */}
        <div className="absolute bottom-sm left-sm lg:bottom-lg lg:left-lg z-10">
          <div className="bg-surface/90 backdrop-blur-md border border-outline-variant px-md py-sm lg:px-lg lg:py-md rounded-lg">
            <div className="flex items-center gap-lg">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] lg:text-[10px] text-text-secondary uppercase">
                  DISTANCE
                </span>
                <span className="font-mono text-base lg:text-xl font-bold text-primary">
                  {distanceKm} KM
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] lg:text-[10px] text-text-secondary uppercase">
                  EST. TIME
                </span>
                <span className="font-mono text-base lg:text-xl font-bold text-secondary">
                  {estMinutes} MIN
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Panel */}
      <section className="w-full lg:w-2/5 flex flex-col min-h-0 flex-1 bg-surface overflow-y-auto pb-24 lg:pb-0">
        <div className="p-md lg:p-xl flex-1 flex flex-col gap-lg lg:gap-xl">
          {/* Header */}
          <div className="flex flex-col gap-sm lg:gap-md">
            <div className="flex items-center justify-between">
              {isUrgent ? (
                <span className="px-sm lg:px-md py-xs bg-error/10 border border-error/30 text-error font-mono text-[10px] lg:text-xs rounded-full flex items-center gap-xs">
                  <Icon name="bolt" size={12} />
                  URGENT
                </span>
              ) : (
                <StatusChip
                  label={JOB_STAGE_LABELS[quest.status] ?? quest.status}
                  variant={quest.status === "completed" ? "success" : "primary"}
                />
              )}
              <CountdownTimer expiresAt={quest.expiresAt} />
            </div>
            <h1 className="font-sans text-xl lg:text-[32px] font-semibold leading-tight text-text-primary">
              {quest.title}
            </h1>
          </div>

          {/* Bounty Breakdown */}
          <div className="p-md lg:p-lg bg-surface-container-high rounded-xl border border-outline-variant">
            <span className="font-mono text-[10px] lg:text-xs text-text-secondary mb-sm lg:mb-md block uppercase tracking-wider">
              BOUNTY BREAKDOWN
            </span>
            <div className="space-y-xs lg:space-y-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Base Errand Fee</span>
                <span className="font-mono text-sm text-text-primary">
                  {formatCurrency(quest.baseFee)}
                </span>
              </div>
              {quest.urgencyFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Urgency Bonus</span>
                  <span className="font-mono text-sm text-success">
                    + {formatCurrency(quest.urgencyFee)}
                  </span>
                </div>
              )}
              {quest.distanceFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Distance Adjustment</span>
                  <span className="font-mono text-sm text-text-primary">
                    {formatCurrency(quest.distanceFee)}
                  </span>
                </div>
              )}
              <div className="pt-sm lg:pt-md mt-sm lg:mt-md border-t border-outline-variant flex justify-between items-center">
                <span className="font-sans text-base lg:text-lg font-semibold text-primary">
                  Total Earnings
                </span>
                <span className="font-mono text-xl lg:text-2xl font-bold text-primary">
                  {formatCurrency(quest.runnerEarnings)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-sm lg:space-y-md">
            <span className="font-mono text-[10px] lg:text-xs text-text-secondary uppercase tracking-wider">
              Quest Description
            </span>
            <p className="text-sm lg:text-base text-on-surface-variant leading-relaxed">
              {quest.description}
            </p>
            <div className="flex flex-wrap gap-sm">
              {quest.category && (
                <span className="px-sm lg:px-md py-xs bg-surface-container-highest border border-outline-variant rounded-lg font-mono text-[10px] lg:text-xs text-text-secondary">
                  {quest.category.replace(/_/g, " ")}
                </span>
              )}
              {quest.vendorName && (
                <span className="px-sm lg:px-md py-xs bg-surface-container-highest border border-outline-variant rounded-lg font-mono text-[10px] lg:text-xs text-text-secondary">
                  {quest.vendorName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Area */}
        {canAccept && (
          <div className="p-md lg:p-xl bg-background border-t border-outline-variant sticky bottom-0">
            <SlideToAccept
              label="DRAG TO ACCEPT QUEST"
              onAccept={handleAccept}
            />
          </div>
        )}

        {isRunner && quest.status !== "completed" && (
          <div className="p-md lg:p-lg bg-background border-t border-outline-variant sticky bottom-0">
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
          <div className="p-md lg:p-lg bg-background border-t border-outline-variant sticky bottom-0 text-center">
            <p className="text-on-surface-variant text-sm font-mono">
              Waiting for a runner to accept...
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
