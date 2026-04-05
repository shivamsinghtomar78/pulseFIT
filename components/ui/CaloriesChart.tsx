"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  day: string;
  intake: number;
  burn: number;
}

interface CaloriesChartProps {
  data: ChartDataPoint[];
  className?: string;
}

export function CaloriesChart({ data, className = "" }: CaloriesChartProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={cn("h-72 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb923c" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border-subtle)" />
          <XAxis
            dataKey="day"
            stroke="var(--ink-tertiary)"
            tick={{
              fill: "var(--ink-secondary)",
              fontSize: 12,
              fontFamily: "var(--font-jetbrains)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="var(--ink-tertiary)"
            tick={{
              fill: "var(--ink-secondary)",
              fontSize: 12,
              fontFamily: "var(--font-jetbrains)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              borderRadius: "16px",
              boxShadow: "var(--shadow-md)",
              color: "var(--ink-primary)",
            }}
            labelStyle={{ color: "var(--ink-primary)", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="intake"
            stroke="var(--accent)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIntake)"
            name="Calories Intake"
            isAnimationActive={!prefersReducedMotion}
            animationDuration={1200}
            animationEasing="ease-out"
          />
          <Area
            type="monotone"
            dataKey="burn"
            stroke="#fb923c"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBurn)"
            name="Calories Burned"
            isAnimationActive={!prefersReducedMotion}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
