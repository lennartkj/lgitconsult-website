"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface PreviewBannerProps {
  isPreview: boolean;
}

export function PreviewBanner({ isPreview }: PreviewBannerProps) {
  const pathname = usePathname();

  if (!isPreview) {
    return null;
  }

  // Generate the exit preview URL
  const exitPreviewUrl = `/api/exit-preview?redirect=${encodeURIComponent(pathname)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-accent text-accent-contrast">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium">
            Preview Mode: You&apos;re viewing draft content
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={exitPreviewUrl}
            className="text-sm font-medium underline hover:no-underline"
          >
            Exit Preview
          </Link>
        </div>
      </div>
    </div>
  );
}