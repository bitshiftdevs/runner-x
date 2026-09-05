"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wallet,
  CreditCard,
  Home,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const adminNav = [
  { title: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { title: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
  { title: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
  { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { title: "Wallets", href: "/admin/wallets", icon: Wallet },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Admin Console</span>
                <span className="text-xs">Mission Control</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/admin/overview" && pathname === "/admin");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Separator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Back to site">
              <Link href="/" className="flex items-center gap-2 w-full">
                <Home />
                <span>Landing Page</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
