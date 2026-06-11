# Runner_X – Product Requirements Document (PRD)

> **Document Version:** 2.0  
> **Date:** June 11, 2026  
> **Product Name:** Runner_X  
> **Tagline:** *"Campus Hustle, Delivered Fast"*

---

## 1. Executive Summary

Runner_X is a **student-only, hyper-local dispatch marketplace** for university campuses in Ghana, starting with **KNUST** (Kwame Nkrumah University of Science and Technology) in Kumasi.

The app connects **Requesters** (students needing errands) with **Runners** (students earning money). It operates on a **Dispatch-First model**: the platform only manages the service/delivery fee. Item costs are handled directly between parties (cash or Mobile Money) to avoid early fintech regulations.

This approach enables fast launch, low regulatory risk, and focus on building trust, convenience, and reliability.

---

## 2. Vision & Objectives

**Vision:**  
Become the default *"on-campus Uber for errands"* — the most trusted and fastest way for students to get things done while creating flexible earning opportunities for fellow students.

**Business Objectives:**
- Achieve product-market fit at KNUST within 3–6 months.
- Reach 50+ daily jobs and 1,000+ active users in first 6 months.
- Prove repeatable demand before adding complex payment features.
- Generate sustainable revenue from service fee commissions.

**Product Objectives:**
- Deliver a superior experience compared to WhatsApp groups or random runners.
- Maintain high job completion rate (>90%) and user satisfaction (>4.5 average rating).

---

## 3. Problem Statement & Opportunity

**Problems:**
- Students lose valuable study time on basic errands (food, notes, printing, documents, small pickups).
- Errand arrangements via WhatsApp are unreliable, lack tracking, and have trust issues.
- Many students need flexible income but lack easy gig opportunities around lectures.

**Opportunity:**  
Large student population at KNUST with high demand for quick, affordable, trusted local services.

---

## 4. Target Audience & User Personas

**Primary Users:** University students (18–28 years old) at KNUST and future Ghanaian campuses.

| Persona | Role | Description |
|---|---|---|
| **Akua** | Requester | Busy 3rd-year Engineering student who needs food delivered during study sessions |
| **Kwame** | Runner | 2nd-year student who wants to earn extra money between classes |
| **Nana** | Both | Student who posts jobs and also runs errands |

---

## 5. Functional Requirements

### 5.1 Authentication & Onboarding
- Phone number (Ghanaian) + Email registration with OTP.
- Profile creation: Full name, profile photo, Student ID upload, bio, default campus location.
- Role selection: **Requester**, **Runner**, or **Both**.
- Manual student verification (admin approves via Student ID).

### 5.2 Job Posting (Requester)

**Job Categories:**
- Food & Drinks
- Academic Materials
- Pickup / Delivery
- General Errands
- Others

**Fields:**
- Title, rich description, vendor name (optional).
- Map-based pickup and delivery location picker.
- Photo attachments.
- Urgency selection: Normal / 10 min / 15 min / 30 min.
- Expiration setting: User-defined time/date for when the job automatically expires and refunds if unaccepted.
- Real-time service fee preview with transparent breakdown.

### 5.3 Pricing Engine

**Formula:**
```
Service Fee = Base Fee + (Distance × Rate) + Urgency Multiplier + Category Multiplier
```

- Clear breakdown shown: *"Total GHS 12 | Runner earns GHS 9 | Platform keeps GHS 3"*
- Platform commission: **20–30%** (configurable via backend).

### 5.4 Service Fee Payment
- Requester pays **only the service fee** via Moolre (Mobile Money).
- Job becomes active **only after successful payment**.

### 5.5 Matching & Runner Experience
- Live job feed with distance, earnings, and estimated time.
- Job acceptance with decision timer (e.g., 5-10 mins) for the Requester to approve or skip the runner.
- Runner profile preview (photo, ratings, verification badge) shown to Requester before final approval.
- Real-time in-app chat (text + images).

### 5.6 Job Execution Stages (Strict)

```
1. Posted (paid)
2. Accepted
3. Heading to Vendor
4. At Vendor          ← photo proof required
5. Heading to Delivery
6. Delivered          ← photo proof required
7. Confirmed          ← Requester OTP or manual confirmation
8. Completed / Cancelled / Disputed
```

- Live location tracking: runner shares location during movement stages.

### 5.7 Completion & Payout
- Requester confirms delivery.
- Platform pays runner their share via Moolre / MoMo *(simulation in early MVP)*.
- Mutual rating & review after completion.

