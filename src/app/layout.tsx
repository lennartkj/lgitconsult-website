import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { PreviewProvider } from "@/components/preview/PreviewProvider";
import React, { Suspense } from 'react';
import GlitchCoreProvider from '@/components/glitch/GlitchCoreProvider';
import GlitchCoreCanvas from '@/components/glitch/GlitchCoreCanvas';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LGIT Consult — Creative Consulting & Digital Agency",
  description: "Leipzig-based creative consulting and digital agency. Technology, campaigns, and joint ventures with artists and brands.",
  keywords: ["creative consulting", "digital agency", "Leipzig", "web development", "campaign design", "photography"],
  authors: [{ name: "LGIT Consult" }],
  creator: "LGIT Consult",
  publisher: "LGIT Consult",
  formatDetection: {
    email: false,
    telephone: false,
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className="scroll-smooth">
      <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
      <Suspense fallback={null}>
      <PreviewProvider>
        {/* We wrap the entire application content with the glitch provider */}
      <GlitchCoreProvider>
          <div className="flex min-h-screen flex-col">

            <Suspense fallback={null}>
              <Navbar />
            </Suspense>

            <main className="flex-grow">
              {children}
            </main>

            <Suspense fallback={null}>
              <Footer />
            </Suspense>

          </div>
          {/* The canvas is rendered outside the main content to float over everything */}
          <GlitchCoreCanvas />
          </GlitchCoreProvider>
      </PreviewProvider>
          </Suspense>
      </body>
      </html>
  );
}