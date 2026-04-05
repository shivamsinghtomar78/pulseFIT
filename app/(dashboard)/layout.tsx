"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { Loading } from "@/components/ui/Loading";
import { useAppContext } from "@/context/app-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isUserFetched, onboardingCompleted } = useAppContext();

  useEffect(() => {
    if (!isUserFetched) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [user, isUserFetched, onboardingCompleted, router]);

  if (!isUserFetched) {
    return <Loading fullScreen text="Loading..." />;
  }

  if (!user || !onboardingCompleted) {
    return <Loading fullScreen text="Preparing your dashboard..." />;
  }

  return (
    <>
      <Sidebar />
      <main className="lg:ml-64 pb-20 lg:pb-0 min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
      <BottomNav />
    </>
  );
}
