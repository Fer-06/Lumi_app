"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, Calendar, MessageCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/tasks", label: "Tareas", icon: ListTodo },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/chat", label: "Lumi", icon: MessageCircle },
  { href: "/settings", label: "Ajustes", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-lavender-100 bg-white/80 backdrop-blur-glass py-2 lg:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-[11px]",
              active ? "text-lavender-600" : "text-gray-400",
            )}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
