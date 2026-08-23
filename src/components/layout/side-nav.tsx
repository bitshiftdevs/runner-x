"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="bg-surface-container-lowest h-[calc(100vh-4rem)] w-64 fixed left-0 top-16 border-r border-outline-variant flex flex-col py-lg gap-lg overflow-y-auto">
      <div className="px-md flex items-center gap-md">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <Icon name="admin_panel_settings" filled className="text-primary" />
        </div>
        <div>
          <p className="font-sans text-lg font-semibold">Admin Console</p>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
            Mission Control
          </p>
        </div>
      </div>

      <div className="px-sm flex flex-col gap-xs">
        <Link
          href="/admin"
          className={
            pathname === "/admin"
              ? "flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container rounded-lg border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.25)]"
              : "flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary hover:bg-surface-hover transition-all duration-200"
          }
        >
          <Icon name="dashboard" />
          <span className="font-mono text-sm">Dashboard</span>
        </Link>
      </div>

      <div className="mt-auto px-md pb-xl flex flex-col gap-xs border-t border-outline-variant pt-lg">
        <Link
          href="/"
          className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <Icon name="home" />
          <span className="font-mono text-sm">Landing Page</span>
        </Link>
      </div>
    </aside>
  );
}
