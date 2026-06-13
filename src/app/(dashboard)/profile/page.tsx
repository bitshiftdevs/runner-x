"use client";

import { useState } from "react";
import { Button, Icon, Rating, Badge } from "@/components/ui";
import { useAuthStore } from "@/stores";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, bio }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-xl">
      <h1 className="font-sans text-3xl font-bold text-primary">Profile</h1>

      <div className="grid grid-cols-[1fr_320px] gap-xl items-start">
        {/* Left: main profile card */}
        <div className="bg-surface border border-outline-variant rounded-lg p-lg space-y-lg">
          {/* Avatar + name */}
          <div className="flex items-center gap-lg">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center shrink-0 overflow-hidden">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="person" className="text-primary text-[40px]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary font-semibold text-lg"
                />
              ) : (
                <h2 className="font-sans text-2xl font-bold truncate">
                  {user?.fullName || "—"}
                </h2>
              )}
              <p className="text-on-surface-variant text-sm mt-xs">
                {user?.phone}
              </p>
              <div className="flex flex-wrap gap-sm mt-sm">
                <span className="font-mono text-xs bg-primary/10 text-primary px-sm py-[2px] rounded border border-primary/30">
                  {user?.role?.toUpperCase()}
                </span>
                {user?.studentIdVerified && (
                  <span className="font-mono text-xs bg-success/10 text-success px-sm py-[2px] rounded border border-success/30">
                    VERIFIED
                  </span>
                )}
                <span className="font-mono text-xs bg-surface-container-high text-on-surface-variant px-sm py-[2px] rounded border border-outline-variant">
                  {user?.campus}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="font-mono text-xs text-on-surface-variant uppercase mb-sm">
              Bio
            </p>
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                placeholder="Tell the guild about yourself..."
              />
            ) : (
              <p className="text-on-surface-variant leading-relaxed">
                {user?.bio || "No bio yet."}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-md pt-md border-t border-outline-variant">
            {editing ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditing(false);
                    setFullName(user?.fullName ?? "");
                    setBio(user?.bio ?? "");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setEditing(true)}
                className="flex items-center gap-sm"
              >
                <Icon name="edit" size={16} />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Right: stats + badges */}
        <div className="sticky top-20 space-y-lg">
          {/* Stats */}
          <div className="bg-surface border border-outline-variant rounded-lg p-lg space-y-md">
            <p className="font-mono text-xs text-on-surface-variant uppercase">
              Stats
            </p>
            <div className="space-y-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">
                  Total Jobs
                </span>
                <span className="font-mono font-bold text-primary text-lg">
                  {user?.totalJobs ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Rating</span>
                <Rating value={Number(user?.rating) || 0} showValue />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Campus</span>
                <span className="font-mono text-sm text-tertiary">
                  {user?.campus}
                </span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-surface border border-outline-variant rounded-lg p-lg space-y-md">
            <p className="font-mono text-xs text-on-surface-variant uppercase">
              Achievements
            </p>
            <div className="grid grid-cols-3 gap-sm">
              <Badge icon="bedtime" variant="secondary" title="Night Runner" locked />
              <Badge icon="bolt" variant="primary" title="Speed Demon" locked />
              <Badge
                icon="workspace_premium"
                variant="tertiary"
                title="Elite"
                locked
              />
            </div>
            <p className="text-xs text-on-surface-variant">
              Complete quests to unlock achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
