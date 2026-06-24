import type { Metadata } from "next";
// Self-hosted Geist (the `geist` package bundles the font files) — no Google
// Fonts fetch at build, so production builds are network-independent.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@repo/ui/globals.css";
// Patina's own identity layer — imported AFTER the shared globals so the
// app-scoped clinical theme (.audit-clinical on /audit*) is self-contained and
// does not depend on the shared packages/ui/globals.css. The shared globals are
// untouched, so git-consult.group keeps its theme.
import "./patina-theme.css";

import {
  ConditionalNavbar,
  ConditionalFooter,
} from "@repo/ui/navigation/ConditionalChrome";
import { PreviewProvider } from "@repo/ui/preview/PreviewProvider";
import React, { Suspense } from "react";
import GlitchCoreProvider from "@repo/ui/glitch/GlitchCoreProvider";
import GlitchCoreCanvas from "@repo/ui/glitch/GlitchCoreCanvas";

export const metadata: Metadata = {
  metadataBase: new URL("https://patina.berlin"),
  title: {
    default: "Patina — The eye, retained",
    template: "%s · Patina",
  },
  description:
    "Patina is a private taste advisory for new wealth. What to keep, what to lose, what to acquire — so everything you own reads as money, never as new-money. The way in is the Audit.",
  keywords: [
    "taste advisory",
    "private art advisory",
    "collection curation",
    "new wealth",
    "luxury taste consulting",
    "Leipzig",
  ],
  authors: [{ name: "Patina" }],
  creator: "Patina",
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
