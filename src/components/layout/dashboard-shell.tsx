"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores";
import { api } from "@/lib";
import { TopAppBar } from "@/components/layout/top-app-bar";
import { SideNav } from "@/components/layout/side-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Icon } from "@/components/ui/icon";

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
      <header className="lg:hidden bg-surface-dim z-40 w-full flex justify-between items-center px-md py-md border-b border-outline-variant sticky top-0">
        <h1 className="font-sans text-2xl font-black text-primary tracking-tighter">Runner_X</h1>
        <div className="flex items-center gap-md">
          <Link href="/notifications">
            <Icon name="notifications" className="text-on-surface-variant hover:text-primary transition-colors" />
          </Link>
          <Link href="/profile">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="avatar" className="w-8 h-8 rounded-full border border-primary object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full border border-primary bg-primary/20 flex items-center justify-center">
                <Icon name="person" size={16} className="text-primary" />
              </div>
            )}
          </Link>
        </div>
      </header>
      <div className="hidden lg:block">
        <TopAppBar navItems={[{ label: "Quest Board", href: "/quests" }, { label: "My Missions", href: "/missions" }]} avatarUrl={user?.photoUrl ?? undefined} />
      </div>
      <div className="lg:flex">
        <div className="hidden lg:block">
          <SideNav onPostQuest={() => router.push("/quests/new")} />
        </div>
        <main className="flex-1 lg:ml-64 pb-24 lg:pb-0 p-md lg:p-lg">
          <div className="w-full">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
