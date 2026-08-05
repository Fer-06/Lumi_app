"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const phases = [
  { label: "Inhala", duration: 4 },
  { label: "Sostén", duration: 4 },
  { label: "Exhala", duration: 6 },
];

export function BreathingExercise() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % phases.length);
    }, phases[phaseIndex].duration * 1000);
    return () => clearTimeout(timeout);
  }, [phaseIndex]);

  const phase = phases[phaseIndex];
  const scale = phase.label === "Inhala" ? 1.3 : phase.label === "Exhala" ? 0.8 : 1.1;

  return (
    <Card className="flex flex-col items-center gap-6 py-10">
      <motion.div
        animate={{ scale }}
        transition={{ duration: phase.duration, ease: "easeInOut" }}
        className="h-28 w-28 rounded-full bg-gradient-to-br from-lavender-300 to-blush-300 shadow-glass"
      />
      <p className="font-display text-xl text-lavender-600">{phase.label}</p>
      <p className="text-sm text-gray-400">Sigue el ritmo del círculo</p>
    </Card>
  );
}
