"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/Loading";
import { useAppContext } from "@/context/app-context";

export default function Home() {
  const router = useRouter();
  const { user, isUserFetched, onboardingCompleted } = useAppContext();

  useEffect(() => {
    if (!isUserFetched) return;

    if (user) {
      if (onboardingCompleted) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding");
      }
    } else {
      router.replace("/login");
    }
  }, [user, isUserFetched, onboardingCompleted, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading fullScreen={false} text="Loading FitTrack..." size="lg" />
    </div>
  );
}
