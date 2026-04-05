"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function useCountUp(
  target: number,
  duration = 800,
  delay = 0
): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let frameId = 0;
    let animationStart = 0;

    setValue(0);

    const animate = (timestamp: number) => {
      if (!animationStart) {
        animationStart = timestamp;
      }

      const elapsed = timestamp - animationStart;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setValue(target * easedProgress);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    timeoutId = setTimeout(() => {
      frameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      cancelAnimationFrame(frameId);
    };
  }, [delay, duration, prefersReducedMotion, target]);

  return value;
}
