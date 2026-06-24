"use client";

import React, { useState } from "react";
import { SearchDialog } from "./SearchDialog";

interface SearchButtonProps {
  variant?: "default" | "icon";
  className?: string;
}

export function SearchButton({ variant = "default", className = "" }: SearchButtonProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Base styles for all variants
  const baseStyles = "transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2";

  // Variant-specific styles
  const variantStyles = {
    default: "inline-flex items-center justify-center rounded-md bg-fg/10 px-4 py-2 text-sm font-medium hover:bg-fg/20",
    icon: "inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-fg/10",
  };

  // Combined className
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <>
      <button
        type="button"
        className={combinedClassName}
        onClick={() => setIsSearchOpen(true)}
        aria-label="Search"
      >
        {variant === "default" ? (
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Search</span>
          </div>
        ) : (
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </button>

      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}