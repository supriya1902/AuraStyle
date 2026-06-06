import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuraStyle AI | Your Personal AI Stylist",
  description: "Upload a photo and get a personalized AI style report. Discover your style identity, color palette, and outfit ideas.",
  openGraph: {
    title: "AuraStyle AI",
    description: "Your Personal AI Stylist",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-primary/30">
          {children}
        </div>
      </body>
    </html>
  );
}
