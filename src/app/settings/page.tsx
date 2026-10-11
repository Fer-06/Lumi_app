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
import { THEME_OPTIONS } from "@/lib/theme";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const { requestPermission } = useNotifications();
  const [name, setName] = useState(profile?.name ?? "");
  const [message, setMessage] = useState("");
  const [themeColor, setThemeColor] = useState(profile?.themeColor ?? THEME_OPTIONS[0].id);

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

  const chooseTheme = async (id: string) => {
  setThemeColor(id);
  if (!profile) return;
  try {
    await saveUserProfile(profile.uid, { themeColor: id });
  } catch (err) {
    console.error("Error al guardar el color:", err);
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
          <p className="font-display text-gray-700">Color de Lumi</p>
          <div className="flex flex-wrap gap-3">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => chooseTheme(t.id)}
                className={`h-10 w-10 rounded-full border-2 transition ${themeColor === t.id ? "border-gray-700 scale-110" : "border-white"}`}
                style={{ background: `linear-gradient(to bottom right, ${t.from}, ${t.to})` }}
                title={t.label}
                aria-label={t.label}
              />
            ))}
          </div>
        <hr className="border-lavender-100" />
        <Button variant="secondary" onClick={enableNotifications}>Activar notificaciones</Button>
        <Button variant="ghost" onClick={handleLogout}>Cerrar sesión</Button>
      </Card>
    </div>
  );
}
