<div align="center">

# 🏃 Runner_X

### *"Campus Hustle, Delivered Fast"*

A student-only, hyper-local dispatch marketplace for university campuses in Ghana — starting with **KNUST**.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-Latest-433E38?style=flat-square)](https://zustand-demo.pmnd.rs)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](./LICENSE)

</div>

---

## 📖 What is Runner_X?

Runner_X connects **Requesters** (students needing errands) with **Runners** (students earning money) on a hyper-local campus marketplace. Think of it as the on-campus Uber for errands.

- 📦 **Requesters** post jobs — food pickups, printing, document runs, general errands.
- 🏃 **Runners** browse the live quest board, accept jobs, and earn money between classes.
- 💸 The platform charges only a **transparent service fee** — no escrow complexity at launch.

> **Dispatch-First model:** Item costs are handled directly between parties (cash or MoMo). The platform manages only the service/delivery fee — enabling fast launch and low regulatory risk.

---

## ✨ Core Features (MVP)

| Feature | Description |
|---|---|
| 🔐 **Auth & Onboarding** | Phone OTP + Email, Student ID verification, role selection |
| 📋 **Quest Board** | Live job feed with distance, urgency, and earnings preview |
| 📝 **Job Posting** | Category picker, map-based locations, photo attachments, pricing preview |
| 💰 **Pricing Engine** | `Base Fee + Distance × Rate + Urgency + Category` multipliers |
| 📱 **Moolre Payments** | Requester pays service fee via Mobile Money before job activates |
| 🗺️ **Live Tracking** | Runner shares real-time location during active job stages |
| 📸 **Photo Proof** | Required at "At Vendor" and "Delivered" stages |
| 💬 **In-App Chat** | Real-time messaging between Requester & Runner per job |
| ⭐ **Ratings** | Mutual review system after every completed job |
| 🔔 **Notifications** | Push + in-app alerts for job updates and messages |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router) |
| **State Management** | Zustand |
| **ORM & Database** | Drizzle ORM + Neon Postgres |
| **Styling** | Tailwind CSS v4 |
| **Maps & GPS** | Google Maps JavaScript API + Geolocation API |
| **Payments** | Moolre API (Mobile Money) |
| **Fonts** | Outfit + JetBrains Mono (via `next/font/google`) |
| **Linter** | Biome |
| **Package Manager** | bun |
| **Environment** | `.env.local` |

---

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
├── components/             # Reusable UI components
│   ├── ui/                 # Base design system components
│   ├── layout/             # Layout components (TopAppBar, SideNav)
│   ├── quest/              # Quest/job related components
│   └── feedback/           # Feedback & status components
├── types/                  # TypeScript types (prefer types over interfaces)
├── services/               # External API services with abstract classes
│   ├── payment/            # PaymentService abstract + MoolrePaymentService
│   ├── auth/               # AuthService abstract
│   ├── maps/               # MapsService abstract
│   └── notifications/
├── stores/                 # Zustand stores
├── db/                     # Drizzle ORM schema & migrations
├── lib/                    # Utility functions
├── hooks/                  # Custom React hooks
└── constants/              # App constants & config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ or bun runtime
- A Neon Postgres database ([create one free](https://neon.tech))

### 1. Clone the repository
```bash
git clone https://github.com/your-org/runner_x.git
cd runner_x
```

### 2. Set up environment variables
Copy the `.env` template and fill in your credentials:
```bash
cp .env.example .env.local
```

```env
DATABASE_URL=postgresql://...@neon.tech/runner_x
MOOLRE_API_KEY=your-moolre-key
MOOLRE_SECRET_KEY=your-moolre-secret
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-maps-key
```

> ⚠️ **Never commit `.env.local` to version control.** It is already in `.gitignore`.

### 3. Install dependencies
```bash
bun install
```

### 4. Run database migrations
```bash
bun drizzle-kit migrate
```

### 5. Run the app
```bash
bun dev
```

---

## 🏗️ Development Commands

| Command | Purpose |
|---|---|
| `bun install` | Install / update dependencies |
| `bun dev` | Launch dev server |
| `bun run build` | Production build |
| `bun drizzle-kit generate` | Generate migration from schema changes |
| `bun drizzle-kit migrate` | Apply migrations |
| `bun drizzle-kit studio` | Open Drizzle Studio (DB browser) |
| `bun biome check .` | Lint & format check |
| `bun biome check --write .` | Auto-fix lint & formatting |
| `bun tsc --noEmit` | Type check |

---

## 📋 Project Documentation

| Document | Purpose |
|---|---|
| [`PRD.md`](./PRD.md) | Full product requirements, personas, feature spec |
| [`ROADMAP.md`](./ROADMAP.md) | Phased development plan from MVP to multi-campus |
| [`PROJECT_GUIDE.md`](./PROJECT_GUIDE.md) | Architecture rules, code style, contributor standards |
| [`DESIGN.md`](./DESIGN.md) | Design token system, color palette, typography guide |

---

## 🎯 Current Status

> **Phase 0 — Foundation & Architecture ✅ Complete**

The project scaffold, design system, and all documentation are in place. Next up is **Phase 1 — Database Schema via Drizzle ORM**.

See [`ROADMAP.md`](./ROADMAP.md) for the full build progression.

---

## 🗺️ Roadmap Snapshot

```
Phase 0  ✅  Foundation & Architecture
Phase 1  ✅  Database Schema + Data Layer
Phase 2  🚧  Authentication & Onboarding
Phase 3  🔲  Core Quest Loop (Post → Pay → Match)
Phase 4  🔲  Job Execution (Tracking + Chat + Stages)
Phase 5  🔲  Profiles, Earnings & Notifications
Phase 6  🔲  Polish, Edge Cases & QA
Phase 7  🔲  KNUST Beta Launch
```

---

## 🤝 Contributing

All contributors must read [`PROJECT_GUIDE.md`](./PROJECT_GUIDE.md) before writing any code. Key rules:

- Use design tokens via Tailwind CSS custom properties — no hardcoded color values.
- All state management via Zustand stores.
- Run `bun biome check .` before every commit. Zero issues tolerance.
- Never commit secrets, `.env.local` files, or API keys.

---

## 👥 Target Users

**KNUST students** — Kumasi, Ghana.

- 🎓 Busy students who need errands handled fast.
- 💼 Students who want flexible income between classes.

---

<div align="center">

Built with ❤️ for Ghanaian campuses.

**Runner_X** — *Campus Hustle, Delivered Fast.*

</div>
