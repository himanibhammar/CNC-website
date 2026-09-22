import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Monumental display face used for the hero headline and section titles. */
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.missionStatement,
  openGraph: {
    title: `${BRAND.name} — ${BRAND.shortName}`,
    description: BRAND.missionStatement,
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#07090e] text-[#f2f4f8]">
        <SmoothScroll>
          <GrainOverlay />
          <Navbar />
          <div className="flex-1 w-full flex flex-col">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
