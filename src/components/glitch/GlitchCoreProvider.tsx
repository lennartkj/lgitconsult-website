"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

// --- Typen und Interfaces ---
interface GlitchCoreContextType {
    triggerEffect: (target: HTMLElement) => void;
    effectQueue: HTMLElement[];
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
    const [effectQueue, setEffectQueue] = useState<HTMLElement[]>([]);
    const hasInitialized = useRef(false);

    // Der Scroll-Handler wird jetzt zuverlässiger ausgelöst
    const scrollDeltaRef = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearQueue = () => {
        setEffectQueue([]);
    };

    const findTextElements = (): HTMLElement[] => {
        const textElements: HTMLElement[] = [];
        const allElements = document.body.querySelectorAll('h1, h2, h3, p, span, li, a, strong, em');
        allElements.forEach(el => {
            // Stelle sicher, dass das Element sichtbar ist
            if (el instanceof HTMLElement && el.textContent && el.textContent.trim().length > 3 && el.offsetWidth > 0 && el.offsetHeight > 0) {
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

    const triggerEffect = (target: HTMLElement) => {
        setEffectQueue(prev => [...prev, target]);
    };

    const triggerMultipleEffects = (count: number) => {
        const elements = findTextElements();
        if (elements.length === 0) return;

        const newEffects: HTMLElement[] = [];
        for (let i = 0; i < count; i++) {
            const randomElement = getRandomElement(elements);
            if (randomElement) {
                newEffects.push(randomElement);
            }
        }
        setEffectQueue(prev => [...prev, ...newEffects]);
    };
    // --- Effekt-Logik für den Scroll-Handler ---
    useEffect(() => {
        if (!hasInitialized.current) {
            const initialElements = findTextElements();
            if (initialElements.length > 0) {
                // Führe initialen Effekt aus
                const randomElement = getRandomElement(initialElements);
                if(randomElement) {
                    triggerEffect(randomElement);
                }
            }
            hasInitialized.current = true;
        }

        const handleScroll = (e: WheelEvent) => {
            // Scroll-Delta akkumulieren
            scrollDeltaRef.current += Math.abs(e.deltaY);

            // Debounce-Logik, um nicht bei jedem Pixel zu triggern
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                if (scrollDeltaRef.current > 1) {
                    // FIX: Trigger multiple effects instead of just one
                    triggerMultipleEffects(10); // This will add 3 new lines/circles
                }
                scrollDeltaRef.current = 0;
            }, 10);
        };

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, []); // Abhängigkeit: [] stellt sicher, dass der Hook nur einmal läuft

    return (
        <GlitchCoreContext.Provider value={{ triggerEffect, effectQueue, clearQueue }}>
            {children}
        </GlitchCoreContext.Provider>
    );
}