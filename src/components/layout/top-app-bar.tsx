"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SearchInput } from "@/components/ui/search-input";
import { Icon } from "@/components/ui/icon";
import { useThemeStore } from "@/stores/theme.store";

type NavItem = { label: string; href: string };

type TopAppBarProps = {
  navItems?: NavItem[];
  avatarUrl?: string;
};

export function TopAppBar({ navItems = [], avatarUrl }: TopAppBarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="bg-surface text-primary border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 sticky top-0 z-50">
      <div className="flex items-center gap-xl">
        <Link href="/dashboard" className="font-sans text-4xl font-bold text-primary tracking-tighter leading-none">
          Runnerx
        </Link>
        <nav className="hidden md:flex gap-lg items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname.startsWith(item.href)
                  ? "text-primary font-bold font-mono text-sm"
                  : "text-on-surface-variant hover:bg-surface-hover transition-colors font-mono text-sm px-sm py-xs rounded"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-md">
        <SearchInput placeholder="Search..." />
        <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hover:bg-surface-hover p-xs rounded cursor-pointer transition-colors text-on-surface-variant"
          >
            <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} />
          </button>
          <Link href="/notifications">
            <Icon
              name="notifications"
              className="hover:bg-surface-hover p-xs rounded cursor-pointer transition-colors"
            />
          </Link>
          <Link href="/earnings">
            <Icon
              name="account_balance_wallet"
              className="hover:bg-surface-hover p-xs rounded cursor-pointer transition-colors"
            />
          </Link>
          <Link href="/profile">
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
          </Link>
        </div>
      </div>
    </header>
  );
}
