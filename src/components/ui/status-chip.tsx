type ChipVariant = "success" | "primary" | "error" | "tertiary";

type StatusChipProps = {
  label: string;
  variant?: ChipVariant;
};

const variantStyles: Record<ChipVariant, string> = {
  success: "bg-success/10 border-success/30 text-success",
  primary: "bg-primary/10 border-primary/30 text-primary",
  error: "bg-error/10 border-error/30 text-error",
  tertiary: "bg-tertiary/10 border-tertiary/30 text-tertiary",
};

export function StatusChip({ label, variant = "primary" }: StatusChipProps) {
  return (
    <span
      className={`px-sm py-[2px] border rounded font-mono text-xs ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
