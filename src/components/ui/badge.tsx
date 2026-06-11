type BadgeVariant = "primary" | "secondary" | "tertiary";

type BadgeProps = {
  icon: string;
  variant?: BadgeVariant;
  title?: string;
  locked?: boolean;
  earned?: boolean;
};

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 border-primary/30 text-primary",
  secondary: "bg-secondary/10 border-secondary/30 text-secondary",
  tertiary: "bg-tertiary/10 border-tertiary/30 text-tertiary",
};

export function Badge({
  icon,
  variant = "primary",
  title,
  locked = false,
  earned = false,
}: BadgeProps) {
  return (
    <div
      className={`w-12 h-12 rounded-full border flex items-center justify-center relative ${
        locked ? "opacity-40 grayscale" : ""
      } ${variantStyles[variant]}`}
      title={title}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {earned && !locked && (
        <div
          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
            variant === "secondary"
              ? "bg-secondary"
              : variant === "tertiary"
                ? "bg-tertiary"
                : "bg-primary"
          }`}
        >
          <span className="material-symbols-outlined text-[8px] text-background">
            check
          </span>
        </div>
      )}
    </div>
  );
}
