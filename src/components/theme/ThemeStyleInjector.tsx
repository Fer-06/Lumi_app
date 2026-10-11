"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { applyTheme, DEFAULT_THEME_ID, getThemeOverrideKey } from "@/lib/theme";

export function ThemeStyleInjector() {
  const profile = useAuthStore((s) => s.profile);
  const uid = profile?.uid;
  const themeColor = profile?.themeColor;

  useEffect(() => {
    const override = window.localStorage.getItem(getThemeOverrideKey(uid));
    const guestTheme = uid ? null : window.localStorage.getItem("lumi-theme");
    applyTheme(override ?? guestTheme ?? themeColor ?? DEFAULT_THEME_ID);
  }, [uid, themeColor]);

  return null;
}