import {
  AgeRange,
  GoalOption,
  MealTypeOption,
  MotivationalMessage,
  QuickActivity,
  QuickFoodActivity,
} from "@/types";

export const quickActivitiesFoodLog: QuickFoodActivity[] = [
  { name: "Breakfast", emoji: "🌅" },
  { name: "Lunch", emoji: "☀️" },
  { name: "Dinner", emoji: "🌙" },
  { name: "Snack", emoji: "🍎" },
];

export const quickActivities: QuickActivity[] = [
  { name: "Running", emoji: "🏃", rate: 10 },
  { name: "Cycling", emoji: "🚴", rate: 8 },
  { name: "Swimming", emoji: "🏊", rate: 9 },
  { name: "Yoga", emoji: "🧘", rate: 4 },
  { name: "Weight Training", emoji: "🏋️", rate: 7 },
  { name: "Walking", emoji: "🚶", rate: 5 },
  { name: "Dancing", emoji: "💃", rate: 6 },
  { name: "Basketball", emoji: "🏀", rate: 8 },
];

export const goalOptions: GoalOption[] = [
  { label: "Lose Weight", value: "lose" },
  { label: "Maintain Weight", value: "maintain" },
  { label: "Gain Muscle", value: "gain" },
];

export const mealTypeOptions: MealTypeOption[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
];

export const goalLabels: Record<string, string> = {
  lose: "Lose Weight",
  maintain: "Maintain Weight",
  gain: "Gain Muscle",
};

export const mealIcons: Record<string, string> = {
  breakfast: "Sun",
  lunch: "UtensilsCrossed",
  dinner: "Moon",
  snack: "Apple",
};

export const mealColors: Record<string, string> = {
  breakfast:
    "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  lunch: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  dinner: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  snack:
    "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
};

export const ageRanges: AgeRange[] = [
  { max: 17, maintain: 2000, burn: 400 },
  { max: 30, maintain: 2200, burn: 450 },
  { max: 50, maintain: 2000, burn: 400 },
  { max: 70, maintain: 1800, burn: 350 },
  { max: 120, maintain: 1600, burn: 300 },
];

export function getDefaultCalories(
  age: number,
  goal: "lose" | "maintain" | "gain"
): { intake: number; burn: number } {
  const range =
    ageRanges.find((candidate) => age <= candidate.max) ??
    ageRanges[ageRanges.length - 1];

  if (goal === "lose") {
    return {
      intake: range.maintain - 400,
      burn: range.burn + 100,
    };
  }

  if (goal === "gain") {
    return {
      intake: range.maintain + 500,
      burn: range.burn - 100,
    };
  }

  return {
    intake: range.maintain,
    burn: range.burn,
  };
}

export function getMotivationalMessage(
  caloriesConsumed: number,
  activeMinutes: number,
  dailyLimit: number
): MotivationalMessage {
  const remaining = dailyLimit - caloriesConsumed;

  if (caloriesConsumed === 0) {
    return {
      emoji: "🌟",
      text: "Start your day strong! Log your first meal.",
    };
  }

  if (remaining < 0) {
    return {
      emoji: "⚠️",
      text: "You've exceeded your goal. A little extra activity can help balance it out.",
    };
  }

  if (remaining < dailyLimit * 0.1) {
    return {
      emoji: "🔥",
      text: "You're close to your limit. Make your next choice count.",
    };
  }

  if (activeMinutes >= 60) {
    return {
      emoji: "💪",
      text: "Amazing activity level today. Keep that momentum going.",
    };
  }

  if (caloriesConsumed > dailyLimit * 0.7) {
    return {
      emoji: "👍",
      text: "Great progress so far. Stay mindful of your remaining calories.",
    };
  }

  return {
    emoji: "✨",
    text: "You're doing great. Keep tracking to stay on course.",
  };
}

export function formatDate(timestamp: string | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function isToday(timestamp: string): boolean {
  const date = new Date(timestamp);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function calculateBMI(weight: number, height: number | null): number | null {
  if (!height || height <= 0) return null;

  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getBMICategory(bmi: number): {
  label: string;
  color: string;
} {
  if (bmi < 18.5) {
    return { label: "Underweight", color: "text-blue-500" };
  }

  if (bmi < 25) {
    return { label: "Healthy", color: "text-green-500" };
  }

  if (bmi < 30) {
    return { label: "Overweight", color: "text-orange-500" };
  }

  return { label: "Obese", color: "text-red-500" };
}

export function getMealTypeFromHour(
  hour: number
): "breakfast" | "lunch" | "dinner" | "snack" {
  if (hour >= 0 && hour <= 11) return "breakfast";
  if (hour >= 12 && hour <= 15) return "lunch";
  if (hour >= 16 && hour <= 17) return "snack";
  return "dinner";
}
