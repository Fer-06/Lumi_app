"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, ListTodo, Calendar, GraduationCap, BookHeart, StickyNote,
  MessageCircle, Wind, Target, Sparkles, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/tasks", label: "Pendientes", icon: ListTodo },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/university", label: "Universidad", icon: GraduationCap },
  { href: "/diary", label: "Diario", icon: BookHeart },
  { href: "/notes", label: "Notas", icon: StickyNote },
  { href: "/quotes", label: "Frases", icon: Sparkles },
  { href: "/chat", label: "Asistente", icon: MessageCircle },
  { href: "/relax", label: "Relax", icon: Wind },
  { href: "/goals", label: "Objetivos", icon: Target },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-lavender-100 bg-white/50 backdrop-blur-glass p-5">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-lavender-400 to-blush-400 shadow-soft" />
        <div>
          <p className="font-display text-lg leading-none text-gray-800">Lumi</p>
          <p className="text-xs text-gray-400">tu espacio ✨</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-lavender-100 text-lavender-600"
                  : "text-gray-500 hover:bg-lavender-50 hover:text-lavender-500",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}