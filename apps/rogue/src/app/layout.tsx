import type { Metadata } from "next";
// Self-hosted Geist (the `geist` package bundles the font files) — no Google
// Fonts fetch at build, so production builds are network-independent.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@repo/ui/globals.css";

import {
  ConditionalNavbar,
  ConditionalFooter,
} from "@repo/ui/navigation/ConditionalChrome";
import { PreviewProvider } from "@repo/ui/preview/PreviewProvider";
import React, { Suspense } from "react";
import GlitchCoreProvider from "@repo/ui/glitch/GlitchCoreProvider";
import GlitchCoreCanvas from "@repo/ui/glitch/GlitchCoreCanvas";

export const metadata: Metadata = {
  title: "Rogue — Marketing, Campaigns & Creative | LGIT",
  description:
    "Leipzig-based creative consulting and digital agency. Technology, campaigns, and joint ventures with artists and brands.",
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
