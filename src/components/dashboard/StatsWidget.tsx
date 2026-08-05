"use client";

import { Card } from "@/components/ui/Card";
import { useTasksStore } from "@/store/useTasksStore";

export function StatsWidget() {
  const tasks = useTasksStore((s) => s.tasks);
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <p className="font-display text-base text-gray-700 mb-3">Tu progreso</p>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#EDE7FF" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="16" fill="none" stroke="#A98AFA" strokeWidth="3"
              strokeDasharray={`${pct} 100`} strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-lavender-600">
            {pct}%
          </span>
        </div>
        <div className="text-sm text-gray-500">
          <p>{completed} completadas</p>
          <p>{total - completed} pendientes</p>
        </div>
      </div>
    </Card>
  );
}
