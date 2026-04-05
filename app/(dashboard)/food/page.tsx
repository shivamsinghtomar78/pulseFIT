"use client";

import React, { useMemo, useRef, useState } from "react";
import { Camera, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { useAppContext } from "@/context/app-context";
import {
  quickActivitiesFoodLog,
  mealTypeOptions,
  mealColors,
  isToday,
  getMealTypeFromHour,
} from "@/assets/data";
import { FoodEntry } from "@/types";
import toast from "react-hot-toast";

const mealIcons: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍎",
};

export default function FoodLogPage() {
  const { user, allFoodLogs, addFoodEntry, removeFoodEntry, isUserFetched } =
    useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    mealType: "breakfast",
  });

  const todayLogs = useMemo(() => {
    return allFoodLogs.filter((log) => isToday(log.createdAt));
  }, [allFoodLogs]);

  const groupedLogs = useMemo(() => {
    return todayLogs.reduce((acc, log) => {
      if (!acc[log.mealType]) {
        acc[log.mealType] = { items: [], totalCalories: 0 };
      }

      acc[log.mealType].items.push(log);
      acc[log.mealType].totalCalories += log.calories;
      return acc;
    }, {} as Record<string, { items: FoodEntry[]; totalCalories: number }>);
  }, [todayLogs]);

  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);

  const handleQuickAdd = (mealType: string) => {
    setFormData((current) => ({ ...current, mealType }));
    setShowForm(true);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
        toast.error(data.error || "Failed to analyze image");
        return;
      }

      await addFoodEntry({
        name: data.result.name,
        calories: data.result.calories,
        mealType: getMealTypeFromHour(new Date().getHours()),
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name || !formData.calories) {
      toast.error("Please fill in all fields");
      return;
    }

    const calories = Number(formData.calories);
    if (Number.isNaN(calories) || calories <= 0) {
      toast.error("Please enter a valid calorie amount");
      return;
    }

    await addFoodEntry({
      name: formData.name,
      calories,
      mealType: formData.mealType,
    });

    setFormData({ name: "", calories: "", mealType: "breakfast" });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      await removeFoodEntry(id);
    }
  };

  if (!isUserFetched || !user) {
    return <Loading fullScreen text="Loading..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Food Log
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your daily intake
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Today&apos;s total
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalCalories}
            <span className="text-sm text-gray-500 ml-1">cal</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Add</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActivitiesFoodLog.map((item) => (
                  <Button
                    key={item.name}
                    variant="secondary"
                    onClick={() => handleQuickAdd(item.name.toLowerCase())}
                  >
                    <span className="mr-2">{item.emoji}</span>
                    {item.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Food Snap</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="primary"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Snap a Photo
                  </>
                )}
              </Button>
              <p className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
                Upload a food photo and FitTrack will estimate the calories.
              </p>
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowForm((current) => !current)}
            className="border-2 border-dashed border-gray-300 dark:border-slate-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            {showForm ? "Cancel" : "Add Food Manually"}
          </Button>

          {showForm && (
            <Card className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Add Food Entry</CardTitle>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Food Name"
                    type="text"
                    placeholder="e.g. Grilled Chicken Salad"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Calories"
                    type="number"
                    min={1}
                    placeholder="e.g. 350"
                    value={formData.calories}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        calories: event.target.value,
                      }))
                    }
                  />
                  <Select
                    label="Meal Type"
                    options={mealTypeOptions}
                    value={formData.mealType}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        mealType: event.target.value,
                      }))
                    }
                  />
                  <Button type="submit" variant="primary" fullWidth>
                    Add Entry
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Today&apos;s Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(groupedLogs).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-4">🍽️</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    No food logged today
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Start by adding your first meal.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {mealTypeOptions.map(({ value }) => {
                    const group = groupedLogs[value];
                    if (!group) return null;

                    return (
                      <div key={value}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{mealIcons[value]}</span>
                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                              {value}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {group.totalCalories} cal
                          </span>
                        </div>

                        <div className="space-y-2">
                          {group.items.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between p-3 rounded-lg ${mealColors[value]}`}
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm opacity-80">
                                  {item.calories} calories
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="p-2 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
