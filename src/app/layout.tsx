import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { PreviewProvider } from "@/components/preview/PreviewProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LGIT Consult - IT Consulting & Development Services",
  description: "Professional IT consulting and development services for businesses of all sizes. We help you transform your digital presence with modern web solutions.",
  keywords: ["IT consulting", "web development", "digital transformation", "Next.js", "React"],
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
        <PreviewProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </PreviewProvider>
      </body>
    </html>
  );
}
