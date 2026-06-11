---
name: Cyber-Guildboard (Adaptive)
version: 2.0.0
author: Antigravity
description: A high-performance, adaptive design system for the student quest and errand economy. Features both a dark Obsidian theme and a bright crisp Zinc Light theme. Implemented via Tailwind CSS v4 custom properties.
tokens:
  shared:
    typography:
      fontSans: "Outfit"          # Wide, modern, premium rounded geometric sans-serif (next/font/google)
      fontMono: "JetBrains Mono"  # Precise monospace for badges, tags, and distance tracking (next/font/google)
      scale:
        h1: "32px"
        h2: "24px"
        h3: "18px"
        bodyLarge: "16px"
        body: "14px"
        caption: "12px"
    spacing:
      xs: "4px"
      sm: "8px"
      md: "16px"
      lg: "24px"
      xl: "32px"
    borderRadius:
      sm: "4px"
      md: "8px"
      lg: "12px"
      full: "9999px"

  dark:
    colors:
      background: "#09090B"      # Deep light-absorbing obsidian black
      surface: "#18181B"         # Clean slate grey for tiles and cards
      surfaceHover: "#27272A"    # Hover/active tile color
      border: "#27272A"          # Subtle thin border line
      borderFocus: "#3F3F46"     # Focused thin border line
      
      # Glow / Neon Accents
      primary: "#8B5CF6"         # Electric Violet (Active buttons, path lines, user progress)
      primaryGlow: "rgba(139, 92, 246, 0.15)"
      secondary: "#EC4899"       # Hyper Pink (High priority, urgent bounties, hot tasks)
      secondaryGlow: "rgba(236, 72, 153, 0.15)"
      success: "#10B981"         # Toxic Emerald (Completed runs, positive ratings, earnings deposit)
      successGlow: "rgba(16, 185, 129, 0.15)"
      warning: "#F59E0B"         # Neon Amber (Money rewards, fees, ratings stars)
      warningGlow: "rgba(245, 158, 11, 0.15)"
      
      # Typography
      textPrimary: "#F4F4F5"     # Crisp zinc white
      textSecondary: "#A1A1AA"   # Cool silver grey
      textMuted: "#71717A"       # Dimmed iron grey
    elevation:
      glowPrimary: "0 0 16px rgba(139, 92, 246, 0.25)"
      glowSecondary: "0 0 16px rgba(236, 72, 153, 0.25)"
      glowWarning: "0 0 16px rgba(245, 158, 11, 0.2)"

  light:
    colors:
      background: "#FAFAFA"      # Clean, clinical zinc off-white
      surface: "#FFFFFF"         # Crisp pure white cards
      surfaceHover: "#F4F4F5"    # Subtle hover tint
      border: "#E4E4E7"          # Solid thin border line
      borderFocus: "#D4D4D8"     # Focused thin border line
      
      # Glow / Rich Accents
      primary: "#7C3AED"         # Vibrant Deep Violet (Optimized for light readability)
      primaryGlow: "rgba(124, 58, 237, 0.08)"
      secondary: "#DB2777"       # Vibrant Deep Pink (Urgent alerts, hot items)
      secondaryGlow: "rgba(219, 39, 119, 0.08)"
      success: "#059669"         # Deep Mint Green (Completed events)
      successGlow: "rgba(5, 150, 105, 0.08)"
      warning: "#D97706"         # Golden Honey Amber (Cash bounties)
      warningGlow: "rgba(217, 119, 6, 0.08)"
      
      # Typography
      textPrimary: "#09090B"     # Charcoal black
      textSecondary: "#52525B"   # Deep slate grey
      textMuted: "#71717A"       # Iron grey
    elevation:
      glowPrimary: "0 8px 16px rgba(124, 58, 237, 0.08)"
      glowSecondary: "0 8px 16px rgba(219, 39, 119, 0.08)"
      glowWarning: "0 8px 16px rgba(217, 119, 6, 0.08)"
---

# Design System: Cyber-Guildboard (runner_x)

Welcome to the visual source of truth for **runner_x**. This document outlines the typography, styling, component design, and behavioral guidelines for our student quest questboard app.

---

## 1. Design Rationale
Students want things to feel **fast, rewarding, and premium**. 
By utilizing an **Adaptive Cyber-Guildboard Theme**, the app transitions seamlessly between:
1. **Dark Mode (Obsidian Base):** A high-contrast cyber-dashboard highlighting fluorescent neon items against a deep obsidian sky.
2. **Light Mode (Zinc White Base):** A clean, editorial layout reminiscent of Stripe's high-fidelity panels, with rich colored shadows and elegant border rules.

---

## 2. Color System
All colors are curated to ensure maximum contrast, accessibility, and visual charm across both lighting scenarios. Colors are implemented as CSS custom properties and consumed via Tailwind CSS v4 utilities.

