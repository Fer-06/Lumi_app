"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { ChatMessage } from "@/types";
import { aiProvider } from "@/services/ai";
import { generateId } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ChatWindow() {
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
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: generateId(), role: "user", text: input, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const reply = await aiProvider.getResponse(
      userMsg.text,
      messages.map((m) => ({ role: m.role, text: m.text })),
    );

    setMessages((prev) => [
      ...prev,
      { id: generateId(), role: "assistant", text: reply, createdAt: new Date().toISOString() },
    ]);
    setTyping(false);
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-xl2 bg-white/60 shadow-soft">
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-gradient-to-br from-lavender-400 to-blush-400 text-white"
                  : "bg-lavender-50 text-gray-700"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && <p className="text-xs text-gray-400">Lumi está escribiendo...</p>}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 border-t border-lavender-100 p-3">
        <Input
          placeholder="Escribe cómo te sientes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button onClick={send}><Send size={16} /></Button>
      </div>
    </div>
  );
}
