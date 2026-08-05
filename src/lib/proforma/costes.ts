// Tipos y cálculos de Costos (puro, sin server-only).
// Presupuesto paramétrico basado en costo/m² por tipología y calidad.

import { num, money } from "@/lib/proforma/terreno";

export type TipoEstructura = "concreto" | "acero" | "mixta" | "mamposteria" | "otro";
export type CalidadAcabados = "economica" | "media" | "alta" | "premium";

export interface CostosData {
  // Inputs base (heredados de Terreno + Zonificación si existen)
  superficie_terreno?: string;
  m2_construir?: string;          // m² totales a construir
  niveles?: string;               // pisos sobre rasante
  sotanos?: string;               // pisos bajo rasante (0-3)

  // Insumos específicos de Costos
  tipo_estructura?: TipoEstructura;
  calidad_acabados?: CalidadAcabados;
  unidades?: string;              // número de unidades vendibles
  cajones_estacionamiento?: string;

  // Costos directos adicionales
  costo_terreno?: string;         // $
  costo_permisos_tramites?: string; // $
  costo_proyecto_arquitectonico?: string; // $ (5-8% típicamente)

  // Factores de ajuste
  region_factor?: string;         // ej. "1.0" para CDMX, "0.85" para zonas rurales
}

export interface PartidaCostos {
  nombre: string;
  costoM2: number;       // costo por m²
  m2Aplicables: number;  // m² a los que aplica esta partida
  costo: number;         // costoM2 * m2Aplicables
  pctDelTotal: number;   // % sobre el costo directo total
}

export interface ResumenCostos {
  costoM2Promedio: number;
  costoDirectoTotal: number;
  costoIndirecto: number;     // permisos + proyecto + supervisión
  costoTerreno: number;
  costoTotal: number;         // terreno + directo + indirecto
  contingencia: number;       // 10% del directo
  costoM2Final: number;        // costoTotal / m2_construir
  partidas: PartidaCostos[];
}

/**
 * Costo por m² según tipología y calidad de acabados (referencia México 2025-2026).
 * Incluye materiales, mano de obra y equipos. NO incluye terreno, ni costos blandos.
 */
export function costoM2PorTipologia(
  tipo: TipoEstructura = "concreto",
  calidad: CalidadAcabados = "media",
): number {
  // Tabla base: concreto + calidad media = $22,000/m² (referencia 2025)
  const base: Record<TipoEstructura, number> = {
    concreto: 22000,
    acero: 24000,
    mixta: 23000,
    mamposteria: 18000,
    otro: 21000,
  };
  const factor: Record<CalidadAcabados, number> = {
    economica: 0.7,
    media: 1.0,
    alta: 1.35,
    premium: 1.85,
  };
  return base[tipo] * factor[calidad];
}

/**
 * Distribución estándar por partidas (% sobre costo directo).
 * Suma ~100%. Ordenadas por fase constructiva.
 */
const DISTRIBUCION_PARTIDAS: { nombre: string; pct: number }[] = [
  { nombre: "Cimentación y movimientos de tierra", pct: 0.10 },
  { nombre: "Estructura", pct: 0.22 },
  { nombre: "Albañilería y obra negra", pct: 0.12 },
  { nombre: "Instalaciones (hidráulica, sanitaria, eléctrica, gas)", pct: 0.18 },
  { nombre: "Acabados (pisos, muros, plafones, carpintería)", pct: 0.20 },
  { nombre: "Carpintería fina, herrería, cancelería", pct: 0.06 },
  { nombre: "Equipamiento (elevadores, sistemas especiales)", pct: 0.04 },
  { nombre: "Urbanización y exteriores", pct: 0.04 },
  { nombre: "Limpieza y entrega", pct: 0.02 },
  { nombre: "Imprevistos de obra", pct: 0.02 },
];

export function calcCostos(data?: CostosData): ResumenCostos {
  const m2 = num(data?.m2_construir);
  const sotanos = num(data?.sotanos);
  const costoM2Base = costoM2PorTipologia(
    data?.tipo_estructura ?? "concreto",
    data?.calidad_acabados ?? "media",
  );
  const factorRegion = num(data?.region_factor) || 1;

  // Los sótanos cuestan 1.6x por m² (excavación, contención, estructura pesada)
  const m2Sotanos = isFinite(sotanos) && sotanos > 0 ? m2 * (sotanos / Math.max(num(data?.niveles) + sotanos, 1)) : 0;

  const costoDirectoBase = m2 * costoM2Base * factorRegion;
  const costoSotanosExtra = m2Sotanos * costoM2Base * 0.6 * factorRegion;
  const costoDirectoTotal = costoDirectoBase + costoSotanosExtra;

  // Desglose por partida
  const partidas: PartidaCostos[] = DISTRIBUCION_PARTIDAS.map((p) => ({
    nombre: p.nombre,
    costoM2: costoM2Base * p.pct * factorRegion,
    m2Aplicables: m2,
    costo: costoDirectoTotal * p.pct,
    pctDelTotal: p.pct * 100,
  }));

  // Costos indirectos (blandos): permisos, proyecto arquitectónico, supervisión
  const costoTerreno = num(data?.costo_terreno);
  const costoPermisos = num(data?.costo_permisos_tramites);
  const costoProyecto = num(data?.costo_proyecto_arquitectonico);
  const costoIndirecto = costoPermisos + costoProyecto;

  // Contingencia: 10% del costo directo
  const contingencia = costoDirectoTotal * 0.10;

  const costoTotal = costoTerreno + costoDirectoTotal + costoIndirecto + contingencia;
  const costoM2Final = isFinite(m2) && m2 > 0 ? costoTotal / m2 : NaN;

  return {
    costoM2Promedio: costoM2Base * factorRegion,
    costoDirectoTotal,
    costoIndirecto,
    costoTerreno,
    costoTotal,
    contingencia,
    costoM2Final,
    partidas,
  };
}

/** Resumen legible para mostrar al usuario. */
export function resumenCostos(r: ResumenCostos): string {
  return [
    `Costo por m² promedio: ${money(r.costoM2Promedio)}`,
    `Costo directo total: ${money(r.costoDirectoTotal)}`,
    `Indirectos (permisos + proyecto): ${money(r.costoIndirecto)}`,
    `Terreno: ${money(r.costoTerreno)}`,
    `Contingencia (10%): ${money(r.contingencia)}`,
    `COSTO TOTAL: ${money(r.costoTotal)}`,
    `Costo final por m² construido: ${money(r.costoM2Final)}`,
  ].join("\n");
}