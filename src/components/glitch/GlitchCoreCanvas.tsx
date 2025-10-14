"use client";

import { useRef, useEffect } from "react";
import { useGlitchCore } from './GlitchCoreProvider';

// Typ für den Effekt (aktualisiert)
interface EffectTarget {
  element: HTMLElement;
  position: DOMRect;
}

export default function GlitchCoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { effectQueue, clearQueue } = useGlitchCore();
  const positionRef = useRef<EffectTarget[]>([]);

  // Anpassung der Canvas-Größe bei Fensteränderungen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Rendert die Effekte auf dem Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Funktion zum Zeichnen der Effekte
    const drawEffects = (effectsToDraw: EffectTarget[]) => {
      // Löscht den vorherigen Canvas-Inhalt
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      effectsToDraw.forEach(({ position }) => {
        // Zeichne den Kreis
        ctx.beginPath();
        ctx.arc(
            position.left + position.width / 2,
            position.top + position.height / 2,
            position.width / 2 + 5,
            0,
            2 * Math.PI
        );
        ctx.strokeStyle = '#00ffc3'; // Glitchcore-Farbe
        ctx.lineWidth = 1;
        ctx.stroke();

        // Zeichne die Linie
        ctx.beginPath();
        ctx.moveTo(
            position.left + position.width / 2,
            position.top + position.height / 2
        );
        ctx.lineTo(position.left + 50, position.top - 50);
        ctx.strokeStyle = '#00ffc3';
        ctx.stroke();

        // Zeichne die Nummer (entfernt, um den Fehler zu beheben)
        // ctx.fillStyle = '#00ffc3';
        // ctx.font = '12px "Geist Mono", monospace';
        // ctx.fillText(index.toString(), position.left + 50, position.top - 50);
      });
    };

    // Verarbeitet die Effekt-Warteschlange
    if (effectQueue.length > 0) {
      const newEffects = effectQueue.map(el => {
        const position = el.getBoundingClientRect();
        return { element: el, position };
      });
      positionRef.current = newEffects;
      drawEffects(newEffects);
      clearQueue();
    }

    // Löscht Effekte nach einer kurzen Zeit
    const timeout = setTimeout(() => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      positionRef.current = [];
    }, 500);

    return () => clearTimeout(timeout);
  }, [effectQueue, clearQueue]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-50 pointer-events-none" />;
}