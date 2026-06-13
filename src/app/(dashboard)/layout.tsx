"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { TopAppBar } from "@/components/layout/top-app-bar";
import { SideNav } from "@/components/layout/side-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
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
  }, [isAuthenticated, router, setUser, setLoading]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopAppBar
        navItems={[
          { label: "Quest Board", href: "/quests" },
          { label: "My Missions", href: "/missions" },
        ]}
        avatarUrl={user?.photoUrl ?? undefined}
      />
      <div className="flex">
        <SideNav
          onPostQuest={() => router.push("/quests/new")}
        />
        <main className="ml-64 flex-1 p-lg">
          <div className="max-w-[1280px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
