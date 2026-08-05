"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ErrorText } from "@/components/ui/ErrorText";
import { createEvent } from "@/services/events.service";
import { useAuthStore } from "@/store/useAuthStore";
import { EventCategory } from "@/types";

const categories: { value: EventCategory; label: string; color: string }[] = [
  { value: "recordatorio", label: "Notita 💌", color: "#C2AEFF" },
  { value: "salida", label: "Salida 🌷", color: "#FFA9CB" },
  { value: "cumpleanos", label: "Cumpleaños 🎂", color: "#FFE585" },
  { value: "exposicion", label: "Exposición 📚", color: "#8FCCFF" },
  { value: "examen", label: "Examen ✏️", color: "#F76BA0" },
  { value: "gym", label: "Gym 💪", color: "#8FE3B8" },
  { value: "cita", label: "Cita 📅", color: "#A98AFA" },
  { value: "viaje", label: "Viaje ✈️", color: "#B8DFFF" },
];

export function EventForm({ defaultDate, onSaved }: { defaultDate: string; onSaved: () => void }) {
  const profile = useAuthStore((s) => s.profile);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [category, setCategory] = useState<EventCategory>("recordatorio");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    if (!profile) {
      setError("Necesitas iniciar sesión para agregar notitas al calendario.");
      return;
    }
    if (!title.trim()) {
      setError("Escribe un título para tu notita.");
      return;
    }
    const chosen = categories.find((c) => c.value === category)!;
    try {
      await createEvent({
        userId: profile.uid,
        title,
        category,
        date,
        color: chosen.color,
        notes,
      });
      setTitle("");
      setNotes("");
      onSaved();
    } catch (err) {
      console.error("Error al guardar la notita:", err);
      setError("No se pudo guardar. Revisa la configuración de Firebase.");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <ErrorText message={error} />
      <Input placeholder="¿Qué quieres anotar? 🌸" value={title} onChange={(e) => setTitle(e.target.value)} />

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              category === c.value ? "text-white" : "text-gray-500 bg-lavender-50"
            }`}
            style={category === c.value ? { backgroundColor: c.color } : {}}
          >
            {c.label}
          </button>
        ))}
      </div>

      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Textarea placeholder="Detalles (opcional)" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button onClick={save} className="self-end">Guardar en el calendario</Button>
    </div>
  );
}
