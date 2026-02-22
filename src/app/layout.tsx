import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Trak - Simple Nutrition Tracking",
  description: "Simple nutrition tracking for busy people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${manrope.variable} flex min-h-screen justify-center font-display antialiased bg-slate-200 dark:bg-slate-900`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
