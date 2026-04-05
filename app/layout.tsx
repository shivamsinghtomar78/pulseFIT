import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { AppProvider } from "@/context/app-context";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitTrack - Your Daily Fitness Tracker",
  description:
    "Track your fitness journey with FitTrack. Log meals, monitor activities, set goals, and analyze food images with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider>
          <AppProvider>
            {children}
          </AppProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1e293b",
                color: "#fff",
                borderRadius: "8px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
