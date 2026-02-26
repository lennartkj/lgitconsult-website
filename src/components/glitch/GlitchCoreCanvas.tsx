"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGlitchCore } from './GlitchCoreProvider';

interface CharacterRef {
  textNode: Node;
  charIndex: number;
}

interface GlitchEffectFromProvider {
  startRef: CharacterRef;
  endRef: CharacterRef;
}

interface CanvasEffect {
  startRef: CharacterRef;
  endRef: CharacterRef;
  index: number;
  createdAt: number;
  duration: number;
  lineWeight: number;
  circleRadius: number;
}

interface AmbientEffect {
  startRef: CharacterRef;
  endRef: CharacterRef;
  index: number;
  phase: number;
  lineWeight: number;
}

const getCoordsForChar = (ref: CharacterRef): { x: number; y: number } | null => {
  try {
    const range = document.createRange();
    range.setStart(ref.textNode, ref.charIndex);
    range.setEnd(ref.textNode, ref.charIndex + 1);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  } catch {
    return null;
  }
};

// Deterministic random from seed for consistent line weights per effect
const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const LINE_WEIGHTS = [0.5, 0.5, 1, 1, 1, 2, 3]; // weighted toward thinner
const CIRCLE_RADII = [6, 8, 10, 10, 12, 14]; // varied sizes
const DURATIONS = [600, 800, 1000, 1200]; // longer, readable


export default function GlitchCoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [effects, setEffects] = useState<CanvasEffect[]>([]);
  const [ambientEffects, setAmbientEffects] = useState<AmbientEffect[]>([]);
  const ambientIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const characterRefsRef = useRef<CharacterRef[]>([]);

  const { effectQueue, clearQueue } = useGlitchCore() as {
    effectQueue: GlitchEffectFromProvider[],
    clearQueue: () => void
  };

  const animationRef = useRef<number | null>(null);

  // Canvas resize
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

  // Scan visible characters for ambient effects
  const scanForAmbient = useCallback(() => {
    const refs: CharacterRef[] = [];
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
    characterRefsRef.current = refs;
  }, []);

  // Ambient effects — always 2 subtle connections visible, cycling every 4s
  useEffect(() => {
    const refreshAmbient = () => {
      scanForAmbient();
      const refs = characterRefsRef.current;
      if (refs.length < 4) return;

      const newAmbient: AmbientEffect[] = [];
      for (let i = 0; i < 2; i++) {
        const startIdx = Math.floor(Math.random() * refs.length);
        let endIdx = Math.floor(Math.random() * refs.length);
        while (startIdx === endIdx) endIdx = Math.floor(Math.random() * refs.length);
        newAmbient.push({
          startRef: refs[startIdx],
          endRef: refs[endIdx],
          index: i + 1,
          phase: Math.random() * Math.PI * 2,
          lineWeight: pickRandom([0.5, 0.5, 1]),
        });
      }
      setAmbientEffects(newAmbient);
    };

    // Initial ambient after content loads
    const initialTimeout = setTimeout(refreshAmbient, 1000);
    ambientIntervalRef.current = setInterval(refreshAmbient, 4000);

    return () => {
      clearTimeout(initialTimeout);
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);
    };
  }, [scanForAmbient]);

  // Process incoming scroll-triggered effects
  useEffect(() => {
    if (effectQueue.length === 0) return;

    const currentTime = Date.now();
    const newEffects = effectQueue.map((el, index) => ({
      startRef: el.startRef,
      endRef: el.endRef,
      index: effects.length + index + 1,
      createdAt: currentTime,
      duration: pickRandom(DURATIONS),
      lineWeight: pickRandom(LINE_WEIGHTS),
      circleRadius: pickRandom(CIRCLE_RADII),
    }));

    setEffects(prev => [...prev, ...newEffects]);
    clearQueue();
  }, [effectQueue, clearQueue, effects.length]);

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const currentTime = Date.now();
    const activeEffects = effects.filter(e => currentTime - e.createdAt < e.duration);

    if (activeEffects.length !== effects.length) {
      setEffects(activeEffects);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fgColor = getComputedStyle(canvas).getPropertyValue('--fg').trim();

    // Draw ambient effects — low opacity, slow pulse
    ambientEffects.forEach(({ startRef, endRef, index, phase, lineWeight }) => {
      const startCoords = getCoordsForChar(startRef);
      const endCoords = getCoordsForChar(endRef);
      if (!startCoords || !endCoords) return;

      const { x: startX, y: startY } = startCoords;
      const { x: endX, y: endY } = endCoords;

      // Slow sine pulse between 0.04 and 0.12 opacity
      const pulse = 0.04 + 0.08 * Math.sin(currentTime * 0.001 + phase);

      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = fgColor;
      ctx.fillStyle = fgColor;
      ctx.lineWidth = lineWeight;

      // Circles
      ctx.beginPath();
      ctx.arc(startX, startY, 6, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, 2 * Math.PI);
      ctx.stroke();

      // Connection line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Index number
      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillText(index.toString(), endX + 12, endY - 12);

      ctx.restore();
    });

    // Draw scroll-triggered effects with fade-out
    activeEffects.forEach(({ startRef, endRef, index, createdAt, duration, lineWeight, circleRadius }) => {
      const startCoords = getCoordsForChar(startRef);
      const endCoords = getCoordsForChar(endRef);
      if (!startCoords || !endCoords) return;

      const { x: startX, y: startY } = startCoords;
      const { x: endX, y: endY } = endCoords;

      // Smooth fade-out over the last 40% of duration
      const elapsed = currentTime - createdAt;
      const fadeStart = duration * 0.6;
      const alpha = elapsed < fadeStart
        ? 1
        : 1 - (elapsed - fadeStart) / (duration - fadeStart);

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.strokeStyle = fgColor;
      ctx.fillStyle = fgColor;
      ctx.lineWidth = lineWeight;

      // Circle at start
      ctx.beginPath();
      ctx.arc(startX, startY, circleRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Circle at end
      ctx.beginPath();
      ctx.arc(endX, endY, circleRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Connection line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Index number
      ctx.font = '12px "Geist Mono", monospace';
      ctx.fillText(index.toString(), endX + 15, endY - 15);

      ctx.restore();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [effects, ambientEffects]);

  // Start/stop animation loop
  useEffect(() => {
    const hasWork = effects.length > 0 || ambientEffects.length > 0;

    if (hasWork && !animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (!hasWork && animationRef.current) {
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
  }, [effects.length, ambientEffects.length, animate]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-50 pointer-events-none" />;
}
