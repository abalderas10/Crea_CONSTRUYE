// Tipos y cálculos de Riesgos + GO/NO-GO (puro, sin server-only).
// Sintetiza las 7 herramientas anteriores y emite el veredicto final.

// tipos y cálculos de Riesgos — sin dependencia de terreno.ts

export type NivelRiesgo = "alto" | "medio" | "bajo";
export type CategoriaRiesgo =
  | "terreno"
  | "normativo"
  | "mercado"
  | "financiero"
  | "ejecucion"
  | "reputacion";

export interface Riesgo {
  nivel: NivelRiesgo;
  categoria: CategoriaRiesgo;
  titulo: string;          // ej. "Derecho de vía reduce área útil"
  descripcion: string;
  mitigacion?: string;
}

export interface RiesgosData {
  // El usuario puede agregar notas / riesgos manuales
  notas_adicionales?: string;
  riesgos_manuales?: Riesgo[];

  // Contexto del usuario (opcional)
  experiencia_previa?: "nula" | "1_proyecto" | "2-5_proyectos" | "5+_proyectos";
  tiene_socio_inversionista?: boolean;
}

export interface MatrizRiesgos {
  riesgos: Riesgo[];
  countAlto: number;
  countMedio: number;
  countBajo: number;
  varEstimado: number;        // pérdida máxima esperada como % de la inversión
  veredicto: "GO" | "GO_CON_CONDICIONES" | "NO_GO" | "PENDIENTE";
  confianza: number;
  resumen: string;
  mitigaciones: string[];
}

/**
 * Sintetiza los outputs de las 7 herramientas y produce la matriz de riesgos.
 *
 * Esta función es PURA — recibe los datos de las otras herramientas
 * como parámetros y devuelve la matriz. La lógica pesada del análisis
 * (Claude) vive en lib/ai/riesgos.ts; aquí solo consolidamos.
 */
