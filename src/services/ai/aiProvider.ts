import { Gender } from "@/types";

// Interfaz que debe cumplir cualquier proveedor de IA (local, OpenAI, Claude, Gemini...)
export interface AIProvider {
  getResponse(
    userMessage: string,
    history: { role: "user" | "assistant"; text: string }[],
    gender?: Gender,
  ): Promise<string>;
}
