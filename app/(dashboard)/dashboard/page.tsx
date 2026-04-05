"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Dumbbell,
  Flame,
  Timer,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { CaloriesChart } from "@/components/ui/CaloriesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAppContext } from "@/context/app-context";
import {
  calculateBMI,
  getBMICategory,
  getMotivationalMessage,
  goalLabels,
  isToday,
} from "@/assets/data";
import { cn } from "@/lib/utils";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getLongDate() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

function getWeekSeries() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: date.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
    };
  });
}

function getBmiPosition(bmi: number) {
  if (bmi <= 18.5) return 12;
  if (bmi <= 25) return 37;
  if (bmi <= 30) return 66;
  return 90;
}

export default function DashboardPage() {
  const { user, allFoodLogs, allActivityLogs } = useAppContext();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const dailyIntake = user?.dailyCalorieIntake ?? 1;
  const dailyBurnTarget = user?.dailyCalorieBurn ?? 0;
  const goal = user?.goal ?? "maintain";
  const username = user?.username ?? "there";
  const weight = user?.weight ?? 0;
  const height = user?.height ?? null;

  const todayFood = allFoodLogs.filter((log) => isToday(log.createdAt));
  const todayActivities = allActivityLogs.filter((log) => isToday(log.createdAt));

  const todayStats = useMemo(() => {
    const totalCalories = todayFood.reduce((sum, log) => sum + log.calories, 0);
    const totalBurned = todayActivities.reduce((sum, log) => sum + log.calories, 0);
    const totalMinutes = todayActivities.reduce((sum, log) => sum + log.duration, 0);

    return {
      totalCalories,
      totalBurned,
      totalMinutes,
      meals: todayFood.length,
      workouts: todayActivities.length,
    };
  }, [todayActivities, todayFood]);

  const motivation = getMotivationalMessage(
    todayStats.totalCalories,
    todayStats.totalMinutes,
    dailyIntake
  );

  const remainingCalories = dailyIntake - todayStats.totalCalories;
  const netCalories = todayStats.totalCalories - todayStats.totalBurned;
  const ringProgress = Math.min(todayStats.totalCalories / dailyIntake, 1);
  const ringCircumference = 2 * Math.PI * 60;
  const bmi = calculateBMI(weight, height);
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  const weeklyData = useMemo(() => {
    const series = getWeekSeries();

    return series.map((day) => ({
      day: day.label,
      intake: allFoodLogs
        .filter((log) => log.createdAt.slice(0, 10) === day.key)
        .reduce((sum, log) => sum + log.calories, 0),
      burn: allActivityLogs
        .filter((log) => log.createdAt.slice(0, 10) === day.key)
        .reduce((sum, log) => sum + log.calories, 0),
    }));
  }, [allActivityLogs, allFoodLogs]);

  const statsCards = [
    {
      icon: Timer,
      label: "Active time",
      value: `${todayStats.totalMinutes} min`,
    },
    {
      icon: Dumbbell,
      label: "Workouts",
      value: `${todayStats.workouts} logged`,
    },
    {
      icon: UtensilsCrossed,
      label: "Meals",
      value: `${todayStats.meals} logged`,
    },
    {
      icon: TrendingUp,
      label: "Goal",
      value: goalLabels[goal],
      accent: true,
    },
  ];

  const showFirstVisitBanner =
    !bannerDismissed && todayFood.length === 0 && todayActivities.length === 0;

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {showFirstVisitBanner ? (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="flex flex-col gap-4 rounded-2xl border border-pulse/20 bg-pulse-light p-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-pulse">
              {getGreeting()}, {username}! Your journey starts today.
            </p>
            <p className="text-sm text-ink-secondary">
              Log your first meal and let the dashboard start working for you.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="text-sm font-medium text-pulse transition-colors hover:text-pulse-hover"
          >
            Dismiss
          </button>
        </motion.div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-ink-tertiary">{getLongDate()}</p>
          <h1 className="font-display text-4xl font-bold text-ink-primary">
            {getGreeting()}, {username}
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-pulse/20 bg-pulse-light px-4 py-2 text-sm font-medium text-pulse">
          <Flame className="h-4 w-4" />
          {motivation.text}
        </div>
      </div>

      <Card inverted className="overflow-hidden">
        <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.25fr_0.9fr] lg:items-center">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Calories in
              </p>
              <AnimatedNumber
                value={todayStats.totalCalories}
                className="text-5xl font-medium text-ink-inverted"
              />
              <p className="text-sm text-white/60">
                of {dailyIntake.toLocaleString()} kcal daily
              </p>
            </div>

            <div className="space-y-3 border-white/10 md:border-l md:pl-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Calories out
              </p>
              <AnimatedNumber
                value={todayStats.totalBurned}
                delay={200}
                className="text-5xl font-medium text-ink-inverted"
              />
              <p className="text-sm text-white/60">
                of {dailyBurnTarget.toLocaleString()} kcal target
              </p>
            </div>

            <div className="md:col-span-2 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Today&apos;s balance
              </p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                <p className="font-mono text-3xl text-ink-inverted">
                  {netCalories.toLocaleString()} net kcal
                </p>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                    remainingCalories > 100
                      ? "bg-pulse-light text-pulse"
                      : remainingCalories >= 0
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-red-400/20 text-red-300"
                  )}
                >
                  {remainingCalories >= 0
                    ? `${remainingCalories.toLocaleString()} kcal remaining`
                    : `Over by ${Math.abs(remainingCalories).toLocaleString()} kcal`}
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto flex justify-center">
            <div className="relative h-56 w-56">
              <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="var(--accent)"
                  strokeLinecap="round"
                  strokeWidth="14"
                  strokeDasharray={ringCircumference}
                  initial={{ strokeDashoffset: ringCircumference }}
                  animate={{
                    strokeDashoffset: ringCircumference * (1 - ringProgress),
                  }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Net remaining
                </span>
                <AnimatedNumber
                  value={Math.max(dailyIntake - netCalories, 0)}
                  className="mt-2 text-4xl font-medium text-ink-inverted"
                />
                <span className="mt-1 text-sm text-white/60">kcal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.3 }}
            >
              <Card className="h-full">
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-base text-pulse">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                      {card.label}
                    </p>
                    <p
                      className={cn(
                        "mt-2 text-lg font-semibold text-ink-primary",
                        card.accent && "text-pulse"
                      )}
                    >
                      {card.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-base text-pulse">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Body metrics
              </p>
              <CardTitle className="text-3xl">BMI snapshot</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {bmi ? (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <AnimatedNumber
                      value={bmi}
                      decimals={1}
                      className="text-6xl font-medium text-ink-primary"
                    />
                    <p className="mt-2 text-sm text-ink-secondary">{bmiCategory?.label}</p>
                  </div>
                  <div className="rounded-2xl bg-bg-base px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-ink-tertiary">
                      Weight
                    </p>
                    <p className="font-mono text-xl">{weight} kg</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <span className="h-3 rounded-full bg-blue-400/70" />
                    <span className="h-3 rounded-full bg-emerald-400/80" />
                    <span className="h-3 rounded-full bg-amber-400/80" />
                    <span className="h-3 rounded-full bg-red-400/70" />
                  </div>
                  <div className="relative h-4">
                    <motion.span
                      initial={{ left: 0 }}
                      animate={{ left: `${getBmiPosition(bmi)}%` }}
                      transition={{ type: "spring", stiffness: 180, damping: 22 }}
                      className="absolute top-0 text-xs text-ink-primary"
                    >
                      ▲
                    </motion.span>
                  </div>
                  <div className="grid grid-cols-4 text-[10px] uppercase tracking-[0.15em] text-ink-tertiary">
                    <span>Under</span>
                    <span>Normal</span>
                    <span>Over</span>
                    <span>Obese</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-bg-base p-5 text-sm text-ink-secondary">
                Add your height in profile to unlock BMI tracking.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Weekly progress
              </p>
              <CardTitle className="text-3xl">Intake vs burn</CardTitle>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-pulse-light px-3 py-1 text-xs font-semibold text-pulse">
                Intake
              </span>
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500">
                Burn
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <CaloriesChart data={weeklyData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
