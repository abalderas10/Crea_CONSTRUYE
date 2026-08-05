import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  consolidarRiesgos,
  type RiesgosData,
  type MatrizRiesgos,
} from "@/lib/proforma/riesgos";

export interface RiesgosAnalysis extends MatrizRiesgos {
  generated_at?: string;
}

const SCHEMA = {
  type: "object",
  properties: {
    veredicto: { type: "string", enum: ["GO", "GO_CON_CONDICIONES", "NO_GO", "PENDIENTE"] },
    confianza: { type: "integer", description: "0-100" },
    resumen: { type: "string", description: "2-3 párrafos" },
    riesgos: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nivel: { type: "string", enum: ["alto", "medio", "bajo"] },
          categoria: {
            type: "string",
            enum: ["terreno", "normativo", "mercado", "financiero", "ejecucion", "reputacion"],
          },
          titulo: { type: "string" },
          descripcion: { type: "string" },
          mitigacion: { type: "string" },
        },
        required: ["nivel", "categoria", "titulo", "descripcion"],
      },
    },
    mitigaciones: { type: "array", items: { type: "string" } },
    varEstimado: { type: "number", description: "0-1 (proporción de la inversión)" },
  },
  required: ["veredicto", "confianza", "resumen", "riesgos", "mitigaciones", "varEstimado"],
  additionalProperties: false,
} as const;

const SYSTEM = `Eres un director de riesgos inmobiliarios mexicano. Tu trabajo es consolidar el análisis de 5 herramientas (Terreno, Zonificación, Costos, Mercado, Financiero) en una matriz de riesgos y un veredicto final GO/NO-GO/GO_CON_CONDICIONES.

Reglas duras:
- NO inventes riesgos nuevos más allá de lo que las herramientas reportan + tu lectura cruzada entre ellas (ej. "si Terreno dice zona de riesgo sísmico + Costos no incluye seguro, hay riesgo de sobrecosto").
- Tu veredicto debe estar justificado con cifras: cuenta de riesgos altos, VaR estimado, ratio de los indicadores clave.
- Si hay 1 riesgo alto aislado, NO es NO_GO — es GO_CON_CONDICICION (se puede resolver con mitigación).
- Si hay 2+ riesgos altos, sí es NO_GO.
- Mitigaciones concretas, no genéricas. "Negociar precio" sí; "mejorar la gestión" no.
- Toda respuesta en español.`;

export async function analyzeRiesgos(
  toolsData: Parameters<typeof consolidarRiesgos>[0],
  userData: RiesgosData | undefined,
  projectContext: string,
  precomputed?: MatrizRiesgos,
): Promise<RiesgosAnalysis> {
  const client = new Anthropic();
  const base = precomputed ?? consolidarRiesgos(toolsData, userData);

  // Construir resumen para Claude
  const resumenes: string[] = [];
  const t = toolsData.terreno?.ai_analysis as { recomendacion?: string } | undefined;
  const z = toolsData.zonificacion?.ai_analysis as { veredicto?: string } | undefined;
  const c = toolsData.costos?.ai_analysis as { veredicto?: string } | undefined;
  const m = toolsData.mercado?.ai_analysis as { veredicto?: string } | undefined;
  const f = toolsData.financiero?.ai_analysis as { veredicto?: string } | undefined;

  if (t?.recomendacion) resumenes.push(`Terreno: ${t.recomendacion}`);
  if (z?.veredicto) resumenes.push(`Zonificación: ${z.veredicto}`);
  if (c?.veredicto) resumenes.push(`Costos: ${c.veredicto}`);
  if (m?.veredicto) resumenes.push(`Mercado: ${m.veredicto}`);
  if (f?.veredicto) resumenes.push(`Financiero: ${f.veredicto}`);

  const userPrompt = `Consolida el análisis de riesgos de este proyecto y emite el veredicto final.

CONTEXTO:
${projectContext}

VEREDICTOS DE LAS 5 HERRAMIENTAS CRÍTICAS:
${resumenes.length === 0 ? "(ninguna herramienta analizada aún)" : resumenes.join("\n")}

MATRIZ DE RIESGOS PRE-COMPUTADA (heurística):
- Total riesgos: ${base.riesgos.length}
- Altos: ${base.countAlto}
- Medios: ${base.countMedio}
- Bajos: ${base.countBajo}
- VaR estimado: ${(base.varEstimado * 100).toFixed(0)}% de la inversión
- Veredicto heurístico: ${base.veredicto}

RIESGOS DETECTADOS:
${base.riesgos.map((r, i) => `${i + 1}. [${r.nivel.toUpperCase()}] ${r.titulo} (${r.categoria}): ${r.descripcion}`).join("\n")}

CONTEXTO DEL USUARIO:
${userData?.experiencia_previa ? `- Experiencia previa: ${userData.experiencia_previa}` : ""}
${userData?.tiene_socio_inversionista ? "- Tiene socio inversionista" : ""}
${userData?.notas_adicionales ? `- Notas adicionales: ${userData.notas_adicionales}` : ""}

Tu trabajo:
1. Validar o ajustar la matriz (puedes agregar riesgos derivados de la lectura cruzada entre herramientas, pero no inventar).
2. Refinar el veredicto con justificación numérica.
3. Lista de mitigaciones concretas y priorizadas.
4. VaR estimado como % de la inversión.`;

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
  const parsed = JSON.parse(textBlock.text) as RiesgosAnalysis;

  return {
    ...parsed,
    riesgos: parsed.riesgos ?? [],
    mitigaciones: parsed.mitigaciones ?? [],
    countAlto: (parsed.riesgos ?? []).filter((r) => r.nivel === "alto").length,
    countMedio: (parsed.riesgos ?? []).filter((r) => r.nivel === "medio").length,
    countBajo: (parsed.riesgos ?? []).filter((r) => r.nivel === "bajo").length,
    generated_at: new Date().toISOString(),
  };
}