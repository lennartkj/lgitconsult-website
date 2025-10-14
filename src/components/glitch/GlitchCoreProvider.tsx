"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

// --- Typen und Interfaces ---
interface GlitchCoreContextType {
    triggerEffect: (startTarget: HTMLElement, endTarget: HTMLElement) => void;
    effectQueue: { start: HTMLElement, end: HTMLElement }[];
    clearQueue: () => void;
}

interface GlitchCoreProviderProps {
    children: React.ReactNode;
}

const GlitchCoreContext = createContext<GlitchCoreContextType | null>(null);

export const useGlitchCore = () => {
    const context = useContext(GlitchCoreContext);
    if (!context) {
        throw new Error("useGlitchCore must be used within a GlitchCoreProvider");
    }
    return context;
};

// --- GlitchCoreProvider Komponente ---
export default function GlitchCoreProvider({ children }: GlitchCoreProviderProps) {
    const [effectQueue, setEffectQueue] = useState<{ start: HTMLElement, end: HTMLElement }[]>([]);
    const hasInitialized = useRef(false);
    const scrollDeltaRef = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearQueue = () => {
        setEffectQueue([]);
    };

    // FIX: Die findTextElements-Funktion filtert jetzt nur sichtbare Elemente
    const findVisibleTextElements = (): HTMLElement[] => {
        const textElements: HTMLElement[] = [];
        const allElements = document.body.querySelectorAll('h1, h2, h3, p, span, li, a, strong, em');
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        allElements.forEach(el => {
            if (el instanceof HTMLElement && el.textContent && el.textContent.trim().length > 3) {
                const rect = el.getBoundingClientRect();
                // Prüft, ob das Element innerhalb der Viewport-Grenzen liegt
                const isVisible = rect.top < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0;

                if (isVisible) {
                    textElements.push(el);
                }
            }
        });
        return textElements;
    };

    const getRandomElement = (elements: HTMLElement[]): HTMLElement | null => {
        if (elements.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * elements.length);
        return elements[randomIndex];
    };

    const triggerEffect = (startTarget: HTMLElement, endTarget: HTMLElement) => {
        setEffectQueue(prev => [...prev, { start: startTarget, end: endTarget }]);
    };

    const triggerMultipleEffects = (count: number) => {
        // FIX: Verwende die neue, verbesserte Funktion
        const elements = findVisibleTextElements();
        if (elements.length < 2) return;

        const newEffects: { start: HTMLElement, end: HTMLElement }[] = [];
        for (let i = 0; i < count; i++) {
            const startElement = getRandomElement(elements);
            const remaining = elements.filter(el => el !== startElement);
            const endElement = getRandomElement(remaining);

            if (startElement && endElement) {
                newEffects.push({ start: startElement, end: endElement });
            }
        }
        setEffectQueue(prev => [...prev, ...newEffects]);
    };

    // --- Effekt-Logik für den Scroll-Handler ---
    useEffect(() => {
        if (!hasInitialized.current) {
            const initialElements = findVisibleTextElements();
            if (initialElements.length > 1) {
                const start = getRandomElement(initialElements);
                const remaining = initialElements.filter(el => el !== start);
                const end = getRandomElement(remaining);
                if (start && end) {
                    triggerEffect(start, end);
                }
            }
            hasInitialized.current = true;
        }

        const handleScroll = (e: WheelEvent) => {
            scrollDeltaRef.current += Math.abs(e.deltaY);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                if (scrollDeltaRef.current > 1) {
                    triggerMultipleEffects(3);
                }
                scrollDeltaRef.current = 0;
            }, 10);
        };

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);

    return (
        <GlitchCoreContext.Provider value={{ triggerEffect, effectQueue, clearQueue }}>
            {children}
        </GlitchCoreContext.Provider>
    );
}