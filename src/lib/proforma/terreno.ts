// Tipos y cálculos del Terreno (puro, sin server-only).

export interface TerrenoEntidad {
  tipo: string; // "cdmx" | "edomex" | "otro"
  estado?: string; // nombre cuando es "otro"
  documento?: string; // documento de zonificación cuando es "otro"
}

export interface TerrenoPredio {
  territorio?: string; // alcaldía / municipio
  cuenta_catastral?: string;
  direccion?: string;
  colonia?: string;
  superficie_terreno?: string;
  superficie_construccion?: string;
  valor_catastral?: string;
  precio_solicitado?: string;
  tipo_desarrollo?: string;
}

export interface TerrenoZonificacion {
  zona_codigo?: string;
  uso_permitido?: string;
  cos?: string;
  cus?: string;
  niveles_max?: string;
  area_libre_pct?: string;
}

export interface TerrenoData {
  entidad?: TerrenoEntidad;
  predio?: TerrenoPredio;
  zonificacion?: TerrenoZonificacion;
}

/** Parsea un string numérico (quita $, comas, %, espacios). */
export function num(s?: string): number {
  if (!s) return NaN;
  return parseFloat(String(s).replace(/[^0-9.]/g, ""));
}

export function money(n: number): string {
  if (!isFinite(n)) return "—";
  return "$" + Math.round(n).toLocaleString("es-MX");
}

export function m2(n: number): string {
  if (!isFinite(n)) return "—";
  return Math.round(n).toLocaleString("es-MX") + " m²";
}

export interface Envolvente {
  superficie: number;
  cos: number;
  cus: number;
  desplante: number; // m² de ocupación en planta baja
  construibleTotal: number; // m² máximos a construir
  nivelesAprox: number; // niveles aproximados (CUS/COS)
  areaLibre: number; // m² de área libre mínima
}

/**
 * Calcula la envolvente construible a partir de superficie, COS y CUS.
 * Fórmulas estándar en México:
 *   desplante = COS × superficie
 *   construible total = CUS × superficie
 *   niveles ≈ CUS / COS
 */
export function calcEnvolvente(z?: TerrenoZonificacion, p?: TerrenoPredio): Envolvente {
  const superficie = num(p?.superficie_terreno);
  const cos = num(z?.cos);
  const cus = num(z?.cus);
  const desplante = cos * superficie;
  const construibleTotal = cus * superficie;
  const nivelesGiven = num(z?.niveles_max);
  const nivelesAprox = isFinite(nivelesGiven) ? nivelesGiven : cus / cos;
  const areaLibrePct = num(z?.area_libre_pct);
  const areaLibre = isFinite(areaLibrePct)
    ? (areaLibrePct / 100) * superficie
    : superficie - desplante;

  return {
    superficie,
    cos,
    cus,
    desplante,
    construibleTotal,
    nivelesAprox,
    areaLibre,
  };
}
