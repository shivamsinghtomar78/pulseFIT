import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            block w-full rounded-lg border px-3 py-2
            text-gray-900 dark:text-white
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 focus:ring-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-slate-700"
            }
            ${
              props.type === "file"
                ? "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-slate-700 dark:file:text-emerald-300"
                : "bg-white dark:bg-slate-800"
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
