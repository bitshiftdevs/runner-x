type RatingProps = {
  value: number; // 0-5
  label?: string;
  showValue?: boolean;
};

const starKeys = ["s1", "s2", "s3", "s4", "s5"] as const;

export function Rating({ value, label, showValue = true }: RatingProps) {
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.5;

  return (
    <div className="flex flex-col items-center justify-center gap-sm">
      {label && (
        <p className="font-mono text-xs text-on-surface-variant uppercase">
          {label}
        </p>
      )}
      <div className="flex gap-xs text-tertiary">
        {starKeys.map((key, i) => (
          <span
            key={key}
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: i < fullStars ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {i < fullStars
              ? "star"
              : i === fullStars && hasHalf
                ? "star_half"
                : "star"}
          </span>
        ))}
      </div>
      {showValue && (
        <span className="font-mono text-2xl font-bold text-white">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