export function consolidarRiesgos(
  toolsData: Partial<{
    terreno: { data: unknown; ai_analysis: unknown };
    zonificacion: { data: unknown; ai_analysis: unknown };
    costos: { data: unknown; ai_analysis: unknown };
    mercado: { data: unknown; ai_analysis: unknown };
    financiero: { data: unknown; ai_analysis: unknown };
  }>,
  userData?: RiesgosData,
): MatrizRiesgos {
  const riesgos: Riesgo[] = [];

  // ── Terreno ────────────────────────────────────────
  const terreno = toolsData.terreno?.ai_analysis as
    | { recomendacion?: string; riesgos?: string[]; precio_objetivo_m2?: string }
    | undefined;
  if (terreno?.recomendacion === "NO_COMPRAR") {
    riesgos.push({
      nivel: "alto",
      categoria: "terreno",
      titulo: "Veredicto Terreno: NO_COMPRAR",
      descripcion: "Claude recomienda no comprar este terreno.",
    });
  }
  if (terreno?.riesgos?.length) {
    for (const r of terreno.riesgos) {
      riesgos.push({
        nivel: "medio",
        categoria: "terreno",
        titulo: r.slice(0, 80),
        descripcion: r,
      });
    }
  }

  // ── Zonificación ────────────────────────────────────────
  const zonif = toolsData.zonificacion?.ai_analysis as
    | { veredicto?: string; riesgos_adicionales?: string[]; puntos_ajuste?: string[] }
    | undefined;
  if (zonif?.veredicto === "NO_PROCEDE") {
    riesgos.push({
      nivel: "alto",
      categoria: "normativo",
      titulo: "Veredicto Zonificación: NO_PROCEDE",
      descripcion: "La normatividad no permite el proyecto tal como está.",
    });
  }
  if (zonif?.veredicto === "AJUSTAR") {
    riesgos.push({
      nivel: "medio",
      categoria: "normativo",
      titulo: "Zonificación requiere ajustes",
      descripcion: "El proyecto cabe con ajustes normativos.",
    });
  }
  if (zonif?.riesgos_adicionales?.length) {
    for (const r of zonif.riesgos_adicionales) {
      riesgos.push({
        nivel: "medio",
        categoria: "normativo",
        titulo: r.slice(0, 80),
        descripcion: r,
      });
    }
  }

  // ── Costos ────────────────────────────────────────
  const costos = toolsData.costos?.ai_analysis as
    | { veredicto?: string; recomendaciones?: string[] }
    | undefined;
  if (costos?.veredicto === "FUERA_DE_PRESUPUESTO") {
    riesgos.push({
      nivel: "alto",
      categoria: "financiero",
      titulo: "Veredicto Costos: FUERA_DE_PRESUPUESTO",
      descripcion: "El presupuesto está fuera de rangos razonables.",
    });
  }
  if (costos?.veredicto === "AJUSTAR_PARTIDAS") {
    riesgos.push({
      nivel: "medio",
      categoria: "financiero",
      titulo: "Costos requieren ajustes",
      descripcion: "Hay partidas críticas que pueden sobrecostar.",
    });
  }

  // ── Mercado ────────────────────────────────────────
  const mercado = toolsData.mercado?.ai_analysis as
    | { veredicto?: string; alertas?: string[] }
    | undefined;
  if (mercado?.veredicto === "DEMANDA_DEBIL") {
    riesgos.push({
      nivel: "alto",
      categoria: "mercado",
      titulo: "Veredicto Mercado: DEMANDA_DEBIL",
      descripcion: "La demanda esperada es insuficiente para absorber el inventario.",
    });
  }
  if (mercado?.veredicto === "DEMANDA_MODERADA") {
    riesgos.push({
      nivel: "medio",
      categoria: "mercado",
      titulo: "Mercado moderado",
      descripcion: "Absorción en rango aceptable pero con sensibilidad a precio.",
    });
  }
  if (mercado?.alertas?.length) {
    for (const a of mercado.alertas) {
      riesgos.push({
        nivel: "medio",
        categoria: "mercado",
        titulo: a.slice(0, 80),
        descripcion: a,
      });
    }
  }

  // ── Financiero ────────────────────────────────────────
  const financiero = toolsData.financiero?.ai_analysis as
    | { veredicto?: string; alertas?: string[]; recomendaciones?: string[] }
    | undefined;
  if (financiero?.veredicto === "NO_VIABLE") {
    riesgos.push({
      nivel: "alto",
      categoria: "financiero",
      titulo: "Veredicto Financiero: NO_VIABLE",
      descripcion: "La estructura financiera no soporta el proyecto.",
    });
  }
  if (financiero?.veredicto === "VIABLE_CON_CONDICIONES") {
    riesgos.push({
      nivel: "medio",
      categoria: "financiero",
      titulo: "Financiamiento viable con condiciones",
      descripcion: "Requiere ajustes en capital, deuda o tasas.",
    });
  }
  if (financiero?.alertas?.length) {
    for (const a of financiero.alertas) {
      riesgos.push({
        nivel: "medio",
        categoria: "financiero",
        titulo: a.slice(0, 80),
        descripcion: a,
      });
    }
  }

  // ── Riesgos manuales del usuario ────────────────────────
  if (userData?.riesgos_manuales?.length) {
    riesgos.push(...userData.riesgos_manuales);
  }

  // ── VaR heurístico ─────────────────────────────────
  // Suma de impactos potenciales como % de la inversión.
  // Cada riesgo alto = 8%, medio = 4%, bajo = 1%.
  const varEstimado =
    riesgos.filter((r) => r.nivel === "alto").length * 0.08 +
    riesgos.filter((r) => r.nivel === "medio").length * 0.04 +
    riesgos.filter((r) => r.nivel === "bajo").length * 0.01;

  // ── Veredicto ─────────────────────────────────────
  const countAlto = riesgos.filter((r) => r.nivel === "alto").length;
  const countMedio = riesgos.filter((r) => r.nivel === "medio").length;
  const countBajo = riesgos.filter((r) => r.nivel === "bajo").length;

  let veredicto: MatrizRiesgos["veredicto"];
  let confianza: number;
  let resumen: string;

  if (countAlto >= 2) {
    veredicto = "NO_GO";
    confianza = 90;
    resumen = `El proyecto tiene ${countAlto} riesgos altos detectados. Sin resolverlos, NO es viable.`;
  } else if (countAlto === 1) {
    veredicto = "GO_CON_CONDICIONES";
    confianza = 75;
    resumen = `Hay 1 riesgo alto que debe resolverse antes de proceder. Los demás riesgos son gestionables.`;
  } else if (countMedio >= 4) {
    veredicto = "GO_CON_CONDICIONES";
    confianza = 70;
    resumen = `Sin riesgos altos, pero ${countMedio} riesgos medios requieren atención durante la ejecución.`;
  } else {
    veredicto = "GO";
    confianza = 85;
    resumen = `Proyecto viable. Riesgos identificados son gestionables dentro del plan de mitigación estándar.`;
  }

  // Si no tenemos análisis de las herramientas críticas, el veredicto es pendiente
  const toolsAnalyzed = [toolsData.terreno, toolsData.zonificacion, toolsData.costos, toolsData.mercado, toolsData.financiero].filter(
    (t) => t?.ai_analysis,
  ).length;
  if (toolsAnalyzed < 3) {
    veredicto = "PENDIENTE";
    confianza = 0;
    resumen = `Faltan análisis por generar (${toolsAnalyzed}/5 herramientas críticas). Completa Terreno, Zonificación, Costos, Mercado y Financiero para obtener el veredicto.`;
  }

  const mitigaciones = [
    ...(costos?.recomendaciones ?? []),
    ...(financiero?.recomendaciones ?? []),
  ];

  return {
    riesgos,
    countAlto,
    countMedio,
    countBajo,
    varEstimado,
    veredicto,
    confianza,
    resumen,
    mitigaciones,
  };
}