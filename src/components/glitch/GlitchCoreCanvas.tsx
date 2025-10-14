"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGlitchCore } from './GlitchCoreProvider';

// --- Typen und Interfaces ---

// Die Referenz auf einen Buchstaben, wie sie vom Provider kommt
interface CharacterRef {
  textNode: Node;
  charIndex: number;
}

// Die vom Provider gesendete Effekt-Struktur
interface GlitchEffectFromProvider {
  startRef: CharacterRef;
  endRef: CharacterRef;
}

// Der interne Zustand für einen Effekt im Canvas
interface CanvasEffect {
  startRef: CharacterRef;
  endRef: CharacterRef;
  index: number;
  expiresAt: number; // Zeitstempel für das Ausblenden
}

/**
 * Ermittelt die exakten x/y-Koordinaten für eine Buchstaben-Referenz
 * mithilfe der Range API. Diese Funktion ist entscheidend für die Neuberechnung in jedem Frame.
 */
const getCoordsForChar = (ref: CharacterRef): { x: number; y: number } | null => {
  try {
    const range = document.createRange();
    range.setStart(ref.textNode, ref.charIndex);
    range.setEnd(ref.textNode, ref.charIndex + 1);

    const rect = range.getBoundingClientRect();
    // Wenn ein Buchstabe nicht mehr sichtbar ist, hat er keine Dimensionen
    if (rect.width === 0 && rect.height === 0) return null;

    // Wir geben den Mittelpunkt des Buchstabens zurück
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  } catch {
    return null;
  }
};


export default function GlitchCoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [effects, setEffects] = useState<CanvasEffect[]>([]);

  // Wichtig: Wir holen die effectQueue aus dem Typ, den der Provider jetzt sendet.
  const { effectQueue, clearQueue } = useGlitchCore() as {
    effectQueue: GlitchEffectFromProvider[],
    clearQueue: () => void
  };

  const animationRef = useRef<number | null>(null);

  // Hook zur Anpassung der Canvas-Größe (unverändert)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Hook zur Verarbeitung der ankommenden Effekt-Referenzen
  useEffect(() => {
    if (effectQueue.length === 0) return;

    const currentTime = Date.now();
    const newEffects = effectQueue.map((el, index) => ({
      startRef: el.startRef, // Speichert die Referenz, nicht die Koordinaten
      endRef: el.endRef,     // Speichert die Referenz, nicht die Koordinaten
      index: effects.length + index + 1,
      expiresAt: currentTime + 200, // Etwas längere Lebenszeit, damit man den Effekt gut sieht
    }));

    setEffects(prev => [...prev, ...newEffects]);
    clearQueue();
  }, [effectQueue, clearQueue, effects.length]);

  // Haupt-Animationsschleife
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const currentTime = Date.now();
    const activeEffects = effects.filter(effect => effect.expiresAt > currentTime);

    if (activeEffects.length !== effects.length) {
      setEffects(activeEffects);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    activeEffects.forEach(({ startRef, endRef, index }) => {
      // **HIER PASSIERT DIE MAGIE:**
      // Die Koordinaten werden in jedem einzelnen Frame neu berechnet.
      const startCoords = getCoordsForChar(startRef);
      const endCoords = getCoordsForChar(endRef);

      // Nur zeichnen, wenn beide Buchstaben noch im Viewport sind.
      if (!startCoords || !endCoords) return;

      const { x: startX, y: startY } = startCoords;
      const { x: endX, y: endY } = endCoords;

      const color = getComputedStyle(canvas).getPropertyValue('--fg').trim();
      ctx.fillStyle = color;
      ctx.lineWidth = 1;

      // Kreis am Startpunkt
      ctx.beginPath();
      ctx.arc(startX, startY, 10, 0, 2 * Math.PI);
      ctx.stroke();

      // Kreis am Endpunkt
      ctx.beginPath();
      ctx.arc(endX, endY, 10, 0, 2 * Math.PI);
      ctx.stroke();

      // Verbindungslinie
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Index-Nummer
      ctx.font = '12px "Geist Mono", monospace';
      ctx.fillText(index.toString(), endX + 15, endY - 15);
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [effects]);

  // Hook zum Starten und Stoppen der Animationsschleife (unverändert)
  useEffect(() => {
    if (effects.length > 0 && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (effects.length === 0 && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [effects.length, animate]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-50 pointer-events-none" />;
}