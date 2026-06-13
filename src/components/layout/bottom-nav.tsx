"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const NAV_ITEMS = [
  { icon: "assignment", label: "Quest Board", href: "/quests" },
  { icon: "chat_bubble", label: "Messenger", href: "/inbox" },
  { icon: "directions_run", label: "My Errands", href: "/missions" },
  { icon: "person", label: "Profile", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-dim border-t border-outline-variant/30 h-20 flex justify-around items-center px-md lg:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 relative py-1"
          >
            <div
              className={`p-1 rounded-xl transition-colors ${active ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}
            >
              <Icon name={item.icon} filled={active} size={28} />
            </div>
            <span
              className={`font-mono text-[10px] ${active ? "text-primary" : "text-on-surface-variant"}`}
            >
              {item.label}
            </span>
            {active && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(208,188,255,0.8)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
