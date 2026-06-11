type MetricCardProps = {
  label: string;
  value: string;
  trend?: { direction: "up" | "down"; label: string };
  subtitle?: string;
  colorClass?: string;
};

export function MetricCard({
  label,
  value,
  trend,
  subtitle,
  colorClass = "text-primary",
}: MetricCardProps) {
  return (
    <div className="bg-surface border border-outline-variant p-md rounded-lg">
      <p className="font-mono text-xs text-on-surface-variant mb-xs uppercase">
        {label}
      </p>
      <p className={`font-mono text-2xl font-bold ${colorClass}`}>{value}</p>
      {trend && (
        <div
          className={`mt-sm flex items-center gap-xs ${trend.direction === "up" ? "text-success" : "text-error"}`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {trend.direction === "up" ? "trending_up" : "trending_down"}
          </span>
          <span className="font-mono text-xs">{trend.label}</span>
        </div>
      )}
      {subtitle && (
        <div className="mt-sm flex items-center gap-xs text-on-surface-variant">
          <span className="font-mono text-xs">{subtitle}</span>
        </div>
      )}
    </div>
  );
}
