"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon, SectionHeader } from "@/components/ui";
import { JOB_CATEGORIES, URGENCY_OPTIONS } from "@/constants";
import { calculatePricing, formatCurrency } from "@/lib";
import type { JobCategory, UrgencyLevel } from "@/types";

export default function NewQuestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<JobCategory>("food_drinks");
  const [urgency, setUrgency] = useState<UrgencyLevel>("normal");
  const [vendorName, setVendorName] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "review">("form");

  const estimatedDistanceKm = 1.5;
  const pricing = calculatePricing(estimatedDistanceKm, urgency, category);

  const canReview =
    title.trim() &&
    description.trim() &&
    pickupAddress.trim() &&
    deliveryAddress.trim();

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          urgency,
          vendorName: vendorName || null,
          pickupLocation: { lat: 6.673, lng: -1.565, address: pickupAddress },
          deliveryLocation: { lat: 6.68, lng: -1.57, address: deliveryAddress },
          distanceKm: estimatedDistanceKm,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/quests/${data.job.id}`);
      }
    } finally {
      setLoading(false);
    }
  }

  if (step === "review") {
    return (
      <div className="space-y-xl">
        <SectionHeader title="Review Quest" moduleLabel="CONFIRM" />

        <div className="grid grid-cols-[1fr_360px] gap-xl items-start">
          {/* Details */}
          <div className="bg-surface border border-outline-variant rounded-lg p-lg space-y-md">
            <div>
              <p className="font-mono text-xs text-on-surface-variant uppercase mb-xs">
                Title
              </p>
              <p className="font-semibold text-lg">{title}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-on-surface-variant uppercase mb-xs">
                Description
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-md pt-md border-t border-outline-variant">
              <div>
                <p className="font-mono text-xs text-on-surface-variant uppercase mb-xs">
                  Category
                </p>
                <p className="text-sm">
                  {JOB_CATEGORIES.find((c) => c.value === category)?.label}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-on-surface-variant uppercase mb-xs">
                  Urgency
                </p>
                <p className="text-sm">
                  {URGENCY_OPTIONS.find((u) => u.value === urgency)?.label}
                </p>
              </div>
              {vendorName && (
                <div>
                  <p className="font-mono text-xs text-on-surface-variant uppercase mb-xs">
                    Vendor
                  </p>
                  <p className="text-sm">{vendorName}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-md pt-md border-t border-outline-variant">
              <div>
                <p className="font-mono text-xs text-on-surface-variant uppercase mb-xs">
                  Pickup
                </p>
                <p className="text-sm">{pickupAddress}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-on-surface-variant uppercase mb-xs">
                  Delivery
                </p>
                <p className="text-sm">{deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Pricing + actions */}
          <div className="sticky top-20 space-y-lg">
            <div className="bg-surface border border-outline-variant rounded-lg p-lg space-y-md">
              <p className="font-mono text-xs text-on-surface-variant uppercase">
                Pricing
              </p>
              <div className="space-y-sm">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Base fee</span>
                  <span>{formatCurrency(pricing.baseFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">
                    Distance ({estimatedDistanceKm}km)
                  </span>
                  <span>{formatCurrency(pricing.distanceFee)}</span>
                </div>
                {pricing.urgencyFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Urgency</span>
                    <span>{formatCurrency(pricing.urgencyFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-primary border-t border-outline-variant pt-sm">
                  <span>You pay</span>
                  <span className="text-xl">{formatCurrency(pricing.totalFee)}</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Runner earns</span>
                  <span>{formatCurrency(pricing.runnerEarnings)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Posting..." : "Post & Pay"}
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setStep("form")}
              >
                Edit Quest
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-xl">
      <SectionHeader title="Post New Quest" moduleLabel="REQUESTER" />

      <div className="grid grid-cols-[1fr_360px] gap-xl items-start">
        {/* Form */}
        <div className="space-y-lg">
          {/* Category */}
          <div className="space-y-sm">
            <p className="font-mono text-xs text-on-surface-variant uppercase">
              Category
            </p>
            <div className="grid grid-cols-3 gap-sm">
              {JOB_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`flex flex-col items-center gap-xs p-md rounded-lg border transition-all ${
                    category === cat.value
                      ? "border-primary bg-primary/10"
                      : "border-outline-variant hover:border-primary/50"
                  }`}
                >
                  <Icon name={cat.icon} className="text-primary" />
                  <span className="text-xs font-mono">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-sm">
            <label
              htmlFor="title"
              className="font-mono text-xs text-on-surface-variant uppercase"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g., KFC family pack pickup"
            />
          </div>

          {/* Description */}
          <div className="space-y-sm">
            <label
              htmlFor="desc"
              className="font-mono text-xs text-on-surface-variant uppercase"
            >
              Description
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary resize-none"
              placeholder="What exactly do you need done?"
            />
          </div>

          {/* Vendor */}
          <div className="space-y-sm">
            <label
              htmlFor="vendor"
              className="font-mono text-xs text-on-surface-variant uppercase"
            >
              Vendor Name{" "}
              <span className="normal-case text-on-surface-variant/60">
                (optional)
              </span>
            </label>
            <input
              id="vendor"
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g., KFC KNUST"
            />
          </div>

          {/* Locations */}
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-sm">
              <label
                htmlFor="pickup"
                className="font-mono text-xs text-on-surface-variant uppercase"
              >
                Pickup Location
              </label>
              <input
                id="pickup"
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="Where to pick up"
              />
            </div>
            <div className="space-y-sm">
              <label
                htmlFor="delivery"
                className="font-mono text-xs text-on-surface-variant uppercase"
              >
                Delivery Location
              </label>
              <input
                id="delivery"
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="Where to deliver"
              />
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-sm">
            <p className="font-mono text-xs text-on-surface-variant uppercase">
              Urgency
            </p>
            <div className="flex gap-sm">
              {URGENCY_OPTIONS.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() => setUrgency(u.value)}
                  className={`flex-1 py-sm px-md rounded-lg border text-center transition-all ${
                    urgency === u.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-primary/50"
                  }`}
                >
                  <span className="font-mono text-xs">{u.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: sticky pricing preview */}
        <div className="sticky top-20 space-y-lg">
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg space-y-md">
            <p className="font-mono text-xs text-on-surface-variant uppercase">
              Pricing Preview
            </p>
            <div className="space-y-sm">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Base fee</span>
                <span>{formatCurrency(pricing.baseFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">
                  Distance ({estimatedDistanceKm}km)
                </span>
                <span>{formatCurrency(pricing.distanceFee)}</span>
              </div>
              {pricing.urgencyFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Urgency</span>
                  <span className="text-secondary">
                    +{formatCurrency(pricing.urgencyFee)}
                  </span>
                </div>
              )}
              <div className="border-t border-outline-variant pt-sm flex justify-between items-center">
                <span className="font-mono text-xs text-on-surface-variant uppercase">
                  Estimated fee
                </span>
                <span className="font-mono text-2xl font-bold text-primary">
                  {formatCurrency(pricing.totalFee)}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Runner earns {formatCurrency(pricing.runnerEarnings)} · Platform{" "}
                {formatCurrency(pricing.platformFee)}
              </p>
            </div>
          </div>

          <Button
            className="w-full"
            disabled={!canReview}
            onClick={() => setStep("review")}
          >
            Review Quest
          </Button>

          {!canReview && (
            <p className="text-xs text-on-surface-variant text-center">
              Fill in title, description and locations to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
