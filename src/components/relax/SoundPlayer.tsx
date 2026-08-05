"use client";

import { useState } from "react";
import { CloudRain, Waves, Trees, Moon, Flame, Pause, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";

const sounds = [
  { id: "lluvia", label: "Lluvia", icon: CloudRain, src: "/sounds/rain.mp3" },
  { id: "mar", label: "Mar", icon: Waves, src: "/sounds/ocean.mp3" },
  { id: "bosque", label: "Bosque", icon: Trees, src: "/sounds/forest.mp3" },
  { id: "noche", label: "Noche", icon: Moon, src: "/sounds/night.mp3" },
  { id: "chimenea", label: "Chimenea", icon: Flame, src: "/sounds/fireplace.mp3" },
];

// Nota: agrega tus propios archivos de audio en /public/sounds/
// (no incluidos por licencias — cualquier mp3 libre de derechos funciona).
export function SoundPlayer() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const toggle = (id: string, src: string) => {
    if (playingId === id) {
      audio?.pause();
      setPlayingId(null);
      return;
    }
    audio?.pause();
    const newAudio = new Audio(src);
    newAudio.loop = true;
    newAudio.play().catch(() => {});
    setAudio(newAudio);
    setPlayingId(id);
  };

  return (
    <Card>
      <p className="font-display text-base text-gray-700 mb-4">Sonidos ambientales</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {sounds.map(({ id, label, icon: Icon, src }) => (
          <button
            key={id}
            onClick={() => toggle(id, src)}
            className={`flex flex-col items-center gap-2 rounded-xl2 p-4 transition ${
              playingId === id ? "bg-lavender-100" : "bg-white/60"
            }`}
          >
            <Icon size={22} className="text-lavender-500" />
            <span className="text-xs text-gray-500">{label}</span>
            {playingId === id ? <Pause size={12} /> : <Play size={12} />}
          </button>
        ))}
      </div>
    </Card>
  );
}
