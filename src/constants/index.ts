import type { JobCategory, UrgencyLevel } from "@/types";

export const APP_NAME = "Runner_X";
export const APP_TAGLINE = "Campus Hustle, Delivered Fast";
export const DEFAULT_CAMPUS = "";
export const CURRENCY = "GHS";
export const CURRENCY_SYMBOL = "₵";

export const PLATFORM_COMMISSION_RATE = 0.25; // 25%

export const BASE_FEE = 3.0; // GHS
export const DISTANCE_RATE = 2.5; // GHS per km

export const URGENCY_MULTIPLIERS: Record<UrgencyLevel, number> = {
  normal: 1.0,
  "10min": 1.8,
  "15min": 1.5,
  "30min": 1.2,
};

export const CATEGORY_MULTIPLIERS: Record<JobCategory, number> = {
  food_drinks: 1.2,
  academic_materials: 1.0,
  pickup_delivery: 1.1,
  general_errands: 1.0,
  others: 1.0,
};

export const JOB_CATEGORIES: {
  value: JobCategory;
  label: string;
  icon: string;
}[] = [
  { value: "food_drinks", label: "Food & Drinks", icon: "restaurant" },
  { value: "academic_materials", label: "Academic", icon: "menu_book" },
  { value: "pickup_delivery", label: "Pickup / Delivery", icon: "local_shipping" },
  { value: "general_errands", label: "General Errands", icon: "handyman" },
  { value: "others", label: "Others", icon: "more_horiz" },
];

export const URGENCY_OPTIONS: {
  value: UrgencyLevel;
  label: string;
  description: string;
}[] = [
  { value: "normal", label: "Normal", description: "No rush" },
  { value: "30min", label: "30 min", description: "Moderate urgency" },
  { value: "15min", label: "15 min", description: "Urgent" },
  { value: "10min", label: "10 min", description: "Very urgent" },
];

export const JOB_STAGE_LABELS: Record<string, string> = {
  posted: "Posted",
  pending_approval: "Pending Approval",
  accepted: "Accepted",
  heading_to_vendor: "Heading to Vendor",
  at_vendor: "At Vendor",
  heading_to_delivery: "Heading to Delivery",
  delivered: "Delivered",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
  expired: "Expired",
};

export const GRACE_PERIOD_MS = 2 * 60 * 1000; // 2 minutes
export const ACCEPTANCE_TIMER_MS = 10 * 60 * 1000; // 10 minutes
