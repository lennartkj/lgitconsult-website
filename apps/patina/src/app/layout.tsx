import type { Metadata } from "next";
// Self-hosted Geist (the `geist` package bundles the font files) — no Google
// Fonts fetch at build, so production builds are network-independent.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@repo/ui/globals.css";
// Patina's own identity layer — imported AFTER the shared globals so the clinical
// theme wins. Patina is funnel-only (the /audit Read/Audit funnel, nothing else),
// so the WHOLE app is the sealed clinical room: `.audit-clinical` sits on <body>
// from the first paint → no flash of the shared LGIT editorial theme. No shared
// nav/footer, no glitch-core canvas (those are LGIT's editorial system).
import "./patina-theme.css";

import { PreviewProvider } from "@repo/ui/preview/PreviewProvider";
import React, { Suspense } from "react";

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
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased audit-clinical`}
      >
        <Suspense fallback={null}>
          <PreviewProvider>
            <main className="min-h-screen">{children}</main>
          </PreviewProvider>
        </Suspense>
      </body>
    </html>
  );
}
