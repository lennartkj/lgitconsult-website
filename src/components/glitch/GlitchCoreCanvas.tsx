"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGlitchCore } from './GlitchCoreProvider';

// KORREKTUR 1: Der Typ ist jetzt viel einfacher, da wir direkt Koordinaten erhalten.
interface CanvasEffect {
  start: { x: number; y: number };
  end: { x: number; y: number };
  index: number;
  expiresAt: number; // Zeitstempel für das Ausblenden
}

export default function GlitchCoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [effects, setEffects] = useState<CanvasEffect[]>([]);
  const { effectQueue, clearQueue } = useGlitchCore();

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // KORREKTUR 2: Verarbeitung der effectQueue. Wir übernehmen die Koordinaten direkt.
  useEffect(() => {
    if (effectQueue.length === 0) return;

    const currentTime = Date.now();
    const newEffects = effectQueue.map((el, index) => {
      // Kein getBoundingClientRect() mehr nötig!
      return {
        start: el.start,
        end: el.end,
        index: effects.length + index + 1,
        expiresAt: currentTime + 500, // Leben nur 100ms
      };
    });

    setEffects(prev => [...prev, ...newEffects]);
    clearQueue();
  }, [effectQueue, clearQueue, effects.length]);


  // Haupt-Animationsschleife (requestAnimationFrame)
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const currentTime = Date.now();

    // Filtere abgelaufene Effekte
    const activeEffects = effects.filter(effect => effect.expiresAt > currentTime);

    // Zustand nur aktualisieren, wenn sich etwas geändert hat
    if (activeEffects.length !== effects.length) {
      setEffects(activeEffects);
    }

    // Canvas für den neuen Frame leeren
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeichne alle aktiven Effekte
    activeEffects.forEach(({ start, end, index }) => {
      // KORREKTUR 3: Die Koordinaten sind bereits die Mittelpunkte.
      const startX = start.x;
      const startY = start.y;
      const endX = end.x;
      const endY = end.y;

      const color = '#00ffc3'; // Farbe zentral definieren
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;

      // Zeichne den Kreis um den Startpunkt
      ctx.beginPath();
      ctx.arc(startX, startY, 10, 0, 2 * Math.PI);
      ctx.stroke();

      // Zeichne den Kreis um den Endpunkt
      ctx.beginPath();
      ctx.arc(endX, endY, 10, 0, 2 * Math.PI);
      ctx.stroke();

      // Zeichne die Linie, die die beiden Punkte verbindet
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Zeichne die Index-Nummer
      ctx.font = '12px "Geist Mono", monospace';
      ctx.fillText(index.toString(), endX + 15, endY - 15);
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [effects]); // Die Abhängigkeit ist jetzt nur noch 'effects'

  // Hook, der die Animationsschleife startet und stoppt (Logik bleibt gleich)
  useEffect(() => {
    // Wenn es Effekte gibt und die Animation nicht läuft -> starte sie
    if (effects.length > 0 && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
    // Wenn es keine Effekte mehr gibt und die Animation noch läuft -> stoppe sie
    else if (effects.length === 0 && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      // Letzte Aufräumarbeiten
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Cleanup-Funktion für den Fall, dass die Komponente unmounted wird
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [effects.length, animate]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-50 pointer-events-none" />;
}