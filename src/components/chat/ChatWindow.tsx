"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { ChatMessage } from "@/types";
import { aiProvider } from "@/services/ai";
import { generateId } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

export function ChatWindow() {
  const gender = useAuthStore((state) => state.profile?.gender ?? "neutral");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hola, soy Lumi 🌸 Estoy aquí para escucharte y ayudarte a organizarte. ¿Cómo te sientes hoy?",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const welcomeText = gender === "femenino"
    ? "Hola, soy Lumi 🌸 Estoy aquí para escucharte y ayudarte a organizarte. ¿Cómo te sientes hoy?"
    : gender === "masculino"
      ? "Hola, soy Lumi 🌸 Estoy aquí para escucharte y ayudarte a organizarte. ¿Cómo te sientes hoy?"
      : "Hola, soy Lumi 🌸 Estoy aquí para escucharte, pensar contigo y ayudarte a organizarte. ¿Cómo va tu día?";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    const userMsg: ChatMessage = { id: generateId(), role: "user", text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError("");
    setTyping(true);

    try {
      const reply = await aiProvider.getResponse(
        userMsg.text,
        messages.map((message) => ({ role: message.role, text: message.text })),
        gender,
      );
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: "assistant", text: reply, createdAt: new Date().toISOString() },
      ]);
    } catch (sendError) {
      console.error("No se pudo generar una respuesta de Lumi:", sendError);
      setError(sendError instanceof Error ? sendError.message : "No pude preparar una respuesta ahora. Inténtalo otra vez.");
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-xl2 bg-white/60 shadow-soft">
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-accent-gradient text-white"
                  : "bg-lavender-50 text-gray-700"
              }`}
            >
              {m.id === "welcome" ? welcomeText : m.text}
            </div>
          </div>
        ))}
        {typing && <p className="text-xs text-gray-400">Lumi está escribiendo...</p>}
        {error && <p className="text-xs text-blush-500" role="alert">{error}</p>}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 border-t border-lavender-100 p-3">
        <Input
          placeholder="Escribe cómo te sientes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={typing}
        />
        <Button onClick={send} disabled={typing || !input.trim()} aria-label="Enviar mensaje"><Send size={16} /></Button>
      </div>
    </div>
  );
}
