import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settingsRaw = await prisma.siteSetting.findMany({
    where: { key: { in: ["defaultSeoTitle", "defaultSeoDescription", "brandName", "tagline", "websiteDescription"] } }
  });
  const settings = Object.fromEntries(settingsRaw.map(s => [s.key, s.value]));
  
  return {
    title: settings.defaultSeoTitle || `${settings.brandName || "Ceylon Elite Tours"} | ${settings.tagline || "Discover Sri Lanka. Travel Exceptionally."}`,
    description: settings.defaultSeoDescription || settings.websiteDescription || "Private journeys, thoughtfully planned around the places, experiences and moments that make Sri Lanka unforgettable.",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
