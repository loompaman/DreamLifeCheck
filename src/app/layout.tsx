import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DreamLifeCheck — See Yourself Living Luxury",
  description:
    "Upload your photo and see yourself living the luxury life — private jets, supercars, yachts, penthouses. AI-powered dream visualization.",
  keywords: "luxury lifestyle, AI photo, dream life, supercar, private jet, yacht",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "DreamLifeCheck — See Yourself Living Luxury",
    description: "Upload your photo and see yourself living the luxury life.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
