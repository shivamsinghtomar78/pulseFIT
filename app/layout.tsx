import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-fraunces",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jakarta",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "PulseFit - Track every rep. Fuel every goal.",
  description:
    "AI-powered fitness tracker. Log meals with a photo, track activities, and monitor your calorie balance with PulseFit.",
  openGraph: {
    title: "PulseFit - Track every rep. Fuel every goal.",
    description:
      "AI-powered fitness tracker. Log meals with a photo, track activities, and monitor your calorie balance.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#16A34A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${jakarta.variable} ${jetbrains.variable} font-body`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
