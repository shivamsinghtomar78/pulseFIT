import React from "react";
import { Loader2 } from "lucide-react";

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
  className = "",
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-emerald-500 animate-spin`} />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
}
