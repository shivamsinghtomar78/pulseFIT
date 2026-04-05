"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";
import { Loading } from "@/components/ui/Loading";
import { useAppContext } from "@/context/app-context";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, isUserFetched, onboardingCompleted } = useAppContext();

  useEffect(() => {
    if (!isUserFetched) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [isUserFetched, onboardingCompleted, router, user]);

  if (!isUserFetched) {
    return <Loading fullScreen text="Checking your session..." />;
  }

  if (!user || !onboardingCompleted) {
    return <Loading fullScreen text="Preparing your dashboard..." />;
  }

  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-bg-base pb-24 lg:ml-[260px] lg:pb-0">
        <div className="editorial-grid min-h-screen">
          <div className="page-shell py-6 md:py-8 lg:py-10">{children}</div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
