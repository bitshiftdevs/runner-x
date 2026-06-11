# Runner_X – Project Development Roadmap

> **Last Updated:** June 11, 2026  
> **Current Phase:** Phase 0 — Foundation & Architecture  
> **Target Launch:** KNUST Campus MVP

This roadmap governs the complete build progression of Runner_X — from infrastructure setup to multi-campus scale. Each phase must be completed and verified before the next begins.

---

## Phase 0 — Foundation & Architecture ✅ Done

> *Goal: Get the project scaffolding, design system, and documentation in place so the team can build features without ambiguity.*

| Task | Status |
|---|---|
| Next.js 16 project setup (App Router, clean architecture) | ✅ Done |
| `package.json` with all core dependencies (bun) | ✅ Done |
| Neon Postgres connection + `.env.local` config | ✅ Done |
| Zustand stores setup with persist middleware | ✅ Done |
| Next.js App Router file-based navigation | ✅ Done |
| Tailwind CSS v4 — Obsidian Dark + Zinc Light themes | ✅ Done |
| Design token system (CSS custom properties + Tailwind config) | ✅ Done |
| Fonts — Outfit + JetBrains Mono via `next/font/google` | ✅ Done |
| Runner_X branding across all files | ✅ Done |
| `PRD.md` — Full Product Requirements Document | ✅ Done |
| `PROJECT_GUIDE.md` — Contributor standards guide | ✅ Done |
| `DESIGN.md` — Visual design token reference | ✅ Done |
| `ROADMAP.md` — This file | ✅ Done |
| Biome linter + formatter configuration | ✅ Done |

---

## Phase 1 — Backend Infrastructure ✅ Done

> *Goal: Define and deploy the full database schema via Drizzle ORM before any feature UI is built. Every TypeScript type and store depends on this.*

### 1.1 Database Schema (Drizzle ORM + Neon Postgres)
- [ ] `profiles` table — name, photo, role, student ID status, campus, rating
- [ ] `verified_profiles` table — user_id, verification_date, verified_by_admin_id (users personally verified by the app)
- [ ] `jobs` table — title, category, description, locations, urgency, fee breakdown, status
- [ ] `job_stages` table — stage enum, timestamp, photo proof URL, actor
- [ ] `ratings` table — job ID, rater ID, ratee ID, score, comment
- [ ] `messages` table — job ID, sender ID, content, image URL, timestamp
- [ ] Enum types: `user_role`, `job_category`, `job_status`, `urgency_level`

### 1.2 Row Level Security (RLS)
- [ ] Profiles: users can only edit their own profile
- [ ] Jobs: runners see all open jobs; requesters see only their own posted jobs in edit views
- [ ] Messages: only job participants (requester + assigned runner) can read/write
- [ ] Ratings: can only be submitted once per completed job, per user
- [ ] Job stages: only the assigned runner can advance stages

### 1.3 File Storage (Cloud Storage)
- [ ] `profile-photos` — public read, authenticated write
- [ ] `student-ids` — private (admin-only read, authenticated write)
- [ ] `job-photos` — public read (proof photos), authenticated write

### 1.4 TypeScript Data Layer
- [x] TypeScript types for all entities (`Profile`, `Job`, `JobStage`, `Message`, `Rating`) in `src/types/`
- [x] Drizzle schema definitions in `src/db/`
- [x] Service classes for each entity (CRUD operations) in `src/services/`
- [x] Zustand stores wired to services in `src/stores/`

---

## Phase 2 — Authentication & Onboarding ✅ Done

> *Goal: Users can register, verify, and set up their profiles. The gate to the entire app.*

### 2.1 Auth Feature (`src/app/(auth)/`)
- [ ] Phone number input screen (Ghanaian format validation)
- [ ] OTP entry screen with resend timer
- [ ] Email fallback option
- [ ] Auth session management (httpOnly cookies)
- [ ] Auth state listener (redirect: new user → onboarding, returning → home)
- [ ] Secure token storage

