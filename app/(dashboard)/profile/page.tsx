"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  LogOut,
  Moon,
  Ruler,
  Scale,
  Sun,
  Target,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAppContext } from "@/context/app-context";
import { useTheme } from "@/context/theme-context";
import { goalLabels, goalOptions, isToday } from "@/assets/data";

export default function ProfilePage() {
  const router = useRouter();
  const { user, allFoodLogs, allActivityLogs, logout, updateUserProfile } =
    useAppContext();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [formData, setFormData] = useState({
    age: 0,
    weight: 0,
    height: "" as string | number,
      goal: "maintain" as "lose" | "maintain" | "gain",
  });
  const age = user?.age ?? 0;
  const weight = user?.weight ?? 0;
  const height = user?.height ?? null;
  const goal = user?.goal ?? "maintain";
  const username = user?.username ?? "";
  const email = user?.email ?? "";
  const createdAt = user?.createdAt ?? new Date().toISOString();

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      age: user.age,
      weight: user.weight,
      height: user.height ?? "",
      goal: user.goal,
    });
  }, [user]);

  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));

  const todayStats = useMemo(() => {
    return {
      meals: allFoodLogs.filter((log) => isToday(log.createdAt)).length,
      activities: allActivityLogs.filter((log) => isToday(log.createdAt)).length,
    };
  }, [allActivityLogs, allFoodLogs]);

  const fields = [
    { label: "Age", value: `${age} years`, icon: Calendar },
    { label: "Weight", value: `${weight} kg`, icon: Scale },
    ...(height
      ? [{ label: "Height", value: `${height} cm`, icon: Ruler }]
      : []),
    { label: "Goal", value: goalLabels[goal], icon: Target },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="text-center">
        <p className="text-sm text-ink-tertiary">Profile</p>
        <h1 className="font-display text-4xl font-bold text-ink-primary">
          Your account
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <div className="h-1 w-full rounded-t-2xl bg-pulse" />
            <CardContent className="p-6">
              <div className="mx-auto max-w-md text-center">
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pulse-light font-display text-3xl font-bold text-pulse"
                >
                  {username.charAt(0).toUpperCase()}
                </motion.div>
                <h2 className="font-display text-3xl font-bold text-ink-primary">
                  {username}
                </h2>
                <p className="mt-1 text-sm text-ink-tertiary">Member since {memberSince}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                  Details
                </p>
                <CardTitle className="text-3xl">Profile settings</CardTitle>
              </div>
              {!isEditing ? (
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  Edit profile
                </Button>
              ) : null}
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait" initial={false}>
                {isEditing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Age"
                      type="number"
                      value={formData.age}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          age: Number(event.target.value),
                        }))
                      }
                    />
                    <Input
                      label="Weight (kg)"
                      type="number"
                      value={formData.weight}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          weight: Number(event.target.value),
                        }))
                      }
                    />
                    <Input
                      label="Height (cm)"
                      type="number"
                      value={formData.height}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          height: event.target.value,
                        }))
                      }
                    />
                    <Select
                      label="Goal"
                      value={formData.goal}
                      options={goalOptions}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          goal: event.target.value as "lose" | "maintain" | "gain",
                        }))
                      }
                    />
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            age: user.age,
                            weight: user.weight,
                            height: user.height ?? "",
                            goal: user.goal,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        isLoading={isSaving}
                        onClick={async () => {
                          setIsSaving(true);

                          try {
                            await updateUserProfile({
                              age: formData.age,
                              weight: formData.weight,
                              height: formData.height ? Number(formData.height) : null,
                              goal: formData.goal,
                              dailyCalorieIntake: user.dailyCalorieIntake,
                              dailyCalorieBurn: user.dailyCalorieBurn,
                            });
                            setIsEditing(false);
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                      >
                        Save changes
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="rounded-2xl bg-bg-base p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-ink-tertiary">
                        Email
                      </p>
                      <p className="mt-2 text-lg font-medium text-ink-primary">{email}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {fields.map((field) => {
                        const Icon = field.icon;

                        return (
                          <div
                            key={field.label}
                            className="flex items-center gap-3 rounded-2xl border border-border bg-bg-base p-4"
                          >
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-surface text-pulse">
                              <Icon className="h-5 w-5" />
                            </span>
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-ink-tertiary">
                                {field.label}
                              </p>
                              <p className="mt-1 font-medium text-ink-primary">{field.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Today
              </p>
              <CardTitle className="text-3xl">Quick stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-bg-base px-4 py-3">
                <span className="text-sm text-ink-secondary">Meals logged</span>
                <span className="font-mono text-lg text-pulse">{todayStats.meals}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-bg-base px-4 py-3">
                <span className="text-sm text-ink-secondary">Activities logged</span>
                <span className="font-mono text-lg text-orange-500">
                  {todayStats.activities}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:hidden">
            <CardContent className="p-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-bg-base px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-warning" />
                  ) : (
                    <Moon className="h-5 w-5 text-pulse" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-ink-primary">Theme</p>
                    <p className="text-xs text-ink-tertiary">
                      {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    </p>
                  </div>
                </div>
                <span
                  className={`relative h-6 w-12 rounded-full border border-border bg-bg-sunken transition-colors ${
                    theme === "dark" ? "bg-pulse" : ""
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                      theme === "dark" ? "left-6" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setShowLogoutDialog(true)}
                  className="mt-0"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showLogoutDialog}
        title="Log out of PulseFit?"
        body="You can sign back in any time, but this will end your current session."
        confirmLabel="Log out"
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={async () => {
          await logout();
          router.replace("/login");
        }}
        icon={<LogOut className="h-5 w-5" />}
      />
    </div>
  );
}
