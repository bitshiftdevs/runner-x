import { Icon } from "@/components/ui/icon";
import { StatusChip } from "@/components/ui/status-chip";
import type { JobCategory, UrgencyLevel } from "@/types";

type QuestCardVariant = "urgent" | "default" | "completed";

type QuestCardProps = {
  title: string;
  description: string;
  category: JobCategory;
  bounty: string;
  variant?: QuestCardVariant;
  timeLeft?: string;
  distance?: string;
  urgency?: UrgencyLevel;
};

const categoryLabels: Record<JobCategory, string> = {
  food_drinks: "Delivery",
  academic_materials: "Academic",
  pickup_delivery: "Pickup",
  general_errands: "Errand",
  others: "Other",
};

const categoryChipVariant: Record<JobCategory, "primary" | "tertiary"> = {
  food_drinks: "primary",
  academic_materials: "tertiary",
  pickup_delivery: "primary",
  general_errands: "tertiary",
  others: "tertiary",
};

export function QuestCard({
  title,
  description,
  category,
  bounty,
  variant = "default",
  timeLeft,
  distance,
}: QuestCardProps) {
  if (variant === "completed") {
    return (
      <div className="bg-surface/50 border border-outline-variant p-md rounded-lg opacity-80 grayscale-[0.5]">
        <div className="mb-md flex justify-between items-start">
          <div>
            <h3 className="font-sans text-lg font-semibold text-on-surface-variant mb-xs">
              {title}
            </h3>
            <StatusChip label="Completed" variant="success" />
          </div>
          <Icon name="check_circle" filled className="text-success" />
        </div>
        <p className="text-on-surface-variant text-sm line-clamp-2 mb-lg">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-on-surface-variant font-mono text-xs uppercase">
              Bounty Earned
            </span>
            <span className="font-mono text-2xl font-bold text-success">
              {bounty}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const isUrgent = variant === "urgent";

  return (
    <div
      className={`bg-surface border p-md rounded-lg relative overflow-hidden group ${
        isUrgent ? "border-primary/30" : "border-outline-variant"
      }`}
    >
      {isUrgent && (
        <div className="absolute top-0 right-0 bg-primary/20 text-primary px-sm py-xs border-l border-b border-primary/30 font-mono text-xs">
          URGENT
        </div>
      )}
      <div className="mb-md">
        <h3 className="font-sans text-lg font-semibold text-primary mb-xs">
          {title}
        </h3>
        <div className="flex gap-sm">
          <StatusChip
            label={categoryLabels[category]}
            variant={categoryChipVariant[category]}
          />
          {timeLeft && (
            <span className="font-mono text-xs text-on-surface-variant flex items-center gap-xs">
              <Icon name="timer" size={14} /> {timeLeft}
            </span>
          )}
          {distance && (
            <span className="font-mono text-xs text-on-surface-variant flex items-center gap-xs">
              <Icon name="location_on" size={14} /> {distance}
            </span>
          )}
        </div>
      </div>
      <p className="text-on-surface-variant text-sm line-clamp-2 mb-lg">
        {description}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-on-surface-variant font-mono text-xs uppercase">
            Bounty
          </span>
          <span
            className={`font-mono text-2xl font-bold ${isUrgent ? "text-primary" : "text-tertiary"}`}
          >
            {bounty}
          </span>
        </div>
        <Icon
          name={isUrgent ? "arrow_forward" : "info"}
          className={`${isUrgent ? "text-primary group-hover:translate-x-2" : "text-on-surface-variant group-hover:text-primary"} transition-all`}
        />
      </div>
    </div>
  );
}
