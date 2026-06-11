"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type SideNavLink = {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
};

type SideNavProps = {
  links?: SideNavLink[];
  userLevel?: string;
  userTitle?: string;
  onPostQuest?: () => void;
};

const defaultLinks: SideNavLink[] = [
  { icon: "grid_view", label: "Quest Board", href: "/quests", active: true },
  { icon: "assignment", label: "My Missions", href: "/missions" },
  { icon: "chat_bubble", label: "Inbox", href: "/inbox" },
  { icon: "payments", label: "Earnings", href: "/earnings" },
  { icon: "military_tech", label: "Leaderboard", href: "/leaderboard" },
];

export function SideNav({
  links = defaultLinks,
  userLevel = "Level 14 Runner",
  userTitle = "Guild Member",
  onPostQuest,
}: SideNavProps) {
  return (
    <aside className="bg-surface-container-lowest h-screen w-64 fixed left-0 top-16 border-r border-outline-variant flex flex-col py-lg gap-lg overflow-y-auto">
      {/* User badge */}
      <div className="px-md flex items-center gap-md">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <Icon name="military_tech" filled className="text-primary" />
        </div>
        <div>
          <p className="font-sans text-lg font-semibold">{userTitle}</p>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
            {userLevel}
          </p>
        </div>
      </div>

      {/* Nav links */}
      <div className="px-sm flex flex-col gap-xs">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={
              link.active
                ? "flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container rounded-lg border border-primary/30"
                : "flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary hover:bg-surface-hover transition-all duration-200"
            }
          >
            <Icon name={link.icon} />
            <span className="font-mono text-sm">{link.label}</span>
          </a>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="mt-auto px-md pb-xl flex flex-col gap-sm">
        <Button
          className="w-full flex items-center justify-center gap-sm"
          onClick={onPostQuest}
        >
          <Icon name="add" size={20} />
          Post New Quest
        </Button>
        <div className="pt-md border-t border-outline-variant flex flex-col gap-xs">
          <a
            href="/switch-role"
            className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            <Icon name="sync" />
            <span className="font-mono text-sm">Switch to Requester</span>
          </a>
          <a
            href="/settings"
            className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            <Icon name="settings" />
            <span className="font-mono text-sm">Settings</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
