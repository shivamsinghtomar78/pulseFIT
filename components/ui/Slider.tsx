import React from "react";

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
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {value}
          {unit && ` ${unit}`}
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer
            accent-emerald-500
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-emerald-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-emerald-500
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer
          "
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>

      {infoText && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {infoText}
        </p>
      )}
    </div>
  );
}
