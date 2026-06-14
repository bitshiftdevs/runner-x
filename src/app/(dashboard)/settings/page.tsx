"use client";
import { useRouter } from "next/navigation";
import { Button, Icon, SectionHeader } from "@/components/ui";
import { useAuthStore } from "@/stores";
import { api } from "@/lib";

export default function SettingsPage() {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  async function handleLogout() {
    await api.auth.logout();
    logout();
    router.push("/login");
  }

  return (
    <div className="space-y-xl">
      <SectionHeader title="Settings" />

      <div className="grid grid-cols-2 gap-xl">
        {/* Left: App preferences */}
        <div className="space-y-md">
          <p className="font-mono text-xs text-on-surface-variant uppercase">
            App Preferences
          </p>
          <div className="bg-surface border border-outline-variant rounded-lg divide-y divide-outline-variant">
            <button type="button" onClick={() => router.push("/settings/appearance")} className="w-full p-md flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-md">
                <Icon name="palette" className="text-on-surface-variant" />
                <span>Appearance</span>
              </div>
              <span className="text-sm text-on-surface-variant">Dark</span>
            </button>
            <button type="button" onClick={() => router.push("/settings/language")} className="w-full p-md flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-md">
                <Icon name="language" className="text-on-surface-variant" />
                <span>Language</span>
              </div>
              <span className="text-sm text-on-surface-variant">English</span>
            </button>
            <button type="button" onClick={() => router.push("/settings/notifications")} className="w-full p-md flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-md">
                <Icon name="notifications" className="text-on-surface-variant" />
                <span>Notifications</span>
              </div>
              <Icon name="chevron_right" className="text-on-surface-variant" />
            </button>
            <div className="p-md flex items-center justify-between">
              <div className="flex items-center gap-md">
                <Icon name="info" className="text-on-surface-variant" />
                <span>Version</span>
              </div>
              <span className="text-sm text-on-surface-variant font-mono">
                0.1.0
              </span>
            </div>
          </div>
        </div>

        {/* Right: Account */}
        <div className="space-y-md">
          <p className="font-mono text-xs text-on-surface-variant uppercase">
            Account
          </p>
          <div className="bg-surface border border-outline-variant rounded-lg divide-y divide-outline-variant">
            <button type="button" onClick={() => router.push("/settings/phone")} className="w-full p-md flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-md">
                <Icon name="phone" className="text-on-surface-variant" />
                <div className="text-left">
                  <p className="text-sm">Phone</p>
                  <p className="text-xs text-on-surface-variant">
                    {user?.phone ?? "—"}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-success">Linked</span>
            </button>
            <button type="button" onClick={() => router.push("/profile/verification")} className="w-full p-md flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-md">
                <Icon name="school" className="text-on-surface-variant" />
                <div className="text-left">
                  <p className="text-sm">Student ID</p>
                  <p className="text-xs text-on-surface-variant">
                    {user?.studentIdVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
              </div>
              {user?.studentIdVerified ? (
                <span className="font-mono text-xs text-success">✓</span>
              ) : (
                <Icon name="chevron_right" className="text-on-surface-variant" />
              )}
            </button>
            <button type="button" onClick={() => router.push("/settings/privacy")} className="w-full p-md flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-md">
                <Icon name="privacy_tip" className="text-on-surface-variant" />
                <span>Privacy</span>
              </div>
              <Icon name="chevron_right" className="text-on-surface-variant" />
            </button>
            <button type="button" onClick={() => router.push("/settings/help")} className="w-full p-md flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-md">
                <Icon name="help" className="text-on-surface-variant" />
                <span>Help & Support</span>
              </div>
              <Icon name="chevron_right" className="text-on-surface-variant" />
            </button>
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        className="w-full flex items-center justify-center gap-sm"
        onClick={handleLogout}
      >
        <Icon name="logout" size={16} />
        Sign Out
      </Button>
    </div>
  );
}
