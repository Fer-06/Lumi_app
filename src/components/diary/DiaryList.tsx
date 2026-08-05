"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { DiaryEntry } from "@/types";
import { Card } from "@/components/ui/Card";
import { deleteDiaryEntry } from "@/services/diary.service";

export function DiaryList({ entries }: { entries: DiaryEntry[] }) {
  const remove = async (id: string) => {
    const confirmDelete = window.confirm("¿Eliminar esta entrada del diario?");
    if (!confirmDelete) return;
    try {
      await deleteDiaryEntry(id);
    } catch (err) {
      console.error("Error al eliminar la entrada:", err);
      alert("No se pudo eliminar. Revisa tu conexión.");
    }
  };

  if (entries.length === 0) {
    return <p className="text-sm text-gray-400 py-6 text-center">Aún no hay entradas. Escribe la primera 🌷</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <div className="flex items-center justify-between mb-1">
            <p className="font-display text-gray-700">{entry.emoji} {entry.title}</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                {format(parseISO(entry.date), "d MMM yyyy", { locale: es })}
              </span>
              <button onClick={() => remove(entry.id)} className="text-gray-300 hover:text-blush-500">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 whitespace-pre-line">{entry.text}</p>
        </Card>
      ))}
    </div>
  );
}