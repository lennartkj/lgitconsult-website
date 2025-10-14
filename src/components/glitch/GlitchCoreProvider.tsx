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

export default function GlitchCoreProvider({ children }: GlitchCoreProviderProps) {
    const [effectQueue, setEffectQueue] = useState<{ start: HTMLElement, end: HTMLElement }[]>([]);
    const lastScrollTime = useRef(0);
    const scrollCount = useRef(0);
    const hasInitialized = useRef(false);

    const clearQueue = () => {
        setEffectQueue([]);
    };

    const findTextElements = (): HTMLElement[] => {
        const textElements: HTMLElement[] = [];
        const allElements = document.body.querySelectorAll('h1, h2, h3, p, span, li, a, strong, em');
        allElements.forEach(el => {
            if (el instanceof HTMLElement && el.textContent && el.textContent.trim().length > 3) {
                textElements.push(el);
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

    useEffect(() => {
        if (!hasInitialized.current) {
            const initialElements = findTextElements();
            if (initialElements.length > 1) {
                const start = getRandomElement(initialElements);
                const end = getRandomElement(initialElements);
                if (start && end) {
                    triggerEffect(start, end);
                }
            }
            hasInitialized.current = true;
        }

        const handleScroll = (e: WheelEvent) => {
            const currentTime = Date.now();
            const timeSinceLastScroll = currentTime - lastScrollTime.current;
            lastScrollTime.current = currentTime;

            if (timeSinceLastScroll < 200) {
                scrollCount.current += 1;
            } else {
                scrollCount.current = 0;
            }

            if (scrollCount.current > 2) {
                const elements = findTextElements();

                if (elements.length < 2) return;

                const startElement = getRandomElement(elements);
                const remaining = elements.filter(el => el !== startElement);
                const endElement = getRandomElement(remaining);

                if (startElement && endElement) {
                    triggerEffect(startElement, endElement);
                }
                scrollCount.current = 0;
            }
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