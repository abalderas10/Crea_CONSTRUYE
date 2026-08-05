import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  calcEnvolventeZonif,
  detectarRiesgos,
  permisosRequeridos,
  type ZonificacionData,
} from "@/lib/proforma/zonificacion";
import { num } from "@/lib/proforma/terreno";

export interface ZonificacionAnalysis {
  veredicto: "PROCEDE" | "AJUSTAR" | "NO_PROCEDE";
  confianza: number;
  resumen: string;
  puntos_cumplimiento: string[];
  puntos_ajuste: string[];
  permisos_orden: string[];
  riesgos_adicionales: string[];
  generated_at?: string;
}

const SCHEMA = {
  type: "object",
  properties: {
    veredicto: { type: "string", enum: ["PROCEDE", "AJUSTAR", "NO_PROCEDE"] },
    confianza: { type: "integer", description: "0-100" },
    resumen: {
      type: "string",
      description: "Análisis narrativo de 2-3 párrafos en español.",
    },
    puntos_cumplimiento: { type: "array", items: { type: "string" } },
    puntos_ajuste: { type: "array", items: { type: "string" } },
    permisos_orden: {
      type: "array",
      items: { type: "string" },
      description: "Permisos en orden lógico de obtención (1 = primero).",
    },
    riesgos_adicionales: { type: "array", items: { type: "string" } },
  },
  required: [
    "veredicto",
    "confianza",
    "resumen",
    "puntos_cumplimiento",
    "puntos_ajuste",
    "permisos_orden",
    "riesgos_adicionales",
  ],
  additionalProperties: false,
} as const;

const SYSTEM = `Eres un urbanista y consultor regulatorio mexicano experto en zonificación, uso de suelo y permisos para desarrollo inmobiliario. Conoces las diferencias entre CDMX (SEDUVI/CUZUS, alcaldías) y Estado de México (planes municipales, SEDUI), así como la normatividad federal aplicable (LGEEPA, Ley de Aguas, Protección Civil). Tu análisis se enfoca en: confirmar si el proyecto propuesto cabe en la normatividad del predio, listar permisos en orden lógico, y señalar riesgos adicionales que no aparecen en los datos crudos (afectaciones, densidad, capacidad de servicios, servidumbres, patrimonio). Sé concreto, técnico y en español. Si un dato falta, indícalo y propón cómo obtenerlo.`;

export async function analyzeZonificacion(
  data: ZonificacionData,
  projectContext: string,
): Promise<ZonificacionAnalysis> {
  const client = new Anthropic();
  // La jurisdicción ya viene implícita en la normatividad capturada
  // (CDMX/EdoMex/otro) y en los datos heredados del terreno.
  const env = calcEnvolventeZonif(
    data.norma,
    num(data.terreno_ref?.superficie_terreno),
    num(data.propuesta_m2_construir),
  );
  const riesgosAuto = detectarRiesgos(data);
  const permisosBase = permisosRequeridos(data.tipo_proyecto);

  const userPrompt = `Analiza la viabilidad regulatoria de este proyecto.

CONTEXTO DEL PROYECTO:
${projectContext}

TIPO DE PROYECTO: ${data.tipo_proyecto ?? "—"}
PROPUESTA: ${data.propuesta_unidades ?? "—"} · ${data.propuesta_m2_construir ?? "—"} m²

UBICACIÓN (heredada de Terreno):
- Dirección: ${data.terreno_ref?.direccion ?? "—"}
- Municipio/alcaldía: ${data.terreno_ref?.municipio ?? "—"}
- Cuenta catastral: ${data.terreno_ref?.cuenta_catastral ?? "—"}
- Superficie del terreno: ${data.terreno_ref?.superficie_terreno ?? "—"} m²

NORMATIVA APLICABLE:
- Clave de zona: ${data.norma?.zona_codigo ?? "—"}
- Uso permitido: ${data.norma?.uso_permitido ?? "—"}
- COS: ${data.norma?.cos ?? "—"} · CUS: ${data.norma?.cus ?? "—"} · Niveles máx: ${data.norma?.niveles_max ?? "—"} · Área libre: ${data.norma?.area_libre_pct ?? "—"}%
- Densidad viv/ha: ${data.norma?.densidad_viv_ha ?? "—"}
- Altura máx: ${data.norma?.altura_max_m ?? "—"} m

ENVOLVENTE CALCULADA:
- m² construibles (CUS × superficie): ${Math.round(env.construibleTotal).toLocaleString("es-MX")} m²
- Desplante (COS × superficie): ${Math.round(env.desplante).toLocaleString("es-MX")} m²
- Niveles aprox: ${isFinite(env.nivelesAprox) ? Math.floor(env.nivelesAprox) : "—"}
- La propuesta del usuario cabe en el CUS: ${env.propuestaCabe ? "SÍ" : `NO, excede por ${Math.round(env.deficitM2).toLocaleString("es-MX")} m²`}

RESTRICCIONES DECLARADAS:
- Afectación: ${data.restricciones?.afectacion ?? "—"}
- Zona de riesgo: ${data.restricciones?.zona_riesgo ?? "—"}
- Zona patrimonio: ${data.restricciones?.zona_patrimonio ? "SÍ" : "NO"}
- Restricciones ambientales: ${data.restricciones?.restricciones_ambientales ?? "—"}

SERVICIOS EN EL PREDIO:
- Agua: ${data.servicios?.agua ? "Sí" : "No"} · Drenaje: ${data.servicios?.drenaje ? "Sí" : "No"} · Electricidad: ${data.servicios?.electricidad ? "Sí" : "No"} · Gas: ${data.servicios?.gas ? "Sí" : "No"}
- Vialidad pavimentada: ${data.servicios?.vialidad_pavimentada ? "Sí" : "No"} · Transporte público: ${data.servicios?.transporte_publico ? "Sí" : "No"}

PERMISOS BASE (catálogo general — confirma o ajusta):
${permisosBase.map((p) => `- ${p}`).join("\n")}

RIESGOS DETECTADOS AUTOMÁTICAMENTE:
${riesgosAuto.length === 0 ? "(ninguno)" : riesgosAuto.map((r) => `- [${r.nivel.toUpperCase()}] ${r.texto}`).join("\n")}

Entrega:
1. Veredicto: PROCEDE, AJUSTAR o NO_PROCEDE.
2. Confianza (0-100).
3. Resumen narrativo (2-3 párrafos): cumplimiento normativo, ajuste requerido al proyecto, y tu veredicto.
4. Puntos de cumplimiento del proyecto respecto a la norma.
5. Puntos de ajuste necesarios (qué cambiar para proceder).
6. Lista de permisos en orden lógico de obtención (1 = primero).
7. Riesgos normativos adicionales que detectes (no duplicar los automáticos).`;

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
  return JSON.parse(textBlock.text) as ZonificacionAnalysis;
}
