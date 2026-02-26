"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

interface GlitchEffect {
    startRef: { textNode: Node; charIndex: number };
    endRef: { textNode: Node; charIndex: number };
}

interface GlitchCoreContextType {
    effectQueue: GlitchEffect[];
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
    const [effectQueue, setEffectQueue] = useState<GlitchEffect[]>([]);
    const [characterRefs, setCharacterRefs] = useState<{ textNode: Node; charIndex: number }[]>([]);
    const pathname = usePathname();

    const interactionDeltaRef = useRef(0);
    const touchStartRef = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearQueue = useCallback(() => {
        setEffectQueue([]);
    }, []);

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

    const triggerMultipleEffects = useCallback((count: number) => {
        if (characterRefs.length < 2) return;

        const newEffects: GlitchEffect[] = [];
        for (let i = 0; i < count; i++) {
            const startIndex = Math.floor(Math.random() * characterRefs.length);
            let endIndex = Math.floor(Math.random() * characterRefs.length);
            while (startIndex === endIndex) {
                endIndex = Math.floor(Math.random() * characterRefs.length);
            }
            newEffects.push({
                startRef: characterRefs[startIndex],
                endRef: characterRefs[endIndex],
            });
        }

        setEffectQueue(newEffects);
    }, [characterRefs]);

    // Re-scan characters when route changes
    useEffect(() => {
        scanVisibleCharacters();

        // Delayed scan for animated/lazy content
        scanTimeoutRef.current = setTimeout(() => {
            scanVisibleCharacters();
        }, 600);

        return () => {
            if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
        };
    }, [pathname, scanVisibleCharacters]);

    // Interaction listeners
    useEffect(() => {
        const handleInteraction = (delta: number) => {
            interactionDeltaRef.current += Math.abs(delta);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                if (interactionDeltaRef.current > 15) {
                    scanVisibleCharacters();
                    triggerMultipleEffects(5);
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
    }, [scanVisibleCharacters, triggerMultipleEffects]);

    return (
        <GlitchCoreContext.Provider value={{ effectQueue, clearQueue }}>
            {children}
        </GlitchCoreContext.Provider>
    );
}
