import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AiSuggestion } from "@/lib/data/community-tools";

const SCHEMA = {
  type: "object",
  properties: {
    resumen: {
      type: "string",
      description: "1-2 frases: qué hace la herramienta y por qué aporta.",
    },
    pasos: {
      type: "array",
      items: { type: "string" },
      description: "Pasos concretos para implementarla en creaConstruye.",
    },
    formulas_clave: {
      type: "array",
      items: { type: "string" },
      description: "Fórmulas o cálculos centrales, en notación legible.",
    },
    datos_necesarios: {
      type: "array",
      items: { type: "string" },
      description: "Datos mínimos que el usuario o una firma de ingeniería debe aportar.",
    },
    alimenta: {
      type: "array",
      items: { type: "string" },
      description: "Herramientas core de la proforma que se beneficiarían (terreno, costos, etc.).",
    },
    complejidad: { type: "string", enum: ["baja", "media", "alta"] },
  },
  required: [
    "resumen",
    "pasos",
    "formulas_clave",
    "datos_necesarios",
    "alimenta",
    "complejidad",
  ],
  additionalProperties: false,
} as const;

const SYSTEM = `Eres el arquitecto de producto de creaConstruye, plataforma mexicana de proformas inmobiliarias y herramientas para el sector construcción. Cuando un usuario propone una herramienta nueva, tu trabajo es convertir su idea en un plan accionable: qué calcula, con qué fórmulas, qué datos necesita y a qué herramientas del proforma alimenta (terreno, zonificacion, mercado, costos, financiero, roi, cronograma, riesgos). Si la herramienta requiere expertise de ingeniería que no podemos automatizar, indica con precisión los datos mínimos que una firma externa debe entregar para continuar. Conoces la normatividad mexicana (federal y local por estado/municipio). Sé concreto, técnico y en español.`;

export async function suggestToolImplementation(input: {
  name: string;
  description: string;
  formulas?: string | null;
  justification?: string | null;
  section: string;
}): Promise<AiSuggestion> {
  const client = new Anthropic();

  const userPrompt = `Un usuario propuso esta herramienta para la comunidad de creaConstruye.

SECCIÓN: ${input.section}
NOMBRE: ${input.name}
DESCRIPCIÓN: ${input.description}
FÓRMULAS / ELEMENTOS A CALCULAR (según el usuario): ${input.formulas || "no especificadas"}
POR QUÉ ES VALIOSA (según el usuario): ${input.justification || "no especificado"}

Genera un plan de implementación: resumen, pasos concretos, fórmulas clave, datos mínimos necesarios, a qué herramientas del proforma alimenta y la complejidad estimada.`;

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: { type: "json_schema", schema: SCHEMA },
    },
    system: SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Sin respuesta de texto del modelo");
  }
  return JSON.parse(textBlock.text) as AiSuggestion;
}
