"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useTasksStore } from "@/store/useTasksStore";
import { todayISO, PRIORITY_COLOR } from "@/lib/utils";

export function TasksSummary() {
  const tasks = useTasksStore((s) => s.tasks);
  const todayTasks = tasks.filter((t) => t.date === todayISO());

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-base text-gray-700">Tareas de hoy</p>
        <Link href="/tasks" className="text-xs font-medium text-lavender-500 hover:underline">
          Ver todas
        </Link>
      </div>
      {todayTasks.length === 0 ? (
        <p className="text-sm text-gray-400">No tienes tareas para hoy. Disfruta el día 🌷</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todayTasks.slice(0, 5).map((task) => (
            <li key={task.id} className="flex items-center gap-2 text-sm text-gray-600">
              {task.completed ? (
                <CheckCircle2 size={16} className="text-mint-400" />
              ) : (
                <Circle size={16} style={{ color: PRIORITY_COLOR[task.priority] }} />
              )}
              <span className={task.completed ? "line-through text-gray-300" : ""}>{task.title}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
