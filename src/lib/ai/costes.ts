import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  calcCostos,
  resumenCostos,
  type CostosData,
} from "@/lib/proforma/costes";

export interface CostosAnalysis {
  veredicto: "EN_PRESUPUESTO" | "AJUSTAR_PARTIDAS" | "FUERA_DE_PRESUPUESTO";
  confianza: number;
  resumen: string;
  partidas_criticas: string[];
  partidas_optimizables: string[];
  recomendaciones: string[];
  costo_total_estimado: string;
  costo_por_m2: string;
}

const SCHEMA = {
  type: "object",
  properties: {
    veredicto: { type: "string", enum: ["EN_PRESUPUESTO", "AJUSTAR_PARTIDAS", "FUERA_DE_PRESUPUESTO"] },
    confianza: { type: "integer", description: "0-100" },
    resumen: { type: "string", description: "2-3 párrafos en español" },
    partidas_criticas: { type: "array", items: { type: "string" } },
    partidas_optimizables: { type: "array", items: { type: "string" } },
    recomendaciones: { type: "array", items: { type: "string" } },
    costo_total_estimado: { type: "string", description: "ej. $87,500,000" },
    costo_por_m2: { type: "string", description: "ej. $32,400/m²" },
  },
  required: ["veredicto", "confianza", "resumen", "partidas_criticas", "partidas_optimizables", "recomendaciones", "costo_total_estimado", "costo_por_m2"],
  additionalProperties: false,
} as const;

const SYSTEM = `Eres un perito general de obra y analista de presupuestos de construcción en México. Conoces costos paramétricos 2025-2026 por tipología (concreto, acero, mixta), calidad de acabados, y costos por zona (CDMX, Estado de México, interior de la república). Tu análisis: validar que el presupuesto paramétrico es razonable, identificar partidas críticas (donde el sobrecosto es más probable) y optimizables (donde hay margen sin sacrificar calidad), y dar recomendaciones concretas. Sé numérico y específico, no genérico. Si el costo por m² está fuera de rango para la zona/tipología, dilo con cifras. Si hay ahorro potencial por cambio de sistema constructivo o calidad, cuéntalo. Toda respuesta en español.`;

export async function analyzeCostos(
  data: CostosData,
  projectContext: string,
): Promise<CostosAnalysis> {
  const client = new Anthropic();
  const r = calcCostos(data);

  const userPrompt = `Analiza la viabilidad de este presupuesto de construcción.

CONTEXTO DEL PROYECTO:
${projectContext}

INPUTS DEL PROYECTO:
- m² a construir: ${data.m2_construir ?? "—"}
- Niveles sobre rasante: ${data.niveles ?? "—"}
- Sótanos: ${data.sotanos ?? "0"}
- Tipo de estructura: ${data.tipo_estructura ?? "—"}
- Calidad de acabados: ${data.calidad_acabados ?? "—"}
- Unidades vendibles: ${data.unidades ?? "—"}
- Cajones de estacionamiento: ${data.cajones_estacionamiento ?? "—"}
- Factor de región: ${data.region_factor ?? "1.0"}

COSTOS DECLARADOS:
- Costo del terreno: ${data.costo_terreno ?? "—"}
- Costo de permisos/trámites: ${data.costo_permisos_tramites ?? "—"}
- Costo del proyecto arquitectónico: ${data.costo_proyecto_arquitectonico ?? "—"}

CÁLCULO PARAMÉTRICO AUTOMÁTICO:
${resumenCostos(r)}

PARTIDAS PRINCIPALES (% del costo directo):
${r.partidas.map((p) => `- ${p.nombre}: ${(p.pctDelTotal).toFixed(1)}% — $${Math.round(p.costo).toLocaleString("es-MX")}`).join("\n")}

Entrega:
1. Veredicto: EN_PRESUPUESTO, AJUSTAR_PARTIDAS o FUERA_DE_PRESUPUESTO
2. Confianza (0-100)
3. Resumen narrativo (2-3 párrafos): razonabilidad del costo por m² para la tipología y zona, comparación con rangos típicos 2025-2026, impacto de las decisiones de calidad y estructura
4. Partidas críticas (lista): dónde es más probable un sobrecosto y por qué
5. Partidas optimizables (lista): dónde hay margen real de ahorro sin sacrificar calidad/seguridad
6. Recomendaciones concretas (lista): qué cambiar para optimizar el presupuesto`;

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
  return JSON.parse(textBlock.text) as CostosAnalysis;
}