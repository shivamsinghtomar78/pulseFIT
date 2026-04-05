import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  fullWidth?: boolean;
  loadingText?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  loadingText = "Hold on...",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-pulse focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-60";

  const variantStyles = {
    primary:
      "bg-pulse text-white shadow-[0_4px_16px_var(--accent-glow)] hover:bg-pulse-hover active:scale-[0.97]",
    secondary:
      "border border-border-strong bg-transparent text-ink-primary hover:bg-bg-sunken active:scale-[0.97]",
    danger:
      "border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-[0.97]",
    ghost:
      "rounded-xl bg-transparent px-4 text-ink-secondary hover:bg-bg-sunken hover:text-ink-primary active:scale-[0.98]",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "h-11 w-11 rounded-full p-0",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {size !== "icon" ? loadingText : null}
        </>
      ) : (
        children
      )}
    </button>
  );
}
