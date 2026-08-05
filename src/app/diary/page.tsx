"use client";

import { Header } from "@/components/layout/Header";
import { DiaryForm } from "@/components/diary/DiaryForm";
import { DiaryList } from "@/components/diary/DiaryList";
import { useSyncDiary } from "@/hooks/useSyncData";

export default function DiaryPage() {
  const entries = useSyncDiary();
  return (
    <div className="px-5 lg:px-8">
      <Header />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DiaryForm />
        <DiaryList entries={entries} />
      </div>
    </div>
  );
}
