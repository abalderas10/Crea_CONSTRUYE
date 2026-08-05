import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  calcFinanciero,
  type FinancieroData,
} from "@/lib/proforma/financiero";

export interface FinancieroAnalysis {
  veredicto: "VIABLE" | "VIABLE_CON_CONDICIONES" | "NO_VIABLE";
  confianza: number;
  resumen: string;
  tir_estimada: string;        // ej. "24.5%"
  payback_estimado: string;   // ej. "4.5 años"
  mejor_escenario: string;    // "Conservador", "Base", "Agresivo"
  alertas: string[];
  recomendaciones: string[];
}

const SCHEMA = {
  type: "object",
  properties: {
    veredicto: { type: "string", enum: ["VIABLE", "VIABLE_CON_CONDICIONES", "NO_VIABLE"] },
    confianza: { type: "integer", description: "0-100" },
    resumen: { type: "string", description: "2-3 párrafos" },
    tir_estimada: { type: "string" },
    payback_estimado: { type: "string" },
    mejor_escenario: { type: "string" },
    alertas: { type: "array", items: { type: "string" } },
    recomendaciones: { type: "array", items: { type: "string" } },
  },
  required: ["veredicto", "confianza", "resumen", "tir_estimada", "payback_estimado", "mejor_escenario", "alertas", "recomendaciones"],
  additionalProperties: false,
} as const;

const SYSTEM = `Eres un analista financiero inmobiliario mexicano. Conoces estructura de capital para desarrollos (capital propio + deuda, LTV típico 50-70%), tasas de interés actuales para créditos puente/puente de construcción, tiempos de preventa y cierre, y márgenes esperados por tipología. Tu análisis: validar que el proyecto es financieramente viable, identificar el mejor escenario, alertar sobre riesgos de capital (LTV excesivo, tasas altas, payback largo) y dar recomendaciones concretas. Sé numérico: ratios, tasas, meses. Si la utilidad neta es negativa en el escenario conservador, dilo. Toda respuesta en español.`;

export async function analyzeFinanciero(
  data: FinancieroData,
  projectContext: string,
): Promise<FinancieroAnalysis> {
  const client = new Anthropic();
  const r = calcFinanciero(data);

  const escenariosStr = r.escenarios
    .map(
      (e) =>
        `${e.nombre}: ROI ${e.roi.toFixed(1)}%, Margen ${e.margenNeto.toFixed(1)}%, Venta en ${e.mesesParaVentaTotal} meses, Intereses ${e.costoFinanciero < 0 ? "-" : ""}${Math.abs(Math.round(e.costoFinanciero)).toLocaleString("es-MX")}, Utilidad neta ${e.utilidadNeta.toLocaleString("es-MX")}`,
    )
    .join("\n");

  const userPrompt = `Analiza la viabilidad financiera de este proyecto inmobiliario.

CONTEXTO:
${projectContext}

INVERSIÓN Y FINANCIAMIENTO:
- Inversión total: ${data.inversion_total ?? "—"}
- Capital propio: ${data.capital_propio ?? "—"}
- Deuda/crédito: ${data.deuda ?? "—"}
- Tasa de interés anual: ${data?.tasa_interes_anual ?? "—"}%
- Plazo del crédito (meses): ${data.plazo_credito_meses ?? "—"}
- Comisión de apertura: ${data.comision_apertura_pct ?? "—"}%
- Pago mensual estimado: ${r.pagoMensualCredito.toLocaleString("es-MX", { maximumFractionDigits: 0 })}

INGRESOS (de la herramienta 3 - Mercado):
- Ingreso bruto total: ${data.ingreso_bruto_total ?? "—"}
- Unidades totales: ${data.unidades_totales ?? "—"}
- m² totales: ${data.m2_construir_total ?? "—"}
- Precio/m² promedio: ${data.precio_m2_promedio ?? "—"}

COSTOS OPERATIVOS:
- Marketing: ${data.costo_marketing_pct_ingreso ?? "3"}% del ingreso
- Comercialización: ${data.costo_comercializacion_pct_ingreso ?? "2"}% del ingreso
- Operación mensual: ${data.costo_operacion_mensual ?? "0"}

CÁLCULO AUTOMÁTICO DE 3 ESCENARIOS:
${escenariosStr}

Recomendaciones automáticas del sistema:
${r.recomendaciones.length === 0 ? "(ninguna)" : r.recomendaciones.join("\n")}

Entrega:
1. Veredicto: VIABLE, VIABLE_CON_CONDICIONES o NO_VIABLE
2. Confianza (0-100)
3. Resumen narrativo (2-3 párrafos): estructura de capital, sensibilidad por escenario, viabilidad global
4. TIR estimada (texto, ej. "24.5%")
5. Payback estimado (texto, ej. "4.5 años")
6. Mejor escenario de los tres (Conservador/Base/Agresivo)
7. Alertas de riesgo financiero (0-3 bullets)
8. Recomendaciones concretas (3-5 bullets)`;

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
  return JSON.parse(textBlock.text) as FinancieroAnalysis;
}