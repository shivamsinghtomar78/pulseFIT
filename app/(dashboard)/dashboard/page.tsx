"use client";

import React, { useMemo } from "react";
import { TrendingUp, Clock, Zap, Calendar, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CaloriesChart } from "@/components/ui/CaloriesChart";
import { Loading } from "@/components/ui/Loading";
import { useAppContext } from "@/context/app-context";
import {
  getMotivationalMessage,
  isToday,
  calculateBMI,
  getBMICategory,
} from "@/assets/data";

const weeklyData = [
  { day: "Mon", intake: 2100, burn: 450 },
  { day: "Tue", intake: 1950, burn: 380 },
  { day: "Wed", intake: 2300, burn: 520 },
  { day: "Thu", intake: 2000, burn: 410 },
  { day: "Fri", intake: 2200, burn: 480 },
  { day: "Sat", intake: 2500, burn: 350 },
  { day: "Sun", intake: 1800, burn: 500 },
];

export default function DashboardPage() {
  const { user, allFoodLogs, allActivityLogs, isUserFetched } = useAppContext();

  const todayStats = useMemo(() => {
    const todayFood = allFoodLogs.filter((log) => isToday(log.createdAt));
    const todayActivities = allActivityLogs.filter((log) =>
      isToday(log.createdAt)
    );

    const totalCalories = todayFood.reduce((sum, log) => sum + log.calories, 0);
    const totalBurned = todayActivities.reduce(
      (sum, log) => sum + log.calories,
      0
    );
    const totalMinutes = todayActivities.reduce(
      (sum, log) => sum + log.duration,
      0
    );

    return {
      totalCalories,
      totalBurned,
      totalMinutes,
      foodCount: todayFood.length,
      activityCount: todayActivities.length,
    };
  }, [allFoodLogs, allActivityLogs]);

  const motivationalMessage = useMemo(() => {
    if (!user) return { emoji: "👋", text: "Welcome to FitTrack!" };
    return getMotivationalMessage(
      todayStats.totalCalories,
      todayStats.totalMinutes,
      user.dailyCalorieIntake
    );
  }, [todayStats, user]);

  const bmi = useMemo(() => {
    if (!user) return null;
    return calculateBMI(user.weight, user.height);
  }, [user]);

  const bmiCategory = useMemo(() => {
    if (!bmi) return null;
    return getBMICategory(bmi);
  }, [bmi]);

  if (!isUserFetched || !user) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  const remainingCalories = user.dailyCalorieIntake - todayStats.totalCalories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {motivationalMessage.emoji} {motivationalMessage.text}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              Daily Calories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {todayStats.totalCalories}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Consumed
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {todayStats.totalBurned}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Burned
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`text-2xl font-bold ${
                    remainingCalories < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {Math.abs(remainingCalories)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {remainingCalories < 0 ? "Over" : "Remaining"}
                </p>
              </div>
            </div>

            <ProgressBar
              label="Calorie Intake Progress"
              value={todayStats.totalCalories}
              max={user.dailyCalorieIntake}
              color="bg-emerald-500"
              showPercentage={true}
            />

            <ProgressBar
              label="Calorie Burn Progress"
              value={todayStats.totalBurned}
              max={user.dailyCalorieBurn}
              color="bg-amber-500"
              showPercentage={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Active Minutes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {todayStats.totalMinutes}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              minutes today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Your Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
              {user.goal === "lose"
                ? "Lose Weight"
                : user.goal === "gain"
                ? "Gain Muscle"
                : "Maintain Weight"}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {user.goal === "lose"
                ? "Focus on a steady deficit and consistent activity."
                : user.goal === "gain"
                ? "Focus on fueling well and training consistently."
                : "Keep intake and activity balanced for steady health."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-pink-500" />
              Body Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Weight</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.weight} kg
                </span>
              </div>
              {user.height && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Height
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user.height} cm
                  </span>
                </div>
              )}
              {bmi && (
                <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">BMI</span>
                    <div className="text-right">
                      <span
                        className={`font-bold text-lg ${bmiCategory?.color}`}
                      >
                        {bmi}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {bmiCategory?.label}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500"
                      style={{
                        background:
                          "linear-gradient(to right, #3b82f6 0%, #3b82f6 18.5%, #10b981 18.5%, #10b981 25%, #f59e0b 25%, #f59e0b 30%, #ef4444 30%)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Today&apos;s Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Meals Logged
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {todayStats.foodCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Activities Logged
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {todayStats.activityCount}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Active Time
                  </span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {todayStats.totalMinutes} min
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <CaloriesChart data={weeklyData} />
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Intake
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Burned
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
