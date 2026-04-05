"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Scale, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { useAppContext } from "@/context/app-context";
import { goalOptions, getDefaultCalories } from "@/assets/data";
import { ProfileFormData } from "@/types";

const steps = [
  { number: 1, title: "How old are you?", icon: User },
  { number: 2, title: "Your measurements", icon: Scale },
  { number: 3, title: "What's your goal?", icon: Target },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isUserFetched, onboardingCompleted, updateUserProfile } =
    useAppContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState<number | null>(170);
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("maintain");
  const [dailyCalorieIntake, setDailyCalorieIntake] = useState(2000);
  const [dailyCalorieBurn, setDailyCalorieBurn] = useState(400);

  // Update calorie defaults when goal changes
  useEffect(() => {
    const defaults = getDefaultCalories(age, goal);
    setDailyCalorieIntake(defaults.intake);
    setDailyCalorieBurn(defaults.burn);
  }, [goal, age]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserFetched) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (onboardingCompleted) {
      router.replace("/dashboard");
    }
  }, [user, isUserFetched, onboardingCompleted, router]);

  useEffect(() => {
    if (!user) return;

    if (user.age > 0) {
      setAge(user.age);
    }

    if (user.weight > 0) {
      setWeight(user.weight);
    }

    if (user.height) {
      setHeight(user.height);
    }

    if (user.goal) {
      setGoal(user.goal);
    }
  }, [user]);

  if (!isUserFetched || !user) {
    return <Loading fullScreen text="Loading..." />;
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return age >= 13 && age <= 120;
      case 2:
        return weight >= 20 && weight <= 300;
      case 3:
        return goal !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    const profileData: ProfileFormData = {
      age,
      weight,
      height,
      goal,
      dailyCalorieIntake,
      dailyCalorieBurn,
    };

    try {
      await updateUserProfile(profileData);
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentIcon = steps[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center ${
                  step.number === steps.length ? "" : "flex-1"
                }`}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-colors duration-300
                    ${
                      step.number <= currentStep
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                    }
                  `}
                >
                  {step.number}
                </div>
                {step.number < steps.length && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 transition-colors duration-300
                      ${
                        step.number < currentStep
                          ? "bg-emerald-500"
                          : "bg-gray-200 dark:bg-slate-700"
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>

          <ProgressBar
            value={currentStep}
            max={3}
            showPercentage={false}
            className="mb-2"
          />
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-4">
                <CurrentIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Step {currentStep} of 3
              </p>
            </div>

            <div className="space-y-6">
              {/* Step 1: Age */}
              {currentStep === 1 && (
                <div className="max-w-sm mx-auto">
                  <Input
                    label="Age"
                    type="number"
                    min={13}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    helperText="Must be between 13 and 120 years"
                  />
                </div>
              )}

              {/* Step 2: Measurements */}
              {currentStep === 2 && (
                <div className="max-w-sm mx-auto space-y-4">
                  <Input
                    label="Weight (kg)"
                    type="number"
                    min={20}
                    max={300}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    helperText="Your weight in kilograms"
                  />
                  <Input
                    label="Height (cm) - Optional"
                    type="number"
                    min={100}
                    max={250}
                    value={height || ""}
                    onChange={(e) =>
                      setHeight(e.target.value ? Number(e.target.value) : null)
                    }
                    helperText="Your height in centimeters (used for BMI calculation)"
                  />
                </div>
              )}

              {/* Step 3: Goal */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Select
                    label="Fitness Goal"
                    options={goalOptions}
                    value={goal}
                    onChange={(e) =>
                      setGoal(e.target.value as "lose" | "maintain" | "gain")
                    }
                  />

                  <Slider
                    label="Daily Calorie Intake"
                    min={1200}
                    max={4000}
                    step={50}
                    value={dailyCalorieIntake}
                    onChange={setDailyCalorieIntake}
                    unit="cal"
                    infoText="Target calories to consume per day"
                  />

                  <Slider
                    label="Daily Calorie Burn Goal"
                    min={100}
                    max={2000}
                    step={50}
                    value={dailyCalorieBurn}
                    onChange={setDailyCalorieBurn}
                    unit="cal"
                    infoText="Target calories to burn through activity per day"
                  />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!validateStep() || isSubmitting}
                isLoading={isSubmitting}
              >
                {currentStep === 3 ? (
                  <>
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
