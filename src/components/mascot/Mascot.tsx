"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quotes } from "@/data/quotes";

const MARGIN = 24;
const HEADER_SAFE = 90;
const BOTTOM_SAFE = 110; // deja libre el nav móvil y el botón flotante
const SIZE = 56;

function randomPoint(width: number, height: number) {
  const x = MARGIN + Math.random() * Math.max(width - SIZE - MARGIN * 2, 0);
  const y = HEADER_SAFE + Math.random() * Math.max(height - SIZE - HEADER_SAFE - BOTTOM_SAFE, 0);
  return { x, y };
}

export function Mascot() {
  const [pos, setPos] = useState({ x: 24, y: 120 });
  const [bubble, setBubble] = useState<string | null>(null);
  const [blink, setBlink] = useState(false);
  const boundsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const updateBounds = () => {
      boundsRef.current = { width: window.innerWidth, height: window.innerHeight };
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);

    const wander = () => {
      const { width, height } = boundsRef.current;
      if (width === 0) return;
      setPos(randomPoint(width, height));
    };
    wander();
    const moveInterval = setInterval(wander, 6000);

    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3200);

    return () => {
      window.removeEventListener("resize", updateBounds);
      clearInterval(moveInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  const sayHi = () => {
    const pool = quotes.filter((q) => q.category === "motivacion");
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setBubble(pick?.text ?? "¡Tú puedes! 🌸");
    setTimeout(() => setBubble(null), 3500);
  };

  return (
    <motion.div
      className="fixed z-20"
      style={{ top: 0, left: 0 }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", damping: 14, stiffness: 36, mass: 1 }}
    >
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="absolute -top-16 left-1/2 w-44 -translate-x-1/2 rounded-2xl bg-white/90 backdrop-blur-glass px-3 py-2 text-center text-xs text-gray-600 shadow-glass"
          >
            {bubble}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={sayHi}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="block"
        aria-label="Lumi, tu mascota"
      >
        <svg width="56" height="56" viewBox="0 0 56 56">
          <ellipse cx="28" cy="50" rx="14" ry="4" fill="#C2AEFF" opacity="0.25" />
          <circle cx="28" cy="28" r="22" fill="url(#mascotGradient)" />
          <circle cx="20" cy="14" r="5" fill="#FFE585" />
          <circle cx="36" cy="14" r="5" fill="#FFA9CB" />
          {blink ? (
            <>
              <line x1="16" y1="27" x2="22" y2="27" stroke="#6B4FC4" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="34" y1="27" x2="40" y2="27" stroke="#6B4FC4" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="19" cy="27" r="3" fill="#6B4FC4" />
              <circle cx="37" cy="27" r="3" fill="#6B4FC4" />
            </>
          )}
          <path d="M20 35 Q28 41 36 35" stroke="#6B4FC4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="mascotGradient" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" style={{ stopColor: "var(--accent-from, #C2AEFF)" }} />
              <stop offset="100%" style={{ stopColor: "var(--accent-to, #FFA9CB)" }} />
            </linearGradient>
          </defs>
        </svg>
      </motion.button>
    </motion.div>
  );
}