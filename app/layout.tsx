import type { Metadata } from "next";
import { Marcellus, Inter } from "next/font/google";
import "./globals.css";

const display = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maveli's Trial — A Mythology CTF",
  description:
    "Step into the legendary age of Mahabali. Solve riddles, uncover hidden clues, decode ancient disguises, and complete the Three Steps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
