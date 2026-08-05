"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

// Mantiene la hora/fecha actualizada mientras la app está abierta,
// para que el saludo, la frase del día y el calendario cambien solos
// al pasar la medianoche, sin necesidad de recargar la página.
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

export function useTodayISO() {
  const now = useNow();
  return format(now, "yyyy-MM-dd");
}