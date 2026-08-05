// Tipos y cálculos de Financiero (puro, sin server-only).
// Flujo de caja mensual del proyecto + 3 escenarios + punto de equilibrio.

import { num } from "@/lib/proforma/terreno";

export interface FinancieroData {
  // Inversión total (heredada si existe)
  inversion_total?: string;         // costo total (terreno + obra + indirectos)
  capital_propio?: string;          // $
  deuda?: string;                   // $
  tasa_interes_anual?: string;      // ej. "12.5" (%)
  plazo_credito_meses?: string;     // ej. "24"
  comision_apertura_pct?: string;   // ej. "1.5"

  // Ingresos (heredados de Mercado)
  ingreso_bruto_total?: string;     // $
  unidades_totales?: string;
  precio_m2_promedio?: string;
  m2_construir_total?: string;

  // Costos operativos durante preventa/venta
  costo_marketing_pct_ingreso?: string; // ej. "3"
  costo_comercializacion_pct_ingreso?: string; // ej. "2"
  costo_operacion_mensual?: string; // $
}

/** Cálculo de pago mensual de crédito hipotecario (sistema francés). */
export function pagoMensualCredito(
  principal: number,
  tasaAnualPct: number,
  meses: number,
): number {
  if (principal <= 0 || meses <= 0) return 0;
  const tasaMensual = tasaAnualPct / 100 / 12;
  if (tasaMensual === 0) return principal / meses;
  const r = tasaMensual;
  const factor = (r * Math.pow(1 + r, meses)) / (Math.pow(1 + r, meses) - 1);
  return principal * factor;
}

export interface Escenario {
  nombre: "Conservador" | "Base" | "Agresivo";
  absorcionMensual: number;       // unidades/mes
  precioM2: number;               // $/m²
  mesesParaVentaTotal: number;
  ingresoBruto: number;
  costoFinanciero: number;        // intereses pagados durante el proyecto
  utilidadBruta: number;
  utilidadNeta: number;           // después de costos operativos
  margenNeto: number;             // % sobre ingreso
  roi: number;                     // % sobre capital propio
  paybackMeses: number;            // meses hasta recuperar inversión
}

export interface ResumenFinanciero {
  escenarios: Escenario[];
  equilibrioMeses: number;        // meses para break-even
  capitalPropio: number;
  deuda: number;
  pagoMensualCredito: number;
  recomendaciones: string[];
}

/**
 * Genera los 3 escenarios (conservador/base/agresivo) en función de
 * los inputs. Usa los cálculos puros de Costos y Mercado si existen.
 */
export function calcFinanciero(data?: FinancieroData): ResumenFinanciero {
  const inversion = num(data?.inversion_total);
  const capitalPropio = num(data?.capital_propio);
  const deuda = num(data?.deuda);
  const tasa = num(data?.tasa_interes_anual);
  const meses = num(data?.plazo_credito_meses);
  const pagoMensual = pagoMensualCredito(deuda, tasa, meses);

  const unidades = num(data?.unidades_totales);
  const m2Total = num(data?.m2_construir_total);
  const precioM2 = num(data?.precio_m2_promedio);
  const ingresoBrutoTotal = num(data?.ingreso_bruto_total);

  // Defaults para absorción según tipología (3 escenarios)
  const ratiosCons = [0.008, 0.012, 0.018]; // 0.8-1.8% mensual
  const ratiosBase = [0.015, 0.022, 0.03];
  const ratiosAgr = [0.025, 0.035, 0.05];

  const escenariosBase: Escenario[] = [
    {
      nombre: "Conservador",
      absorcionMensual: unidades * ratiosCons[1],
      precioM2: precioM2 * 0.92,
      mesesParaVentaTotal: 0,
      ingresoBruto: 0,
      costoFinanciero: 0,
      utilidadBruta: 0,
      utilidadNeta: 0,
      margenNeto: 0,
      roi: 0,
      paybackMeses: 0,
    },
    {
      nombre: "Base",
      absorcionMensual: unidades * ratiosBase[1],
      precioM2: precioM2,
      mesesParaVentaTotal: 0,
      ingresoBruto: 0,
      costoFinanciero: 0,
      utilidadBruta: 0,
      utilidadNeta: 0,
      margenNeto: 0,
      roi: 0,
      paybackMeses: 0,
    },
    {
      nombre: "Agresivo",
      absorcionMensual: unidades * ratiosAgr[1],
      precioM2: precioM2 * 1.08,
      mesesParaVentaTotal: 0,
      ingresoBruto: 0,
      costoFinanciero: 0,
      utilidadBruta: 0,
      utilidadNeta: 0,
      margenNeto: 0,
      roi: 0,
      paybackMeses: 0,
    },
  ];

  // Llenar escenarios
  for (const e of escenariosBase) {
    e.ingresoBruto = isFinite(precioM2) && isFinite(m2Total)
      ? e.precioM2 * m2Total
      : isFinite(ingresoBrutoTotal) && e === escenariosBase[1]
        ? ingresoBrutoTotal
        : 0;

    e.mesesParaVentaTotal = e.absorcionMensual > 0
      ? Math.ceil(unidades / e.absorcionMensual)
      : 0;

    // Costo financiero: intereses durante el periodo de venta
    const mesesConDeuda = Math.min(e.mesesParaVentaTotal, meses);
    e.costoFinanciero = pagoMensual * mesesConDeuda - deuda;

    e.utilidadBruta = e.ingresoBruto - inversion;
    const pctComercial = (num(data?.costo_comercializacion_pct_ingreso) || 2) / 100;
    const pctMarketing = (num(data?.costo_marketing_pct_ingreso) || 3) / 100;
    const costosOperativos = e.ingresoBruto * (pctComercial + pctMarketing);
    e.utilidadNeta = e.utilidadBruta - costosOperativos - Math.max(e.costoFinanciero, 0);
    e.margenNeto = e.ingresoBruto > 0 ? (e.utilidadNeta / e.ingresoBruto) * 100 : 0;
    e.roi = capitalPropio > 0 ? (e.utilidadNeta / capitalPropio) * 100 : 0;
    e.paybackMeses = e.utilidadNeta > 0 && e.ingresoBruto > 0
      ? Math.ceil((capitalPropio || inversion) / (e.ingresoBruto / Math.max(e.mesesParaVentaTotal, 1)))
      : 0;
  }

  const equilibrioMeses = inversion > 0 && ingresoBrutoTotal > 0
    ? Math.ceil(inversion / (ingresoBrutoTotal / Math.max(unidades, 1)))
    : 0;

  const recomendaciones: string[] = [];
  if (capitalPropio > 0 && deuda > 0) {
    const ratio = deuda / (capitalPropio + deuda);
    if (ratio > 0.7) {
      recomendaciones.push(
        `El ratio de deuda es alto (${(ratio * 100).toFixed(0)}%). Bancos suelen pedir ≤70% de LTV. Considera aumentar capital propio.`,
      );
    } else if (ratio > 0.5) {
      recomendaciones.push(
        `El ratio de deuda es moderado (${(ratio * 100).toFixed(0)}%). Rango aceptable para desarrollo.`,
      );
    }
  }
  if (tasa > 14) {
    recomendaciones.push(
      `La tasa de interés (${tasa.toFixed(1)}%) está por encima del rango típico. Negocia con la banca.`,
    );
  }

  return {
    escenarios: escenariosBase,
    equilibrioMeses,
    capitalPropio,
    deuda,
    pagoMensualCredito: pagoMensual,
    recomendaciones,
  };
}