### Implementation (CSS Custom Properties)
```css
/* src/app/globals.css */
@theme {
  --color-background: #09090B;
  --color-surface: #18181B;
  --color-surface-hover: #27272A;
  --color-border: #27272A;
  --color-border-focus: #3F3F46;
  --color-primary: #8B5CF6;
  --color-primary-glow: rgba(139, 92, 246, 0.15);
  --color-secondary: #EC4899;
  --color-secondary-glow: rgba(236, 72, 153, 0.15);
  --color-success: #10B981;
  --color-success-glow: rgba(16, 185, 129, 0.15);
  --color-warning: #F59E0B;
  --color-warning-glow: rgba(245, 158, 11, 0.15);
  --color-text-primary: #F4F4F5;
  --color-text-secondary: #A1A1AA;
  --color-text-muted: #71717A;
}

[data-theme="light"] {
  --color-background: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-surface-hover: #F4F4F5;
  --color-border: #E4E4E7;
  --color-border-focus: #D4D4D8;
  --color-primary: #7C3AED;
  --color-primary-glow: rgba(124, 58, 237, 0.08);
  --color-secondary: #DB2777;
  --color-secondary-glow: rgba(219, 39, 119, 0.08);
  --color-success: #059669;
  --color-success-glow: rgba(5, 150, 105, 0.08);
  --color-warning: #D97706;
  --color-warning-glow: rgba(217, 119, 6, 0.08);
  --color-text-primary: #09090B;
  --color-text-secondary: #52525B;
  --color-text-muted: #71717A;
}
```

### Usage in Components
```tsx
// Use Tailwind utilities that map to custom properties
<div className="bg-background text-text-primary">
  <div className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-hover">
    <h3 className="text-text-primary font-sans">Quest Title</h3>
    <span className="text-text-secondary font-mono text-caption">0.8 km</span>
  </div>
</div>
```

### Dark Mode (Obsidian)
* **Base (`#09090B`):** Establishes a true dark workspace.
* **Slate Cards (`#18181B`):** Clean surfaces with zero elevation shadows.
* **Accents:** Electric neon highlights that "glow" on the black background.

### Light Mode (Zinc)
* **Base (`#FAFAFA`):** Crisp and clean collegiate environment.
* **White Cards (`#FFFFFF`):** Floating tiles separated by crisp, micro-thin borders (`#E4E4E7`).
* **Accents:** Darker, richer tones of the neon colors to guarantee excellent readability and a premium, high-value look without eye strain.

---

## 3. Typography & Badges
* **Font Family:** `Outfit` (loaded via `next/font/google` for zero layout shift) for highly readable, futuristic-feeling titles and body text. `JetBrains Mono` (also via `next/font/google`) for status chips, stats, and distance indicators.
* **Font Loading:**
  ```typescript
  // src/app/layout.tsx
  import { Outfit, JetBrains_Mono } from "next/font/google";

  const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
  const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
  ```
* **Tailwind Usage:** `font-sans` for body text, `font-mono` for badges and stats.
* **Type Scale (Tailwind classes):**
  * h1: `text-3xl font-bold` (32px)
  * h2: `text-2xl font-semibold` (24px)
  * h3: `text-lg font-medium` (18px)
  * bodyLarge: `text-base` (16px)
  * body: `text-sm` (14px)
  * caption: `text-xs` (12px)
* **Metadata Badges:**
  * Compact capsules: `[ 0.8 km ]`, `[ ERRAND ]`, `[ LEVEL 3 ]`.
  * Rendered with: `font-mono text-xs bg-primary-glow text-primary rounded-full px-2 py-0.5`

---

## 4. Components

### A. The Quest Card
* **Background:** `bg-surface`
* **Border:** `border border-border`
* **Hover:** `hover:bg-surface-hover transition-colors`
* **Focus/Highlight State:** 
  * **Dark:** Glowing gradient shadow via `shadow-[0_0_16px_rgba(139,92,246,0.25)]`
  * **Light:** Soft drop-shadow via `shadow-[0_8px_16px_rgba(124,58,237,0.08)]`
* **Content Layout:**
  * Left: Quest Title (`font-sans font-medium`), category tag (`font-mono text-xs`), and running time.
  * Right: Bounty value (`font-mono font-bold text-warning`) e.g., `GHS 12.50`.
* **Example:**
  ```tsx
  <div className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-hover transition-colors">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h3 className="font-sans font-medium text-text-primary">KFC Delivery</h3>
        <span className="font-mono text-xs bg-primary-glow text-primary rounded-full px-2 py-0.5">FOOD</span>
      </div>
      <span className="font-mono font-bold text-warning">GHS 12.50</span>
    </div>
  </div>
  ```

### B. Swipe-To-Accept Slider
* **Track:** `bg-border rounded-full h-12`
* **Handle:** `bg-primary rounded-full w-10 h-10 flex items-center justify-center` containing an arrow icon.
* **Effect:** Sliding the handle right fills the track with a smooth gradient (`bg-gradient-to-r from-primary to-secondary`), culminating in a satisfying haptic feedback and animation on completion.

### C. XP Progression Bar
* **Bar Track:** `h-1 bg-border rounded-full`
* **Active Fill:** `bg-gradient-to-r from-primary to-secondary rounded-full` with width set dynamically.
* **Indicator:** Floating `+20 XP` text (`font-mono text-xs text-primary animate-bounce`) that briefly animates upwards when a quest is marked as finished.
