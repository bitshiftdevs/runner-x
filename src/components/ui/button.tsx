"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary font-bold glow-primary glow-primary-hover active:scale-95",
  secondary:
    "bg-transparent border border-secondary text-secondary font-bold hover:bg-secondary/10 active:scale-95",
  ghost: "text-on-surface-variant hover:text-primary font-bold",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-xl py-md rounded-lg transition-all font-mono text-sm tracking-wider ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
