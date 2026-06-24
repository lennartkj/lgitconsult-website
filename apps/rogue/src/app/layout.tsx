import type { Metadata } from "next";
// Self-hosted Geist (the `geist` package bundles the font files) — no Google
// Fonts fetch at build, so production builds are network-independent.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@repo/ui/globals.css";
// Rogue's own identity layer — "European Summer, Scorched" (promoted from
// explore/v2). Imported AFTER the shared globals so it overrides the LGIT
// theme tokens for the Rogue app ONLY. The shared packages/ui/globals.css is
// untouched, so git-consult.group keeps its warm-neutral editorial theme.
import "./rogue-theme.css";

import {
  ConditionalNavbar,
  ConditionalFooter,
} from "@repo/ui/navigation/ConditionalChrome";
import { PreviewProvider } from "@repo/ui/preview/PreviewProvider";
import React, { Suspense } from "react";
import GlitchCoreProvider from "@repo/ui/glitch/GlitchCoreProvider";
import GlitchCoreCanvas from "@repo/ui/glitch/GlitchCoreCanvas";

export const metadata: Metadata = {
  metadataBase: new URL("https://rogue.berlin"),
  title: {
    default: "Rogue — European Guerrilla & Experiential Agency",
    template: "%s · Rogue",
  },
  description:
    "A European guerrilla and experiential agency for brands that refuse to be ignored. Unsanctioned moments, installations and stunts — Berlin to the Mediterranean, based in Leipzig.",
  keywords: [
    "guerrilla marketing agency",
    "experiential marketing Europe",
    "brand activation",
    "experiential agency Europe",
    "stunt marketing",
    "creative agency Berlin",
  ],
  authors: [{ name: "Rogue" }],
  creator: "Rogue",
  publisher: "LGIT",
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
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <Suspense fallback={null}>
          <PreviewProvider>
            {/* We wrap the entire application content with the glitch provider */}
            <GlitchCoreProvider>
              <div className="flex min-h-screen flex-col">
                <Suspense fallback={null}>
                  <ConditionalNavbar />
                </Suspense>

                <main className="flex-grow">{children}</main>

                <Suspense fallback={null}>
                  <ConditionalFooter />
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
