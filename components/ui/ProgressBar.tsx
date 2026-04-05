import React from "react";

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
  color = "bg-emerald-500",
  showPercentage = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isOverLimit = value > max;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {value} / {max}
            {showPercentage && (
              <span className="ml-1">({Math.round(percentage)}%)</span>
            )}
          </span>
        </div>
      )}

      <div className="relative h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`
            h-full rounded-full transition-all duration-500 ease-out
            ${isOverLimit ? "bg-red-500" : color}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isOverLimit && (
        <p className="mt-1 text-xs text-red-500">Over limit by {value - max}</p>
      )}
    </div>
  );
}
