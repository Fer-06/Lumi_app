import { Gender } from "@/types";
import { adaptGenderedText } from "@/lib/gender";
import { AIProvider } from "./aiProvider";

type ConversationMessage = { role: "user" | "assistant"; text: string };

function normalize(text: string) {
  return text
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(text: string, phrases: string[]) {
  return phrases.some((phrase) => text.includes(phrase));
}

function adjective(gender: Gender, feminine: string, masculine: string, neutral: string) {
  if (gender === "femenino") return feminine;
  if (gender === "masculino") return masculine;
  return neutral;
}

function pick<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function replyFor(
  topic: string,
  gender: Gender,
  seed: number,
  userMessage: string,
  previousAssistantMessage?: string,
) {
  const variants: Record<string, string[]> = {
    crisis: [
      "Siento mucho que estés pasando por algo tan pesado. Me importa que estés a salvo: si podrías hacerte daño ahora, aléjate de cualquier cosa con la que pudieras lastimarte y busca a alguien de confianza para que esté contigo. Contacta emergencias o una línea de crisis de tu país. ¿Estás en peligro inmediato en este momento?",
    ],
    anxiety: [
      `Suena muy difícil, y no tienes que resolverlo todo de golpe. Si te sirve, apoyemos los pies en el suelo: nombra 5 cosas que ves, 4 que sientes y 3 que escuchas. ¿Qué pasó justo antes de que empezara esta ${adjective(gender, "sensación", "sensación", "sensación")}?`,
      "Estoy aquí contigo. Prueba inhalar suavemente durante 4 segundos y exhalar durante 6, unas cuantas veces, sin forzarte. Después podemos ordenar lo que te preocupa, una cosa a la vez. ¿Qué es lo que más te inquieta ahora?",
    ],
    sadness: [
      "Gracias por contármelo. No voy a intentar arreglarlo con una frase hecha: a veces solo toca atravesar un rato difícil. ¿Quieres contarme qué pasó, o prefieres que pensemos en algo pequeño que te ayude a pasar esta hora?",
      "Lo que sientes merece espacio, aunque no tengas claro por qué te sientes así. Si puedes, toma un poco de agua y busca un lugar donde estés a gusto. Estoy aquí para escucharte: ¿qué parte pesa más?",
    ],
    stress: [
      `Uf, parece que se te juntó mucho y estás ${adjective(gender, "agobiada", "agobiado", "con muchas cosas encima")}. No tienes que poder con todo al mismo tiempo. Hagamos una lista y elegimos solo el paso más pequeño para empezar. ¿Qué pendiente te está pesando más?`,
      "Te leo; tener tantas cosas encima puede agotar a cualquiera. Prueba separar lo urgente de lo que puede esperar y date 10 minutos para una sola cosa. Si me dices qué tienes pendiente, te ayudo a priorizar.",
    ],
    study: [
      `Vamos a hacerlo manejable: dime qué materia o tema es y cuándo lo necesitas. Podemos armar bloques cortos con pausas para que llegues ${adjective(gender, "preparada", "preparado", "con más preparación")}.`,
      "No hace falta estudiar todo de una sentada. Elige un tema, intenta explicarlo con tus palabras durante 20 minutos y luego toma un descanso breve. ¿Qué estás estudiando? Te ayudo a organizarlo.",
    ],
    task: [
      "Claro, lo ordenamos. Escríbeme las cosas que tienes pendientes y, si puedes, cuándo vence cada una. Te ayudo a separarlas en urgente, importante y primer paso.",
      "Para destrabarlo, convierte el pendiente en una acción que puedas hacer en menos de 10 minutos. ¿Qué necesitas terminar y para cuándo? Armamos el primer paso juntes.",
    ],
    relationships: [
      "Las relaciones pueden remover mucho. Puedo escucharte sin juzgar; también podemos pensar qué necesitas y qué límite te haría bien. ¿Qué ocurrió?",
      "Siento que estés lidiando con eso. Antes de decidir qué hacer, quizá ayude separar lo que pasó de lo que temes que signifique. ¿Quieres contarme un poco más?",
    ],
    selfWorth: [
      `Siento que te estés hablando con tanta dureza. Un error o un día malo no resume quién eres. No tienes que pasar por esto ${adjective(gender, "sola", "solo", "por tu cuenta")}. ¿Qué pasó para que hoy te sintieras así?`,
      "Lo que piensas de ti en un momento difícil no siempre cuenta toda la historia. No tienes que ganarte el derecho a descansar o recibir apoyo. ¿Qué pasó para que hoy te sintieras así?",
    ],
    sleep: [
      "Cuando el cansancio se acumula, todo puede sentirse más grande. Si puedes, baja un poco el ritmo, toma agua y elige entre descansar 10 minutos o resolver solo una cosa pequeña. ¿Hace cuánto te sientes así?",
      "Descansar también cuenta como cuidarte. Tal vez te sirva alejarte un momento de la pantalla y respirar despacio. ¿Quieres que armemos un plan sencillo para terminar el día?",
    ],
    goals: [
      "Qué lindo que quieras avanzar con eso. Hagamos que la meta sea concreta: ¿qué resultado buscas y cuál sería un paso de 10 minutos que puedas dar hoy?",
      "Podemos convertirlo en algo alcanzable, sin pedirte perfección. Cuéntame tu meta y para cuándo la imaginas; te ayudo a dividirla en pasos.",
    ],
    greeting: [
      "¡Hola! Qué gusto leerte 🌸 ¿Cómo va tu día: quieres platicar, ordenar algo pendiente o buscar una idea?",
      "Holaa ✨ Aquí estoy. Cuéntame, ¿qué tienes en mente?",
    ],
    thanks: [
      "De nada, me alegra acompañarte 💛 ¿Quieres que sigamos pensando en eso o por ahora te sientes un poquito más en calma?",
      "Siempre puedes volver a platicarme. ¿Hay algo más que te vendría bien ahora?",
    ],
    fallback: [
      `Quiero entenderte bien. Cuando dices “${userMessage.trim()}”, ¿qué parte te gustaría que pensemos juntes?`,
      "Te escucho. Puedo ayudarte a ordenar ideas, buscar opciones o simplemente acompañarte mientras lo cuentas. ¿Qué te serviría más ahora?",
      previousAssistantMessage
        ? `Gracias por seguir contándome. Para no asumir de más: ¿qué te gustaría que pasara con eso?`
        : `Cuéntame un poquito más de lo que pasó y vemos opciones juntes, sin prisa.`,
    ],
  };

  return pick(variants[topic], seed);
}

function detectTopic(message: string) {
  if (hasAny(message, ["quiero suicid", "suicidarme", "suicidio", "quitarme la vida", "hacerme dano", "no quiero vivir", "me quiero morir", "matarme", "acabar con todo"])) {
    return "crisis";
  }
  if (hasAny(message, ["ansiedad", "ansioso", "ansiosa", "ataque de panico", "panico", "me cuesta respirar", "nervios"])) return "anxiety";
  if (hasAny(message, ["triste", "llorar", "me siento mal", "sola", "solo", "vacio", "vacia", "deprimid", "perdi a"])) return "sadness";
  if (hasAny(message, ["estres", "estresado", "estresada", "agobi", "abrum", "no puedo mas", "mucho que hacer", "sobrecarg"])) return "stress";
  if (hasAny(message, ["examen", "parcial", "estudiar", "estudio", "materia", "tarea de", "universidad", "exposicion"])) return "study";
  if (hasAny(message, ["pendiente", "organizar", "organizacion", "priorizar", "planificar", "no se por donde empezar"])) return "task";
  if (hasAny(message, ["mi pareja", "mi novio", "mi novia", "mi amigo", "mi amiga", "pelee", "discuti", "relacion", "me dejaron"])) return "relationships";
  if (hasAny(message, ["no valgo", "no sirvo", "soy un fracaso", "soy inutil", "me odio", "soy fe", "mi cuerpo"])) return "selfWorth";
  if (hasAny(message, ["cansado", "cansada", "agotado", "agotada", "no dormi", "no puedo dormir", "tengo sueño", "tengo sueno"])) return "sleep";
  if (hasAny(message, ["mi meta", "mis metas", "objetivo", "quiero lograr", "mi futuro", "mi sueno", "mi sueño"])) return "goals";
  if (hasAny(message, ["hola", "buenos dias", "buenas tardes", "buenas noches", "hey", "holi"])) return "greeting";
  if (hasAny(message, ["gracias", "te agradezco", "me ayudaste"])) return "thanks";
  return "fallback";
}

export class LocalAIProvider implements AIProvider {
  async getResponse(
    userMessage: string,
    history: ConversationMessage[] = [],
    gender: Gender = "neutral",
  ): Promise<string> {
    const normalized = normalize(userMessage);
    const previousAssistantMessage = [...history].reverse().find((message) => message.role === "assistant")?.text;
    const seed = normalized.length + history.length * 7;
    const topic = detectTopic(normalized);

    await new Promise((resolve) => setTimeout(resolve, 450));
    return adaptGenderedText(
      replyFor(topic, gender, seed, userMessage, previousAssistantMessage),
      gender,
    );
  }
}
