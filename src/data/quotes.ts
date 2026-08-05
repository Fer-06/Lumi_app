import { Quote } from "@/types";

// Banco de frases. Agrega las que quieras — el sistema no debe repetir
// la misma frase en menos de ~20 días (ver services/quotes.service.ts).
export const quotes: Quote[] = [
  { id: "q1", text: "Cada página que estudias hoy es un paso hacia la persona que quieres ser.", category: "estudio" },
  { id: "q2", text: "No necesitas ser perfecta, necesitas ser constante.", category: "disciplina" },
  { id: "q3", text: "Tu ritmo es válido. Comparado contigo misma de ayer, ya avanzaste.", category: "motivacion" },
  { id: "q4", text: "El éxito no es una línea recta; hoy también cuenta, aunque avances poquito.", category: "exito" },
  { id: "q5", text: "Te ves bella todos los días, con o sin maquillaje, con o sin sueño.", category: "fisico" },
  { id: "q6", text: "Tu cuerpo no es un proyecto que arreglar, es el hogar donde vives tu vida.", category: "fisico" },
  { id: "q7", text: "Respira. Lo que sientes ahora no va a durar para siempre.", category: "ansiedad" },
  { id: "q8", text: "Mereces amor propio incluso — sobre todo — en tus días difíciles.", category: "amor-propio" },
  { id: "q9", text: "El futuro que imaginas se construye con las decisiones pequeñas de hoy.", category: "futuro" },
  { id: "q10", text: "Sí se puede lograr. Tú ya has superado el 100% de tus días difíciles hasta ahora.", category: "esperanza" },
  { id: "q11", text: "La universidad es un capítulo, no todo el libro. Estás haciendo lo mejor que puedes.", category: "universidad" },
  { id: "q12", text: "La confianza se entrena como un músculo: con repetición, no con perfección.", category: "confianza" },
  { id: "q13", text: "Ir al gym hoy, aunque sea 15 minutos, ya es una victoria.", category: "gym" },
  { id: "q14", text: "Tus sueños no son exagerados, solo son tuyos.", category: "suenos" },
  { id: "q15", text: "No estás atrasada, estás en tu propio tiempo.", category: "motivacion" },
  { id: "q16", text: "Disciplina es elegir entre lo que quieres ahora y lo que quieres más.", category: "disciplina" },
  { id: "q17", text: "Cuidar tu autoestima es tan importante como cuidar tus notas.", category: "autoestima" },
  { id: "q18", text: "El éxito de otros no resta el tuyo. Hay espacio para todas.", category: "exito" },
  { id: "q19", text: "Un descanso también es parte del plan, no una interrupción de él.", category: "estudio" },
  { id: "q20", text: "Eres más fuerte que la ansiedad de este momento.", category: "ansiedad" },
];

export function getQuoteForDate(date: Date, history: string[] = []): Quote {
  // rotación determinística por día, evitando repetir lo reciente cuando es posible
  const dayIndex = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const available = quotes.filter((q) => !history.includes(q.id));
  const pool = available.length > 0 ? available : quotes;
  return pool[dayIndex % pool.length];
}
