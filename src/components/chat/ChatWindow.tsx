"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Send, Trash2 } from "lucide-react";
import { ChatMessage } from "@/types";
import { aiProvider } from "@/services/ai";
import {
  ChatConversation,
  createChatConversation,
  deleteChatConversation,
  saveChatMessage,
  subscribeToChatConversations,
  subscribeToChatMessages,
} from "@/services/chatHistory.service";
import { generateId } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

function createWelcomeMessage(gender: string): ChatMessage {
  const text = gender === "neutral"
    ? "Hola, soy Lumi 🌸 Estoy aquí para escucharte, pensar contigo y ayudarte a organizarte. ¿Cómo va tu día?"
    : "Hola, soy Lumi 🌸 Estoy aquí para escucharte y ayudarte a organizarte. ¿Cómo te sientes hoy?";

  return {
    id: "welcome",
    role: "assistant",
    text,
    createdAt: new Date().toISOString(),
  };
}

function getConversationTitle(message: string) {
  const title = message.replace(/\s+/g, " ").trim();
  return title.length > 42 ? `${title.slice(0, 39)}…` : title;
}

function isFirestorePermissionError(error: unknown) {
  return typeof error === "object"
    && error !== null
    && "code" in error
    && error.code === "permission-denied";
}

export function ChatWindow() {
  const profile = useAuthStore((state) => state.profile);
  const userId = profile?.uid;
  const gender = profile?.gender ?? "neutral";
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage(gender)]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      return;
    }

    return subscribeToChatConversations(
      userId,
      (items) => {
        setConversations(items);
        setActiveConversationId((currentId) => currentId ?? items[0]?.id ?? null);
      },
      (subscriptionError) => {
        console.error("No se pudo cargar el historial de conversaciones:", subscriptionError);
        setError(
          isFirestorePermissionError(subscriptionError)
            ? "Firebase bloqueó el historial. Publica las reglas incluidas en firestore.rules."
            : "No se pudo cargar tu historial. Comprueba tu conexión e inténtalo de nuevo.",
        );
      },
    );
  }, [userId]);

  useEffect(() => {
    if (!userId || !activeConversationId) {
      setMessages([createWelcomeMessage(gender)]);
      setLoadingHistory(false);
      return;
    }

    setLoadingHistory(true);
    return subscribeToChatMessages(
      userId,
      activeConversationId,
      (items) => {
        setMessages(items);
        setLoadingHistory(false);
      },
      (subscriptionError) => {
        console.error("No se pudo cargar una conversación de Lumi:", subscriptionError);
        setError(
          isFirestorePermissionError(subscriptionError)
            ? "Firebase bloqueó esta conversación. Publica las reglas incluidas en firestore.rules."
            : "No se pudo abrir esta conversación. Comprueba tu conexión e inténtalo de nuevo.",
        );
        setLoadingHistory(false);
      },
    );
  }, [activeConversationId, gender, userId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const startNewConversation = () => {
    setActiveConversationId(null);
    setMessages([createWelcomeMessage(gender)]);
    setError("");
    setLoadingHistory(false);
  };

  const openConversation = (conversationId: string) => {
    if (conversationId === activeConversationId) return;
    setActiveConversationId(conversationId);
    setMessages([]);
    setError("");
  };

  const removeConversation = async (conversation: ChatConversation) => {
    if (!userId || typing || deletingConversationId) return;
    const confirmed = window.confirm(
      `¿Eliminar la conversación "${conversation.title}" y todos sus mensajes? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    setDeletingConversationId(conversation.id);
    setError("");
    try {
      await deleteChatConversation(userId, conversation.id);
      const remaining = conversations.filter((item) => item.id !== conversation.id);
      setConversations(remaining);
      if (activeConversationId === conversation.id) {
        setActiveConversationId(remaining[0]?.id ?? null);
        setMessages(remaining.length ? [] : [createWelcomeMessage(gender)]);
      }
    } catch (deleteError) {
      console.error("No se pudo eliminar la conversación de Lumi:", deleteError);
      setError(
        isFirestorePermissionError(deleteError)
          ? "Firebase bloqueó la eliminación. Revisa las reglas de Firestore."
          : deleteError instanceof Error
            ? deleteError.message
            : "No se pudo eliminar la conversación. Inténtalo de nuevo.",
      );
    } finally {
      setDeletingConversationId(null);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || typing || loadingHistory || !userId) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };
    const history = messages
      .filter((message) => message.id !== "welcome")
      .map((message) => ({ role: message.role, text: message.text }));

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setError("");
    setTyping(true);

    try {
      let conversationId = activeConversationId;
      if (conversationId) {
        await saveChatMessage(userId, conversationId, userMessage);
      } else {
        const conversation = await createChatConversation(
          userId,
          getConversationTitle(text),
          userMessage,
        );
        conversationId = conversation.id;
        setConversations((previous) => [conversation, ...previous]);
        setActiveConversationId(conversation.id);
      }

      const reply = await aiProvider.getResponse(text, history, gender);
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        text: reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((previous) => [...previous, assistantMessage]);

      try {
        await saveChatMessage(userId, conversationId, assistantMessage);
      } catch (saveError) {
        console.error("La respuesta de Lumi no se pudo guardar en el historial:", saveError);
        setError("Lumi respondió, pero no se pudo guardar esa respuesta en tu historial.");
      }
    } catch (sendError) {
      console.error("No se pudo guardar o responder el mensaje de Lumi:", sendError);
      setError(
        isFirestorePermissionError(sendError)
          ? "Firebase bloqueó el historial. Publica las reglas incluidas en firestore.rules."
          : sendError instanceof Error
          ? sendError.message
          : "No se pudo guardar el mensaje. Comprueba tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setTyping(false);
    }
  };

  return (
    <section className="flex flex-col gap-3 lg:h-[70vh] lg:flex-row">
      <aside className="min-w-0 rounded-xl2 border border-lavender-100 bg-white/55 p-3 lg:flex lg:w-64 lg:shrink-0 lg:flex-col">
        <Button
          onClick={startNewConversation}
          variant="secondary"
          size="sm"
          className="flex w-full items-center justify-center gap-2"
        >
          <Plus size={16} />
          Nueva conversación
        </Button>
        <div className="mt-2 flex max-w-full gap-2 overflow-x-auto pb-1 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex w-60 shrink-0 items-center gap-1 rounded-xl p-1 lg:w-full ${
                conversation.id === activeConversationId ? "bg-lavender-100" : "bg-white/70"
              }`}
            >
              <button
                type="button"
                onClick={() => openConversation(conversation.id)}
                aria-current={conversation.id === activeConversationId ? "page" : undefined}
                className="min-w-0 flex-1 rounded-lg px-2 py-1 text-left transition-colors hover:bg-white/70"
              >
                <span className="block truncate text-sm font-medium text-gray-700">{conversation.title}</span>
                <span className="mt-0.5 block truncate text-xs text-gray-400">{conversation.preview}</span>
              </button>
              <button
                type="button"
                onClick={() => void removeConversation(conversation)}
                disabled={typing || deletingConversationId !== null}
                aria-label={`Eliminar conversación: ${conversation.title}`}
                title="Eliminar conversación"
                className="shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-blush-100 hover:text-blush-500 disabled:opacity-40"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {!conversations.length && (
            <p className="hidden px-2 py-3 text-xs text-gray-400 lg:block">
              Tus conversaciones anteriores aparecerán aquí.
            </p>
          )}
        </div>
      </aside>

      <div className="flex h-[min(70vh,42rem)] min-h-96 min-w-0 flex-1 flex-col rounded-xl2 bg-white/60 shadow-soft">
        <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-5">
          {loadingHistory && (
            <p className="text-xs text-gray-400" role="status">Cargando conversación...</p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm sm:max-w-[75%] ${
                  message.role === "user"
                    ? "bg-accent-gradient text-white"
                    : "bg-lavender-50 text-gray-700"
                }`}
              >
                {message.text}
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
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void send();
              }
            }}
            disabled={typing || loadingHistory}
          />
          <Button
            onClick={() => void send()}
            disabled={typing || loadingHistory || !input.trim()}
            aria-label="Enviar mensaje"
            className="shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
