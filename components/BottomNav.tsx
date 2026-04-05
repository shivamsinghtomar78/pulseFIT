"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border-subtle bg-bg-surface/90 px-2 backdrop-blur-md lg:hidden">
      <div className="flex h-full items-center justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 text-[10px] font-medium transition-colors duration-150",
                isActive ? "text-pulse" : "text-ink-tertiary"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="bottom-active"
                  className="absolute inset-0 rounded-xl bg-pulse-light"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              ) : null}
              <Icon className="relative h-5 w-5" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
