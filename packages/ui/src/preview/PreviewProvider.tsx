"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PreviewBanner } from "./PreviewBanner";

// Editorial preview mode. The state is carried by the URL alone
// (`?preview=true` / `?preview=false`, set by /api/preview and
// /api/exit-preview): nothing is written to or read from the visitor's device,
// so the site stays free of cookies and storage access (§ 25 TDDDG).

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

  useEffect(() => {
    setIsPreview(searchParams.get("preview") === "true");
  }, [searchParams]);

  return (
    <PreviewContext.Provider value={{ isPreview, setIsPreview }}>
      {children}
      <PreviewBanner isPreview={isPreview} />
    </PreviewContext.Provider>
  );
}
