"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ErrorText } from "@/components/ui/ErrorText";
import { createEvent } from "@/services/events.service";
import { useAuthStore } from "@/store/useAuthStore";
import { EventCategory, ReminderOffset } from "@/types";

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
  const [time, setTime] = useState("09:00");
  const [reminder, setReminder] = useState<ReminderOffset>("1h");
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
        time,
        reminder,
        color: chosen.color,
        notes,
      });
      setTitle("");
      setNotes("");
      setTime("09:00");
      setReminder("1h");
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
      <div className="grid grid-cols-2 gap-3">
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <select
          value={reminder}
          onChange={(e) => setReminder(e.target.value as ReminderOffset)}
          className="rounded-xl border border-lavender-200 bg-white/80 px-3 py-2.5 text-sm"
          aria-label="Avisarme antes del evento"
        >
          <option value="5m">Avisarme 5 min antes</option>
          <option value="15m">Avisarme 15 min antes</option>
          <option value="30m">Avisarme 30 min antes</option>
          <option value="1h">Avisarme 1 hora antes</option>
          <option value="1d">Avisarme 1 día antes</option>
          <option value="none">Sin recordatorio</option>
        </select>
      </div>
      <Textarea placeholder="Detalles (opcional)" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button onClick={save} className="self-end">Guardar en el calendario</Button>
    </div>
  );
}
