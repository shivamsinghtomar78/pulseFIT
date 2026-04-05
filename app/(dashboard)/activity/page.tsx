"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, X, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { useAppContext } from "@/context/app-context";
import { quickActivities, isToday } from "@/assets/data";
import toast from "react-hot-toast";

interface ActivityFormData {
  name: string;
  duration: string;
  calories: string;
}

export default function ActivityLogPage() {
  const { user, allActivityLogs, addActivityEntry, removeActivityEntry, isUserFetched } =
    useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ActivityFormData>({
    name: "",
    duration: "30",
    calories: "",
  });

  // Filter today's logs
  const todayLogs = useMemo(() => {
    return allActivityLogs.filter((log) => isToday(log.createdAt));
  }, [allActivityLogs]);

  const totalMinutes = todayLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalBurned = todayLogs.reduce((sum, log) => sum + log.calories, 0);

  const handleQuickAdd = (activity: (typeof quickActivities)[0]) => {
    const duration = 30;
    const calories = duration * activity.rate;
    setFormData({
      name: activity.name,
      duration: duration.toString(),
      calories: calories.toString(),
    });
    setShowForm(true);
  };

  const handleDurationChange = (value: string) => {
    const duration = parseInt(value) || 0;
    // Check if it's a quick activity to auto-calculate calories
    const quickActivity = quickActivities.find(
      (a) => a.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (quickActivity) {
      const calories = duration * quickActivity.rate;
      setFormData({
        ...formData,
        duration: value,
        calories: calories.toString(),
      });
    } else {
      setFormData({ ...formData, duration: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.duration || !formData.calories) {
      toast.error("Please fill in all fields");
      return;
    }

    const duration = parseInt(formData.duration);
    const calories = parseInt(formData.calories);

    if (isNaN(duration) || duration <= 0) {
      toast.error("Please enter a valid duration");
      return;
    }

    if (isNaN(calories) || calories <= 0) {
      toast.error("Please enter valid calories");
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      await removeActivityEntry(id);
    }
  };

  if (!isUserFetched || !user) {
    return <Loading fullScreen text="Loading..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Activity Log
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your workouts and activities
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Active Today
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {totalMinutes}
            <span className="text-sm text-gray-500 ml-1">min</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-4">
          {/* Quick Add Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActivities.map((activity) => (
                  <Button
                    key={activity.name}
                    variant="secondary"
                    onClick={() => handleQuickAdd(activity)}
                  >
                    <span className="mr-2">{activity.emoji}</span>
                    {activity.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Manual Add */}
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowForm(!showForm)}
            className="border-2 border-dashed border-gray-300 dark:border-slate-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            {showForm ? "Cancel" : "Add Custom Activity"}
          </Button>

          {/* Add Form */}
          {showForm && (
            <Card className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Add Activity</CardTitle>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Activity Name"
                    type="text"
                    placeholder="e.g., Swimming"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <Input
                    label="Duration (minutes)"
                    type="number"
                    min={1}
                    max={300}
                    placeholder="e.g., 30"
                    value={formData.duration}
                    onChange={(e) => handleDurationChange(e.target.value)
                    }
                  />
                  <Input
                    label="Calories Burned"
                    type="number"
                    placeholder="e.g., 300"
                    value={formData.calories}
                    onChange={(e) =>
                      setFormData({ ...formData, calories: e.target.value })
                    }
                    helperText="Calories are auto-calculated for quick activities"
                  />
                  <Button type="submit" variant="primary" fullWidth>
                    Log Activity
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Entries List */}
        <div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today&apos;s Activities</CardTitle>
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                {todayLogs.length} activities
              </span>
            </CardHeader>
            <CardContent>
              {todayLogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-4">🏃</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    No activity logged today
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Get moving and track your progress!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                          <Timer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {log.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(log.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {log.duration} min
                          </p>
                          <p className="text-sm text-amber-600 dark:text-amber-400">
                            {log.calories} cal
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Active Time
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {totalMinutes} minutes
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Calories Burned
                      </span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        {totalBurned} cal
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
