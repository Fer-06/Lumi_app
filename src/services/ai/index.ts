import { AIProvider } from "./aiProvider";
import { GeminiAIProvider } from "./geminiProvider";

export const aiProvider: AIProvider = new GeminiAIProvider();
