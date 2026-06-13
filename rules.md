# 📖 Runner_X Engineering Principles & Repository Rules

These are non-negotiable rules for every contributor and AI agent. They combine the strict visual aesthetics of Runner_X with enterprise-grade Clean Architecture principles tailored for our Next.js stack.

---

## 1. Theme — Never Hardcode Colors
**Rule:** Never write hardcoded color hex values or magic spacing numbers in your UI code. All color decisions must flow through Tailwind CSS utilities that reference our CSS custom properties (`var(--color-*)`).
```tsx
// ❌ Never do this
<div className="bg-[#1A1A1A] text-white">
// ✅ Do this
<div className="bg-surface text-text-primary">
```

## 2. Architecture — Clean Layers
**Rule:** Follow the Clean Architecture directory structure exactly.
- **`types/`**: Pure TypeScript types (prefer `type` over `interface`). No runtime code.
- **`services/`**: External API calls. Define abstract classes as contracts, concrete classes for implementation.
- **`stores/`**: Client state.
- **`db/`**: Database schema and queries.
- **`components/`**: Presentational UI only.

## 3. State Management — Zustand Only
**Rule:** Use Zustand for global client state. Keep stores thin—complex business logic should live in `services/` or `lib/` utilities. Do not use Context API for global state.

## 4. Database — Drizzle ORM is the Source of Truth
**Rule:** All schema definitions live in `src/db/schema/` (or similar configured DB path). Never manually alter the database. Always use `bun drizzle-kit generate` and `bun drizzle-kit migrate` for changes.

## 5. UI Components — Design System First
**Rule:** Before writing a new base widget, check `src/components/ui/`. Use existing base components (Buttons, Inputs, Cards, Badges) to maintain visual consistency. 

## 6. Routing & Navigation — Next.js App Router
**Rule:** Use the Next.js 16 App Router conventions (`src/app/`). All navigation should happen via `<Link>` from `next/link` or the `useRouter` hook from `next/navigation` (not `next/router`).

## 7. Environment Variables — Validated Constants
**Rule:** Never access `process.env.*` directly inside components. Use the validated `env` object from `src/constants/env.ts` (or similar).
```typescript
// ❌ Never do this
const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
// ✅ Do this
import { env } from '@/constants/env';
const key = env.googleMapsKey;
```

## 8. Formatting and Linting — Zero Tolerance (Biome)
**Rule:** The project uses Biome (no ESLint/Prettier). Every change must pass `bun biome check .` with zero errors. Run `bun biome check --write .` to auto-format before committing.

## 9. Next.js Best Practices — Server vs Client Components
**Rule:** Default to Server Components (`React Server Components`). Only add `"use client"` at the very top of files when you absolutely need interactivity (hooks, state, event listeners). Push `"use client"` as far down the component tree as possible.

## 10. File Size & Complexity
**Rule:** Keep files focused. If a file exceeds 150-200 lines, consider extracting sub-components, hooks, or utility functions to maintain readability.

## 11. Naming Conventions
**Rule:**
- **Files/Folders:** `kebab-case` for standard files/folders, `PascalCase.tsx` for React components.
- **Types/Interfaces:** `PascalCase`.
- **Variables/Functions:** `camelCase`.
- **Constants:** `UPPER_SNAKE_CASE` (for global non-env constants).

## 12. Security & Secrets
**Rule:** Never commit `.env.local` or any hardcoded API keys. They belong in environment variables only. 
