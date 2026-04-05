"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User, Calendar, Scale, Ruler, Target, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { useAppContext } from "@/context/app-context";
import { useTheme } from "@/context/theme-context";
import { goalOptions, isToday, goalLabels } from "@/assets/data";

export default function ProfilePage() {
  const router = useRouter();
  const { user, allFoodLogs, allActivityLogs, logout, updateUserProfile, isUserFetched } =
    useAppContext();
  const { theme, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    age: 0,
    weight: 0,
    height: null as number | null,
    goal: "maintain" as "lose" | "maintain" | "gain",
  });

  // Initialize form data when user loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
      });
    }
  }, [user]);

  // Calculate stats
  const todayStats = useMemo(() => {
    const foodCount = allFoodLogs.filter((log) => isToday(log.createdAt)).length;
    const activityCount = allActivityLogs.filter((log) =>
      isToday(log.createdAt)
    ).length;
    return { foodCount, activityCount };
  }, [allFoodLogs, allActivityLogs]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "N/A";
    return new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [user?.createdAt]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        ...formData,
        dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
        dailyCalorieBurn: user?.dailyCalorieBurn || 400,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (!isUserFetched || !user) {
    return <Loading fullScreen text="Loading..." />;
  }

  const profileFields = [
    {
      label: "Age",
      value: user.age,
      icon: Calendar,
      unit: "years",
    },
    {
      label: "Weight",
      value: user.weight,
      icon: Scale,
      unit: "kg",
    },
    ...(user.height
      ? [
          {
            label: "Height",
            value: user.height,
            icon: Ruler,
            unit: "cm",
          },
        ]
      : []),
    {
      label: "Goal",
      value: goalLabels[user.goal],
      icon: Target,
      unit: "",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card - Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle>Your Profile</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member since {memberSince}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <Button variant="secondary" onClick={handleEdit}>
                Edit Profile
              </Button>
            ) : null}
          </CardHeader>

          <CardContent>
            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Username
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {profileFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.label}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-lg">
                          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {field.label}
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {field.value} {field.unit}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Edit Mode
              <div className="space-y-4">
                <Input
                  label="Age"
                  type="number"
                  min={13}
                  max={120}
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: Number(e.target.value) })
                  }
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  min={20}
                  max={300}
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: Number(e.target.value) })
                  }
                />
                <Input
                  label="Height (cm) - Optional"
                  type="number"
                  min={100}
                  max={250}
                  value={formData.height || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      height: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
                <Select
                  label="Goal"
                  options={goalOptions}
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      goal: e.target.value as "lose" | "maintain" | "gain",
                    })
                  }
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isSaving}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Food Entries Today
                  </span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {todayStats.foodCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Activities Today
                  </span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {todayStats.activityCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Toggle (Mobile Only) */}
          <Card className="lg:hidden">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span className="text-gray-900 dark:text-white">
                      Light Mode
                    </span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-900 dark:text-white">
                      Dark Mode
                    </span>
                  </>
                )}
              </button>
            </CardContent>
          </Card>

          {/* Logout Card */}
          <Card>
            <CardContent className="p-6">
              <Button
                variant="danger"
                fullWidth
                onClick={handleLogout}
                className="flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