### 5.8 Additional Features
- Push + in-app notifications.
- Job history and search.
- Runner earnings dashboard.
- Cancellation & dispute flows:
  - Grace period (e.g., 2 minutes) for 100% free cancellation.
  - Cancellation fee (platform cut) if cancelled after the grace period.
  - Expired jobs (no runner found before timer runs out) trigger an automatic 100% full refund.
- Role switching via intuitive navigation.
- Job templates for common requests.

---

## 6. Non-Functional Requirements

### Performance
- Fast load times and optimized bundle size with Next.js App Router.
- Client-side caching with Zustand persisted stores for profiles, past jobs, and drafts.

### Reliability
- Graceful handling of poor network conditions.
- Real-time updates via WebSocket subscriptions.

### Security & Compliance
- Row Level Security (RLS) policies on Neon Postgres via Drizzle ORM.
- Compliance with **Ghana Data Protection Act 2012**.
- Secure storage of authentication tokens (httpOnly cookies).
- No storage of sensitive payment card data.

### Usability
- Modern, colorful, student-friendly design with Tailwind CSS v4.
- Full dark mode support (default: Obsidian Dark).
- Intuitive UX optimized for first-time campus users.

### Technical
- Platform: **Web** (responsive, mobile-first) via Next.js 16.
- Scalable architecture (Zustand + Drizzle ORM + Neon Postgres).
- Maintainable, well-documented, contributor-friendly codebase.

---

## 7. User Flows (High Level)

**Requester Happy Path:**
```
Post Job → Pay Service Fee → Match with Runner → Track Live → Receive Item → Confirm OTP → Rate Runner
```

**Runner Happy Path:**
```
Browse Jobs → Accept → Chat & Coordinate → Complete Stages with Photos → Get Paid → Rate Requester
```

---

## 8. Technical Architecture

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router) |
| **State Management** | Zustand |
| **Backend / ORM** | Drizzle ORM + Neon Postgres |
| **CSS** | Tailwind CSS v4 |
| **Maps & Location** | Google Maps JavaScript API + Geolocation API |
| **Payments** | Moolre API (Mobile Money) |
| **Navigation** | Next.js App Router (file-based routing) |
| **Fonts** | Outfit + JetBrains Mono (via `next/font/google`) |
| **Linter** | Biome |
| **Package Manager** | bun |
| **Environment** | `.env.local` with `process.env` |

---

## 9. Business Model & Monetization (MVP)

- **Commission** on every service fee (20–30%).
- Example: *GHS 12 fee → Runner earns GHS 9, Platform keeps GHS 3.*

**Future Monetization:**
- Merchant listings / featured jobs.
- Premium runner profiles.
- In-app item payments (full escrow).

---

## 10. Success Metrics (KPIs)

| Category | Metric |
|---|---|
| **Acquisition** | Registered users, student verification rate |
| **Engagement** | Jobs posted, jobs accepted, completion rate |
| **Retention** | Weekly active users, repeat usage rate |
| **Financial** | Total service fees processed, platform revenue, avg fee per job |
| **Quality** | Average rating, cancellation rate, dispute rate |

> **Target for Month 3:** 500+ users · 30+ daily jobs · >4.5 average rating

---

## 11. Risks & Mitigation

| Risk | Mitigation Strategy |
|---|---|
| Chicken & Egg Problem | Launch incentives, campus marketing, seed users |
| Off-platform Bypass | Rules enforcement, rating impact, chat monitoring |
| Runner Liquidity | Focus on low-value, high-frequency jobs initially |
| Regulatory Risk | Stay in pure marketplace model; consult lawyer before adding escrow |
| Payment Failures | Strong error handling + fallback MoMo instructions |

---

## 12. Assumptions & Out of Scope (MVP)

**Assumptions:**
- Students have smartphones with basic mobile data.
- Mobile Money (MoMo) is the dominant payment method.
- Manual verification is sufficient at launch.

**Out of Scope for MVP:**
- Full wallet / escrow system
- Surge pricing
- Merchant in-app payments
- Advanced admin dashboard
- Multi-language (Twi) support
- Insurance coverage

---

## 13. Roadmap

| Phase | Timeline | Focus |
|---|---|---|
| **Phase 1 – MVP** | Now | Dispatch model · service fee only · KNUST |
| **Phase 2** | 3–6 months post-launch | Merchant partnerships · in-app item payments via Moolre · improved matching |
| **Phase 3** | 6–12 months | Full wallet · escrow · surge pricing · multi-campus |
| **Phase 4** | 12+ months | Enterprise features · API for other universities |

---

*This PRD is the single source of truth for Runner_X product scope, priorities, and direction. All feature development must be validated against this document before implementation.*
