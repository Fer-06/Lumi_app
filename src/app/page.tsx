"use client";

import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { QuoteCard } from "@/components/dashboard/QuoteCard";
import { TasksSummary } from "@/components/dashboard/TasksSummary";
import { StatsWidget } from "@/components/dashboard/StatsWidget";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useUIStore } from "@/store/useUIStore";
import { useSyncTasks, useSyncEvents } from "@/hooks/useSyncData";

export default function DashboardPage() {
  useSyncTasks();
  const events = useSyncEvents();
  const isTaskModalOpen = useUIStore((s) => s.isTaskModalOpen);
  const openTaskModal = useUIStore((s) => s.openTaskModal);
  const closeTaskModal = useUIStore((s) => s.closeTaskModal);

  return (
    <div className="px-5 lg:px-8">
      <Header />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <QuoteCard />
          <TasksSummary />
        </div>
        <div className="flex flex-col gap-4">
          <MiniCalendar />
          <StatsWidget />
          <UpcomingEvents events={events} />
        </div>
      </div>

      <button
        onClick={openTaskModal}
        className="fixed bottom-24 right-5 z-30 rounded-full bg-gradient-to-br from-lavender-400 to-blush-400 p-4 text-white shadow-glass lg:bottom-8 lg:right-8"
      >
        <Plus size={22} />
      </button>

      <Modal open={isTaskModalOpen} onClose={closeTaskModal} title="Nueva tarea">
        <TaskForm />
      </Modal>
    </div>
  );
}
