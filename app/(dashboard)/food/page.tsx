"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Apple,
  Camera,
  CheckCircle2,
  Coffee,
  Moon,
  Plus,
  Sparkles,
  SunMedium,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { useAppContext } from "@/context/app-context";
import {
  getMealTypeFromHour,
  isToday,
  mealColors,
  mealTypeOptions,
} from "@/assets/data";
import { FoodEntry } from "@/types";
import { cn } from "@/lib/utils";

const mealIconMap = {
  breakfast: Coffee,
  lunch: SunMedium,
  dinner: Moon,
  snack: Apple,
};

export default function FoodLogPage() {
  const { allFoodLogs, addFoodEntry, removeFoodEntry } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    name: string;
    calories: number;
    mealType: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    mealType: "breakfast",
  });

  const todayLogs = useMemo(
    () => allFoodLogs.filter((log) => isToday(log.createdAt)),
    [allFoodLogs]
  );

  const groupedLogs = useMemo(() => {
    return todayLogs.reduce((accumulator, log) => {
      if (!accumulator[log.mealType]) {
        accumulator[log.mealType] = { totalCalories: 0, items: [] as FoodEntry[] };
      }

      accumulator[log.mealType].items.push(log);
      accumulator[log.mealType].totalCalories += log.calories;
      return accumulator;
    }, {} as Record<string, { totalCalories: number; items: FoodEntry[] }>);
  }, [todayLogs]);

  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);

  useEffect(() => {
    if (!analysisResult) {
      return;
    }

    const timeout = window.setTimeout(() => setAnalysisResult(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [analysisResult]);

  const handleManualSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.calories) {
      toast.error("Please fill in the meal name and calories");
      return;
    }

    const calories = Number(formData.calories);
    if (Number.isNaN(calories) || calories <= 0) {
      toast.error("Please enter a valid calorie value");
      return;
    }

    await addFoodEntry({
      name: formData.name,
      calories,
      mealType: formData.mealType,
    });

    setFormData({ name: "", calories: "", mealType: formData.mealType });
    setShowForm(false);
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsAnalyzing(true);

    try {
      const body = new FormData();
      body.append("image", file);

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || "Failed to analyse image");
        return;
      }

      const mealType = getMealTypeFromHour(new Date().getHours());
      await addFoodEntry({
        name: data.result.name,
        calories: data.result.calories,
        mealType,
      });

      setAnalysisResult({
        name: data.result.name,
        calories: data.result.calories,
        mealType,
      });
    } catch (error) {
      console.error("Food analysis failed:", error);
      toast.error("Failed to analyse image");
    } finally {
      setIsAnalyzing(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-ink-tertiary">Food log</p>
          <h1 className="font-display text-4xl font-bold text-ink-primary">
            Track your intake
          </h1>
        </div>
        <div className="rounded-2xl border border-border bg-bg-surface px-5 py-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-tertiary">
            Today&apos;s total
          </p>
          <p className="mt-2 font-mono text-3xl text-pulse">
            {totalCalories.toLocaleString()} kcal
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                AI Food Snap
              </p>
              <CardTitle className="text-3xl">Let Gemini do the logging</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="overflow-hidden rounded-2xl border border-pulse/20 bg-bg-base p-4"
                  >
                    <div className="relative h-3 overflow-hidden rounded-full bg-bg-sunken">
                      <span className="absolute left-0 top-0 h-full w-1/3 animate-[slideInRight_1.2s_linear_infinite] rounded-full bg-pulse" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-ink-primary">
                      Analysing your meal...
                    </p>
                    <p className="mt-1 text-sm text-ink-tertiary">
                      Estimating ingredients and calories now.
                    </p>
                  </motion.div>
                ) : (
                  <motion.button
                    key="cta"
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-3 rounded-[1.75rem] bg-[linear-gradient(90deg,var(--accent),#34d399)] px-6 py-5 text-base font-semibold text-white shadow-[0_12px_32px_var(--accent-glow)]"
                  >
                    <Sparkles className="h-5 w-5 transition-transform duration-150 group-hover:rotate-12" />
                    Snap a meal
                  </motion.button>
                )}
              </AnimatePresence>

              <p className="text-sm leading-7 text-ink-secondary">
                Upload a photo and PulseFit estimates the meal and calorie count
                in a few seconds. It works best with clear, well-lit shots.
              </p>

              <AnimatePresence>
                {analysisResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="rounded-2xl border border-pulse/20 bg-pulse-light p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-pulse">
                          {analysisResult.name}
                        </p>
                        <p className="mt-1 font-mono text-2xl text-ink-primary">
                          {analysisResult.calories.toLocaleString()} kcal
                        </p>
                      </div>
                      <span className="rounded-full bg-bg-base px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-pulse">
                        {analysisResult.mealType}
                      </span>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Quick add
              </p>
              <CardTitle className="text-3xl">Choose a meal type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="-mx-6 overflow-x-auto px-6">
                <div className="flex gap-3 pb-2">
                  {mealTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData((current) => ({ ...current, mealType: option.value }));
                        setShowForm(true);
                      }}
                      className={cn(
                        "whitespace-nowrap rounded-full border border-border px-4 py-2 text-sm font-medium transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]",
                        formData.mealType === option.value
                          ? "border-pulse bg-pulse text-white"
                          : "bg-bg-surface text-ink-secondary"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowForm((current) => !current)}
                className="mt-4 w-full justify-center border border-dashed border-border"
              >
                <Plus className="h-4 w-4" />
                {showForm ? "Hide manual form" : "Add meal manually"}
              </Button>
            </CardContent>
          </Card>

          <AnimatePresence initial={false}>
            {showForm ? (
              <motion.div
                initial={{ opacity: 0, y: -12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -12, height: 0 }}
                className="overflow-hidden"
              >
                <Card>
                  <CardHeader>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                      Manual entry
                    </p>
                    <CardTitle className="text-3xl">Add food details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                      <Input
                        label="Food name"
                        value={formData.name}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Grilled chicken salad"
                      />
                      <Input
                        label="Calories"
                        type="number"
                        value={formData.calories}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            calories: event.target.value,
                          }))
                        }
                        placeholder="420"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {mealTypeOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setFormData((current) => ({
                                ...current,
                                mealType: option.value,
                              }))
                            }
                            className={cn(
                              "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                              formData.mealType === option.value
                                ? "border-pulse bg-pulse-light text-pulse"
                                : "border-border bg-bg-base text-ink-secondary"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <Button type="submit" fullWidth>
                        Save meal
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <Card className="h-full">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
              Today&apos;s entries
            </p>
            <CardTitle className="text-3xl">Meals by type</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(groupedLogs).length === 0 ? (
              <EmptyState
                icon={<UtensilsCrossed className="h-7 w-7" />}
                title="No meals logged yet"
                body="Start by snapping a meal or adding your first entry manually."
                action={
                  <Button size="sm" onClick={() => setShowForm(true)}>
                    Add first meal
                  </Button>
                }
              />
            ) : (
              <div className="space-y-8">
                {mealTypeOptions.map((option) => {
                  const group = groupedLogs[option.value];
                  if (!group) {
                    return null;
                  }

                  const Icon = mealIconMap[option.value as keyof typeof mealIconMap];

                  return (
                    <section key={option.value}>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full",
                              mealColors[option.value]
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-ink-primary">{option.label}</p>
                            <p className="text-sm text-ink-tertiary">
                              {group.items.length} items
                            </p>
                          </div>
                        </div>
                        <p className="font-mono text-lg text-ink-primary">
                          {group.totalCalories.toLocaleString()} kcal
                        </p>
                      </div>

                      <div className="space-y-1">
                        <AnimatePresence>
                          {group.items.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20, height: 0 }}
                              transition={{ delay: index * 0.04 }}
                              className="group flex items-center justify-between border-b border-border-subtle py-3 last:border-0"
                            >
                              <div>
                                <p className="font-medium text-ink-primary">{item.name}</p>
                                <p className="text-sm text-ink-tertiary">
                                  {item.calories.toLocaleString()} calories
                                </p>
                              </div>
                              <button
                                type="button"
                                aria-label={`Delete ${item.name}`}
                                onClick={() => setDeleteId(item.id)}
                                className="rounded-full p-2 text-ink-tertiary opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/10 hover:text-danger"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this meal?"
        body="This entry will be removed from today's totals and charts."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) {
            return;
          }

          await removeFoodEntry(deleteId);
          setDeleteId(null);
        }}
        icon={<Trash2 className="h-5 w-5" />}
      />
    </div>
  );
}
