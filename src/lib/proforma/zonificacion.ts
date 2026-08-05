// Tipos y cálculos de Zonificación (puro, sin server-only).
// Se apoya en lib/proforma/terreno.ts: la envolvente es la misma matemática.

import { num } from "@/lib/proforma/terreno";

export type TipoProyecto =
  | "habitacional"
  | "habitacional-mixto"
  | "comercial"
  | "oficinas"
  | "industrial"
  | "mixto"
  | "otro";

export interface ZonificacionNorma {
  zona_codigo?: string;        // ej. "HM 4/20/Z" (CDMX) o "H.200.A" (EdoMex)
  uso_permitido?: string;      // texto libre del plan local
  cos?: string;                // 0–1
  cus?: string;                // ej. "3.0"
  niveles_max?: string;        // ej. "5"
  area_libre_pct?: string;     // ej. "20"
  densidad_viv_ha?: string;    // opcional: viv/ha cuando aplique
  altura_max_m?: string;       // opcional: altura en metros
}

export interface ZonificacionRestricciones {
  afectacion?: string;         // ej. "Río", "Derecho de vía", "Área verde"
  zona_riesgo?: string;        // ej. "Inundación", "Hundimiento", "Sísmica"
  zona_patrimonio?: boolean;   // INAH/INBAL
  servidumbres?: string;       // ej. "Paso de servicios subterráneos"
  restricciones_ambientales?: string; // ej. "Impacto ambiental requerido"
}

export interface ZonificacionServicios {
  agua: boolean;
  drenaje: boolean;
  electricidad: boolean;
  gas: boolean;
  vialidad_pavimentada: boolean;
  transporte_publico: boolean;
}

export interface ZonificacionData {
  tipo_proyecto?: TipoProyecto;
  propuesta_unidades?: string;   // ej. "60 deptos"
  propuesta_m2_construir?: string; // m² que se quieren construir
  norma?: ZonificacionNorma;
  restricciones?: ZonificacionRestricciones;
  servicios?: ZonificacionServicios;
  // Contexto heredado de Terreno (opcional, para que Claude tenga el panorama)
  terreno_ref?: {
    direccion?: string;
    municipio?: string;
    cuenta_catastral?: string;
    superficie_terreno?: string;
  };
}

export interface EnvolventeConstruible {
  superficie: number;
  cos: number;
  cus: number;
  desplante: number;
  construibleTotal: number;
  nivelesAprox: number;
  areaLibre: number;
  propuestaCabe: boolean;
  propuestaM2: number;
  deficitM2: number;
  excedenteM2: number;
}

/**
 * Re-calcula la envolvente a partir de la norma capturada en Zonificación.
 * Si la propuesta del usuario excede CUS, lo señala (no bloquea: es editable).
 */
export function calcEnvolventeZonif(
  norma?: ZonificacionNorma,
  superficie?: number,
  propuestaM2?: number,
): EnvolventeConstruible {
  const sup = superficie ?? 0;
  const cos = num(norma?.cos);
  const cus = num(norma?.cus);
  const nivelesGiven = num(norma?.niveles_max);
  const nivelesAprox = isFinite(nivelesGiven) ? nivelesGiven : cus / cos;
  const desplante = cos * sup;
  const construibleTotal = cus * sup;
  const areaLibrePct = num(norma?.area_libre_pct);
  const areaLibre = isFinite(areaLibrePct)
    ? (areaLibrePct / 100) * sup
    : sup - desplante;

  const m2 = propuestaM2 ?? 0;
  const propuestaCabe = m2 > 0 && m2 <= construibleTotal;
  const deficitM2 = m2 > construibleTotal ? m2 - construibleTotal : 0;
  const excedenteM2 = construibleTotal > m2 ? construibleTotal - m2 : 0;

  return {
    superficie: sup,
    cos,
    cus,
    desplante,
    construibleTotal,
    nivelesAprox,
    areaLibre,
    propuestaCabe,
    propuestaM2: m2,
    deficitM2,
    excedenteM2,
  };
}

