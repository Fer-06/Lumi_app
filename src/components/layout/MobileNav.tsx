"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookHeart,
  Calendar,
  GraduationCap,
  Home,
  ListTodo,
  Menu,
  MessageCircle,
  Settings,
  Sparkles,
  StickyNote,
  Target,
  Wind,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/tasks", label: "Tareas", icon: ListTodo },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/chat", label: "Lumi", icon: MessageCircle },
];

const moreLinks = [
  { href: "/university", label: "Universidad", icon: GraduationCap },
  { href: "/notes", label: "Notas", icon: StickyNote },
  { href: "/diary", label: "Diario", icon: BookHeart },
  { href: "/relax", label: "Relax", icon: Wind },
  { href: "/quotes", label: "Frases", icon: Sparkles },
  { href: "/goals", label: "Objetivos", icon: Target },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreLinks.some(({ href }) => pathname === href);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      {moreOpen && (
        <button
          type="button"
          aria-label="Cerrar menú de más opciones"
          className="fixed inset-0 z-40 bg-black/10 lg:hidden"
          onClick={() => setMoreOpen(false)}
        />
      )}
      {moreOpen && (
        <nav
          aria-label="Más secciones"
          className="fixed bottom-20 left-3 right-3 z-50 grid grid-cols-2 gap-2 rounded-2xl border border-lavender-100 bg-white/95 p-3 shadow-glass backdrop-blur-glass lg:hidden"
        >
          {moreLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm",
                  active ? "bg-lavender-100 text-lavender-700" : "text-gray-600 hover:bg-lavender-50",
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      )}
      <nav
        aria-label="Navegación principal"
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-lavender-100 bg-white/90 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-glass lg:hidden"
      >
        {mainLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center gap-0.5 px-2 py-1 text-[11px]",
                active ? "text-lavender-600" : "text-gray-400",
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((open) => !open)}
          aria-label={moreOpen ? "Cerrar más opciones" : "Abrir más opciones"}
          aria-expanded={moreOpen}
          className={cn(
            "flex min-w-0 flex-col items-center gap-0.5 px-2 py-1 text-[11px]",
            moreOpen || moreActive ? "text-lavender-600" : "text-gray-400",
          )}
        >
          {moreOpen ? <X size={20} /> : <Menu size={20} />}
          Más
        </button>
      </nav>
    </>
  );
}
