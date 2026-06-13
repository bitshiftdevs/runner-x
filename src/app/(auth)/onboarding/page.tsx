"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Icon } from "@/components/ui";
import { useAuthStore } from "@/stores";
import type { UserRole } from "@/types";

type Step = "profile" | "role" | "id";

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [step, setStep] = useState<Step>("profile");
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<UserRole>("both");
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, bio, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  }

  if (step === "profile") {
    return (
      <div className="space-y-xl">
        <div className="text-center space-y-sm">
          <h1 className="font-sans text-2xl font-bold text-primary">
            Set Up Profile
          </h1>
          <p className="text-on-surface-variant text-sm">Tell us about yourself</p>
        </div>
        <div className="space-y-lg">
          <div className="space-y-sm">
            <label htmlFor="name" className="font-mono text-xs text-on-surface-variant uppercase">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary"
              placeholder="Kwame Asante"
            />
          </div>
          <div className="space-y-sm">
            <label htmlFor="bio" className="font-mono text-xs text-on-surface-variant uppercase">
              Bio (optional)
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary resize-none"
              placeholder="3rd year CS student..."
            />
          </div>
          <Button
            className="w-full"
            onClick={() => setStep("role")}
            disabled={!fullName.trim()}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (step === "role") {
    const roles: { value: UserRole; label: string; icon: string; desc: string }[] = [
      { value: "requester", label: "Requester", icon: "shopping_bag", desc: "Post errands" },
      { value: "runner", label: "Runner", icon: "directions_run", desc: "Earn money" },
      { value: "both", label: "Both", icon: "swap_horiz", desc: "Post & run errands" },
    ];

    return (
      <div className="space-y-xl">
        <div className="text-center space-y-sm">
          <h1 className="font-sans text-2xl font-bold text-primary">Choose Role</h1>
          <p className="text-on-surface-variant text-sm">You can switch anytime</p>
        </div>
        <div className="space-y-md">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`w-full flex items-center gap-md p-md rounded-lg border transition-all ${
                role === r.value
                  ? "border-primary bg-primary/10"
                  : "border-outline-variant hover:border-primary/50"
              }`}
            >
              <Icon name={r.icon} className="text-primary" />
              <div className="text-left">
                <p className="font-sans font-semibold text-on-surface">{r.label}</p>
                <p className="text-sm text-on-surface-variant">{r.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <Button className="w-full" onClick={() => setStep("id")}>
          Continue
        </Button>
      </div>
    );
  }

  // Step: student ID
  return (
    <div className="space-y-xl">
      <div className="text-center space-y-sm">
        <h1 className="font-sans text-2xl font-bold text-primary">Student ID</h1>
        <p className="text-on-surface-variant text-sm">
          Upload for verification (optional, can skip)
        </p>
      </div>
      <div className="border-2 border-dashed border-outline-variant rounded-lg p-xl flex flex-col items-center gap-md">
        <Icon name="badge" className="text-primary text-[48px]" />
        <p className="text-on-surface-variant text-sm">
          Upload a photo of your student ID
        </p>
        <label className="cursor-pointer bg-surface-container-high px-lg py-sm rounded-lg text-sm text-on-surface hover:bg-surface-hover transition-colors">
          Choose File
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>
      <div className="flex gap-md">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={handleComplete}
          disabled={loading}
        >
          Skip
        </Button>
        <Button
          className="flex-1"
          onClick={handleComplete}
          disabled={loading}
        >
          {loading ? "Saving..." : "Complete"}
        </Button>
      </div>
    </div>
  );
}
