type SectionHeaderProps = {
  title: string;
  moduleLabel?: string;
};

export function SectionHeader({ title, moduleLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-lg border-b border-outline-variant pb-md">
      <h2 className="font-sans text-3xl font-semibold text-primary">{title}</h2>
      {moduleLabel && (
        <span className="font-mono text-xs text-on-surface-variant">
          {moduleLabel}
        </span>
      )}
    </div>
  );
}
