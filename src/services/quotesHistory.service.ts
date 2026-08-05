import { doc, setDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Quote } from "@/types";

export interface SeenQuote {
  id: string; // = `${userId}_${date}`
  userId: string;
  date: string;
  quoteId: string;
  text: string;
  category: string;
}

// Guarda la frase del día de hoy en el historial del usuario.
// Usamos un id fijo (userId + fecha) para que, aunque se llame varias
// veces en el mismo día, no se dupliquen entradas.
export async function saveTodayQuoteToHistory(userId: string, date: string, quote: Quote) {
  const id = `${userId}_${date}`;
  await setDoc(doc(db, "quoteHistory", id), {
    userId,
    date,
    quoteId: quote.id,
    text: quote.text,
    category: quote.category,
  });
}

export function subscribeToQuoteHistory(userId: string, cb: (quotes: SeenQuote[]) => void) {
  const q = query(collection(db, "quoteHistory"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SeenQuote, "id">) }));
    // orden en el cliente para no necesitar un índice compuesto en Firestore
    list.sort((a, b) => b.date.localeCompare(a.date));
    cb(list);
  });
}