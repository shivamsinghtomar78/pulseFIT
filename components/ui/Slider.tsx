"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  infoText?: string;
  className?: string;
  valueFormatter?: (value: number) => string;
}

export function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = "",
  infoText,
  className = "",
  valueFormatter,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const bubbleOffset = `calc(${percentage}% - 28px)`;
  const displayValue = valueFormatter
    ? valueFormatter(value)
    : `${value}${unit ? ` ${unit}` : ""}`;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-ink-primary">{label}</label>
        <span className="font-mono text-sm font-medium text-pulse">
          {displayValue}
        </span>
      </div>

      <div className="relative pt-8">
        <motion.div
          layout
          className="pointer-events-none absolute top-0 rounded-full border border-border bg-bg-surface px-3 py-1 font-mono text-xs font-medium text-ink-primary shadow-sm"
          style={{ left: bubbleOffset }}
        >
          {displayValue}
        </motion.div>
        <div className="absolute left-0 right-0 top-[2.625rem] h-2 rounded-full bg-bg-sunken" />
        <motion.div
          className="absolute left-0 top-[2.625rem] h-2 rounded-full bg-pulse"
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.2 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 h-10 w-full cursor-pointer appearance-none bg-transparent focus:outline-none [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:-mt-[6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-pulse [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110 [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-pulse [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md"
        />
      </div>

      <div className="mt-1 flex justify-between text-xs text-ink-tertiary">
        <span>
          {min}
          {unit ? ` ${unit}` : ""}
        </span>
        <span>
          {max}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>

      {infoText ? <p className="mt-2 text-xs text-ink-tertiary">{infoText}</p> : null}
    </div>
  );
}
