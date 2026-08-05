"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { createDiaryEntry } from "@/services/diary.service";
import { useAuthStore } from "@/store/useAuthStore";
import { todayISO } from "@/lib/utils";

const moods = [
  { value: "genial", emoji: "🤩" },
  { value: "bien", emoji: "🙂" },
  { value: "normal", emoji: "😐" },
  { value: "mal", emoji: "😔" },
  { value: "terrible", emoji: "😢" },
] as const;

export function DiaryForm() {
  const profile = useAuthStore((s) => s.profile);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mood, setMood] = useState<(typeof moods)[number]["value"]>("bien");

  const save = async () => {
    if (!profile || !text.trim()) return;
    const emoji = moods.find((m) => m.value === mood)?.emoji ?? "🙂";
    await createDiaryEntry({
      userId: profile.uid,
      date: todayISO(),
      time: new Date().toTimeString().slice(0, 5),
      mood,
      emoji,
      title: title || "Sin título",
      text,
      photos: [],
      tags: [],
    });
    setTitle("");
    setText("");
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl2 bg-white/70 p-5 shadow-soft">
      <div className="flex gap-2">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => setMood(m.value)}
            className={`text-2xl rounded-full p-1.5 transition ${mood === m.value ? "bg-lavender-100" : ""}`}
          >
            {m.emoji}
          </button>
        ))}
      </div>
      <Input placeholder="Título del día" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="¿Cómo te fue hoy?" rows={5} value={text} onChange={(e) => setText(e.target.value)} />
      <Button onClick={save} className="self-end">Guardar entrada</Button>
    </div>
  );
}
