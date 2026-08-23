"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useThemeStore } from "@/stores/theme.store";

type TopAppBarProps = {
  avatarUrl?: string;
};

export function TopAppBar({ avatarUrl }: TopAppBarProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="bg-surface text-primary border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 sticky top-0 z-50">
      <div className="flex items-center gap-xl">
        <Link href="/admin" className="font-sans text-4xl font-bold text-primary tracking-tighter leading-none">
          Runnerx
        </Link>
        <nav className="hidden md:flex gap-lg items-center">
          <Link
            href="/admin"
            className="text-primary font-bold font-mono text-sm"
          >
            Admin Console
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-md">
        <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hover:bg-surface-hover p-xs rounded cursor-pointer transition-colors text-on-surface-variant"
          >
            <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} />
          </button>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-primary/50 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Icon name="person" size={16} className="text-primary" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
