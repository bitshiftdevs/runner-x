export type UserRole = "requester" | "runner" | "both";

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

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  bio: string | null;
  role: UserRole;
  studentIdUrl: string | null;
  studentIdVerified: boolean;
  campus: string;
  rating: number;
  totalJobs: number;
  createdAt: string;
};

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

export type GeoLocation = {
  lat: number;
  lng: number;
  address: string;
};

export type JobStage = {
  id: string;
  jobId: string;
  stage: JobStatus;
  photoProofUrl: string | null;
  actorId: string;
  createdAt: string;
};

export type Message = {
  id: string;
  jobId: string;
  senderId: string;
  content: string;
  imageUrl: string | null;
  isSystem: boolean;
  createdAt: string;
};

export type Rating = {
  id: string;
  jobId: string;
  raterId: string;
  rateeId: string;
  score: number;
  comment: string | null;
  createdAt: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: "job_update" | "message" | "rating" | "system";
};

export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export type Payment = {
  id: string;
  jobId: string;
  userId: string;
  amount: number;
  currency: string;
  provider: string;
  providerRef: string | null;
  status: PaymentStatus;
  createdAt: string;
};
