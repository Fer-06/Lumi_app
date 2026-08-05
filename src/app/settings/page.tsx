"use client";

import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { saveUserProfile, logoutUser } from "@/services/auth.service";
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const { requestPermission } = useNotifications();
  const [name, setName] = useState(profile?.name ?? "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile]);

  const save = async () => {
    if (!profile) {
      setMessage("Primero inicia sesión para guardar tu perfil.");
      return;
    }

    try {
      await saveUserProfile(profile.uid, { name });
      setProfile({ ...profile, name });
      setMessage("Cambios guardados correctamente.");
    } catch {
      setMessage("No se pudieron guardar los cambios. Intenta otra vez.");
    }
  };

  const enableNotifications = async () => {
    const token = await requestPermission();
    if (profile && token) {
      try {
        await saveUserProfile(profile.uid, { notificationsEnabled: true });
        setProfile({ ...profile, notificationsEnabled: true });
        setMessage("Notificaciones activadas.");
      } catch {
        setMessage("No se pudieron activar las notificaciones.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setProfile(null);
      router.push("/login");
    } catch {
      setMessage("No se pudo cerrar sesión. Intenta otra vez.");
    }
  };

  return (
    <div className="px-5 lg:px-8">
      <Header />
      <Card className="max-w-md flex flex-col gap-3">
        <p className="font-display text-gray-700">Tu perfil</p>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
        <Button onClick={save}>Guardar cambios</Button>
        {message && <p className="text-xs text-gray-500">{message}</p>}
        <hr className="border-lavender-100" />
        <Button variant="secondary" onClick={enableNotifications}>Activar notificaciones</Button>
        <Button variant="ghost" onClick={handleLogout}>Cerrar sesión</Button>
      </Card>
    </div>
  );
}
