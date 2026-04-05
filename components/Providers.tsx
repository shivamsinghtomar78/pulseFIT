"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/theme-context";
import { AppProvider } from "@/context/app-context";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeEnter } from "@/lib/motion";

function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={
          prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
        }
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.4,
          ease: easeEnter,
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouteTransition>{children}</RouteTransition>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--bg-surface)",
              color: "var(--ink-primary)",
              border: "1px solid var(--border-default)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-lg)",
              fontSize: "14px",
              fontFamily: "var(--font-jakarta)",
            },
            success: {
              iconTheme: {
                primary: "var(--accent)",
                secondary: "var(--bg-base)",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "var(--bg-base)",
              },
            },
          }}
        />
      </AppProvider>
    </ThemeProvider>
  );
}
