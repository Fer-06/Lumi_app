"use client";

import { Card } from "@/components/ui/Card";
import { CalendarEvent } from "@/types";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function UpcomingEvents({ events }: { events: CalendarEvent[] }) {
  const upcoming = [...events]
    .filter((e) => new Date(e.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <Card>
      <p className="font-display text-base text-gray-700 mb-3">Próximos eventos</p>
      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-400">Nada agendado por ahora.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {upcoming.map((ev) => (
            <li key={ev.id} className="flex items-center gap-3 text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ev.color }} />
              <span className="flex-1 text-gray-600">{ev.title}</span>
              <span className="text-xs text-gray-400">
                {format(parseISO(ev.date), "d MMM", { locale: es })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
