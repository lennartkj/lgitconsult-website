"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

// --- Typen und Interfaces (unverändert) ---
interface GlitchEffect {
    start: { x: number; y: number };
    end: { x: number; y: number };
}

interface GlitchCoreContextType {
    effectQueue: GlitchEffect[];
    clearQueue: () => void;
}

interface GlitchCoreProviderProps {
    children: React.ReactNode;
}

// --- React Context (unverändert) ---
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
    const [effectQueue, setEffectQueue] = useState<GlitchEffect[]>([]);
    const [characterRefs, setCharacterRefs] = useState<{ textNode: Node; charIndex: number }[]>([]);

    const interactionDeltaRef = useRef(0);
    const touchStartRef = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearQueue = useCallback(() => {
        setEffectQueue([]);
    }, []);

    // HINWEIS: Alle useCallback-Hooks sind korrekt, da sie die Funktionen stabil halten.
    // Das Problem lag in der Art, wie die useEffect-Hooks sie aufgerufen haben.

    const scanVisibleCharacters = useCallback(() => {
        const refs: { textNode: Node; charIndex: number }[] = [];
        const allElements = document.body.querySelectorAll('h1, h2, h3, p, span, li, a, strong, em, button');
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        allElements.forEach(el => {
            if (el instanceof HTMLElement && el.textContent && el.textContent.trim().length > 0) {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0;
                if (isVisible) {
                    const treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
                    let currentNode;
                    while ((currentNode = treeWalker.nextNode())) {
                        const text = currentNode.nodeValue || "";
                        for (let i = 0; i < text.length; i++) {
                            if (text[i].trim() !== "") {
                                refs.push({ textNode: currentNode, charIndex: i });
                            }
                        }
                    }
                }
            }
        });
        setCharacterRefs(refs);
    }, []);

    const getCoordsForChar = (textNode: Node, charIndex: number): { x: number; y: number } | null => {
        try {
            const range = document.createRange();
            range.setStart(textNode, charIndex);
            range.setEnd(textNode, charIndex + 1);
            const rect = range.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return null;
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        } catch { return null; }
    };

    const triggerMultipleEffects = useCallback((count: number) => {
        if (characterRefs.length < 2) return;

        const newEffects: GlitchEffect[] = [];
        for (let i = 0; i < count; i++) {
            const startIndex = Math.floor(Math.random() * characterRefs.length);
            let endIndex = Math.floor(Math.random() * characterRefs.length);
            while (startIndex === endIndex) {
                endIndex = Math.floor(Math.random() * characterRefs.length);
            }
            const startRef = characterRefs[startIndex];
            const endRef = characterRefs[endIndex];
            const startCoords = getCoordsForChar(startRef.textNode, startRef.charIndex);
            const endCoords = getCoordsForChar(endRef.textNode, endRef.charIndex);
            if (startCoords && endCoords) {
                newEffects.push({ start: startCoords, end: endCoords });
            }
        }
        setEffectQueue(prev => [...prev, ...newEffects]);
    }, [characterRefs]);

    // --- Effekt-Hooks ---

    // KORREKTUR 1: Dieser Hook läuft nur einmal beim Mounten, um den initialen Scan durchzuführen.
    useEffect(() => {
        scanVisibleCharacters();
    }, [scanVisibleCharacters]);

    // KORREKTUR 2: Dieser Hook richtet die Event-Listener ein. Er ist jetzt stabil.
    useEffect(() => {
        const handleInteraction = (delta: number) => {
            interactionDeltaRef.current += Math.abs(delta);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                if (interactionDeltaRef.current > 15) {
                    triggerMultipleEffects(3);
                }
                interactionDeltaRef.current = 0;
            }, 25);
        };

        const handleWheel = (e: WheelEvent) => handleInteraction(e.deltaY);
        const handleTouchStart = (e: TouchEvent) => { touchStartRef.current = e.touches[0].clientY; };
        const handleTouchMove = (e: TouchEvent) => {
            const currentY = e.touches[0].clientY;
            const delta = touchStartRef.current - currentY;
            handleInteraction(delta);
            touchStartRef.current = currentY;
        };

        // Der 'resize' Handler ist einfach die stabile scanVisibleCharacters-Funktion.
        window.addEventListener('resize', scanVisibleCharacters);
        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('resize', scanVisibleCharacters);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // Wir übergeben die stabilen Funktionen an das Dependency-Array.
        // Das stellt sicher, dass der Hook nur neu läuft, wenn sich diese (stabilen) Funktionen ändern, was sie nicht tun.
    }, [scanVisibleCharacters, triggerMultipleEffects]);

    return (
        <GlitchCoreContext.Provider value={{ effectQueue, clearQueue }}>
            {children}
        </GlitchCoreContext.Provider>
    );
}