"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, isSameDay, addMonths, subMonths, format,
} from "date-fns";
import { es } from "date-fns/locale";

export function MiniCalendar() {
  const [current, setCurrent] = useState(new Date());
  const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(current), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-base text-gray-700 capitalize">
          {format(current, "MMMM yyyy", { locale: es })}
        </p>
        <div className="flex gap-1">
          <button onClick={() => setCurrent(subMonths(current, 1))} className="text-gray-400 hover:text-lavender-500">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrent(addMonths(current, 1))} className="text-gray-400 hover:text-lavender-500">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-400 mb-1">
        {["L", "M", "X", "J", "V", "S", "D"].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <span
            key={day.toISOString()}
            className={[
              "flex h-7 w-7 items-center justify-center rounded-full text-xs",
              isSameDay(day, new Date()) ? "bg-lavender-400 text-white" : "",
              !isSameMonth(day, current) ? "text-gray-300" : "text-gray-600",
            ].join(" ")}
          >
            {day.getDate()}
          </span>
        ))}
      </div>
    </Card>
  );
}