### 2.2 Onboarding Feature (`src/app/(onboarding)/`)
- [ ] Welcome/splash onboarding screens (3-step)
- [ ] Profile creation: full name, bio, profile photo upload
- [ ] Student ID photo upload (triggers admin review state)
- [ ] Role selection screen: Requester / Runner / Both
- [ ] Default campus + location picker (map-based)
- [ ] "Pending Verification" holding screen (post-submission state)

---

## Phase 3 — Core Quest Loop 🚧 IN PROGRESS

> *Goal: The full Requester → Runner job cycle works end-to-end. This is the heart of the product.*

### 3.1 Quest Board — Runner Feed (`src/app/(dashboard)/quests/`)
- [x] Live job feed (WebSocket real-time subscription)
- [x] Job card: category icon, title, distance, earnings, urgency badge
- [ ] Filter bar: by category, by urgency, by distance (PENDING)
- [ ] Job detail screen: full description, map preview, fee breakdown, accept button (PENDING)
- [ ] Acceptance timer countdown UI (PENDING)
- [x] Empty state & loading skeleton

### 3.2 Job Posting — Requester Form (`src/app/(dashboard)/post/`)
- [x] Category selector (icon grid)
- [x] Title + rich description input
- [x] Map-based pickup location picker
- [x] Map-based delivery location picker
- [x] Urgency selector
- [ ] Job expiration setting (date/time picker for automatic cancellation/refunds) (PENDING)
- [ ] Optional photo attachments (PENDING)
- [ ] Real-time pricing preview with transparent breakdown: (PENDING)
  > *"Total GHS 12 | You pay GHS 12 | Runner earns GHS 9 | Platform keeps GHS 3"*
- [x] Pricing engine implementation (Base + Distance × Rate + Urgency + Category multipliers)
- [ ] Review & confirm screen before payment (PENDING)

### 3.3 Service Fee Payment
- [ ] Moolre Mobile Money integration (payment initiation)
- [ ] Payment status polling / webhook handler (Next.js API route)
- [ ] Job activation on payment success
- [ ] Payment failure state + retry UI
- [ ] Simulated payment mode (MVP dev toggle)

