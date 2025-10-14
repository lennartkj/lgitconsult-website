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

    // Refs für Desktop und Mobile
    const scrollDeltaRef = useRef(0);
    const touchStartRef = useRef(0); // NEU: Speichert die Startposition des Fingers

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearQueue = () => {
        setEffectQueue([]);
    };

    const findVisibleTextElements = (): HTMLElement[] => {
        const textElements: HTMLElement[] = [];
        const allElements = document.body.querySelectorAll('h1, h2, h3, p, span, li, a, strong, em');
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        allElements.forEach(el => {
            if (el instanceof HTMLElement && el.textContent && el.textContent.trim().length > 3) {
                const rect = el.getBoundingClientRect();
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

    // Die Funktion zum Auslösen der Effekte bleibt unverändert
    const triggerMultipleEffects = (count: number) => {
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

    useEffect(() => {
        if (!hasInitialized.current) {
            // Logik für den initialen Effekt ...
            hasInitialized.current = true;
        }

        const handleInteraction = (delta: number) => {
            scrollDeltaRef.current += Math.abs(delta);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                // Ein Schwellenwert, der für beide Interaktionen passt
                if (scrollDeltaRef.current > 10) {
                    triggerMultipleEffects(3);
                }
                scrollDeltaRef.current = 0;
            }, 20);
        };

        // --- Event-Handler für Desktop (Mausrad) ---
        const handleWheel = (e: WheelEvent) => {
            handleInteraction(e.deltaY);
        };

        // --- NEU: Event-Handler für Mobile (Touch) ---
        const handleTouchStart = (e: TouchEvent) => {
            // Speichert die Y-Koordinate des ersten Touch-Punkts
            touchStartRef.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            // Berechnet die Distanz zur letzten bekannten Position
            const delta = touchStartRef.current - currentY;
            handleInteraction(delta);
            // Aktualisiert die Startposition für die nächste Bewegung
            touchStartRef.current = currentY;
        };

        // Events für Desktop und Mobile registrieren
        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        // Aufräumfunktion: Entfernt die Listener, wenn die Komponente unmounted wird
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []); // Leeres Array, damit der Effekt nur einmal beim Mounten ausgeführt wird

    return (
        <GlitchCoreContext.Provider value={{ triggerEffect, effectQueue, clearQueue }}>
            {children}
        </GlitchCoreContext.Provider>
    );
}