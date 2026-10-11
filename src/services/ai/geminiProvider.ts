import { auth } from "@/lib/firebase";
import { Gender } from "@/types";
import { AIProvider } from "./aiProvider";

interface ChatAPIResponse {
  reply?: string;
  error?: string;
}

export class GeminiAIProvider implements AIProvider {
  async getResponse(
    userMessage: string,
    history: { role: "user" | "assistant"; text: string }[],
    gender: Gender = "neutral",
  ): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Inicia sesión para conversar con Lumi.");
    }

    const idToken = await user.getIdToken();
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ message: userMessage, history, gender }),
    });

    const result = (await response.json().catch(() => null)) as ChatAPIResponse | null;
    if (!response.ok) {
      throw new Error(result?.error ?? "No se pudo conectar con el asistente.");
    }
    if (!result?.reply) {
      throw new Error("El asistente no devolvió una respuesta. Inténtalo de nuevo.");
    }

    return result.reply;
  }
}
