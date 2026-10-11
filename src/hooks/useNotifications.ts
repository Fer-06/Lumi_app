"use client";

import { useCallback } from "react";

export function useNotifications() {
  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      throw new Error("Este navegador no admite notificaciones.");
    }

    return Notification.requestPermission();
  }, []);

  return { requestPermission };
}
