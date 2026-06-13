"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

type SideNavLink = {
  icon: string;
  label: string;
  href: string;
};

type SideNavProps = {
  onPostQuest?: () => void;
};

const navLinks: SideNavLink[] = [
  { icon: "grid_view", label: "Quest Board", href: "/quests" },
  { icon: "assignment", label: "My Missions", href: "/missions" },
  { icon: "chat_bubble", label: "Inbox", href: "/inbox" },
  { icon: "payments", label: "Earnings", href: "/earnings" },
  { icon: "notifications", label: "Notifications", href: "/notifications" },
];

export function SideNav({ onPostQuest }: SideNavProps) {
  const pathname = usePathname();

  return (
    <aside className="bg-surface-container-lowest h-[calc(100vh-4rem)] w-64 fixed left-0 top-16 border-r border-outline-variant flex flex-col py-lg gap-lg overflow-y-auto">
      <div className="px-md flex items-center gap-md">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <Icon name="military_tech" filled className="text-primary" />
        </div>
        <div>
          <p className="font-sans text-lg font-semibold">Guild Member</p>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
            Runner
          </p>
        </div>
      </div>

      <div className="px-sm flex flex-col gap-xs">
        {navLinks.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container rounded-lg border border-primary/30"
                  : "flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary hover:bg-surface-hover transition-all duration-200"
              }
            >
              <Icon name={link.icon} />
              <span className="font-mono text-sm">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-sm mt-md">
        <p className="px-md py-xs font-mono text-xs text-on-surface-variant/50 uppercase tracking-widest mb-xs">Command Center</p>
        <Link
          href="/admin"
          className={pathname === "/admin"
            ? "flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container rounded-lg border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.25)]"
            : "flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary hover:bg-surface-hover transition-all duration-200"
          }
        >
          <Icon name="admin_panel_settings" />
          <span className="font-mono text-sm">Admin Console</span>
        </Link>
      </div>

      <div className="mt-auto px-md pb-xl flex flex-col gap-sm">
        <Button
          className="w-full flex items-center justify-center gap-sm"
          onClick={onPostQuest}
        >
          <Icon name="add" size={20} />
          Post New Quest
        </Button>
        <div className="pt-md border-t border-outline-variant flex flex-col gap-xs">
          <Link
            href="/profile"
            className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            <Icon name="person" />
            <span className="font-mono text-sm">Profile</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            <Icon name="settings" />
            <span className="font-mono text-sm">Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
