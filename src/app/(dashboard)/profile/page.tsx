"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { formatCurrency, api } from "@/lib";
import { useAuthStore } from "@/stores";
import type { Job } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [missions, setMissions] = useState<Job[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);

  useEffect(() => {
    async function fetchMissions() {
      try {
        const data = await api.jobs.list({ mine: true });
        setMissions(data.jobs ?? []);
      } finally {
        setLoadingMissions(false);
      }
    }
    fetchMissions();
  }, []);

  async function handleLogout() {
    await api.auth.logout();
    logout();
    router.push("/login");
  }

  const activeMissions = missions.filter(
    (m) => !["completed", "cancelled", "expired", "draft"].includes(m.status),
  );
  const completedMissions = missions
    .filter((m) => m.status === "completed")
    .slice(0, 5);

  return (
    <div className="max-w-full mx-auto">
      {/* Profile Hero */}
      <section className="px-lg pt-lg pb-md">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-md">
            <div className="w-24 h-24 rounded-full border-2 border-primary p-1">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="person" size={40} className="text-primary" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary p-1 rounded-lg glow-primary">
              <Icon name="star" filled size={18} />
            </div>
          </div>

          <h2 className="font-sans text-3xl font-bold text-on-surface tracking-tight">
            {user?.fullName || "Runner"}
          </h2>
          <div className="mt-xs">
            <span className="font-mono text-xs text-primary uppercase tracking-widest bg-primary/10 px-md py-xs rounded-full">
              Elite Courier Status
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-md w-full mt-xl">
            <div className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col items-start gap-xs">
              <span className="font-mono text-xs text-on-surface-variant uppercase">
                Rating
              </span>
              <div className="flex items-center gap-xs">
                <span className="font-mono text-2xl font-bold text-primary">
                  {Number(user?.rating || 0).toFixed(1)}
                </span>
                <Icon name="grade" filled className="text-primary" />
              </div>
            </div>
            <div className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col items-start gap-xs">
              <span className="font-mono text-xs text-on-surface-variant uppercase">
                Quests
              </span>
              <div className="flex items-center gap-xs">
                <span className="font-mono text-2xl font-bold text-success">
                  {user?.totalJobs ?? 0}
                </span>
                <Icon name="assignment_turned_in" className="text-success" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Errands */}
      {!loadingMissions && activeMissions.length > 0 && (
        <section className="px-lg mt-md">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-sans text-lg font-semibold text-on-surface">
              Active Errands
            </h3>
            <span className="font-mono text-xs bg-primary/10 text-primary px-sm py-xs rounded">
              {activeMissions.length} IN PROGRESS
            </span>
          </div>
          <div className="space-y-md">
            {activeMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-surface border border-outline-variant rounded-xl p-md quest-card-gradient"
              >
                <div className="flex justify-between items-start mb-sm">
                  <div className="flex-1 min-w-0 pr-sm">
                    <h4 className="font-sans text-base font-bold text-on-surface truncate">
                      {mission.title}
                    </h4>
                    <p className="font-mono text-xs text-on-surface-variant mt-xs line-clamp-1">
                      {(mission.pickupLocation as { address: string })
                        ?.address ?? "—"}{" "}
                      →{" "}
                      {(mission.deliveryLocation as { address: string })
                        ?.address ?? "—"}
                    </p>
                  </div>
                  <span className="font-mono text-base font-bold text-primary shrink-0">
                    {formatCurrency(mission.runnerEarnings)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/missions")}
                  className="w-full mt-md bg-primary text-on-primary py-sm rounded-lg font-mono text-xs glow-primary text-center"
                >
                  UPDATE STATUS
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quest History */}
      {!loadingMissions && completedMissions.length > 0 && (
        <section className="px-lg mt-xl">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-sans text-lg font-semibold text-on-surface">
              Quest History
            </h3>
            <Link
              href="/missions"
              className="text-primary font-mono text-xs hover:underline"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="space-y-sm">
            {completedMissions.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-md bg-surface-container-low rounded-lg border border-outline-variant/30"
              >
                <div className="flex items-center gap-md">
                  <div className="bg-success/10 p-sm rounded">
                    <Icon name="check_circle" className="text-success" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-on-surface">
                      {m.title}
                    </p>
                    <p className="font-mono text-xs text-on-surface-variant">
                      {new Date(m.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-on-surface">
                  {formatCurrency(m.runnerEarnings)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Settings */}
      <section className="px-lg mt-xl">
        <h3 className="font-sans text-lg font-semibold text-on-surface mb-md">
          Settings
        </h3>
        <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant">
          <Link
            href="/settings"
            className="flex items-center justify-between px-md py-lg hover:bg-surface-hover transition-colors border-b border-outline-variant/30"
          >
            <div className="flex items-center gap-md text-on-surface-variant">
              <Icon name="person_outline" />
              <span className="font-sans text-base">Account Preferences</span>
            </div>
            <Icon name="chevron_right" className="text-on-surface-variant" />
          </Link>
          <Link
            href="/earnings"
            className="flex items-center justify-between px-md py-lg hover:bg-surface-hover transition-colors border-b border-outline-variant/30"
          >
            <div className="flex items-center gap-md text-on-surface-variant">
              <Icon name="account_balance_wallet" />
              <span className="font-sans text-base">Payout Methods</span>
            </div>
            <Icon name="chevron_right" className="text-on-surface-variant" />
          </Link>
          <Link
            href="/settings"
            className="flex items-center justify-between px-md py-lg hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-md text-on-surface-variant">
              <Icon name="security" />
              <span className="font-sans text-base">Privacy & Shield</span>
            </div>
            <Icon name="chevron_right" className="text-on-surface-variant" />
          </Link>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full mt-xl py-md text-error font-sans font-semibold hover:bg-error/5 rounded-lg transition-colors border border-error/20"
        >
          LOG OUT OF COMMAND
        </button>
      </section>

      {/* Bottom padding for nav */}
      <div className="h-8" />
    </div>
  );
}
