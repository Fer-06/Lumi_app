"use client";

import { useCallback } from "react";
import { getToken } from "firebase/messaging";
import { getMessagingIfSupported } from "@/lib/firebase";

// Solicita permiso y obtiene el token de FCM para notificaciones push reales.
// Requiere NEXT_PUBLIC_FIREBASE_VAPID_KEY y un service worker en /public/firebase-messaging-sw.js
export function useNotifications() {
  const requestPermission = useCallback(async () => {
    const messaging = await getMessagingIfSupported();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token;
  }, []);

  return { requestPermission };
}
