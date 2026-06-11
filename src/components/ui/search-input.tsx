import type { InputHTMLAttributes } from "react";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function SearchInput({ className = "", ...props }: SearchInputProps) {
  return (
    <div className="relative bg-surface-container-low px-md py-xs rounded-lg border border-outline-variant flex items-center gap-sm">
      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
        search
      </span>
      <input
        type="text"
        className={`bg-transparent border-none focus:ring-0 focus:outline-none font-mono text-sm w-48 text-on-surface placeholder:text-on-surface-variant ${className}`}
        {...props}
      />
    </div>
  );
}
