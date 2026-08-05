"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/store/useAuthStore";
import { subscribeToQuoteHistory, SeenQuote } from "@/services/quotesHistory.service";

export default function QuotesHistoryPage() {
  const profile = useAuthStore((s) => s.profile);
  const [quotes, setQuotes] = useState<SeenQuote[]>([]);

  useEffect(() => {
    if (!profile) return;
    return subscribeToQuoteHistory(profile.uid, setQuotes);
  }, [profile]);

  return (
    <div className="px-5 lg:px-8">
      <Header />
      <p className="font-display text-lg text-gray-700 mb-4">Tus frases del día 🌸</p>
      {quotes.length === 0 ? (
        <p className="text-sm text-gray-400">
          Aún no hay frases guardadas — vuelve mañana y se irán acumulando aquí solas.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {quotes.map((q) => (
            <Card key={q.id} className="flex gap-3">
              <Sparkles size={16} className="mt-1 shrink-0 text-lavender-400" />
              <div>
                <p className="text-sm text-gray-700">“{q.text}”</p>
                <p className="mt-1 text-xs text-gray-400 capitalize">
                  {format(parseISO(q.date), "d MMMM yyyy", { locale: es })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}