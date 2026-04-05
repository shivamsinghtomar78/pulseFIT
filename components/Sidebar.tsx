"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UtensilsCrossed,
  Dumbbell,
  User,
  PersonStanding,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/context/theme-context";

const navItems = [
  { path: "/dashboard", label: "Home", icon: Home },
  { path: "/food", label: "Food", icon: UtensilsCrossed },
  { path: "/activity", label: "Activity", icon: Dumbbell },
  { path: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 fixed left-0 top-0 z-40">
      {/* Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <PersonStanding className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            FitTrack
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-5 h-5" />
              <span>Light mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              <span>Dark mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
