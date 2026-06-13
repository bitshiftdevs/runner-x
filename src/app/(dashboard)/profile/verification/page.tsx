"use client";

import { useAuthStore } from "@/stores";
import { Icon } from "@/components/ui";

type VerificationStep = {
  label: string;
  icon: string;
  status: "done" | "current" | "pending";
};

function StepIndicator({ step }: { step: VerificationStep }) {
  const base = "w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ring-4 ring-background";
  if (step.status === "done") {
    return (
      <div className={`${base} bg-primary text-on-primary`}>
        <Icon name="check" size={20} />
      </div>
    );
  }
  if (step.status === "current") {
    return (
      <div className={`${base} bg-background border-2 border-primary text-primary animate-pulse`}>
        <Icon name={step.icon} size={20} />
      </div>
    );
  }
  return (
    <div className={`${base} bg-surface-container-high text-on-surface-variant border border-outline-variant`}>
      <Icon name={step.icon} size={20} />
    </div>
  );
}

export default function VerificationPage() {
  const user = useAuthStore((s) => s.user);

  const steps: VerificationStep[] = [
    { label: "Contact", icon: "phone", status: "done" },
    { label: "Profile", icon: "person", status: "done" },
    {
      label: "ID Upload",
      icon: "badge",
      status: user?.studentIdVerified ? "done" : "current",
    },
  ];

  const completedSteps = steps.filter((s) => s.status === "done").length;
  const progressWidth = `${(completedSteps / steps.length) * 100}%`;

  return (
    <div className="max-w-5xl mx-auto p-md lg:p-0 space-y-xl">
      {/* Header */}
      <div>
        <h1 className="font-sans text-3xl lg:text-[48px] font-bold text-primary tracking-tight">
          Verification Center
        </h1>
        <p className="text-text-secondary mt-xs">
          Complete your profile to unlock high-bounty student quests.
        </p>
      </div>

      {/* Progress Tracker */}
      <div className="bg-surface border border-outline-variant rounded-xl p-lg lg:p-xl">
        <div className="flex justify-between items-center relative">
          {/* Background line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-variant -translate-y-1/2 z-0" />
          {/* Active progress line */}
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 shadow-[0_0_10px_var(--color-primary-container)] transition-all duration-500"
            style={{ width: progressWidth }}
          />
          {steps.map((step) => (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-sm">
              <StepIndicator step={step} />
              <span
                className={`font-mono text-xs ${step.status === "pending" ? "text-on-surface-variant" : "text-primary"}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* Left Column */}
        <div className="md:col-span-7 flex flex-col gap-lg">
          {/* Status Card */}
          <div className="bg-surface border border-outline-variant rounded-xl p-lg border-l-4 border-l-tertiary">
            <div className="flex items-start gap-md">
              <div className="p-sm bg-tertiary/10 rounded-lg shrink-0">
                <Icon name="hourglass_empty" className="text-tertiary" />
              </div>
              <div>
                <h2 className="font-sans text-xl lg:text-2xl font-semibold uppercase tracking-tight">
                  {user?.studentIdVerified
                    ? "Verification Complete"
                    : "Reviewing Student ID"}
                </h2>
                <p className="text-sm text-text-secondary mt-xs leading-relaxed">
                  {user?.studentIdVerified
                    ? "Your student credentials have been verified. You now have access to all quests."
                    : (
                        <>
                          Our campus admins are verifying your credentials. This usually
                          takes{" "}
                          <span className="text-tertiary font-bold">2-4 hours</span>{" "}
                          during business days.
                        </>
                      )}
                </p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-surface border border-outline-variant rounded-xl p-lg">
            <h3 className="font-mono text-xs text-text-secondary uppercase mb-md tracking-widest">
              Verification Details
            </h3>
            <div className="space-y-md">
              <div className="flex justify-between items-center py-sm border-b border-outline-variant/30">
                <span className="text-sm text-text-secondary">Institution</span>
                <span className="font-mono text-sm">
                  {user?.campus ?? "KNUST"}, Kumasi
                </span>
              </div>
              <div className="flex justify-between items-center py-sm border-b border-outline-variant/30">
                <span className="text-sm text-text-secondary">Submission Date</span>
                <span className="font-mono text-sm">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-sm border-b border-outline-variant/30">
                <span className="text-sm text-text-secondary">Status</span>
                <span
                  className={`font-mono text-sm ${user?.studentIdVerified ? "text-success" : "text-tertiary"}`}
                >
                  {user?.studentIdVerified ? "Verified" : "Pending Review"}
                </span>
              </div>
            </div>
          </div>

          {/* Support Button */}
          <button
            type="button"
            className="w-full py-md bg-surface-variant hover:bg-surface-container-high text-on-surface-variant font-mono text-sm rounded-lg transition-all flex items-center justify-center gap-md"
          >
            <Icon name="support_agent" />
            Contact Campus Admin Support
          </button>
        </div>

        {/* Right Column: ID Preview */}
        <div className="md:col-span-5">
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden group hover:border-primary transition-colors">
            <div className="p-md bg-surface-container border-b border-outline-variant flex justify-between items-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                Uploaded Credential
              </span>
              <span
                className={`font-mono text-[10px] uppercase px-sm py-xs rounded border ${
                  user?.studentIdVerified
                    ? "bg-success/10 text-success border-success/30"
                    : "bg-tertiary/10 text-tertiary border-tertiary/30"
                }`}
              >
                {user?.studentIdVerified ? "Verified" : "Pending Review"}
              </span>
            </div>

            {/* ID Card Preview */}
            <div className="relative aspect-[1.6/1] bg-surface-container-lowest flex items-center justify-center overflow-hidden">
              {user?.studentIdUrl ? (
                <img
                  src={user.studentIdUrl}
                  alt="Student ID"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="text-center text-on-surface-variant">
                  <Icon name="badge" className="text-[48px] opacity-30" />
                  <p className="font-mono text-xs mt-sm opacity-50">No ID uploaded</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              {/* Scanning animation */}
              <div className="scanline-animate" />
            </div>

            {/* Validation checks */}
            <div className="p-lg space-y-sm">
              <div className="flex items-center gap-sm">
                <Icon
                  name="check_circle"
                  filled
                  size={16}
                  className="text-success"
                />
                <span className="text-sm text-text-secondary">
                  Face Match: 98.4%
                </span>
              </div>
              <div className="flex items-center gap-sm">
                <Icon
                  name="check_circle"
                  filled
                  size={16}
                  className="text-success"
                />
                <span className="text-sm text-text-secondary">
                  Expiry Valid: 2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
