"use client";

import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Tabs } from "@/components/ui/Tabs";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Modal } from "@/components/ui/Modal";
import { useTasksStore } from "@/store/useTasksStore";
import { useUIStore } from "@/store/useUIStore";
import { useSyncTasks } from "@/hooks/useSyncData";

export default function TasksPage() {
  useSyncTasks();
  const filter = useTasksStore((s) => s.filter);
  const setFilter = useTasksStore((s) => s.setFilter);
  const isTaskModalOpen = useUIStore((s) => s.isTaskModalOpen);
  const openTaskModal = useUIStore((s) => s.openTaskModal);
  const closeTaskModal = useUIStore((s) => s.closeTaskModal);

  return (
    <div className="px-5 lg:px-8">
      <Header />
      <div className="mb-4 flex items-center justify-between">
        <Tabs
          value={filter}
          onChange={(v) => setFilter(v as any)}
          options={[
            { label: "Todas", value: "todas" },
            { label: "Pendientes", value: "pendientes" },
            { label: "Completadas", value: "completadas" },
          ]}
        />
        <button
          onClick={openTaskModal}
          className="rounded-full bg-accent-gradient p-2.5 text-white shadow-soft"
        >
          <Plus size={18} />
        </button>
      </div>
      <TaskList />
      <Modal open={isTaskModalOpen} onClose={closeTaskModal} title="Nueva tarea">
        <TaskForm />
      </Modal>
    </div>
  );
}
