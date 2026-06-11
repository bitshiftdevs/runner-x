import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { SearchInput } from "@/components/ui/search-input";

type NavItem = { label: string; href: string; active?: boolean };

type TopAppBarProps = {
  navItems?: NavItem[];
  avatarUrl?: string;
};

export function TopAppBar({ navItems = [], avatarUrl }: TopAppBarProps) {
  return (
    <header className="bg-surface text-primary border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 sticky top-0 z-50">
      <div className="flex items-center gap-xl">
        <span className="font-sans text-4xl font-bold text-primary tracking-tighter leading-none">
          Runner_X
        </span>
        <nav className="hidden md:flex gap-lg items-center">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={
                item.active
                  ? "text-primary font-bold font-mono text-sm"
                  : "text-on-surface-variant hover:bg-surface-hover transition-colors font-mono text-sm px-sm py-xs rounded"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-md">
        <SearchInput placeholder="Search components..." />
        <div className="flex items-center gap-sm">
          <Icon
            name="notifications"
            className="hover:bg-surface-hover p-xs rounded cursor-pointer transition-colors"
          />
          <Icon
            name="account_balance_wallet"
            className="hover:bg-surface-hover p-xs rounded cursor-pointer transition-colors"
          />
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="Profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-primary/50 object-cover"
            />
          )}
        </div>
      </div>
    </header>
  );
}
