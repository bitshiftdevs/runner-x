"use client";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      {label && <span className="text-sm">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full border border-outline-variant relative transition-colors ${
          checked ? "bg-primary" : "bg-surface-container-highest"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
            checked ? "left-7 bg-white" : "left-1 bg-on-surface-variant"
          }`}
        />
      </button>
    </div>
  );
}
