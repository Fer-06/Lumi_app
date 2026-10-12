"use client";

import { useState } from "react";
import { Pin, Trash2 } from "lucide-react";
import { QuickNote } from "@/types";
import { updateNote, deleteNote, createNote } from "@/services/notes.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const colors = ["#F5F3FF", "#FFE4EF", "#DBF6E9", "#DCEFFF", "#FFF9EE", "#FFEFB0"];

export function NotesGrid({ notes }: { notes: QuickNote[] }) {
  const profile = useAuthStore((s) => s.profile);
  const [draft, setDraft] = useState("");

  const addNote = async () => {
    if (!profile || !draft.trim()) return;
    await createNote({
      userId: profile.uid,
      text: draft,
      color: colors[Math.floor(Math.random() * colors.length)],
      pinned: false,
      createdAt: new Date().toISOString(),
    });
    setDraft("");
  };

  const sorted = [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Textarea
          placeholder="Escribe una nota rápida..."
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="min-w-0"
        />
        <Button onClick={addNote} className="shrink-0 self-end sm:self-auto">Añadir</Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((note) => (
          <div key={note.id} className="rounded-xl2 p-4 shadow-soft" style={{ backgroundColor: note.color }}>
            <p className="break-words whitespace-pre-line text-sm text-gray-700">{note.text}</p>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => updateNote(note.id, { pinned: !note.pinned })}>
                <Pin size={14} className={note.pinned ? "text-lavender-600" : "text-gray-400"} />
              </button>
              <button onClick={() => deleteNote(note.id)}>
                <Trash2 size={14} className="text-gray-400 hover:text-blush-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
