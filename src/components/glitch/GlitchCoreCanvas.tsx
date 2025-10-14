"use client";

import React, { useRef, useEffect, useState } from "react";
import { useGlitchCore } from './GlitchCoreProvider';

// Definieren des Typs für den Effekt
interface EffectTarget {
  element: HTMLElement;
  position: DOMRect;
  index: number;
}

export default function GlitchCoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [effects, setEffects] = useState<EffectTarget[]>([]);
  const { effectQueue, clearQueue } = useGlitchCore();

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
    if (!ctx || effectQueue.length === 0) return;

    // Verarbeitet die Effekt-Warteschlange
    const newEffects = effectQueue.map((el, index) => {
      const position = el.getBoundingClientRect();
      return { element: el, position, index: effects.length + index + 1 };
    });

    setEffects(prev => [...prev, ...newEffects]);
    clearQueue();

    // Zeichne alle Effekte (in einer separaten Funktion)
    const drawEffects = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      effects.forEach(({ element, position, index }) => {
        // Bestimme die Größe des zufälligen Buchstabens (oder Elements)
        const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
        const textMetrics = ctx.measureText(element.textContent.charAt(0));
        const letterWidth = textMetrics.width;
        const letterHeight = fontSize;

        const letterX = position.left + letterWidth / 2;
        const letterY = position.top + letterHeight / 2;

        // Zeichne den Kreis um den Buchstaben
        ctx.beginPath();
        ctx.arc(
            letterX,
            letterY,
            letterWidth / 2 + 5,
            0,
            2 * Math.PI
        );
        ctx.strokeStyle = '#00ffc3';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Zeichne die Linie zur Zahl
        ctx.beginPath();
        ctx.moveTo(letterX, letterY);
        ctx.lineTo(letterX + 50, letterY - 50);
        ctx.strokeStyle = '#00ffc3';
        ctx.stroke();

        // Zeichne die Nummer
        ctx.fillStyle = '#00ffc3';
        ctx.font = '12px "Geist Mono", monospace';
        ctx.fillText(index.toString(), letterX + 50, letterY - 50);
      });
    };

    // Zeichne die Effekte
    drawEffects();

  }, [effectQueue, clearQueue, effects]);

  // Dieser Hook verwaltet die Lebensdauer der Effekte
  useEffect(() => {
    if (effects.length > 0) {
      const timeout = setTimeout(() => {
        setEffects([]);
      }, 500); // 500ms, bis die Effekte verschwinden

      return () => clearTimeout(timeout);
    }
  }, [effects]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-50 pointer-events-none" />;
}