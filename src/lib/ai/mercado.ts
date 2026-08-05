import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  calcMercado,
  resumenMercado,
  type MercadoData,
} from "@/lib/proforma/mercado";

export interface MercadoAnalysis {
  veredicto: "DEMANDA_FUERTE" | "DEMANDA_MODERADA" | "DEMANDA_DEBIL";
  confianza: number;
  resumen: string;
  precio_objetivo_m2: string;
  absorcion_mensual: number;
  score_demanda: number;
  perfil_comprador: string;
  producto_optimo: string;
  insights: string[];
  alertas: string[];
}

const SCHEMA = {
  type: "object",
  properties: {
    veredicto: { type: "string", enum: ["DEMANDA_FUERTE", "DEMANDA_MODERADA", "DEMANDA_DEBIL"] },
    confianza: { type: "integer", description: "0-100" },
    resumen: { type: "string", description: "2-3 párrafos en español" },
    precio_objetivo_m2: { type: "string", description: "ej. $120,000/m²" },
    absorcion_mensual: { type: "number", description: "unidades/mes esperadas" },
    score_demanda: { type: "integer", description: "0-100" },
    perfil_comprador: { type: "string", description: "1-2 oraciones" },
    producto_optimo: { type: "string", description: "1-2 oraciones" },
    insights: { type: "array", items: { type: "string" } },
    alertas: { type: "array", items: { type: "string" } },
  },
  required: ["veredicto", "confianza", "resumen", "precio_objetivo_m2", "absorcion_mensual", "score_demanda", "perfil_comprador", "producto_optimo", "insights", "alertas"],
  additionalProperties: false,
} as const;

const SYSTEM = `Eres un analista de mercado inmobiliario mexicano. Conoces oferta comparable por zona (CDMX, Estado de México, Guadalajara, Monterrey, Querétaro, Mérida, etc.), tendencias de demanda por tipología (residencial vertical, horizontal, comercial, mixto), perfil del comprador por nivel socioeconómico y rango de precios. Tu análisis: validar el precio objetivo por m², dar una tasa de absorción realista, perfilar al comprador ideal y proponer el producto óptimo (m² por unidad, amenidades, mix). Sé concreto: cifras, comparables, tendencias. Si hay riesgos de mercado (sobreoferta, cambio de tendencia, riesgo de absorción), señálalos. Toda respuesta en español.`;

export async function analyzeMercado(
  data: MercadoData,
  projectContext: string,
): Promise<MercadoAnalysis> {
  const client = new Anthropic();
  const r = calcMercado(data);

  const userPrompt = `Analiza la viabilidad de mercado de este proyecto inmobiliario.

CONTEXTO DEL PROYECTO:
${projectContext}

UBICACIÓN: ${data.municipio ?? "—"}, ${data.zona ?? "—"}

PRODUCTO:
- Tipo: ${data.tipo_proyecto ?? "—"}
- m² totales: ${data.m2_construir_total ?? "—"}
- m² promedio por unidad: ${data.m2_promedio_unidad ?? "—"}
- Unidades totales: ${data.unidades_totales ?? "—"}
- Amenidades: ${data.amenidades ?? "—"}

DEMANDA ESPERADA (input del usuario):
- Precio/m² esperado (rango bajo): ${data.precio_m2_esperado ?? "—"}
- Precio/m² esperado (rango alto): ${data.precio_m2_esperado_alto ?? "—"}
- Radio de búsqueda: ${data.radio_busqueda_km ?? "—"} km
- Público objetivo: ${data.publico_objetivo ?? "—"}
- Nivel socioeconómico: ${data.nivel_socioeconomico ?? "—"}

CÁLCULO AUTOMÁTICO:
${resumenMercado(r)}

COMPARABLES (del usuario):
${(data.comparables ?? []).length === 0 ? "(no se proporcionaron)" : (data.comparables ?? []).map((c) => `- ${c.direccion}: ${c.precio_m2}/m², ${c.m2} m², ${c.distancia_km ?? "?"} km, fuente: ${c.fuente}`).join("\n")}

Entrega:
1. Veredicto: DEMANDA_FUERTE, DEMANDA_MODERADA o DEMANDA_DEBIL
2. Confianza (0-100)
3. Resumen narrativo (2-3 párrafos): análisis del rango de precios esperado, validación vs mercado, tendencia de absorción
4. Precio objetivo por m² recomendado
5. Absorción mensual esperada (número)
6. Score de demanda (0-100)
7. Perfil del comprador ideal (1-2 oraciones)
8. Producto óptimo recomendado (1-2 oraciones)
9. Insights clave (3-5 bullets)
10. Alertas de mercado (0-3 bullets) si hay riesgos de sobreoferta, cambio de tendencia, etc.`;

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
  return JSON.parse(textBlock.text) as MercadoAnalysis;
}