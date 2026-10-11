"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getRegistrationErrorMessage, registerUser } from "@/services/auth.service";
import { Gender } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>("neutral");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      await registerUser(name, email, password, gender);
      router.push("/");
    } catch (err) {
      console.error("Error al crear la cuenta:", err);
      setError(getRegistrationErrorMessage(err));
    } finally {
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
            <p className="font-display text-2xl text-lavender-600">Bienvenida a Lumi ✨</p>
            <p className="text-sm text-gray-400">Crea tu cuenta para empezar</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Input placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Correo Gmail o institucional" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <select
            value={gender}
            onChange={(e) => {
              const value = e.target.value;
              setGender(value === "femenino" || value === "masculino" ? value : "neutral");
            }}
            className="rounded-xl border border-lavender-200 bg-white/80 px-3 py-2.5 text-sm text-gray-600"
            aria-label="Cómo quieres que Lumi se dirija a ti"
          >
            <option value="neutral">Prefiero lenguaje neutral</option>
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
          </select>
          {error && <p className="rounded-lg bg-blush-50 px-3 py-2 text-xs text-blush-500" role="alert">{error}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta? <Link href="/login" className="font-medium text-lavender-500">Inicia sesión</Link>
        </p>
      </Card>
    </div>
  );
}
