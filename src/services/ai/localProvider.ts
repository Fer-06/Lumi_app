import { AIProvider } from "./aiProvider";

// Proveedor local basado en reglas: funciona sin conexión ni API key.
// El día que quieras conectar OpenAI/Claude/Gemini, crea otra clase que
// implemente AIProvider y cámbiala en services/ai/index.ts — nada más
// del proyecto necesita saber que cambiaste de proveedor.

interface Rule {
  keywords: string[];
  responses: string[];
}

const rules: Rule[] = [
  {
    keywords: ["estres", "estrés", "agobiada", "agobiado", "abrumada", "abrumado", "no puedo mas", "no puedo más"],
    responses: [
      "Respira conmigo un momento: inhala 4 segundos, sostén 4, exhala 6. Lo que sientes es real, pero no es permanente. ¿Qué es lo que más pesa ahora mismo?",
      "Se nota que traes mucho encima. No tienes que resolverlo todo hoy — solo el siguiente paso pequeño. ¿Cuál sería?",
    ],
  },
  {
    keywords: ["ansiedad", "ansioso", "ansiosa", "nervios", "pánico", "panico"],
    responses: [
      "La ansiedad miente sobre el tamaño de las cosas. Estás a salvo en este momento. Prueba nombrar 5 cosas que puedas ver ahora — te ayuda a volver al presente.",
    ],
  },
  {
    keywords: ["examen", "parcial", "final", "exposicion", "exposición"],
    responses: [
      "Vas a estar bien preparada/o. Divide lo que falta en bloques de 25 minutos con descansos — así rinde más que estudiar de corrido. ¿Quieres que armemos un plan?",
    ],
  },
  {
    keywords: ["gordo", "gorda", "gordito", "gordita", "flaca", "flaco", "fea", "feo", "cuerpo"],
    responses: [
      "Tu cuerpo no define tu valor. Eres mucho más que cómo te ves hoy: tu esfuerzo, tu forma de cuidar a otros, tus ganas de salir adelante. Te ves bien y, sobre todo, eres suficiente tal como eres.",
    ],
  },
  {
    keywords: ["no sirvo", "fracaso", "fracasé", "fracase", "no valgo", "inutil", "inútil"],
    responses: [
      "Eso que sientes ahora no es un hecho, es una emoción pasajera. Has llegado hasta aquí superando cosas difíciles antes. Estoy contigo en esto.",
    ],
  },
  {
    keywords: ["meta", "metas", "objetivo", "objetivos", "sueño", "sueños", "futuro"],
    responses: [
      "Me encanta que pienses en eso. Cada pequeño paso de hoy construye el futuro que quieres. ¿Qué meta te gustaría anotar en tu sección de objetivos?",
    ],
  },
  {
    keywords: ["gym", "gimnasio", "ejercicio", "entrenar"],
    responses: [
      "¡Qué bien que te muevas hoy! La disciplina se construye con constancia, no con perfección. Un día a la vez.",
    ],
  },
  {
    keywords: ["cansada", "cansado", "sin energia", "sin energía", "agotada", "agotado"],
    responses: [
      "Descansar también es productivo. Tal vez este es el momento de tomarte 10 minutos en la sección Relax antes de seguir.",
    ],
  },
];

const fallbackResponses = [
  "Te escucho. Cuéntame un poco más sobre eso.",
  "Gracias por compartirlo conmigo. ¿Cómo te gustaría que te ayude con esto?",
  "Estoy aquí contigo. ¿Qué necesitas en este momento: organizar algo, desahogarte, o un poco de ánimo?",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class LocalAIProvider implements AIProvider {
  async getResponse(userMessage: string): Promise<string> {
    const normalized = userMessage.toLowerCase();
    const matched = rules.find((rule) =>
      rule.keywords.some((kw) => normalized.includes(kw)),
    );
    // pequeña espera para que se sienta natural, no instantáneo
    await new Promise((r) => setTimeout(r, 400));
    return matched ? pickRandom(matched.responses) : pickRandom(fallbackResponses);
  }
}
