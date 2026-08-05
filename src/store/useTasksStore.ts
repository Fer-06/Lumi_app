import { create } from "zustand";
import { Task } from "@/types";

interface TasksState {
  tasks: Task[];
  setTasks: (t: Task[]) => void;
  filter: "todas" | "pendientes" | "completadas";
  setFilter: (f: TasksState["filter"]) => void;
  view: "lista" | "kanban" | "calendario" | "semanal" | "mensual";
  setView: (v: TasksState["view"]) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  filter: "todas",
  setFilter: (filter) => set({ filter }),
  view: "lista",
  setView: (view) => set({ view }),
}));
