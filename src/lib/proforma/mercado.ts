// Tipos y cálculos de Mercado (puro, sin server-only).
// Análisis de oferta comparable + demanda + absorción esperada.

import { num, money } from "@/lib/proforma/terreno";

export type TipoProyecto =
  | "habitacional"
  | "habitacional-mixto"
  | "comercial"
  | "oficinas"
  | "industrial"
  | "mixto"
  | "otro";

export interface Comparable {
  fuente: string;             // "Inmuebles24", "Vivanuncios", "dato propio"
  direccion: string;
  m2: string;
  precio_m2: string;           // "$120,000"
  distancia_km?: string;       // "1.2"
  recamaros?: string;
  meses_en_mercado?: string;   // "8"
}

export interface MercadoData {
  // Ubicación (heredada si existe)
  municipio?: string;          // ej. "Cuauhtémoc, CDMX"
  zona?: string;               // nombre de la colonia/área

  // Producto
  tipo_proyecto?: TipoProyecto;
  m2_construir_total?: string;
  m2_promedio_unidad?: string; // ej. "75 m²" para depto
  unidades_totales?: string;
  amenidades?: string;          // texto libre: "roof garden, gym, 2 cajones"

  // Demanda esperada
  precio_m2_esperado?: string; // rango bajo (ej. "$110,000")
  precio_m2_esperado_alto?: string; // rango alto
  radio_busqueda_km?: string;  // "5"
  publico_objetivo?: string;   // "Jóvenes profesionistas 28-40"
  nivel_socioeconomico?: "A/B" | "C+" | "C" | "C-" | "D+" | "D";

  // Comparables (inputs manuales, se muestran en el reporte)
  comparables?: Comparable[];
}

export interface ResumenMercado {
  inversion_estimada_venta: number;  // m² × precio / m² × unidades
  ingreso_bruto_proyecto: number;    // unidades × m² × precio / m²
  absorcion_mensual_estimada: number;
  score_demanda: number;             // 0-100
  meses_para_vender_todo: number;
  competencia_score: number;         // 0-100 (más bajo = menos competencia)
}

/**
 * Score de demanda: combinación de precio relativo a la zona,
 * amenidades y tipo de proyecto. Heurística simple.
 */
export function scoreDemanda(data?: MercadoData): number {
  if (!data) return 0;
  const base = 50;

  // Bonus por amenidades mencionadas
  const amenidades = (data.amenidades ?? "").toLowerCase();
  let bonus = 0;
  if (/gym|gimnasio/.test(amenidades)) bonus += 4;
  if (/roof|garden|terraza/.test(amenidades)) bonus += 4;
  if (/seguridad|vigilancia|24\s*h/.test(amenidades)) bonus += 3;
  if (/estacionamiento|cajones/.test(amenidades)) bonus += 3;
  if (/pet|pet.friendly/.test(amenidades)) bonus += 2;

  // Bonus por nivel socioeconómico (más alto = menor demanda pero más margen)
  if (data.nivel_socioeconomico === "A/B") bonus += 5;
  if (data.nivel_socioeconomico === "C+") bonus += 8;
  if (data.nivel_socioeconomico === "C") bonus += 10;
  if (data.nivel_socioeconomico === "C-") bonus += 7;
  if (data.nivel_socioeconomico === "D+") bonus += 5;

  return Math.min(100, Math.max(0, base + bonus));
}

/**
 * Absorción mensual estimada: ratio estándar para desarrollo mexicano.
 * - Residencial: 1-3% del inventario total al mes
 * - Comercial: 0.5-1.5%
 * - Industrial: 0.3-0.8%
 * Métrica: unidades vendidas por mes.
 */
export function absorcionMensualEstimada(
  unidades: number,
  tipo: TipoProyecto,
): number {
  if (!unidades || unidades <= 0) return 0;
  const ratios: Record<TipoProyecto, [number, number]> = {
    habitacional: [0.015, 0.03],     // 1.5-3% mensual
    "habitacional-mixto": [0.012, 0.025],
    comercial: [0.008, 0.015],
    oficinas: [0.005, 0.012],
    industrial: [0.003, 0.008],
    mixto: [0.01, 0.02],
    otro: [0.01, 0.02],
  };
  const [low, high] = ratios[tipo] ?? ratios.otro;
  const mid = (low + high) / 2;
  return Math.max(1, unidades * mid);
}

/**
 * Resumen numérico del mercado (cálculos puros, sin IA).
 */
export function calcMercado(data?: MercadoData): ResumenMercado {
  const m2 = num(data?.m2_construir_total);
  const unidades = num(data?.unidades_totales);
  const precioBajo = num(data?.precio_m2_esperado);
  const precioAlto = num(data?.precio_m2_esperado_alto);
  const precioPromedio = isFinite(precioBajo) && isFinite(precioAlto)
    ? (precioBajo + precioAlto) / 2
    : isFinite(precioBajo)
      ? precioBajo
      : isFinite(precioAlto)
        ? precioAlto
        : NaN;

  const ingresoBruto = isFinite(m2) && isFinite(precioPromedio)
    ? m2 * precioPromedio
    : NaN;

  const inversionEstimada = isFinite(unidades) && isFinite(m2) && isFinite(precioPromedio)
    ? (unidades / Math.max(m2, 1)) * m2 * precioPromedio
    : ingresoBruto;

  const absorcion = absorcionMensualEstimada(
    unidades,
    (data?.tipo_proyecto as TipoProyecto) ?? "habitacional",
  );
  const mesesParaVenderTodo = isFinite(absorcion) && absorcion > 0
    ? unidades / absorcion
    : NaN;

  const scoreDemandaActual = scoreDemanda(data);
  const competencia = (data?.comparables?.length ?? 0) > 5 ? 80 : 50;

  return {
    inversion_estimada_venta: isFinite(inversionEstimada) ? inversionEstimada : 0,
    ingreso_bruto_proyecto: isFinite(ingresoBruto) ? ingresoBruto : 0,
    absorcion_mensual_estimada: absorcion,
    score_demanda: scoreDemandaActual,
    meses_para_vender_todo: isFinite(mesesParaVenderTodo) ? mesesParaVenderTodo : 0,
    competencia_score: competencia,
  };
}

export function resumenMercado(r: ResumenMercado): string {
  return [
    `Ingreso bruto del proyecto: ${money(r.ingreso_bruto_proyecto)}`,
    `Absorción mensual estimada: ${r.absorcion_mensual_estimada.toFixed(1)} unidades/mes`,
    `Tiempo estimado para vender todo: ${r.meses_para_vender_todo.toFixed(0)} meses`,
    `Score de demanda: ${r.score_demanda}/100`,
    `Nivel de competencia: ${r.competencia_score}/100`,
  ].join("\n");
}