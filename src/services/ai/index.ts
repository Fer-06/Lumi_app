import { AIProvider } from "./aiProvider";
import { LocalAIProvider } from "./localProvider";

// Punto único de cambio: cuando conectes OpenAI/Claude/Gemini,
// crea RemoteAIProvider implements AIProvider y expórtalo aquí.
export const aiProvider: AIProvider = new LocalAIProvider();
