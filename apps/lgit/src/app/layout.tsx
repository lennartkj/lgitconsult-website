import type { Metadata } from "next";
// Self-hosted Geist (the `geist` package bundles the font files) — no Google
// Fonts fetch at build or at runtime, so no visitor data leaves for a font CDN.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@repo/ui/globals.css";

import {
  ConditionalNavbar,
  ConditionalFooter,
} from "@repo/ui/navigation/ConditionalChrome";
import React from 'react';
import GlitchCoreProvider from '@repo/ui/glitch/GlitchCoreProvider';
import GlitchCoreCanvas from '@repo/ui/glitch/GlitchCoreCanvas';

// No provider in this tree may call useSearchParams(): on a statically
// rendered route that bails the whole subtree out to client-side rendering and
// ships an empty HTML shell (the editorial preview provider did exactly that
// until 2026-09-07; it is gone from this app).

export const metadata: Metadata = {
  title: "LGIT Consult — Websites, Webanwendungen und KI-Integration in Leipzig",
  description:
    "Websites, Webanwendungen und KI-Integration zum Festpreis für Unternehmen in Leipzig. In Stadt und Landkreis Leipzig sowie Nordsachsen derzeit mit 35 bis 60 % der förderfähigen Kosten SAB-bezuschussbar, vorbehaltlich Bewilligung.",
  keywords: [
    "Webdesign Leipzig",
    "Webentwicklung Leipzig",
    "Webanwendung",
    "Kundenportal",
    "KI-Integration",
    "SAB Digitalisierung Zuschuss",
    "Festpreis",
  ],
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
    <html lang="de" className="scroll-smooth">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <GlitchCoreProvider>
          <div className="flex min-h-screen flex-col">
            <ConditionalNavbar />
            <main className="flex-grow">{children}</main>
            <ConditionalFooter />
          </div>
          {/* The canvas is rendered outside the main content to float over everything */}
          <GlitchCoreCanvas />
        </GlitchCoreProvider>
      </body>
    </html>
  );
}
