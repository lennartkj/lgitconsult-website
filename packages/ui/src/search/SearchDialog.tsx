"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Define the search result interface
interface SearchResult {
  type: 'project' | 'post' | 'service';
  id: number;
  title: string;
  description: string;
  slug: string;
  url: string;
  tags?: string[];
  category?: string;
  excerpt?: string;
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the input when the dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Perform search when query changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
        if (!response.ok) {
          throw new Error("Search request failed");
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error searching:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce search requests

    return () => clearTimeout(searchTimeout);
  }, [query]);

  // Get icon for result type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "post":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case "service":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="fixed inset-0 bg-fg/20 backdrop-blur-sm" />

          <motion.div
            ref={dialogRef}
            className="relative w-full max-w-lg rounded-lg border border-fg/10 bg-bg shadow-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center border-b border-fg/10 px-4 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-fg/50"
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
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for anything..."
                className="flex-1 border-0 bg-transparent px-3 py-2 text-fg focus:outline-none focus:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={onClose}
                className="text-fg/50 hover:text-fg"
                aria-label="Close search"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-fg/10 border-t-accent" />
                </div>
              ) : results.length > 0 ? (
                <ul className="space-y-1">
                  {results.map((result) => (
                    <li key={`${result.type}-${result.id}`}>
                      <Link
                        href={result.url}
                        className="flex items-start gap-3 rounded-md p-3 hover:bg-fg/5"
                        onClick={onClose}
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-fg/10 text-fg">
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h3 className="truncate text-sm font-medium">{result.title}</h3>
                          <p className="truncate text-xs text-fg/60">
                            {result.description}
                          </p>
                          {result.tags && result.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {result.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-full bg-fg/10 px-2 py-0.5 text-xs text-fg/70"
                                >
                                  {tag}
                                </span>
                              ))}
                              {result.tags.length > 3 && (
                                <span className="inline-flex items-center rounded-full bg-fg/10 px-2 py-0.5 text-xs text-fg/70">
                                  +{result.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : query.trim() !== "" ? (
                <div className="py-8 text-center text-sm text-fg/60">
                  No results found for &quot;{query}&quot;
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-fg/60">
                  Start typing to search...
                </div>
              )}
            </div>

            <div className="border-t border-fg/10 p-2 text-xs text-fg/60">
              <div className="flex items-center justify-between">
                <span>Press ESC to close</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuery("")}
                    className="rounded px-2 py-1 hover:bg-fg/5"
                    disabled={query === ""}
                  >
                    Clear
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded px-2 py-1 hover:bg-fg/5"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
