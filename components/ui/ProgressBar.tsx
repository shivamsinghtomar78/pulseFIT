import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  color = "bg-pulse",
  showPercentage = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isOverLimit = value > max;

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-ink-primary">{label}</span>
          <span className="font-mono text-sm text-ink-secondary">
            {value} / {max}
            {showPercentage ? <span className="ml-1">({Math.round(percentage)}%)</span> : null}
          </span>
        </div>
      ) : null}

      <div className="relative h-2 overflow-hidden rounded-full bg-bg-sunken">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isOverLimit ? "bg-danger" : color
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isOverLimit ? (
        <p className="mt-1 text-xs text-danger">Over limit by {value - max}</p>
      ) : null}
    </div>
  );
}
