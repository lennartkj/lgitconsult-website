"use client";

import React, { useRef, useEffect, useState } from "react";
import { useGlitchCore } from './GlitchCoreProvider';

// Definieren des Typs für den Effekt
interface EffectTarget {
  start: HTMLElement;
  end: HTMLElement;
  positionStart: DOMRect;
  positionEnd: DOMRect;
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

  // Hook zum Hinzufügen neuer Effekte zur Liste
  useEffect(() => {
    if (effectQueue.length === 0) return;

    const newEffects = effectQueue.map((el, index) => {
      const positionStart = el.start.getBoundingClientRect();
      const positionEnd = el.end.getBoundingClientRect();
      return { start: el.start, end: el.end, positionStart, positionEnd, index: effects.length + index + 1 };
    });

    setEffects(prev => [...prev, ...newEffects]);
    clearQueue();
  }, [effectQueue, clearQueue, effects.length]);

  // Hook für das Zeichnen und die Lebensdauer der Effekte
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const drawEffects = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      effects.forEach(({ positionStart, positionEnd, index }) => {
        const startX = positionStart.left + positionStart.width / 2;
        const startY = positionStart.top + positionStart.height / 2;
        const endX = positionEnd.left + positionEnd.width / 2;
        const endY = positionEnd.top + positionEnd.height / 2;

        ctx.beginPath();
        ctx.arc(startX, startY, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = '#00ffc3';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(endX, endY, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = '#00ffc3';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#00ffc3';
        ctx.stroke();

        ctx.fillStyle = '#00ffc3';
        ctx.font = '12px "Geist Mono", monospace';
        ctx.fillText(index.toString(), endX + 15, endY - 15);
      });
    };

    if (effects.length > 0) {
      drawEffects();

      const timeout = setTimeout(() => {
        setEffects([]);
      }, 10);

      return () => clearTimeout(timeout);
    }
  }, [effects]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-50 pointer-events-none" />;
}