import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  profiles,
  jobs,
  messages,
  ratings,
  payments,
  jobStages,
} from "../../src/db/schema";
import { SEED_PROFILES } from "./profiles";
import { buildJobs } from "./jobs";
import { buildMessages } from "./messages";
import { buildRatings } from "./ratings";
import { buildPayments } from "./payments";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/main";

const sql = postgres(DATABASE_URL);
const db = drizzle(sql);

async function main() {
  console.log("🌱 Seeding database…");

  // 1. Wipe existing data (order matters for FK constraints)
  await db.delete(payments);
  await db.delete(ratings);
  await db.delete(messages);
  await db.delete(jobStages);
  await db.delete(jobs);
  await db.delete(profiles);
  console.log("  ✓ Cleared existing data");

  // 2. Profiles
  const insertedProfiles = await db
    .insert(profiles)
    .values(SEED_PROFILES)
    .returning();
  console.log(`  ✓ Inserted ${insertedProfiles.length} profiles`);

  const runners = insertedProfiles.filter(
    (p) => p.role === "runner" || p.role === "both",
  );
  const requesters = insertedProfiles.filter(
    (p) => p.role === "requester" || p.role === "both",
  );

  // 3. Jobs
  const jobsToInsert = buildJobs(requesters, runners);
  const insertedJobs = await db.insert(jobs).values(jobsToInsert).returning();
  console.log(`  ✓ Inserted ${insertedJobs.length} jobs`);

  // 4. Messages
  const messagesData = buildMessages(insertedJobs);
  if (messagesData.length > 0) {
    await db.insert(messages).values(messagesData);
    console.log(`  ✓ Inserted ${messagesData.length} messages`);
  }

  // 5. Ratings
  const ratingsData = buildRatings(insertedJobs);
  if (ratingsData.length > 0) {
    await db.insert(ratings).values(ratingsData);
    console.log(`  ✓ Inserted ${ratingsData.length} ratings`);
  }

  // 6. Payments
  const paymentsData = buildPayments(insertedJobs);
  if (paymentsData.length > 0) {
    await db.insert(payments).values(paymentsData);
    console.log(`  ✓ Inserted ${paymentsData.length} payments`);
  }

  console.log("\n✅ Seed complete!");
  await sql.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
