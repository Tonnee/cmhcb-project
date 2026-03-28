import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
