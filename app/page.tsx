"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BarChart2,
  Camera,
  CheckCircle2,
  Dumbbell,
  Flame,
  Moon,
  PersonStanding,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppContext } from "@/context/app-context";
import {
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  scaleIn,
  staggerContainer,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    icon: Sparkles,
    title: "AI Food Snap",
    body: "Point your camera at any meal. Gemini AI recognises it instantly and logs the calories for you.",
    badge: "AI powered",
    highlight: true,
  },
  {
    icon: Flame,
    title: "Calorie Balance",
    body: "See exactly how much you've eaten versus burned, updated in real time as you log.",
  },
  {
    icon: Dumbbell,
    title: "Activity Tracking",
    body: "Quick-log common workouts or add custom activities with duration and burn rate.",
  },
  {
    icon: BarChart2,
    title: "Weekly Progress",
    body: "A clean chart of your intake vs burn across the past 7 days. Spot patterns at a glance.",
  },
  {
    icon: Target,
    title: "Goal Modes",
    body: "Lose weight, maintain, or build muscle. Calorie targets adjust automatically to your goal.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    body: "A rich dark theme built from the ground up, with warmth and contrast instead of flat inversion.",
  },
];

const testimonials = ["AM", "PK", "DS", "LR"];

export default function Home() {
  const router = useRouter();
  const { user, isUserFetched, onboardingCompleted } = useAppContext();
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isUserFetched || !user) {
      return;
    }

    router.replace(onboardingCompleted ? "/dashboard" : "/onboarding");
  }, [isUserFetched, onboardingCompleted, router, user]);

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    const target = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - target.left) / target.width - 0.5) * 30;
    const y = ((event.clientY - target.top) / target.height - 0.5) * 30;
    setPointerOffset({ x, y });
  };

  const headlineRows = useMemo(
    () => [
      { words: ["Track", "every", "rep."], accent: false },
      { words: ["Fuel", "every", "goal."], accent: true },
    ],
    []
  );

  return (
    <div className="bg-bg-base text-ink-primary">
      <section
        className="noise-bg editorial-grid relative min-h-screen overflow-hidden"
        onMouseMove={handlePointerMove}
      >
        <motion.div
          className="absolute right-[-8rem] top-[-6rem] h-[38rem] w-[38rem] rounded-full bg-pulse-glow blur-[120px]"
          animate={{ x: pointerOffset.x, y: pointerOffset.y }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
        <header className="page-shell relative z-10 flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pulse text-white shadow-[0_10px_30px_var(--accent-glow)]">
              <PersonStanding className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-black">PulseFit</p>
              <p className="text-xs uppercase tracking-[0.2em] text-ink-tertiary">
                Editorial Fitness
              </p>
            </div>
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="text-sm font-medium text-ink-secondary hover:text-ink-primary">
              Sign in
            </Link>
            <Button variant="primary" size="sm" onClick={() => router.push("/login")}>
              Start free
            </Button>
          </div>
        </header>

        <div className="page-shell relative z-10 grid min-h-[calc(100vh-88px)] items-center gap-14 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-0">
          <div className="max-w-2xl">
            <motion.div
              variants={fadeInDown}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-pulse"
            >
              <span className="h-px w-8 bg-pulse" />
              Your daily fitness companion
            </motion.div>

            <div className="mt-6 space-y-2">
              {headlineRows.map((row, rowIndex) => (
                <div
                  key={row.words.join("-")}
                  className={`flex flex-wrap gap-x-4 gap-y-2 font-display text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.95] tracking-tight ${
                    row.accent ? "text-pulse" : "text-ink-primary"
                  }`}
                >
                  {row.words.map((word, wordIndex) => (
                    <motion.span
                      key={word}
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      animate={{ clipPath: "inset(0 0% 0 0)" }}
                      transition={{
                        duration: 0.6,
                        delay: rowIndex * 0.2 + wordIndex * 0.08,
                        ease: [0, 0, 0.2, 1],
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              ))}
            </div>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary"
            >
              Log meals with AI. Track workouts. Monitor your calorie balance.
              PulseFit turns daily data into visible progress.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                onClick={() => router.push("/login")}
                className="group text-base"
              >
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="justify-start text-base sm:justify-center"
                onClick={() =>
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See how it works
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-10 flex flex-col gap-4 text-sm text-ink-secondary sm:flex-row sm:items-center"
            >
              <div className="flex -space-x-2">
                {testimonials.map((initials) => (
                  <div
                    key={initials}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-bg-base bg-bg-sunken text-[11px] font-semibold text-ink-primary"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p>2,400+ people hitting their goals with consistent daily logging.</p>
            </motion.div>
          </div>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, delay: 0.25 }}
            className="relative mx-auto w-full max-w-[34rem]"
          >
            <motion.div className="relative animate-float">
              <div className="rounded-[2rem] border border-border bg-bg-surface p-8 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">
                      Daily intake
                    </p>
                    <p className="mt-4 font-mono text-4xl font-medium text-ink-primary">
                      1,840 / 2,200
                    </p>
                    <p className="mt-2 text-sm text-ink-secondary">Calories in</p>
                  </div>
                  <div className="relative h-28 w-28">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r="46"
                        fill="none"
                        stroke="var(--border-default)"
                        strokeWidth="10"
                      />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="46"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="289"
                        initial={{ strokeDashoffset: 289 }}
                        animate={{ strokeDashoffset: 71 }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono text-xl font-semibold">360</span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-ink-tertiary">
                        Remaining
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-bg-base p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink-tertiary">
                      Meals
                    </p>
                    <p className="mt-2 font-mono text-2xl">4 logged</p>
                  </div>
                  <div className="rounded-2xl bg-bg-base p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-ink-tertiary">
                      Burn
                    </p>
                    <p className="mt-2 font-mono text-2xl">540 kcal</p>
                  </div>
                </div>
              </div>

              <motion.div
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.45, delay: 0.8 }}
                className="absolute -right-4 top-8 w-56 rotate-[3deg] rounded-[1.6rem] border border-white/40 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-bg-surface/90"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pulse-light text-pulse">
                    <Camera className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-ink-tertiary">
                      AI snap
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink-primary">
                      Pizza slice
                    </p>
                    <p className="font-mono text-lg">320 kcal</p>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-pulse-light px-3 py-1 text-xs font-semibold text-pulse">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Logged instantly
                </div>
              </motion.div>

              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.45, delay: 0.65 }}
                className="absolute -bottom-6 -left-5 w-56 -rotate-2 rounded-[1.6rem] border border-border bg-bg-surface p-4 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                    <Flame className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-ink-tertiary">
                      Activity streak
                    </p>
                    <p className="mt-1 text-lg font-semibold text-ink-primary">
                      7 day streak
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-end gap-2">
                  {[34, 52, 44, 60, 72, 64, 86].map((height, index) => (
                    <span
                      key={height}
                      className={cn(
                        "w-4 rounded-full",
                        index === 6 ? "bg-pulse" : "bg-pulse/40"
                      )}
                      style={{ height }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="features" ref={featuresRef} className="page-shell py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pulse">
            Everything you need
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.95] text-ink-primary">
            One app. Every metric
            <br />
            <span className="text-pulse">that matters.</span>
          </h2>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                  feature.highlight
                    ? "border-pulse/20 bg-pulse-light/50"
                    : "border-border bg-bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-base text-pulse shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  {feature.badge ? (
                    <span className="rounded-full bg-pulse-light px-3 py-1 text-xs font-semibold text-pulse">
                      {feature.badge}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-ink-primary">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-secondary">{feature.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <section className="bg-ink-primary py-24 text-ink-inverted md:py-32">
        <div className="page-shell grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="relative mx-auto h-[680px] w-full rounded-[3rem] border border-white/10 bg-[#0f100f] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="relative h-full rounded-[2.3rem] bg-[#141514] p-5">
                <div className="rounded-[2rem] border border-white/10 bg-[#1b1d1a] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8e9388]">
                    Upload your meal
                  </p>
                  <div className="mt-4 flex h-56 items-center justify-center rounded-[1.6rem] border border-dashed border-white/10 bg-[#11120f]">
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-pulse-light text-pulse">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-sm text-[#adb1a7]">Waiting for camera roll</p>
                    </div>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-[#20231f] p-4"
                >
                  <div className="relative h-60 rounded-[1.5rem] bg-[linear-gradient(135deg,#2b2e28,#1a1b18)]">
                    <div className="absolute inset-6 rounded-[1.4rem] bg-[linear-gradient(135deg,#c56a39,#733e24)] opacity-70" />
                    <div className="absolute inset-0 overflow-hidden rounded-[1.5rem]">
                      <div className="absolute left-0 right-0 top-0 h-0.5 animate-scan bg-[linear-gradient(90deg,transparent,var(--accent),transparent)]" />
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="absolute bottom-8 left-8 right-8 rounded-[1.6rem] border border-white/10 bg-[#11120f]/90 p-5 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8e9388]">
                        Result
                      </p>
                      <p className="mt-2 text-lg font-semibold">Chicken rice bowl</p>
                      <p className="font-mono text-2xl text-pulse">540 kcal</p>
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pulse-light text-pulse">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pulse">
              AI Food Snap
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[0.95]">
              Snap a meal.
              <br />
              Skip the data entry.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#c4c8be]">
              The AI Food Snap feature uses Google Gemini to analyse any food photo
              and return the item name and estimated calories in seconds. No barcode
              scanning. No manual searching.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#c4c8be]">
              {["Fast analysis", "Smart calorie estimate", "Built for real meals"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="page-shell py-24 md:py-32">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-bg-surface px-8 py-12 text-center shadow-sm md:px-14 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pulse">
            Free forever
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] font-black leading-[0.95]">
            Ready to move with purpose?
          </h2>
          <p className="mt-4 text-lg text-ink-secondary">
            No credit card. Start in 60 seconds and turn today into momentum.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={() => router.push("/login")} className="group text-base">
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border-subtle py-8 text-sm text-ink-tertiary">
        <div className="page-shell flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="font-display text-lg font-bold text-ink-primary">PulseFit</p>
          <p>Built with Next.js, Firebase, and Gemini.</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-ink-primary"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
