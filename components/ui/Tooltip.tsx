"use client";

import React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = "" }: TooltipProps) {
  return (
    <span className={`group relative inline-flex ${className}`}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-xs font-medium text-white shadow-lg group-hover:block dark:bg-slate-100 dark:text-slate-950">
        {content}
      </span>
    </span>
  );
}
