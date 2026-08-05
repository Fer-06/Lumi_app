"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loginUser } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      router.push("/");
    } catch {
      setError("No pudimos iniciar sesión. Revisa tus datos.");
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
          <Input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-xs text-blush-500">{error}</p>}
          <Button type="submit">Iniciar sesión</Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          ¿No tienes cuenta? <Link href="/register" className="font-medium text-lavender-500">Regístrate</Link>
        </p>
      </Card>
    </div>
  );
}
