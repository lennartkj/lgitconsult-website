"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGlitchCore } from './GlitchCoreProvider';

// Definieren des Typs für den Effekt
interface EffectTarget {
  start: HTMLElement;
  end: HTMLElement;
  positionStart: DOMRect;
  positionEnd: DOMRect;
  index: number;
  expiresAt: number; // NEU: Zeitstempel für das Ablaufen
}

export default function GlitchCoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [effects, setEffects] = useState<EffectTarget[]>([]);
  const { effectQueue, clearQueue } = useGlitchCore();
  const animationRef = useRef<number>();

  // Hook zur Anpassung der Canvas-Größe bei Fensteränderungen
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

  // Hook zum Hinzufügen neuer Effekte zur Liste (wird durch Provider getriggert)
  useEffect(() => {
    if (effectQueue.length === 0) return;

    const currentTime = Date.now();
    const newEffects = effectQueue.map((el, index) => {
      const positionStart = el.start.getBoundingClientRect();
      const positionEnd = el.end.getBoundingClientRect();
      return {
        start: el.start,
        end: el.end,
        positionStart,
        positionEnd,
        index: effects.length + index + 1,
        expiresAt: currentTime + 100, // Leben nur 100ms
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
    let needsUpdate = false;

    // 1. Filtere abgelaufene Effekte im Render-Zyklus
    const activeEffects = effects.filter(effect => effect.expiresAt > currentTime);

    // 2. Zustand nur aktualisieren, wenn sich die Liste der aktiven Effekte geändert hat
    if (activeEffects.length !== effects.length) {
      setEffects(activeEffects);
      needsUpdate = true; // Markiere, dass ein Neuzeichnen nötig ist
    }

    // 3. Zeichne und lösche den Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    activeEffects.forEach(({ positionStart, positionEnd, index }) => {
      const startX = positionStart.left + positionStart.width / 2;
      const startY = positionStart.top + positionStart.height / 2;
      const endX = positionEnd.left + positionEnd.width / 2;
      const endY = positionEnd.top + positionEnd.height / 2;

      // Zeichne den Kreis um den Startpunkt
      ctx.beginPath();
      ctx.arc(startX, startY, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = '#00ffc3';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Zeichne den Kreis um den Endpunkt
      ctx.beginPath();
      ctx.arc(endX, endY, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = '#00ffc3';
      ctx.stroke();

      // Zeichne die Linie, die die beiden Elemente verbindet
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#00ffc3';
      ctx.stroke();

      // Zeichne die Nummer
      ctx.fillStyle = '#00ffc3';
      ctx.font = '12px "Geist Mono", monospace';
      ctx.fillText(index.toString(), endX + 15, endY - 15);
    });

    // 4. Starte die nächste Animations-Frame
    animationRef.current = requestAnimationFrame(animate);

  }, [effects, setEffects]); // Der Hook hängt nur von effects ab

  // Hook, der die Animationsschleife startet, wenn Effekte hinzukommen
  useEffect(() => {
    if (effects.length > 0 && !animationRef.current) {
      // Startet die Schleife nur, wenn sie nicht bereits läuft
      animationRef.current = requestAnimationFrame(animate);
    } else if (effects.length === 0 && animationRef.current) {
      // Stoppt die Schleife, wenn keine Effekte mehr vorhanden sind
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;

      // Letzte Aufräumarbeiten (Canvas endgültig löschen)
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // WICHTIG: Die Cleanup-Funktion stellt sicher, dass requestAnimationFrame gestoppt wird,
    // wenn die Komponente unmountet wird.
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [effects.length, animate]); // Abhängig von der Anzahl der Effekte und der animate-Funktion

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-50 pointer-events-none" />;
}
