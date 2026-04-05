"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Moon, PersonStanding, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-border-subtle bg-bg-surface lg:flex"
    >
      <div className="border-b border-border-subtle p-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pulse text-white shadow-[0_10px_24px_var(--accent-glow)]">
            <PersonStanding className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink-primary">
              PulseFit
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-ink-tertiary">
              Daily companion
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "text-pulse"
                  : "text-ink-secondary hover:bg-bg-sunken hover:text-ink-primary"
              )}
            >
              {isActive ? (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-pulse-light"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              ) : null}
              <span className="relative flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </span>
              {isActive ? (
                <motion.span
                  layoutId="nav-active-bar"
                  className="absolute right-3 h-5 w-1 rounded-full bg-pulse"
                />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border-subtle p-3">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-ink-secondary transition-all hover:bg-bg-sunken hover:text-ink-primary"
        >
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-sunken"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-warning" />
            ) : (
              <Moon className="h-5 w-5 text-pulse" />
            )}
          </motion.span>
          <span className="text-sm font-medium">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>
      </div>
    </motion.aside>
  );
}
