// User Types
export interface User {
  uid: string;
  username: string;
  email: string;
  age: number;
  weight: number;
  height: number | null;
  goal: "lose" | "maintain" | "gain";
  dailyCalorieIntake: number;
  dailyCalorieBurn: number;
  onboardingCompleted: boolean;
  createdAt: string;
}

// Food Entry Types
export interface FoodEntry {
  id: string;
  uid: string;
  name: string;
  calories: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  createdAt: string;
}

// Activity Entry Types
export interface ActivityEntry {
  id: string;
  uid: string;
  name: string;
  duration: number;
  calories: number;
  createdAt: string;
}

// Auth Credentials
export interface Credentials {
  username?: string;
  email: string;
  password: string;
}

// Profile Form Data
export interface ProfileFormData {
  age: number;
  weight: number;
  height: number | null;
  goal: "lose" | "maintain" | "gain";
  dailyCalorieIntake: number;
  dailyCalorieBurn: number;
}

// Form Data for Food/Activity
export interface FormData {
  name: string;
  calories: number;
  mealType?: string;
  duration?: number;
}

// Theme Context
export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Motivational Message
export interface MotivationalMessage {
  emoji: string;
  text: string;
}

// Quick Activity
export interface QuickActivity {
  name: string;
  emoji: string;
  rate: number;
}

// Quick Food Activity
export interface QuickFoodActivity {
  name: string;
  emoji: string;
}

// Goal Option
export interface GoalOption {
  label: string;
  value: "lose" | "maintain" | "gain";
}

// Meal Type Option
export interface MealTypeOption {
  label: string;
  value: "breakfast" | "lunch" | "dinner" | "snack";
}

// Age Range
export interface AgeRange {
  max: number;
  maintain: number;
  burn: number;
}
