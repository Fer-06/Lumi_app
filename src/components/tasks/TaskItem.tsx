"use client";

import { CheckCircle2, Circle, Trash2, Copy } from "lucide-react";
import { Task } from "@/types";
import { PRIORITY_COLOR, PRIORITY_LABEL, cn } from "@/lib/utils";
import { updateTask, deleteTask, duplicateTask } from "@/services/tasks.service";
import { Badge } from "@/components/ui/Badge";

export function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-lavender-100 bg-white/70 p-3">
      <button onClick={() => updateTask(task.id, { completed: !task.completed })}>
        {task.completed ? (
          <CheckCircle2 size={20} className="text-mint-400" />
        ) : (
          <Circle size={20} style={{ color: PRIORITY_COLOR[task.priority] }} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm text-gray-700 truncate", task.completed && "line-through text-gray-300")}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <Badge color={PRIORITY_COLOR[task.priority]}>{PRIORITY_LABEL[task.priority]}</Badge>
          {task.time && <span className="text-xs text-gray-400">{task.time}</span>}
        </div>
      </div>

      <button onClick={() => duplicateTask(task)} className="text-gray-300 hover:text-lavender-500">
        <Copy size={16} />
      </button>
      <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-blush-500">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
