import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "PrepAI",
  description: "AI Interview Prep Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
