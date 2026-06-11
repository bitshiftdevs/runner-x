# Runner_X Project Contributor Guide

Welcome to **Runner_X**—the premium student errand and quest application tailored for Ghanaian collegiate environments, starting with **KNUST**. 

This guide serves as the visual, architectural, and procedural source of truth. All developers, UI designers, and systems architects must read, understand, and strictly adhere to these standards when contributing to the repository.

---

## 🛠️ 1. Technical Stack

Our stack is selected for extreme responsiveness, modern code structures, and state-of-the-art developer ergonomics:

* **Next.js 16 (App Router):** Server-first React framework with file-based routing, server components, and streaming.
* **State Management:** Zustand with persist middleware for lightweight, scalable client state.
* **ORM & Database:** Drizzle ORM with Neon Postgres — type-safe queries, migrations, and schema definitions.
* **Styling:** Tailwind CSS v4 with CSS custom properties for the design token system.
* **Payments:** Moolre API for Mobile Money integration (https://docs.moolre.com/).
* **Maps & Location:** Google Maps JavaScript API + browser Geolocation API.
* **Fonts:** Outfit + JetBrains Mono via `next/font/google`.
* **Linter & Formatter:** Biome (replaces ESLint + Prettier).
* **Package Manager:** bun.
* **Environment:** `.env.local` with `process.env` validated at build time.

---

## 📂 2. Directory Architecture (Clean Architecture)

Runner_X uses a strict **Clean Architecture** structure. We separate concerns by responsibility layer, with clear boundaries between types, services, stores, and UI.

```
src/
├── app/                           # Next.js App Router pages & layouts
│   ├── (auth)/                    # Auth route group (login, OTP, register)
│   ├── (onboarding)/              # Onboarding route group
│   ├── (dashboard)/               # Main app route group
│   │   ├── quests/                # Quest board pages
│   │   ├── post/                  # Job posting pages
│   │   ├── profile/               # Profile pages
│   │   └── layout.tsx             # Dashboard layout with nav
│   ├── api/                       # API routes (webhooks, server actions)
│   ├── layout.tsx                 # Root layout (fonts, providers, theme)
│   └── page.tsx                   # Landing / redirect
├── components/                    # Reusable UI components
│   ├── ui/                        # Base design system (Button, Input, Card, Badge)
│   ├── layout/                    # Layout components (TopAppBar, SideNav, MobileNav)
│   ├── quest/                     # Quest/job related components (QuestCard, QuestDetail)
│   └── feedback/                  # Feedback & status (Toast, Skeleton, EmptyState)
├── types/                         # TypeScript types (prefer `type` over `interface`)
├── services/                      # External API services with abstract classes
│   ├── payment/                   # PaymentService abstract + MoolrePaymentService
│   ├── auth/                      # AuthService abstract
│   ├── maps/                      # MapsService abstract
│   └── notifications/             # NotificationService abstract
├── stores/                        # Zustand stores (auth, jobs, ui, chat)
├── db/                            # Drizzle ORM schema & migrations
│   ├── schema/                    # Table definitions (profiles, jobs, messages, etc.)
│   ├── migrations/                # Generated SQL migrations
│   └── index.ts                   # Drizzle client instance
├── lib/                           # Utility functions (pricing engine, formatters, validators)
├── hooks/                         # Custom React hooks (useAuth, useGeolocation, useRealtime)
└── constants/                     # App constants & config (categories, urgency levels, routes)
```

### Architecture Guidelines
- **`types/`**: Pure TypeScript types. Prefer `type` over `interface`. No runtime code.
- **`services/`**: Abstract class defines the contract; concrete implementation handles the API. This enables easy swapping (e.g., mock services for testing).
- **`stores/`**: Zustand stores are the single source of truth for client state. Keep stores thin — business logic lives in services or lib utilities.
- **`db/`**: Drizzle schema is the source of truth for the database. All migrations are generated via `drizzle-kit`.
- **`components/`**: Presentational components. Keep logic in hooks or stores — components render UI.

---

## 🎨 3. Design Tokens & Visual Integrity

To maintain absolute uniformity between Obsidian Dark mode and Zinc Light mode, **never write hardcoded color hex values or magic spacing numbers in your UI code**. Use our design token system via Tailwind CSS v4 custom properties.

### A. Spacing & Radius Guidelines
* Margins & Paddings: Use Tailwind spacing utilities (`p-2` = 8px, `p-4` = 16px, `p-6` = 24px).
* Spacing gaps between elements: Use `gap-2`, `gap-4`, `gap-6` in flex/grid containers.
* Corner rounding: Use `rounded-lg` (12px) for cards, `rounded-xl` (16px) for bottom sheets, `rounded-full` for pills.

### B. Dynamic Color Swapping (CSS Custom Properties)
* Access theme colors via Tailwind utilities that reference CSS custom properties:
  ```tsx
  <div className="bg-surface text-primary border-border">
    <h2 className="text-text-primary">Quest Title</h2>
    <p className="text-text-secondary">Description</p>
  </div>
  ```
* All color tokens are defined in `tailwind.config.ts` referencing `var(--color-*)` custom properties.
* Theme switching toggles a `data-theme="dark"` or `data-theme="light"` attribute on `<html>`.
* Avoid raw hex color references unless implementing specific one-off gradients.

---

## ⚡ 4. Developer Workflows & Commands

To keep the repository error-free and ready to deploy, run these commands frequently during development.

### A. Installing Dependencies
Whenever modifications are made to `package.json`, run:
```bash
bun install
```

### B. Running the Dev Server
```bash
bun dev
```

### C. Database Migrations (Drizzle)
```bash
# Generate a migration after schema changes
bun drizzle-kit generate

# Apply migrations to the database
bun drizzle-kit migrate

# Open Drizzle Studio to browse data
bun drizzle-kit studio
```

### D. Linting & Formatting (Biome)
Runner_X uses Biome as the single tool for linting and formatting. Run before every commit:
```bash
# Check for issues
bun biome check .

# Auto-fix and format
bun biome check --write .
```
All code submissions **MUST pass Biome with zero errors**.

### E. Type Checking
```bash
bun tsc --noEmit
```

### F. Building for Production
```bash
bun run build
```

---

## 🔒 5. Environment & Credentials

* **Strict Rule:** Never check raw credentials, API endpoints, or secret keys into source control!
* Add keys to the root-level `.env.local` file (which is in `.gitignore`).
* Access environment variables through validated constants:
  ```typescript
  // src/constants/env.ts
  export const env = {
    databaseUrl: process.env.DATABASE_URL!,
    moolreApiKey: process.env.MOOLRE_API_KEY!,
    googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  } as const;
  ```
* Public env vars (accessible in client code) must be prefixed with `NEXT_PUBLIC_`.
