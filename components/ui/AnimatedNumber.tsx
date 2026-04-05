"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
  delay?: number;
  decimals?: number;
  formatter?: (value: number) => string;
}

export function AnimatedNumber({
  value,
  className,
  duration,
  delay,
  decimals = 0,
  formatter,
}: AnimatedNumberProps) {
  const animatedValue = useCountUp(value, duration, delay);
  const roundedValue =
    decimals > 0
      ? animatedValue.toFixed(decimals)
      : Math.round(animatedValue).toLocaleString();

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {formatter ? formatter(animatedValue) : roundedValue}
    </span>
  );
}