/**
 * Lista los permisos/trámites típicos requeridos según tipo de proyecto.
 * Esto es el "checklist regulatorio" base; Claude lo ajustará con
 * particularidades del municipio/estado.
 */
export function permisosRequeridos(tipo?: TipoProyecto): string[] {
  const base = [
    "Uso de suelo específico / Dictamen de congruencia",
    "Licencia de construcción (alineamiento, número oficial)",
    "Manifestación de obra o equivalente",
  ];
  if (tipo === "industrial") {
    return [
      ...base,
      "Estudio de Impacto Ambiental (MIA) / IPPC según giro",
      "Licencia sanitaria (COFEPRIS) si aplica",
      "Dictamen de Protección Civil (bodegas, productos peligrosos)",
      "Permiso de descargas (CONAGUA) si hay residuos líquidos industriales",
    ];
  }
  if (tipo === "comercial" || tipo === "oficinas" || tipo === "mixto") {
    return [
      ...base,
      "Visto bueno de Protección Civil (giro con aforo)",
      "Dictamen de impacto vial si supera umbral de cajones",
      "Permiso de anuncios (si lleva fachada comercial)",
    ];
  }
  // habitacional / habitacional-mixto / otro
  return [
    ...base,
    "Dictamen de Protección Civil",
    "Estudio de Impacto Urbano o equivalente (según m² y densidad)",
    "Carta de factibilidad de servicios (agua, drenaje, electricidad)",
  ];
}

export interface RiesgoDetectado {
  nivel: "alto" | "medio" | "bajo";
  texto: string;
}

export function detectarRiesgos(data?: ZonificacionData): RiesgoDetectado[] {
  if (!data) return [];
  const out: RiesgoDetectado[] = [];

  const r = data.restricciones;
  if (r?.zona_riesgo) {
    const txt = r.zona_riesgo.trim();
    if (/inund|hundim|geol|fall|sísm/i.test(txt)) {
      out.push({ nivel: "alto", texto: `Zona de riesgo: ${txt}. Requiere estudio técnico.` });
    } else if (txt) {
      out.push({ nivel: "medio", texto: `Zona de riesgo: ${txt}.` });
    }
  }
  if (r?.zona_patrimonio) {
    out.push({ nivel: "alto", texto: "Zona de patrimonio (INAH/INBAL): requiere autorización previa." });
  }
  if (r?.afectacion) {
    out.push({ nivel: "medio", texto: `Afectación: ${r.afectacion}. Reduce el área útil.` });
  }
  if (r?.restricciones_ambientales) {
    out.push({ nivel: "medio", texto: `Restricción ambiental: ${r.restricciones_ambientales}.` });
  }

  const s = data.servicios;
  if (s) {
    const faltan: string[] = [];
    if (!s.agua) faltan.push("agua");
    if (!s.drenaje) faltan.push("drenaje");
    if (!s.electricidad) faltan.push("electricidad");
    if (faltan.length > 0) {
      out.push({
        nivel: faltan.length > 1 ? "alto" : "medio",
        texto: `Faltan servicios públicos: ${faltan.join(", ")}.`,
      });
    }
    if (!s.vialidad_pavimentada) {
      out.push({ nivel: "medio", texto: "Vialidad no pavimentada: costo extra de urbanización." });
    }
  }

  const env = calcEnvolventeZonif(
    data.norma,
    num(data.terreno_ref?.superficie_terreno),
    num(data.propuesta_m2_construir),
  );
  if (env.propuestaM2 > 0 && !env.propuestaCabe) {
    out.push({
      nivel: "alto",
      texto: `La propuesta (${Math.round(env.propuestaM2).toLocaleString("es-MX")} m²) excede el CUS permitido (${Math.round(env.construibleTotal).toLocaleString("es-MX")} m²).`,
    });
  }

  return out;
}
