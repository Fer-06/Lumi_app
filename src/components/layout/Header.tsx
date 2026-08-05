"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useNow } from "@/hooks/useNow";

export function Header() {
  const profile = useAuthStore((s) => s.profile);
  const now = useNow();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <header className="flex items-center justify-between px-5 py-4 lg:px-8 lg:py-6">
      <div>
        <p className="font-display text-xl text-gray-800 lg:text-2xl">
          {greeting}{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""} 🌸
        </p>
        <p className="text-sm text-gray-400 capitalize">
          {new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long" }).format(now)}
        </p>
      </div>
    </header>
  );
}