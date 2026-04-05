import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardGate } from "@/components/DashboardGate";
import { getServerSessionUser } from "@/lib/server/firebase-auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const sessionUser = await getServerSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  return <DashboardGate>{children}</DashboardGate>;
}
