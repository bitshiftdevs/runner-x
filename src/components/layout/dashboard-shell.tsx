"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { api } from "@/lib";
import { TopAppBar } from "@/components/layout/top-app-bar";
import { SideNav } from "@/components/layout/side-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await api.auth.session();
        if (data.user) {
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
        <div className="animate-pulse text-primary font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <TopAppBar avatarUrl={user?.photoUrl ?? undefined} />
      </div>
      <div className="lg:flex">
        <div className="hidden lg:block">
          <SideNav />
        </div>
        <main className="flex-1 lg:ml-64 p-md lg:p-lg">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
