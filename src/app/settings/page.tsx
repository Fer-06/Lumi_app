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
import { applyTheme, DEFAULT_THEME_ID, getThemeOverrideKey, THEME_OPTIONS } from "@/lib/theme";
import { Gender } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);
  const setProfile = useAuthStore((s) => s.setProfile);
  const { requestPermission } = useNotifications();
  const [name, setName] = useState(profile?.name ?? "");
  const [message, setMessage] = useState("");
  const [themeColor, setThemeColor] = useState(profile?.themeColor ?? THEME_OPTIONS[0].id);
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "neutral");

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
    const override = window.localStorage.getItem(getThemeOverrideKey(profile?.uid));
    const guestTheme = profile ? null : window.localStorage.getItem("lumi-theme");
    setThemeColor(override ?? guestTheme ?? profile?.themeColor ?? DEFAULT_THEME_ID);
  }, [profile]);

  useEffect(() => {
    setGender(profile?.gender ?? "neutral");
  }, [profile?.gender]);

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
    const overrideKey = getThemeOverrideKey(profile?.uid);
    setThemeColor(id);
    window.localStorage.setItem(overrideKey, id);
    applyTheme(id);

    if (!profile) return;

    setProfile({ ...profile, themeColor: id });
    try {
      await saveUserProfile(profile.uid, { themeColor: id });
      window.localStorage.removeItem(overrideKey);
      setMessage("Color actualizado y guardado.");
    } catch {
      setMessage("El color quedó aplicado en este dispositivo, pero no se pudo sincronizar con tu cuenta.");
    }
  };

  const saveGender = async (value: Gender) => {
    setGender(value);
    if (!profile) return;

    try {
      await saveUserProfile(profile.uid, { gender: value });
      setProfile({ ...profile, gender: value });
      setMessage("Preferencia de lenguaje guardada.");
    } catch {
      setMessage("No se pudo guardar tu preferencia. Intenta otra vez.");
    }
  };

  const enableNotifications = async () => {
    if (!profile) {
      setMessage("Inicia sesión para activar los recordatorios.");
      return;
    }

    try {
      const permission = await requestPermission();
      if (permission !== "granted") {
        setMessage("Permite las notificaciones en tu navegador para recibir recordatorios.");
        return;
      }

      try {
        await saveUserProfile(profile.uid, { notificationsEnabled: true });
        setProfile({ ...profile, notificationsEnabled: true });
        setMessage("Recordatorios activados para tus tareas y eventos del calendario.");
      } catch {
        setMessage("No se pudieron guardar los ajustes de notificaciones.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudieron activar las notificaciones.");
    }
  };

  const disableNotifications = async () => {
    if (!profile) return;
    try {
      await saveUserProfile(profile.uid, { notificationsEnabled: false });
      setProfile({ ...profile, notificationsEnabled: false });
      setMessage("Recordatorios desactivados.");
    } catch {
      setMessage("No se pudieron desactivar los recordatorios.");
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
        <label htmlFor="profile-gender" className="font-display text-gray-700">
          Cómo quieres que Lumi se dirija a ti
        </label>
        <select
          id="profile-gender"
          value={gender}
          onChange={(event) => {
            const value = event.target.value;
            void saveGender(value === "femenino" || value === "masculino" ? value : "neutral");
          }}
          className="rounded-xl border border-lavender-200 bg-white/80 px-3 py-2.5 text-sm text-gray-600"
          disabled={loading}
        >
          <option value="neutral">Lenguaje neutral</option>
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
        </select>
        <hr className="border-lavender-100" />
          <p className="font-display text-gray-700">Color de Lumi</p>
          <div className="flex flex-wrap gap-3">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={loading}
                onClick={() => chooseTheme(t.id)}
                className={`h-10 w-10 rounded-full border-2 transition disabled:cursor-wait ${themeColor === t.id ? "border-gray-700 scale-110" : "border-white"}`}
                style={{ background: `linear-gradient(to bottom right, ${t.from}, ${t.to})` }}
                title={t.label}
                aria-label={t.label}
                aria-pressed={themeColor === t.id}
              />
            ))}
          </div>
        <hr className="border-lavender-100" />
        {profile?.notificationsEnabled ? (
          <Button variant="secondary" onClick={disableNotifications}>Desactivar recordatorios</Button>
        ) : (
          <Button variant="secondary" onClick={enableNotifications}>Activar recordatorios</Button>
        )}
        <Button variant="ghost" onClick={handleLogout}>Cerrar sesión</Button>
      </Card>
    </div>
  );
}
