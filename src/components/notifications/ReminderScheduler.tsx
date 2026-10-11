"use client";

import { useEffect, useState } from "react";
import { CalendarEvent, Task } from "@/types";
import { subscribeToEvents } from "@/services/events.service";
import { subscribeToTasks } from "@/services/tasks.service";
import { useAuthStore } from "@/store/useAuthStore";

interface Reminder {
  id: string;
  kind: "task" | "event";
  title: string;
  dueAt: number;
  route: string;
}

const MAX_TIMEOUT = 2_147_000_000;
const REMINDER_OFFSETS: Record<string, number> = {
  "5m": 5 * 60_000,
  "15m": 15 * 60_000,
  "30m": 30 * 60_000,
  "1h": 60 * 60_000,
  "1d": 24 * 60 * 60_000,
  custom: 0,
};

function localDateTime(date: string, time?: string) {
  return new Date(`${date}T${time || "09:00"}:00`).getTime();
}

function getReminders(tasks: Task[], events: CalendarEvent[]): Reminder[] {
  const taskReminders = tasks
    .filter((task) => !task.completed)
    .map((task) => ({
      id: task.id,
      kind: "task" as const,
      title: task.title,
      dueAt: localDateTime(task.date, task.time),
      route: "/tasks",
    }));

  const eventReminders = events
    .filter((event) => event.reminder !== "none")
    .map((event) => ({
      id: event.id,
      kind: "event" as const,
      title: event.title,
      dueAt: localDateTime(event.date, event.time) - REMINDER_OFFSETS[event.reminder ?? "1h"],
      route: "/calendar",
    }));

  return [...taskReminders, ...eventReminders].filter((reminder) => Number.isFinite(reminder.dueAt));
}

function showReminder(uid: string, reminder: Reminder) {
  const storageKey = `lumi-notified:${uid}:${reminder.kind}:${reminder.id}:${reminder.dueAt}`;
  if (window.localStorage.getItem(storageKey)) return;

  const title = reminder.kind === "task" ? "Tarea pendiente" : "Próximo evento";
  const options: NotificationOptions = {
    body: reminder.title,
    tag: `${reminder.kind}-${reminder.id}`,
    data: { url: reminder.route },
  };

  const show = async () => {
    try {
      const registration = await navigator.serviceWorker?.getRegistration();
      if (registration) {
        await registration.showNotification(title, options);
      } else {
        const notification = new Notification(title, options);
        notification.onclick = () => {
          window.focus();
          window.location.assign(reminder.route);
        };
      }
      window.localStorage.setItem(storageKey, "1");
    } catch (error) {
      console.error("No se pudo mostrar el recordatorio:", error);
    }
  };

  void show();
}

export function ReminderScheduler() {
  const profile = useAuthStore((state) => state.profile);
  const [data, setData] = useState<{ uid: string; tasks: Task[]; events: CalendarEvent[] } | null>(null);

  useEffect(() => {
    const uid = profile?.uid;
    if (!uid || !profile.notificationsEnabled) {
      setData(null);
      return;
    }

    let tasks: Task[] | null = null;
    let events: CalendarEvent[] | null = null;
    const update = () => {
      if (tasks && events) setData({ uid, tasks, events });
    };
    const unsubscribeTasks = subscribeToTasks(uid, (nextTasks) => {
      tasks = nextTasks;
      update();
    });
    const unsubscribeEvents = subscribeToEvents(uid, (nextEvents) => {
      events = nextEvents;
      update();
    });

    return () => {
      unsubscribeTasks();
      unsubscribeEvents();
    };
  }, [profile?.uid, profile?.notificationsEnabled]);

  useEffect(() => {
    if (
      !profile?.uid ||
      !profile.notificationsEnabled ||
      !data ||
      data.uid !== profile.uid ||
      typeof window === "undefined" ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const reminders = getReminders(data.tasks, data.events);
    for (const reminder of reminders) {
      const notify = () => {
        const delay = reminder.dueAt - Date.now();
        if (delay <= 0) {
          showReminder(profile.uid, reminder);
          return;
        }
        timers.push(setTimeout(notify, Math.min(delay, MAX_TIMEOUT)));
      };
      notify();
    }

    return () => timers.forEach(clearTimeout);
  }, [data, profile?.uid, profile?.notificationsEnabled]);

  return null;
}
