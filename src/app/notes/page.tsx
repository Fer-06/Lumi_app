"use client";

import { Header } from "@/components/layout/Header";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { useSyncNotes } from "@/hooks/useSyncData";

export default function NotesPage() {
  const notes = useSyncNotes();
  return (
    <div className="px-5 lg:px-8">
      <Header />
      <NotesGrid notes={notes} />
    </div>
  );
}
