"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, Dumbbell, User } from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Home", icon: Home },
  { path: "/food", label: "Food", icon: UtensilsCrossed },
  { path: "/activity", label: "Activity", icon: Dumbbell },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex flex-col items-center justify-center flex-1 h-full
                transition-colors duration-200
                ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 mb-1 ${isActive ? "stroke-[2.5px]" : ""}`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
