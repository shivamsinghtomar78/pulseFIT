import React, { ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leading,
      trailing,
      className,
      wrapperClassName,
      labelClassName,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className={cn(
              "mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-ink-secondary transition-colors",
              error && "text-danger",
              labelClassName
            )}
          >
            {label}
          </label>
        ) : null}
        <div
          className={cn(
            "group relative flex items-center overflow-hidden rounded-xl border bg-bg-sunken transition-all duration-200",
            error
              ? "animate-shake border-danger/60"
              : "border-border focus-within:border-pulse focus-within:ring-2 focus-within:ring-pulse-glow"
          )}
        >
          {leading ? (
            <span className="pl-4 text-ink-secondary transition-colors group-focus-within:text-pulse">
              {leading}
            </span>
          ) : null}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "block w-full bg-transparent px-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
              leading && "pl-3",
              trailing && "pr-3",
              props.type === "file" &&
                "file:mr-4 file:rounded-full file:border-0 file:bg-pulse-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-pulse hover:file:bg-pulse-light/70",
              className
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {trailing ? (
            <span className="pr-3 text-ink-secondary transition-colors group-focus-within:text-pulse">
              {trailing}
            </span>
          ) : null}
        </div>
        {error ? (
          <p className="mt-2 text-sm text-danger">{error}</p>
        ) : helperText ? (
          <p className="mt-2 text-sm text-ink-tertiary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
