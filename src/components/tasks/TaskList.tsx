"use client";

import { useTasksStore } from "@/store/useTasksStore";
import { TaskItem } from "./TaskItem";

export function TaskList() {
  const tasks = useTasksStore((s) => s.tasks);
  const filter = useTasksStore((s) => s.filter);

  const filtered = tasks.filter((t) => {
    if (filter === "pendientes") return !t.completed;
    if (filter === "completadas") return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No hay tareas aquí todavía 🌷</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {filtered.map((task) => <TaskItem key={task.id} task={task} />)}
    </div>
  );
}
