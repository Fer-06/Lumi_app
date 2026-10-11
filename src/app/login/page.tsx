"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loginUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const setProfile = useAuthStore((state) => state.setProfile);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      const credential = await loginUser(email.trim(), password);
      const user = credential.user;
      setProfile({
        uid: user.uid,
        name: user.displayName ?? "",
        email: user.email ?? email.trim(),
        gender: "neutral",
        notificationsEnabled: false,
        language: "es",
      });
      router.replace("/");
    } catch (loginError) {
      console.error("No se pudo iniciar sesión:", loginError);
      setError("No pudimos iniciar sesión. Revisa tus datos.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(167,138,250,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,169,203,0.24),_transparent_35%)]" />
      <Card className="relative w-full max-w-md overflow-hidden border border-white/70 bg-white/75 p-6 backdrop-blur-xl shadow-glass">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lavender-400 to-blush-400 text-white shadow-soft">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="font-display text-2xl text-lavender-600">Hola de nuevo 🌸</p>
            <p className="text-sm text-gray-400">Inicia sesión en Lumi</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
          <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSubmitting} />
          {error && <p className="text-xs text-blush-500" role="alert">{error}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          ¿No tienes cuenta? <Link href="/register" className="font-medium text-lavender-500">Regístrate</Link>
        </p>
      </Card>
    </div>
  );
}
