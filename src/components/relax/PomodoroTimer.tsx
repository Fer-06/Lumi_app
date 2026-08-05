"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const MODES = { estudio: 25 * 60, descanso: 5 * 60, descansoLargo: 15 * 60 };

export function PomodoroTimer() {
  const [mode, setMode] = useState<keyof typeof MODES>("estudio");
  const [secondsLeft, setSecondsLeft] = useState(MODES.estudio);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const changeMode = (m: keyof typeof MODES) => {
    setMode(m);
    setSecondsLeft(MODES[m]);
    setRunning(false);
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Card className="flex flex-col items-center gap-4 py-8">
      <div className="flex gap-2">
        {(Object.keys(MODES) as (keyof typeof MODES)[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              mode === m ? "bg-lavender-400 text-white" : "bg-lavender-50 text-gray-500"
            }`}
          >
            {m === "estudio" ? "Estudio" : m === "descanso" ? "Descanso" : "Descanso largo"}
          </button>
        ))}
      </div>
      <p className="font-display text-6xl text-lavender-600 tabular-nums">{minutes}:{seconds}</p>
      <div className="flex gap-3">
        <Button onClick={() => setRunning((r) => !r)}>
          {running ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        <Button variant="secondary" onClick={() => changeMode(mode)}>
          <RotateCcw size={18} />
        </Button>
      </div>
    </Card>
  );
}
