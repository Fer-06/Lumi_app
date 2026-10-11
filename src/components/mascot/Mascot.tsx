"use client";

import { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quotes } from "@/data/quotes";

const SIZE = 76;
const EDGE_GAP = 8;
const POSITION_KEY = "lumi-mascot-position";

interface Position {
  x: number;
  y: number;
}

interface DragStart {
  pointerId: number;
  pointerX: number;
  pointerY: number;
  startX: number;
  startY: number;
}

function clampPosition(position: Position): Position {
  return {
    x: Math.min(Math.max(EDGE_GAP, position.x), Math.max(EDGE_GAP, window.innerWidth - SIZE - EDGE_GAP)),
    y: Math.min(Math.max(EDGE_GAP, position.y), Math.max(EDGE_GAP, window.innerHeight - SIZE - EDGE_GAP)),
  };
}

export function Mascot() {
  const [pos, setPos] = useState<Position>({ x: 24, y: 120 });
  const [bubble, setBubble] = useState<string | null>(null);
  const [blink, setBlink] = useState(false);
  const [dragging, setDragging] = useState(false);
  const positionRef = useRef(pos);
  const dragRef = useRef<DragStart | null>(null);
  const movedRef = useRef(false);
  const suppressClickRef = useRef(false);

  const updatePosition = (nextPosition: Position) => {
    positionRef.current = nextPosition;
    setPos(nextPosition);
  };

  useEffect(() => {
    try {
      const savedPosition = window.localStorage.getItem(POSITION_KEY);
      if (savedPosition) {
        const parsed = JSON.parse(savedPosition) as Position;
        if (Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) {
          updatePosition(clampPosition(parsed));
        }
      }
    } catch (error) {
      console.error("No se pudo restaurar la posición de Lumi:", error);
    }

    const handleResize = () => updatePosition(clampPosition(positionRef.current));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let blinkTimeout: ReturnType<typeof setTimeout>;
    const blinkInterval = setInterval(() => {
      setBlink(true);
      blinkTimeout = setTimeout(() => setBlink(false), 180);
    }, 3200);

    return () => {
      clearInterval(blinkInterval);
      clearTimeout(blinkTimeout);
    };
  }, []);

  const sayHi = () => {
    const pool = quotes.filter((quote) => quote.category === "motivacion");
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setBubble(pick?.text ?? "¡Tú puedes! 🌸");
    setTimeout(() => setBubble(null), 3500);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: positionRef.current.x,
      startY: positionRef.current.y,
    };
    movedRef.current = false;
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.pointerX;
    const deltaY = event.clientY - drag.pointerY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 5) movedRef.current = true;
    if (movedRef.current) {
      event.preventDefault();
      updatePosition(clampPosition({ x: drag.startX + deltaX, y: drag.startY + deltaY }));
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);

    if (movedRef.current) {
      suppressClickRef.current = event.type === "pointerup";
      try {
        window.localStorage.setItem(POSITION_KEY, JSON.stringify(positionRef.current));
      } catch (error) {
        console.error("No se pudo guardar la posición de Lumi:", error);
      }
    }
  };

  return (
    <div
      className="fixed z-40"
      style={{ left: pos.x, top: pos.y, width: SIZE, height: SIZE }}
    >
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="absolute -top-16 left-1/2 z-10 w-48 -translate-x-1/2 rounded-2xl bg-white/95 px-3 py-2 text-center text-xs text-gray-600 shadow-glass backdrop-blur-glass"
          >
            {bubble}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={() => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }
          sayHi();
        }}
        animate={dragging ? { scale: 1.08, rotate: -6 } : { y: [0, -5, 0], rotate: [0, 2, 0] }}
        transition={dragging ? { duration: 0.15 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className={`block h-full w-full rounded-full touch-none select-none drop-shadow-[0_8px_12px_rgba(143,106,240,0.28)] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        aria-label="Lumi, tu mascota. Arrástrame para moverme o tócame para saludar."
      >
        <svg width={SIZE} height={SIZE} viewBox="0 0 76 76" role="img" aria-hidden="true">
          <defs>
            <linearGradient id="mascotGradient" x1="9" y1="8" x2="66" y2="68" gradientUnits="userSpaceOnUse">
              <stop offset="0%" style={{ stopColor: "var(--accent-from, #C2AEFF)" }} />
              <stop offset="100%" style={{ stopColor: "var(--accent-to, #FFA9CB)" }} />
            </linearGradient>
            <linearGradient id="mascotBelly" x1="24" y1="39" x2="51" y2="63" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFF4F8" stopOpacity="0.76" />
            </linearGradient>
            <filter id="mascotShadow" x="2" y="5" width="72" height="70" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7550D6" floodOpacity="0.16" />
            </filter>
          </defs>

          <ellipse cx="38" cy="67" rx="19" ry="5" fill="var(--accent-from, #C2AEFF)" opacity="0.22" />

          <g filter="url(#mascotShadow)">
            <path d="M17 33 11 28q-2-2 0-4l8-3M59 33l6-5q2-2 0-4l-8-3" fill="url(#mascotGradient)" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="22" cy="18" r="9" fill="url(#mascotGradient)" stroke="#FFFFFF" strokeOpacity=".75" strokeWidth="2" />
            <circle cx="54" cy="18" r="9" fill="url(#mascotGradient)" stroke="#FFFFFF" strokeOpacity=".75" strokeWidth="2" />
            <path d="M38 8c-16 0-27 12-27 28 0 17 11 28 27 28s27-11 27-28C65 20 54 8 38 8Z" fill="url(#mascotGradient)" stroke="#FFFFFF" strokeWidth="2.5" />
            <ellipse cx="38" cy="50" rx="15" ry="10" fill="url(#mascotBelly)" />

            <path d="M24 38c-4 2-6 6-6 10m34-10c4 2 6 6 6 10" fill="none" stroke="url(#mascotGradient)" strokeWidth="7" strokeLinecap="round" />

            <ellipse cx="25" cy="39" rx="5" ry="3.2" fill="#FF7EA8" opacity=".68" />
            <ellipse cx="51" cy="39" rx="5" ry="3.2" fill="#FF7EA8" opacity=".68" />

            {blink ? (
              <>
                <path d="M25 31q3 3 6 0m14 0q3 3 6 0" fill="none" stroke="#59427D" strokeWidth="2.6" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="28" cy="30" rx="3.4" ry="4.4" fill="#59427D" />
                <ellipse cx="48" cy="30" rx="3.4" ry="4.4" fill="#59427D" />
                <circle cx="29" cy="28.5" r="1.2" fill="#FFFFFF" />
                <circle cx="49" cy="28.5" r="1.2" fill="#FFFFFF" />
              </>
            )}
            <path d="M35 37q3-2 6 0-3 4-6 0Z" fill="#F47FA7" />
            <path d="M32 42q6 6 12 0" fill="none" stroke="#59427D" strokeWidth="2.2" strokeLinecap="round" />

            <path d="m38 5 1.6 3.6 3.9.4-2.9 2.6.8 3.8-3.4-2-3.4 2 .8-3.8-2.9-2.6 3.9-.4L38 5Z" fill="#FFE585" stroke="#FFFFFF" strokeWidth="1.2" strokeLinejoin="round" />
            <circle cx="14" cy="14" r="2" fill="#FFFFFF" opacity=".8" />
            <path d="m63 43 .8 2 2.2.2-1.7 1.4.5 2.1-1.8-1.1-1.8 1.1.5-2.1-1.7-1.4 2.2-.2.8-2Z" fill="#FFE585" />
          </g>
        </svg>
      </motion.button>
    </div>
  );
}
