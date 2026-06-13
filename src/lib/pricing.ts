import type { JobCategory, UrgencyLevel } from "@/types";
import {
  BASE_FEE,
  DISTANCE_RATE,
  URGENCY_MULTIPLIERS,
  CATEGORY_MULTIPLIERS,
  PLATFORM_COMMISSION_RATE,
} from "@/constants";

export type PricingBreakdown = {
  baseFee: number;
  distanceFee: number;
  urgencyFee: number;
  categoryFee: number;
  totalFee: number;
  runnerEarnings: number;
  platformFee: number;
};

export function calculatePricing(
  distanceKm: number,
  urgency: UrgencyLevel,
  category: JobCategory,
): PricingBreakdown {
  const baseFee = BASE_FEE;
  const rawDistanceFee = distanceKm * DISTANCE_RATE;
  const urgencyMultiplier = URGENCY_MULTIPLIERS[urgency];
  const categoryMultiplier = CATEGORY_MULTIPLIERS[category];

  const subtotal = (baseFee + rawDistanceFee) * urgencyMultiplier * categoryMultiplier;
  const totalFee = Math.round(subtotal * 100) / 100;
  const platformFee = Math.round(totalFee * PLATFORM_COMMISSION_RATE * 100) / 100;
  const runnerEarnings = Math.round((totalFee - platformFee) * 100) / 100;

  const distanceFee = Math.round(rawDistanceFee * 100) / 100;
  const urgencyFee =
    Math.round((subtotal - (baseFee + rawDistanceFee) * categoryMultiplier) * 100) / 100;
  const categoryFee =
    Math.round(((baseFee + rawDistanceFee) * (categoryMultiplier - 1)) * 100) / 100;

  return {
    baseFee,
    distanceFee,
    urgencyFee,
    categoryFee,
    totalFee,
    runnerEarnings,
    platformFee,
  };
}
