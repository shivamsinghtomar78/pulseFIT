import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  inverted?: boolean;
}

export function Card({
  children,
  className,
  hover = false,
  interactive = false,
  inverted = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border shadow-sm transition-all duration-300",
        inverted
          ? "border-white/10 bg-ink-primary text-ink-inverted shadow-lg"
          : "border-border bg-bg-surface text-ink-primary",
        hover && "hover:shadow-md",
        interactive &&
          "cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("space-y-2 px-6 pt-6", className)}>{children}</div>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn("font-display text-2xl font-bold text-inherit", className)}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("p-6", className)}>{children}</div>;
}
