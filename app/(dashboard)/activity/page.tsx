"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bike,
  CircleDot,
  Dumbbell,
  PersonStanding,
  Timer,
  Trash2,
  Waves,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { useAppContext } from "@/context/app-context";
import { isToday, quickActivities } from "@/assets/data";

const quickActivityIcons: Record<string, ReactNode> = {
  Running: <PersonStanding className="h-7 w-7" />,
  Cycling: <Bike className="h-7 w-7" />,
  Swimming: <Waves className="h-7 w-7" />,
  Yoga: <CircleDot className="h-7 w-7" />,
  "Weight Training": <Dumbbell className="h-7 w-7" />,
  Walking: <PersonStanding className="h-7 w-7" />,
  Dancing: <CircleDot className="h-7 w-7" />,
  Basketball: <CircleDot className="h-7 w-7" />,
};

interface ActivityFormData {
  name: string;
  duration: string;
  calories: string;
}

export default function ActivityLogPage() {
  const { allActivityLogs, addActivityEntry, removeActivityEntry } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ActivityFormData>({
    name: "",
    duration: "30",
    calories: "",
  });

  const todayLogs = useMemo(
    () => allActivityLogs.filter((log) => isToday(log.createdAt)),
    [allActivityLogs]
  );

  const totalMinutes = todayLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalBurned = todayLogs.reduce((sum, log) => sum + log.calories, 0);

  const handleQuickActivity = (activity: (typeof quickActivities)[number]) => {
    const duration = 30;
    const calories = duration * activity.rate;

    setFormData({
      name: activity.name,
      duration: String(duration),
      calories: String(calories),
    });
    setShowForm(true);
  };

  const handleDurationChange = (nextValue: string) => {
    const numericValue = Number(nextValue);
    const selectedQuickActivity = quickActivities.find(
      (activity) => activity.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (selectedQuickActivity && numericValue > 0) {
      setFormData((current) => ({
        ...current,
        duration: nextValue,
        calories: String(numericValue * selectedQuickActivity.rate),
      }));
      return;
    }

    setFormData((current) => ({ ...current, duration: nextValue }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const duration = Number(formData.duration);
    const calories = Number(formData.calories);

    if (!formData.name || !duration || !calories) {
      toast.error("Please fill in all activity fields");
      return;
    }

    if (duration <= 0 || calories <= 0) {
      toast.error("Use positive values for duration and calories");
      return;
    }

    await addActivityEntry({
      name: formData.name,
      duration,
      calories,
    });

    setFormData({ name: "", duration: "30", calories: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-ink-tertiary">Activity log</p>
          <h1 className="font-display text-4xl font-bold text-ink-primary">
            Track movement
          </h1>
        </div>
        <div className="rounded-2xl border border-border bg-bg-surface px-5 py-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-tertiary">
            Active today
          </p>
          <p className="mt-2 font-mono text-3xl text-orange-500">
            {totalMinutes.toLocaleString()} min
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Quick start
              </p>
              <CardTitle className="text-3xl">Log a workout in one tap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {quickActivities.map((activity) => (
                  <motion.button
                    key={activity.name}
                    type="button"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickActivity(activity)}
                    className="rounded-2xl border border-border bg-bg-surface p-4 text-center shadow-sm transition-all duration-200 hover:border-pulse/30 hover:shadow-md"
                  >
                    <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-base text-pulse">
                      {quickActivityIcons[activity.name] ?? <Dumbbell className="h-7 w-7" />}
                    </span>
                    <p className="text-sm font-medium text-ink-primary">{activity.name}</p>
                  </motion.button>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowForm((current) => !current)}
                className="mt-4 w-full justify-center border border-dashed border-border"
              >
                {showForm ? "Hide manual form" : "Add custom activity"}
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
                    <CardTitle className="text-3xl">Activity details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        label="Activity"
                        value={formData.name}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Swimming"
                      />
                      <Input
                        label="Duration"
                        type="number"
                        value={formData.duration}
                        onChange={(event) => handleDurationChange(event.target.value)}
                        placeholder="30"
                        helperText="Minutes"
                      />
                      <Input
                        label="Calories burned"
                        type="number"
                        value={formData.calories}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            calories: event.target.value,
                          }))
                        }
                        placeholder="280"
                        helperText="Auto-calculates for quick activities"
                      />
                      <Button type="submit" fullWidth>
                        Log activity
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <Card className="h-full">
          <CardHeader className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Today&apos;s activities
              </p>
              <CardTitle className="text-3xl">Movement log</CardTitle>
            </div>
            <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
              {todayLogs.length} entries
            </span>
          </CardHeader>
          <CardContent>
            {todayLogs.length === 0 ? (
              <EmptyState
                icon={<Timer className="h-7 w-7" />}
                title="No activity logged yet"
                body="Tap a quick activity above or add your workout manually."
                action={
                  <Button size="sm" onClick={() => setShowForm(true)}>
                    Log activity
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {todayLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, scale: 0.96, y: 18 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -12 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 260, damping: 24 }}
                      className="flex items-center gap-4 rounded-xl border border-border bg-bg-base p-4"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                        <Timer className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-ink-primary">{log.name}</p>
                        <p className="text-xs text-ink-tertiary">
                          {new Intl.DateTimeFormat("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(log.createdAt))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-ink-primary">
                          {log.duration} min
                        </p>
                        <p className="font-mono text-sm text-orange-500">
                          {log.calories} kcal
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Delete ${log.name}`}
                        onClick={() => setDeleteId(log.id)}
                        className="rounded-full p-2 text-ink-tertiary transition-colors hover:bg-red-500/10 hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="mt-4 rounded-2xl border border-border bg-bg-base p-5">
                  <div className="flex justify-between text-sm text-ink-secondary">
                    <span>Total active time</span>
                    <span className="font-medium text-ink-primary">{totalMinutes} min</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-ink-secondary">
                    <span>Total calories burned</span>
                    <span className="font-medium text-orange-500">
                      {totalBurned.toLocaleString()} kcal
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this activity?"
        body="This removes the workout from today's burn totals and weekly chart."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) {
            return;
          }

          await removeActivityEntry(deleteId);
          setDeleteId(null);
        }}
        icon={<Trash2 className="h-5 w-5" />}
      />
    </div>
  );
}
