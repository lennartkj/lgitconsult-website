"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PreviewBanner } from "./PreviewBanner";

// Create a context for preview state
interface PreviewContextType {
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
}

const PreviewContext = createContext<PreviewContextType>({
  isPreview: false,
  setIsPreview: () => {},
});

// Hook to use preview context
export const usePreview = () => useContext(PreviewContext);

interface PreviewProviderProps {
  children: React.ReactNode;
}

export function PreviewProvider({ children }: PreviewProviderProps) {
  const [isPreview, setIsPreview] = useState(false);
  const searchParams = useSearchParams();

  // Check for preview mode on component mount
  useEffect(() => {
    // Check if the URL has a preview parameter
    const previewParam = searchParams.get("preview");

    // If preview parameter exists and is "true", set preview mode
    if (previewParam === "true") {
      setIsPreview(true);

      // Store preview state in localStorage for persistence across page navigation
      localStorage.setItem("isPreviewMode", "true");
    } else if (previewParam === "false") {
      // If explicitly set to false, exit preview mode
      setIsPreview(false);
      localStorage.removeItem("isPreviewMode");
    } else {
      // Check if preview mode is stored in localStorage
      const storedPreviewMode = localStorage.getItem("isPreviewMode");
      if (storedPreviewMode === "true") {
        setIsPreview(true);
      }
    }

    // Function to handle storage events (for multi-tab synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "isPreviewMode") {
        setIsPreview(event.newValue === "true");
      }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [searchParams]);

  return (
    <PreviewContext.Provider value={{ isPreview, setIsPreview }}>
      {children}
      <PreviewBanner isPreview={isPreview} />
    </PreviewContext.Provider>
  );
}
