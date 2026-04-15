import type { Metadata } from "next";
import { Marcellus, DM_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import "./globals.css";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Center for Mental Health and Care, Bangladesh",
  description: "Expert mental health services including individual, family, and child therapy. Book sessions with experienced therapists and start your journey to better well-being today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${marcellus.variable} ${dmSans.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
