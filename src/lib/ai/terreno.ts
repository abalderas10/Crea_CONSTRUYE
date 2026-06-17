import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export interface TerrenoInputs {
  direccion: string;
  ciudad: string;
  superficie_m2: string;
  precio_solicitado: string;
  tipo_desarrollo: string;
}

export interface TerrenoAnalysis {
  recomendacion: "COMPRAR" | "NEGOCIAR" | "NO_COMPRAR";
  precio_objetivo_m2: string;
  confianza: number;
  resumen: string;
  fortalezas: string[];
  riesgos: string[];
  generated_at?: string;
}

const SCHEMA = {
  type: "object",
  properties: {
    recomendacion: {
      type: "string",
      enum: ["COMPRAR", "NEGOCIAR", "NO_COMPRAR"],
    },
    precio_objetivo_m2: {
      type: "string",
      description: "Precio objetivo por m² en pesos (ej. '$12,500/m²')",
    },
    confianza: {
      type: "integer",
      description: "Nivel de confianza 0-100",
    },
    resumen: {
      type: "string",
      description: "Análisis narrativo de 2-3 párrafos en español",
    },
    fortalezas: { type: "array", items: { type: "string" } },
    riesgos: { type: "array", items: { type: "string" } },
  },
  required: [
    "recomendacion",
    "precio_objetivo_m2",
    "confianza",
    "resumen",
    "fortalezas",
    "riesgos",
  ],
  additionalProperties: false,
} as const;

const SYSTEM = `Eres un analista experto en desarrollo inmobiliario en México, especializado en la evaluación de terrenos para proformas. Analizas viabilidad, valoración de mercado y riesgos con rigor profesional, como lo harías para presentar a un banco o inversionista. Usas datos del contexto mexicano (zonas, precios, normatividad). Sé concreto y honesto: si el precio pedido es alto o el terreno tiene problemas, dilo. Toda tu respuesta va en español.`;

export async function analyzeTerreno(
  inputs: TerrenoInputs,
  projectContext: string,
): Promise<TerrenoAnalysis> {
  const client = new Anthropic();

  const userPrompt = `Analiza la viabilidad de comprar este terreno para un desarrollo inmobiliario.

CONTEXTO DEL PROYECTO:
${projectContext}

DATOS DEL TERRENO:
- Dirección: ${inputs.direccion}
- Ciudad / zona: ${inputs.ciudad}
- Superficie: ${inputs.superficie_m2} m²
- Precio solicitado: ${inputs.precio_solicitado}
- Tipo de desarrollo previsto: ${inputs.tipo_desarrollo}

Entrega:
1. Una recomendación: COMPRAR, NEGOCIAR o NO_COMPRAR.
2. Un precio objetivo por m² razonable para esta zona.
3. Tu nivel de confianza (0-100).
4. Un resumen narrativo (2-3 párrafos): contexto de la zona, valoración vs. precio pedido, y tu recomendación con justificación.
5. Fortalezas del terreno (lista).
6. Riesgos detectados (lista).`;

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 8000,
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
  return JSON.parse(textBlock.text) as TerrenoAnalysis;
}
