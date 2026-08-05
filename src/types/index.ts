export type Priority = "muy-alta" | "alta" | "media" | "baja";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  date: string; // ISO date
  time?: string; // HH:mm
  color: string;
  courseId?: string;
  professor?: string;
  tags: string[];
  subtasks: Subtask[];
  links: string[];
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory =
  | "salida"
  | "cumpleanos"
  | "exposicion"
  | "viaje"
  | "gym"
  | "cita"
  | "recordatorio"
  | "examen"
  | "laboratorio"
  | "trabajo";

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  category: EventCategory;
  date: string;
  time?: string;
  color: string;
  courseId?: string;
  notes?: string;
  reminder?: ReminderOffset;
}

export type ReminderOffset =
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "1d"
  | "custom"
  | "none";

export interface Course {
  id: string;
  userId: string;
  name: string;
  professor?: string;
  color: string;
  materials: { name: string; url: string }[];
  links: { name: string; url: string }[];
  notes?: string;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  date: string;
  time: string;
  mood: "genial" | "bien" | "normal" | "mal" | "terrible";
  emoji: string;
  title: string;
  text: string;
  photos: string[];
  tags: string[];
}

export interface QuickNote {
  id: string;
  userId: string;
  text: string;
  color: string;
  pinned: boolean;
  reminderDate?: string;
  createdAt: string;
}

export type QuoteCategory =
  | "motivacion"
  | "exito"
  | "disciplina"
  | "universidad"
  | "estudio"
  | "autoestima"
  | "fisico"
  | "ansiedad"
  | "amor-propio"
  | "suenos"
  | "futuro"
  | "esperanza"
  | "gym"
  | "confianza";

export interface Quote {
  id: string;
  text: string;
  category: QuoteCategory;
}

export type GoalPeriod = "diaria" | "semanal" | "mensual" | "anual";

export interface Goal {
  id: string;
  userId: string;
  title: string;
  period: GoalPeriod;
  target: number;
  progress: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  themeColor?: string;
  notificationsEnabled: boolean;
  language: "es" | "en";
}
