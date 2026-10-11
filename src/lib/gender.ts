import { Gender } from "@/types";

const genderedWords: Record<string, [string, string]> = {
  atrasada: ["atrasada", "atrasado"],
  preparada: ["preparada", "preparado"],
  perfecta: ["perfecta", "perfecto"],
  bella: ["bella", "bello"],
  agobiada: ["agobiada", "agobiado"],
  abrumada: ["abrumada", "abrumado"],
  cansada: ["cansada", "cansado"],
  agotada: ["agotada", "agotado"],
  sola: ["sola", "solo"],
  lista: ["lista", "listo"],
  tranquila: ["tranquila", "tranquilo"],
  orgullosa: ["orgullosa", "orgulloso"],
  segura: ["segura", "seguro"],
  acompañada: ["acompañada", "acompañado"],
  apoyada: ["apoyada", "apoyado"],
  escuchada: ["escuchada", "escuchado"],
  entendida: ["entendida", "entendido"],
  frustrada: ["frustrada", "frustrado"],
  preocupada: ["preocupada", "preocupado"],
  nerviosa: ["nerviosa", "nervioso"],
  confundida: ["confundida", "confundido"],
  bienvenida: ["bienvenida", "bienvenido"],
  feliz: ["feliz", "feliz"],
};

const neutralAlternatives: Record<string, string> = {
  atrasada: "con retraso",
  preparada: "con preparación",
  perfecta: "con perfección",
  bella: "con belleza",
  agobiada: "con muchas cosas encima",
  abrumada: "con muchas cosas encima",
  cansada: "con cansancio",
  agotada: "con agotamiento",
  sola: "por tu cuenta",
  lista: "con todo listo",
  tranquila: "en calma",
  orgullosa: "con orgullo",
  segura: "con seguridad",
  acompañada: "con alguien a tu lado",
  apoyada: "con apoyo",
  escuchada: "con quien te escuche",
  entendida: "con comprensión",
  frustrada: "con frustración",
  preocupada: "con preocupación",
  nerviosa: "con nervios",
  confundida: "con dudas",
  bienvenida: "te damos la bienvenida",
  feliz: "feliz",
};

export function adaptGenderedText(text: string, gender: Gender = "neutral") {
  let result = text;

  for (const [feminine, [femaleForm, maleForm]] of Object.entries(genderedWords)) {
    const forms = `${femaleForm}|${maleForm}`;
    const genderedForm = new RegExp(`\\b(?:${forms})(?:\\s*\\/\\s*(?:${forms}|[oa]))?\\b`, "gi");

    result = result.replace(genderedForm, () => {
      if (gender === "neutral") return neutralAlternatives[feminine];
      return gender === "masculino" ? maleForm : femaleForm;
    });
  }

  result = result.replace(/\bjuntes\b/gi, gender === "femenino" ? "juntas" : gender === "masculino" ? "juntos" : "en conjunto");
  return result;
}
