type ProgressBarProps = {
  progress: number; // 0-100
  label?: string;
  sublabelLeft?: string;
  sublabelRight?: string;
  valueLabel?: string;
};

export function ProgressBar({
  progress,
  label,
  sublabelLeft,
  sublabelRight,
  valueLabel,
}: ProgressBarProps) {
  return (
    <div className="bg-surface border border-outline-variant p-md rounded-lg space-y-md">
      {(label || valueLabel) && (
        <div className="flex justify-between items-center">
          {label && <span className="font-mono text-sm">{label}</span>}
          {valueLabel && (
            <span className="font-mono text-xs text-on-surface-variant">
              {valueLabel}
            </span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden border border-outline-variant">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary relative"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
      {(sublabelLeft || sublabelRight) && (
        <div className="flex justify-between items-center">
          {sublabelLeft && (
            <span className="text-primary font-bold font-mono text-xs">
              {sublabelLeft}
            </span>
          )}
          {sublabelRight && (
            <span className="text-on-surface-variant font-mono text-xs">
              {sublabelRight}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
