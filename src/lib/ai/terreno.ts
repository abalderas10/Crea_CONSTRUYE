import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  calcEnvolvente,
  m2,
  type TerrenoData,
} from "@/lib/proforma/terreno";
import { getJurisdiccion } from "@/lib/proforma/jurisdicciones";

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
    recomendacion: { type: "string", enum: ["COMPRAR", "NEGOCIAR", "NO_COMPRAR"] },
    precio_objetivo_m2: {
      type: "string",
      description: "Precio objetivo por m² de terreno en pesos (ej. '$120,000/m²')",
    },
    confianza: { type: "integer", description: "Nivel de confianza 0-100" },
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

const SYSTEM = `Eres un analista experto en desarrollo inmobiliario en México, especializado en la evaluación de terrenos para proformas. Analizas viabilidad, valoración de mercado, normatividad de uso de suelo (COS/CUS) y riesgos con rigor profesional, como para presentar a un banco o inversionista. Conoces las diferencias regulatorias entre CDMX (SEDUVI/Metrópolis, CUZUS) y Estado de México (planes municipales, SEDUI). Razona el Valor Residual del Suelo cuando haya datos. Sé concreto y honesto: si el precio pedido es alto o el terreno tiene problemas, dilo. Toda tu respuesta va en español.`;

export async function analyzeTerreno(
  data: TerrenoData,
  projectContext: string,
): Promise<TerrenoAnalysis> {
  const client = new Anthropic();
  const j = getJurisdiccion(data.entidad?.tipo);
  const entidadNombre =
    data.entidad?.tipo === "otro"
      ? data.entidad?.estado || "Otro estado"
      : j.nombre;
  const p = data.predio ?? {};
  const z = data.zonificacion ?? {};
  const env = calcEnvolvente(z, p);

  const userPrompt = `Analiza la viabilidad de comprar este terreno para un desarrollo inmobiliario.

CONTEXTO DEL PROYECTO:
${projectContext}

ENTIDAD: ${entidadNombre} (autoridad: ${j.autoridad}; documento de zonificación: ${data.entidad?.documento || j.documento})

PREDIO (datos de boleta predial):
- Dirección: ${p.direccion ?? "—"}, ${p.colonia ?? ""} ${p.territorio ?? ""}
- Cuenta/clave catastral: ${p.cuenta_catastral ?? "—"}
- Superficie del terreno: ${p.superficie_terreno ?? "—"} m²
- Superficie construida existente: ${p.superficie_construccion ?? "0"} m²
- Valor catastral: ${p.valor_catastral ?? "—"}
- Precio solicitado: ${p.precio_solicitado ?? "—"}
- Tipo de desarrollo previsto: ${p.tipo_desarrollo ?? "—"}

ZONIFICACIÓN:
- Código de zona: ${z.zona_codigo ?? "—"}
- Uso permitido: ${z.uso_permitido ?? "—"}
- COS: ${z.cos ?? "—"} · CUS: ${z.cus ?? "—"} · Niveles máx: ${z.niveles_max ?? "—"} · Área libre: ${z.area_libre_pct ?? "—"}%

ENVOLVENTE CONSTRUIBLE (calculada):
- m² construibles totales (CUS × superficie): ${m2(env.construibleTotal)}
- Desplante en planta baja (COS × superficie): ${m2(env.desplante)}
- Niveles aproximados: ${isFinite(env.nivelesAprox) ? Math.floor(env.nivelesAprox) : "—"}

Entrega:
1. Recomendación: COMPRAR, NEGOCIAR o NO_COMPRAR.
2. Precio objetivo por m² de terreno razonable para esta zona y este potencial construible.
3. Nivel de confianza (0-100).
4. Resumen narrativo (2-3 párrafos): contexto de la zona y la normatividad, valoración vs. precio pedido considerando el potencial construible (CUS), y tu recomendación justificada.
5. Fortalezas del terreno (lista).
6. Riesgos detectados (lista), incluyendo normativos y de la zona.`;

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
