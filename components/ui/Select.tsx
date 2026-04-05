import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={selectId}
            className={cn(
              "mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-ink-secondary",
              error && "text-danger"
            )}
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "block w-full appearance-none rounded-xl border border-border bg-bg-sunken px-4 py-3 pr-10 text-sm text-ink-primary transition-all duration-200 focus:border-pulse focus:outline-none focus:ring-2 focus:ring-pulse-glow disabled:cursor-not-allowed disabled:opacity-60",
              error && "border-danger/60",
              className
            )}
            aria-invalid={Boolean(error)}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
        </div>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      </div>
    );
  }
);

Select.displayName = "Select";