### 3.4 Job Assignment & Runner Preview (`src/components/quest/`)
- [ ] Runner accepts job -> Job enters "pending_requester_approval" state
- [ ] Requester views Runner Profile Preview: displays runner's photo, ratings, stats, and reviews
- [ ] Verification badge UI (displays badge next to runner's name if they exist in `verified_profiles`)
- [ ] Requester decision timer (e.g., 5-10 minutes) to accept or skip the runner
- [ ] If skipped or timer expires, runner is freed and job returns to the board
- [ ] Requester confirms/approves the runner to officially start the execution phase

---

## Phase 4 — Job Execution & Tracking 🔲

> *Goal: The job runs reliably from acceptance to completion with full auditability.*

### 4.1 Stage Progression System
- [ ] Stage stepper UI (visual job progress tracker)
- [ ] Stage advancement controls (runner-side)
- [ ] Photo proof upload at "At Vendor" and "Delivered" stages
- [ ] Stage history timeline (visible to both parties)

### 4.2 Live Location Tracking
- [ ] Runner location sharing (Geolocation API broadcast during active job)
- [ ] Requester live map view (runner pin moves in real time)
- [ ] Location sharing starts on "Heading to Vendor", stops on "Delivered"
- [ ] Privacy: location only shared during active job stages

### 4.3 In-App Chat
- [ ] Chat screen per job (WebSocket real-time messages)
- [ ] Text + image message support
- [ ] Unread message badge
- [ ] System messages (auto-posted on stage changes: *"Kwame is heading to KFC"*)
- [ ] Chat accessible to job participants only (RLS enforced)

### 4.4 Completion Flow
- [ ] Requester OTP confirmation (or manual "Mark as Received" button)
- [ ] Payout trigger (simulated MoMo transfer in MVP)
- [ ] Mutual rating & review screen (1–5 stars + optional comment)
- [ ] Job archived to history

---

## Phase 5 — Profiles, Earnings & Notifications 🔲

> *Goal: Users have a full identity, history, and earnings view. Notifications keep them engaged.*

### 5.1 Profile Feature (`src/app/(dashboard)/profile/`)
- [ ] Profile screen: photo, name, rating, role badges, verification status
- [ ] Edit profile (name, bio, photo)
- [ ] Runner score & reputation display
- [ ] Review history (received ratings)
- [ ] Job history list (as requester + as runner)

### 5.2 Runner Earnings Dashboard
- [ ] Total earned (all time, this week, today)
- [ ] Payout history list
- [ ] Pending earnings (active jobs)
- [ ] MoMo payout request button (Phase 3+ feature)

### 5.3 Notifications
- [ ] Push notifications (Web Push API via service worker)
- [ ] In-app notification center
- [ ] Events: job accepted, stage changed, message received, job completed, rating received
- [ ] Notification preferences screen

---

## Phase 6 — Polish, Edge Cases & Launch Prep 🔲

> *Goal: The app is reliable, handles failure gracefully, and is ready for real students.*

### 6.1 Cancellation & Refunds
- [ ] Requester cancellation flow:
  - [ ] Grace period (e.g., 2 minutes) for 100% free cancellation.
  - [ ] Cancellation fee (platform cut) if cancelled after grace period.
- [ ] Expired Job Refund flow: 100% automatic refund if job timer runs out with no runner attached.
- [ ] Runner cancellation flow (job re-posted to board).
- [ ] Dispute submission form (with evidence photos).
- [ ] Dispute status screen (pending admin review).

### 6.2 Offline & Network Resilience
- [ ] Zustand persisted stores for profiles, job history, and drafts
- [ ] Offline banner + graceful degradation UI
- [ ] Draft saving for incomplete job posts

### 6.3 Job Templates
- [ ] Pre-filled templates for common jobs (e.g., "KFC Delivery", "Library Printout")
- [ ] User-saved personal templates

### 6.4 Admin Tooling (Minimal MVP)
- [ ] Student ID verification queue (admin dashboard page)
- [ ] Dispute review interface
- [ ] Manual job cancellation capability

### 6.5 QA & Performance
- [ ] End-to-end test of full requester and runner happy paths
- [ ] Load test WebSocket with 50 concurrent jobs
- [ ] Performance profiling (Lighthouse, Core Web Vitals)
- [ ] Accessibility review (contrast, focus states, keyboard navigation)
- [ ] App icon + favicon finalization

---

## Phase 7 — Beta Launch at KNUST 🔲

> *Goal: Real students use the app. Gather data, fix critical bugs, iterate.*

- [ ] Closed beta: 50–100 seed users (mix of Requesters and Runners)
- [ ] Feedback collection system (in-app rating prompt + Google Form)
- [ ] Error monitoring (Sentry)
- [ ] Analytics instrumentation (job funnel tracking)
- [ ] Production deployment (Vercel)
- [ ] Public launch

---

## Post-MVP Phases (Future)

### Phase 8 — Merchant Partnerships & Improved Matching
- Verified merchant accounts (restaurants, print shops, etc.)
- Smart matching algorithm (runner proximity + rating + history)
- Featured job listings

### Phase 9 — Full Payment Ecosystem
- In-app item payments (Moolre full escrow)
- Runner wallet with scheduled payouts
- Requester balance top-up

### Phase 10 — Multi-Campus Expansion
- UG (University of Ghana), UCC, UDS, etc.
- Campus-scoped job feeds
- Surge pricing during peak periods

### Phase 11 — Enterprise & API
- University partnerships (official errand services)
- API for third-party campus integrations
- Multi-language support (Twi)

---

## Version Tags

| Tag | Milestone |
|---|---|
| `v0.1.0` | Phase 0 complete — architecture + docs |
| `v0.2.0` | Phase 1 complete — schema + data layer |
| `v0.3.0` | Phase 2 complete — auth + onboarding |
| `v0.5.0` | Phase 3 complete — core quest loop |
| `v0.7.0` | Phase 4 complete — execution + tracking |
| `v0.9.0` | Phase 5–6 complete — full MVP feature set |
| `v1.0.0` | Phase 7 — Public Beta Launch at KNUST |

---

*Roadmap is a living document. Update status indicators and task checkboxes as work progresses. Any scope changes must be reflected here before development begins.*
