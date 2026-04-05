import React from "react";
import { Loader2, PersonStanding } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({
  fullScreen = false,
  size = "md",
  text = "Loading...",
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pulse text-white shadow-[0_10px_30px_var(--accent-glow)]">
        <PersonStanding className="h-8 w-8" />
      </div>
      <div className="mt-4 flex items-center gap-2 text-pulse">
        <Loader2 className={cn(sizeClasses[size], "animate-spin")} />
      </div>
      {text ? <p className="mt-3 text-sm text-ink-secondary">{text}</p> : null}
      <div className="mt-3 flex items-center gap-1.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-pulse [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-pulse [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-pulse [animation-delay:300ms]" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
