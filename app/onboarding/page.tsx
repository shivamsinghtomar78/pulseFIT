"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  PersonStanding,
  Rocket,
  Scale,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { useAppContext } from "@/context/app-context";
import { Loading } from "@/components/ui/Loading";
import { getDefaultCalories } from "@/assets/data";
import { ProfileFormData } from "@/types";
import { cn } from "@/lib/utils";

const goalCards = [
  {
    value: "lose" as const,
    title: "Lose weight",
    body: "Calorie deficit to shed fat steadily",
    tag: "Popular",
    icon: TrendingDown,
  },
  {
    value: "maintain" as const,
    title: "Stay balanced",
    body: "Maintenance calories for steady energy",
    icon: Scale,
  },
  {
    value: "gain" as const,
    title: "Build muscle",
    body: "Calorie surplus to support strength",
    icon: TrendingUp,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isUserFetched, onboardingCompleted, updateUserProfile } =
    useAppContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [age, setAge] = useState("25");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [weightInput, setWeightInput] = useState("70");
  const [weightKg, setWeightKg] = useState(70);
  const [height, setHeight] = useState("170");
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain" | null>(
    "maintain"
  );
  const [dailyCalorieIntake, setDailyCalorieIntake] = useState(2000);
  const [dailyCalorieBurn, setDailyCalorieBurn] = useState(400);

  useEffect(() => {
    if (!isUserFetched) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (onboardingCompleted) {
      router.replace("/dashboard");
    }
  }, [isUserFetched, onboardingCompleted, router, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.age > 0) {
      setAge(String(user.age));
    }

    if (user.weight > 0) {
      setWeightKg(user.weight);
      setWeightInput(String(user.weight));
    }

    if (user.height) {
      setHeight(String(user.height));
    }

    if (user.goal) {
      setGoal(user.goal);
    }
  }, [user]);

  useEffect(() => {
    const numericAge = Number(age);
    if (!numericAge || !goal) {
      return;
    }

    const defaults = getDefaultCalories(numericAge, goal);
    setDailyCalorieIntake(defaults.intake);
    setDailyCalorieBurn(defaults.burn);
  }, [age, goal]);

  const ageNumber = Number(age);
  const heightNumber = height ? Number(height) : null;
  const netCalories = dailyCalorieIntake - dailyCalorieBurn;

  const validationMessage = useMemo(() => {
    if (!showValidation) {
      return "";
    }

    if (currentStep === 1 && (ageNumber < 13 || ageNumber > 120)) {
      return "Please enter a valid age (13-120)";
    }

    if (currentStep === 2 && (!weightKg || weightKg < 20 || weightKg > 300)) {
      return "Please enter a valid weight before continuing";
    }

    if (currentStep === 3 && !goal) {
      return "Choose a goal so we can personalise your targets";
    }

    return "";
  }, [ageNumber, currentStep, goal, showValidation, weightKg]);

  const canContinue =
    (currentStep === 1 && ageNumber >= 13 && ageNumber <= 120) ||
    (currentStep === 2 && weightKg >= 20 && weightKg <= 300) ||
    (currentStep === 3 && Boolean(goal));

  const goToStep = (nextStep: number) => {
    setShowValidation(false);
    setDirection(nextStep > currentStep ? 1 : -1);
    setCurrentStep(nextStep);
  };

  const handleWeightChange = (value: string) => {
    setWeightInput(value);
    const numericValue = Number(value);
    if (Number.isNaN(numericValue) || numericValue <= 0) {
      return;
    }

    setWeightKg(
      weightUnit === "kg"
        ? numericValue
        : Number((numericValue / 2.20462).toFixed(1))
    );
  };

  const handleUnitChange = (nextUnit: "kg" | "lbs") => {
    if (nextUnit === weightUnit) {
      return;
    }

    const convertedValue = nextUnit === "kg" ? weightKg : weightKg * 2.20462;

    setWeightUnit(nextUnit);
    setWeightInput(
      `${nextUnit === "kg" ? convertedValue : convertedValue}`
        .replace(/\.0+$/, "")
        .replace(/(\.\d*[1-9])0+$/, "$1")
    );
  };

  const handleNext = async () => {
    if (!canContinue) {
      setShowValidation(true);
      return;
    }

    if (currentStep < 3) {
      goToStep(currentStep + 1);
      return;
    }

    setIsSubmitting(true);

    const payload: ProfileFormData = {
      age: ageNumber,
      weight: Number(weightKg.toFixed(1)),
      height: heightNumber,
      goal: goal ?? "maintain",
      dailyCalorieIntake,
      dailyCalorieBurn,
    };

    try {
      await updateUserProfile(payload);
      router.replace("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isUserFetched || !user) {
    return <Loading fullScreen text="Setting up your profile..." />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base">
      <div
        className={cn(
          "pointer-events-none absolute h-[32rem] w-[32rem] rounded-full blur-[120px]",
          currentStep === 1 && "left-[-10rem] top-[-8rem] bg-pulse-glow",
          currentStep === 2 && "right-[-8rem] top-[5rem] bg-orange-500/10",
          currentStep === 3 && "left-1/2 top-12 -translate-x-1/2 bg-pulse-glow"
        )}
      />
      <div className="fixed inset-x-0 top-0 z-30 h-1 bg-border-subtle">
        <motion.div
          layoutId="progress-fill"
          className="h-full bg-pulse"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>

      <div className="page-shell relative z-10 flex min-h-screen flex-col py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-ink-tertiary">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-surface text-pulse">
              <PersonStanding className="h-4 w-4" />
            </span>
            PulseFit
          </div>
          <p className="text-sm text-ink-tertiary">Step {currentStep} of 3</p>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center py-8">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                initial={{ x: direction * 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -60, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
              >
                {currentStep === 1 ? (
                  <section className="mx-auto max-w-lg text-center">
                    <div className="mb-8 flex justify-center">
                      <div className="relative flex h-32 w-32 items-center justify-center">
                        {[0, 1, 2].map((ring) => (
                          <motion.span
                            key={ring}
                            className="absolute h-full w-full rounded-full border border-pulse/25"
                            animate={{ scale: [0.8, 1.45], opacity: [0.2, 0] }}
                            transition={{
                              duration: 2.4,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: ring * 0.45,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-pulse-light text-pulse">
                          <PersonStanding className="h-8 w-8" />
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pulse">
                      Step 1 - Just you
                    </p>
                    <h1 className="mt-4 font-display text-5xl font-bold text-ink-primary">
                      How old are you?
                    </h1>
                    <p className="mt-3 text-lg text-ink-secondary">
                      We use this to calibrate your calorie recommendations.
                    </p>
                    <div className="mt-12">
                      <input
                        type="number"
                        min={13}
                        max={120}
                        value={age}
                        onChange={(event) => setAge(event.target.value)}
                        className="w-40 border-b-2 border-border-strong bg-transparent pb-3 text-center font-mono text-7xl outline-none transition-colors duration-200 focus:border-pulse"
                      />
                      <p className="mt-3 text-sm text-ink-tertiary">years</p>
                    </div>
                  </section>
                ) : null}

                {currentStep === 2 ? (
                  <section className="mx-auto max-w-2xl">
                    <div className="mb-8 flex justify-center">
                      <motion.div
                        animate={{ rotate: [-2, 2, -2] }}
                        transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
                        className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-bg-surface text-pulse shadow-sm"
                      >
                        <Scale className="h-9 w-9" />
                      </motion.div>
                    </div>
                    <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-pulse">
                      Step 2 - Your measurements
                    </p>
                    <h1 className="mt-4 text-center font-display text-5xl font-bold text-ink-primary">
                      Body details
                    </h1>
                    <div className="mt-10 grid gap-8 md:grid-cols-2">
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-secondary">
                            Weight
                          </label>
                          <div className="rounded-full border border-border bg-bg-surface p-1">
                            {(["kg", "lbs"] as const).map((unit) => (
                              <button
                                key={unit}
                                type="button"
                                onClick={() => handleUnitChange(unit)}
                                className={cn(
                                  "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] transition-colors",
                                  weightUnit === unit
                                    ? "bg-ink-primary text-ink-inverted"
                                    : "text-ink-secondary"
                                )}
                              >
                                {unit}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input
                          type="number"
                          value={weightInput}
                          onChange={(event) => handleWeightChange(event.target.value)}
                          className="w-full border-b-2 border-border-strong bg-transparent pb-3 font-mono text-5xl outline-none transition-colors focus:border-pulse"
                        />
                        <p className="mt-3 text-sm text-ink-tertiary">
                          Enter the weight you want us to use for calorie targets.
                        </p>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="mb-4 flex items-center gap-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-secondary">
                            Height
                          </label>
                          <span className="rounded-full bg-pulse-light px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-pulse">
                            Optional
                          </span>
                        </div>
                        <input
                          type="number"
                          value={height}
                          onChange={(event) => setHeight(event.target.value)}
                          className="w-full border-b-2 border-border-strong bg-transparent pb-3 font-mono text-5xl outline-none transition-colors focus:border-pulse"
                        />
                        <p className="mt-3 text-sm text-ink-tertiary">cm</p>
                      </motion.div>
                    </div>
                  </section>
                ) : null}

                {currentStep === 3 ? (
                  <section className="mx-auto max-w-4xl">
                    <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-pulse">
                      Step 3 - Your why
                    </p>
                    <h1 className="mt-4 text-center font-display text-5xl font-bold text-ink-primary">
                      What&apos;s your goal?
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-ink-secondary">
                      We&apos;ll personalise your daily targets based on your age and this
                      goal.
                    </p>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1 } },
                      }}
                      className="mt-10 grid gap-4 md:grid-cols-3"
                    >
                      {goalCards.map((card) => {
                        const Icon = card.icon;
                        const isSelected = goal === card.value;

                        return (
                          <motion.button
                            key={card.value}
                            type="button"
                            onClick={() => setGoal(card.value)}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "rounded-2xl border-2 p-6 text-center transition-all duration-200",
                              isSelected
                                ? "border-pulse bg-pulse-light shadow-[0_0_0_4px_var(--accent-glow)]"
                                : "border-border bg-bg-surface hover:-translate-y-1 hover:border-border-strong hover:shadow-md"
                            )}
                          >
                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-base text-pulse">
                              <Icon className="h-6 w-6" />
                            </span>
                            <div className="mt-4 flex items-center justify-center gap-2">
                              <h3 className="text-lg font-semibold text-ink-primary">
                                {card.title}
                              </h3>
                              {card.tag ? (
                                <span className="rounded-full bg-bg-base px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-pulse">
                                  {card.tag}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 text-sm leading-6 text-ink-secondary">
                              {card.body}
                            </p>
                          </motion.button>
                        );
                      })}
                    </motion.div>

                    <AnimatePresence>
                      {goal ? (
                        <motion.div
                          initial={{ opacity: 0, y: 16, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: 16, height: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-10 rounded-[2rem] border border-border bg-bg-surface p-6 shadow-sm">
                            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-ink-secondary">
                              Your daily targets
                            </p>
                            <div className="space-y-8">
                              <Slider
                                label="Calorie intake"
                                min={1200}
                                max={4000}
                                step={50}
                                value={dailyCalorieIntake}
                                onChange={setDailyCalorieIntake}
                                unit="kcal"
                              />
                              <Slider
                                label="Calorie burn target"
                                min={100}
                                max={2000}
                                step={50}
                                value={dailyCalorieBurn}
                                onChange={setDailyCalorieBurn}
                                unit="kcal"
                              />
                            </div>
                            <div className="mt-8 rounded-2xl border border-border bg-bg-base p-5">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">
                                Live preview
                              </p>
                              <p className="mt-3 font-mono text-3xl text-ink-primary">
                                {netCalories.toLocaleString()} kcal/day
                              </p>
                              <div className="mt-3 inline-flex items-center rounded-full bg-pulse-light px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-pulse">
                                {netCalories >= 0 ? "Deficit / maintenance leaning" : "Surplus"}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </section>
                ) : null}
              </motion.div>
            </AnimatePresence>

            {validationMessage ? (
              <p className="mt-6 text-center text-sm text-danger">{validationMessage}</p>
            ) : null}

            <div className="mt-10 flex items-center justify-between">
              <AnimatePresence>
                {currentStep > 1 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                  >
                    <Button variant="ghost" onClick={() => goToStep(currentStep - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                  </motion.div>
                ) : (
                  <div />
                )}
              </AnimatePresence>

              <Button
                size="lg"
                onClick={handleNext}
                isLoading={isSubmitting}
                loadingText="Setting up your account..."
                className="text-base"
              >
                {currentStep === 3 ? (
                  <>
                    Start my journey
                    <Rocket className="h-4 w-4 transition-transform duration-150 group-hover:rotate-45" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
