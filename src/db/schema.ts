import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "requester",
  "runner",
  "both",
]);

export const jobCategoryEnum = pgEnum("job_category", [
  "food_drinks",
  "academic_materials",
  "pickup_delivery",
  "general_errands",
  "others",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "draft",
  "posted",
  "pending_approval",
  "accepted",
  "heading_to_vendor",
  "at_vendor",
  "heading_to_delivery",
  "delivered",
  "confirmed",
  "completed",
  "cancelled",
  "disputed",
  "expired",
]);

export const urgencyEnum = pgEnum("urgency_level", [
  "normal",
  "10min",
  "15min",
  "30min",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
  "refunded",
]);

// Tables

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  role: userRoleEnum("role").notNull().default("both"),
  studentIdUrl: text("student_id_url"),
  studentIdVerified: boolean("student_id_verified").notNull().default(false),
  campus: text("campus").notNull().default("KNUST"),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  totalJobs: integer("total_jobs").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  requesterId: uuid("requester_id")
    .notNull()
    .references(() => profiles.id),
  runnerId: uuid("runner_id").references(() => profiles.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: jobCategoryEnum("category").notNull(),
  urgency: urgencyEnum("urgency").notNull().default("normal"),
  pickupLocation: jsonb("pickup_location").notNull(),
  deliveryLocation: jsonb("delivery_location").notNull(),
  vendorName: text("vendor_name"),
  photoUrls: jsonb("photo_urls").notNull().default([]),
  baseFee: numeric("base_fee", { precision: 10, scale: 2 }).notNull(),
  distanceFee: numeric("distance_fee", { precision: 10, scale: 2 }).notNull(),
  urgencyFee: numeric("urgency_fee", { precision: 10, scale: 2 }).notNull(),
  categoryFee: numeric("category_fee", { precision: 10, scale: 2 }).notNull(),
  totalFee: numeric("total_fee", { precision: 10, scale: 2 }).notNull(),
  runnerEarnings: numeric("runner_earnings", {
    precision: 10,
    scale: 2,
  }).notNull(),
  platformFee: numeric("platform_fee", { precision: 10, scale: 2 }).notNull(),
  status: jobStatusEnum("status").notNull().default("draft"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const jobStages = pgTable("job_stages", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id),
  stage: jobStatusEnum("stage").notNull(),
  photoProofUrl: text("photo_proof_url"),
  actorId: uuid("actor_id")
    .notNull()
    .references(() => profiles.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => profiles.id),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  isSystem: boolean("is_system").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id),
  raterId: uuid("rater_id")
    .notNull()
    .references(() => profiles.id),
  rateeId: uuid("ratee_id")
    .notNull()
    .references(() => profiles.id),
  score: integer("score").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("GHS"),
  provider: text("provider").notNull().default("moolre"),
  providerRef: text("provider_ref"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
