"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { EventForm } from "@/components/calendar/EventForm";
import { useSyncEvents, useSyncTasks } from "@/hooks/useSyncData";
import { useTasksStore } from "@/store/useTasksStore";
import { deleteEvent } from "@/services/events.service";
import { todayISO } from "@/lib/utils";

export default function CalendarPage() {
  useSyncTasks();
  const events = useSyncEvents();
  const tasks = useTasksStore((s) => s.tasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const eventIds = new Set(events.map((e) => e.id));

  const calendarEvents = [
    ...events.map((e) => ({ id: e.id, title: e.title, date: e.date, color: e.color })),
    ...tasks.map((t) => ({ id: `task-${t.id}`, title: `📌 ${t.title}`, date: t.date, color: t.color })),
  ];

  const openForDate = (date: string) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleDateClick = (arg: DateClickArg) => {
    openForDate(arg.dateStr);
  };

  const handleEventClick = async (arg: EventClickArg) => {
    const id = arg.event.id;
    if (id.startsWith("task-")) {
      alert("Esta es una tarea 📌 — ve a la sección Pendientes para editarla o eliminarla.");
      return;
    }
    if (!eventIds.has(id)) return;
    const confirmDelete = window.confirm(`¿Eliminar "${arg.event.title}" del calendario?`);
    if (!confirmDelete) return;
    try {
      await deleteEvent(id);
    } catch (err) {
      console.error("Error al eliminar la notita:", err);
      alert("No se pudo eliminar. Revisa tu conexión.");
    }
  };

  return (
    <div className="px-5 lg:px-8">
      <Header />
      <Card className="p-3 lg:p-5">
        <style>{`
          .fc { --fc-border-color: #EDE7FF; --fc-today-bg-color: #F5F3FF; font-family: var(--font-sans); }
          .fc .fc-toolbar-title { font-family: var(--font-display); color: #6B4FC4; font-size: 1.1rem; }
          .fc .fc-button { background: #A98AFA; border: none; }
          .fc .fc-button:hover { background: #8F6AF0; }
          .fc-daygrid-event { border-radius: 8px; border: none; padding: 1px 4px; cursor: pointer; }
          .fc-daygrid-day:hover { background: #FBF9FF; cursor: pointer; }
        `}</style>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="es"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
          events={calendarEvents}
          editable
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
        />
      </Card>

      <button
        onClick={() => openForDate(todayISO())}
        className="fixed bottom-24 right-5 z-30 rounded-full bg-gradient-to-br from-lavender-400 to-blush-400 p-4 text-white shadow-glass lg:bottom-8 lg:right-8"
      >
        <Plus size={22} />
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva notita 🌸">
        <EventForm defaultDate={selectedDate} onSaved={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}