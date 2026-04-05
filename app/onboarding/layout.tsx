import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSessionUser } from "@/lib/server/firebase-auth";

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const sessionUser = await getServerSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  return children;
}
