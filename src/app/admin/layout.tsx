"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { api } from "@/lib";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await api.auth.session();
        if (data.user) {
          if (!data.user.isAdmin) {
            router.push("/login?error=unauthorized");
            return;
          }
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      }
    }
    if (!isAuthenticated) {
      checkSession();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, setUser, setLoading, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground font-mono text-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Runnerx Admin
            </span>
          </header>
          <div className="flex-1 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
