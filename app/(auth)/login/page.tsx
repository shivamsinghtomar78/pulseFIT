"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  PersonStanding,
  Chrome,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/utils";

const quotes = [
  "'Lost 8kg in 3 months just by being consistent with logging.' - Arjun M.",
  "'The AI food snap changed how I think about meals.' - Priya K.",
  "'Finally a tracker that doesn't feel like homework.' - Dev S.",
];

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (/[A-Z]/.test(password) || /\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 10) score += 1;
  if (password.length >= 12) score += 1;
  return Math.min(score, 4);
}

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, loginWithGoogle, user, isUserFetched, onboardingCompleted } =
    useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotes.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isUserFetched || !user) {
      return;
    }

    router.replace(onboardingCompleted ? "/dashboard" : "/onboarding");
  }, [isUserFetched, onboardingCompleted, router, user]);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!isLogin && !username.trim()) {
      nextErrors.username = "Username is required";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = (nextMode: boolean) => {
    setIsLogin(nextMode);
    setErrors({});
    setUsername("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setIsSuccess(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await signup({ username, email, password });
      }

      setIsSuccess(true);
      window.setTimeout(() => {
        setIsSuccess(false);
      }, 600);
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleSubmitting(true);

    try {
      await loginWithGoogle();
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[0.42fr_0.58fr]">
      <aside className="noise-bg relative hidden overflow-hidden bg-ink-primary p-10 text-ink-inverted lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--accent-glow),transparent_28%)]" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pulse text-white shadow-[0_10px_30px_var(--accent-glow)]">
            <PersonStanding className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold">PulseFit</p>
            <p className="text-xs uppercase tracking-[0.18em] text-[#9ea296]">
              Track every rep
            </p>
          </div>
        </div>

        <div className="relative mt-auto max-w-md pb-12">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-pulse dark:bg-white/5">
            <Quote className="h-5 w-5" />
          </span>
          <div className="mt-6 min-h-[9rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45 }}
                className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] text-ink-inverted"
              >
                {quotes[quoteIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex gap-2">
            {quotes.map((quote, index) => (
              <button
                key={quote}
                type="button"
                aria-label={`Show quote ${index + 1}`}
                onClick={() => setQuoteIndex(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  quoteIndex === index
                    ? "w-8 bg-pulse"
                    : "w-2.5 bg-black/10 dark:bg-white/20"
                )}
              />
            ))}
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="rounded-full border border-border bg-bg-surface p-1 shadow-sm">
            <div className="grid grid-cols-2">
              {[
                { label: "Sign in", value: true },
                { label: "Create account", value: false },
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => resetForm(tab.value)}
                  className={cn(
                    "relative rounded-full px-4 py-3 text-sm font-medium transition-colors",
                    isLogin === tab.value ? "text-ink-inverted" : "text-ink-secondary hover:text-ink-primary"
                  )}
                >
                  {isLogin === tab.value ? (
                    <motion.span
                      layoutId="auth-mode"
                      className="absolute inset-0 rounded-full bg-ink-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  ) : null}
                  <span className="relative">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h1 className="font-display text-4xl font-bold text-ink-primary">
              {isLogin ? "Welcome back" : "Join PulseFit"}
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">
              {isLogin
                ? "Step back into your routine with one focused dashboard."
                : "Create your account and start seeing progress in the numbers."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <AnimatePresence initial={false}>
              {!isLogin ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: -8, height: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Input
                    label="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="How should we call you?"
                    error={errors.username}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              leading={<Mail className="h-4 w-4" />}
              error={errors.email}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                error={errors.password}
                trailing={
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((current) => !current)}
                    className="rounded-full p-1 transition-transform duration-200 hover:bg-black/5"
                  >
                    <motion.span
                      animate={{ rotate: showPassword ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="block"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </motion.span>
                  </button>
                }
              />
              {!isLogin ? (
                <div className="mt-3">
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <motion.span
                        key={index}
                        layout
                        className={cn(
                          "h-2 rounded-full bg-bg-sunken",
                          passwordStrength > index &&
                            [
                              "bg-red-400",
                              "bg-orange-400",
                              "bg-yellow-400",
                              "bg-pulse",
                            ][index]
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-ink-tertiary">
                    Use at least 6 characters. Longer and more varied is better.
                  </p>
                </div>
              ) : null}
            </div>

            <motion.div
              animate={{
                scale: isSuccess ? 1.01 : 1,
              }}
              className="pt-2"
            >
              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isSubmitting}
                loadingText="Hold on..."
                className={cn(
                  "text-base",
                  isSuccess && "bg-pulse-hover",
                  isSubmitting && "opacity-80"
                )}
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Done!
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Hold on...
                  </>
                ) : isLogin ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
            </motion.div>
          </form>

          <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-ink-tertiary">
            <span className="hairline" />
            or continue with
            <span className="hairline" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting || isGoogleSubmitting}
            className={cn(
              "flex w-full items-center justify-center gap-3 rounded-full border border-border bg-bg-sunken px-6 py-3 text-sm font-medium text-ink-primary transition-colors hover:bg-bg-surface",
              (isSubmitting || isGoogleSubmitting) && "cursor-not-allowed opacity-70"
            )}
          >
            {isGoogleSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting to Google...
              </>
            ) : (
              <>
                <Chrome className="h-4 w-4" />
                Continue with Google
              </>
            )}
          </button>
        </motion.div>
      </section>
    </div>
  );
}
