import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function todayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatFriendlyDate(date: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export const PRIORITY_LABEL: Record<string, string> = {
  "muy-alta": "Muy alta",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const PRIORITY_COLOR: Record<string, string> = {
  "muy-alta": "#F76BA0",
  alta: "#FFA9CB",
  media: "#A98AFA",
  baja: "#8FE3B8",
};
