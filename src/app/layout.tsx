import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DigieKnowledge — AI-Powered EdTech Platform",
  description:
    "Master SDET, Full Stack Development, Data Science & Cyber Security with AI-powered learning. Join 10,000+ professionals transforming their careers.",
  keywords:
    "SDET, Full Stack Development, Data Science, Cyber Security, AI Learning, EdTech, Online Courses",
  openGraph: {
    title: "DigieKnowledge — AI-Powered EdTech Platform",
    description:
      "Master SDET, Full Stack Development, Data Science & Cyber Security with AI-powered learning.",
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
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#080808] text-[#F0F0F0] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
