import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-sans",
});

export const metadata: Metadata = {
  title: "Tech Internships — Summer 2027 & Fall 2026",
  description:
    "Live-updating list of tech internships, scraped from companies' own public job boards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plexSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
