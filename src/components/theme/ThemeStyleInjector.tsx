"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { applyTheme, DEFAULT_THEME_ID } from "@/lib/theme";

export function ThemeStyleInjector() {
  const profile = useAuthStore((s) => s.profile);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("lumi-theme");
    applyTheme(profile?.themeColor ?? savedTheme ?? DEFAULT_THEME_ID);
  }, [profile?.themeColor]);

  return null;
}