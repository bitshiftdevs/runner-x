import type { GeoLocation } from "./geo";

export type JobCategory =
  | "food_drinks"
  | "academic_materials"
  | "pickup_delivery"
  | "general_errands"
  | "others";

export type JobStatus =
  | "draft"
  | "posted"
  | "pending_approval"
  | "accepted"
  | "heading_to_vendor"
  | "at_vendor"
  | "heading_to_delivery"
  | "delivered"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "disputed"
  | "expired";

export type UrgencyLevel = "normal" | "10min" | "15min" | "30min";

export type Job = {
  id: string;
  requesterId: string;
  runnerId: string | null;
  title: string;
  description: string;
  category: JobCategory;
  urgency: UrgencyLevel;
  pickupLocation: GeoLocation;
  deliveryLocation: GeoLocation;
  vendorName: string | null;
  photoUrls: string[];
  baseFee: number;
  distanceFee: number;
  urgencyFee: number;
  categoryFee: number;
  totalFee: number;
  runnerEarnings: number;
  platformFee: number;
  status: JobStatus;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type JobStage = {
  id: string;
  jobId: string;
  stage: JobStatus;
  photoProofUrl: string | null;
  actorId: string;
  createdAt: string;
};
