"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getQuoteForDate } from "@/data/quotes";
import { useNow, useTodayISO } from "@/hooks/useNow";
import { useAuthStore } from "@/store/useAuthStore";
import { saveTodayQuoteToHistory } from "@/services/quotesHistory.service";

export function QuoteCard() {
  const now = useNow();
  const today = useTodayISO();
  const profile = useAuthStore((s) => s.profile);
  const quote = getQuoteForDate(now, [], profile?.gender);

  useEffect(() => {
    if (!profile) return;
    saveTodayQuoteToHistory(profile.uid, today, quote).catch((err) =>
      console.error("Error al guardar la frase del día:", err),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, today]);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-lavender-100 via-blush-50 to-mint-50">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start gap-3"
      >
        <div className="mt-1 rounded-full bg-white/70 p-2 text-lavender-500">
          <Sparkles size={18} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-lavender-500">Frase del día</p>
          <p className="mt-1 font-display text-lg leading-snug text-gray-700">“{quote.text}”</p>
          <Link href="/quotes" className="mt-2 inline-block text-xs font-medium text-lavender-500 hover:underline">
            Ver frases anteriores →
          </Link>
        </div>
      </motion.div>
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-blush-200/40 blur-xl" />
    </Card>
  );
}