"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { getTheme } from "@/lib/theme";

export function ThemeStyleInjector() {
  const profile = useAuthStore((s) => s.profile);

  useEffect(() => {
    const theme = getTheme(profile?.themeColor);
    document.documentElement.style.setProperty("--accent-from", theme.from);
    document.documentElement.style.setProperty("--accent-to", theme.to);
  }, [profile?.themeColor]);

  return null;
}