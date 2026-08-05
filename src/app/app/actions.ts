"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type ToolStatus = Database["public"]["Enums"]["tool_status"];
const TOOL_IDS = [
  "terreno",
  "zonificacion",
  "mercado",
  "costos",
  "financiero",
  "roi",
  "cronograma",
  "riesgos",
] as const;

export type ProjectFormState = { error: string } | null;

/** Crea un proyecto del usuario actual y redirige a su dashboard. */
export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const municipio = String(formData.get("municipio") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();

  if (!name) return { error: "El nombre del proyecto es obligatorio." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name,
      municipio: municipio || null,
      tipo: tipo || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "No se pudo crear el proyecto. Intenta de nuevo." };
  }

  revalidatePath("/app");
  redirect(`/app/${data.id}`);
}

/** Guarda los datos de Localización (Terreno) en project_tool_data.data. */
export async function saveTerrenoData(
  projectId: string,
  formData: FormData,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    entidad: {
      tipo: s("entidad_tipo") || "cdmx",
      estado: s("entidad_estado") || undefined,
      documento: s("entidad_documento") || undefined,
    },
    predio: {
      territorio: s("territorio"),
      cuenta_catastral: s("cuenta_catastral"),
      direccion: s("direccion"),
      colonia: s("colonia"),
      superficie_terreno: s("superficie_terreno"),
      superficie_construccion: s("superficie_construccion"),
      valor_catastral: s("valor_catastral"),
      precio_solicitado: s("precio_solicitado"),
      tipo_desarrollo: s("tipo_desarrollo"),
    },
    zonificacion: {
      zona_codigo: s("zona_codigo"),
      uso_permitido: s("uso_permitido"),
      cos: s("cos"),
      cus: s("cus"),
      niveles_max: s("niveles_max"),
      area_libre_pct: s("area_libre_pct"),
    },
  };

  const { error } = await supabase.from("project_tool_data").upsert(
    {
      project_id: projectId,
      tool_id: "terreno",
      status: "in_progress",
      data,
    },
    { onConflict: "project_id,tool_id" },
  );

  if (error) return { error: "No se pudo guardar." };
  revalidatePath(`/app/${projectId}/terreno`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Genera el análisis de Claude para Terreno y lo persiste. */
export async function generateTerrenoAnalysis(
  projectId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const [{ data: tool }, { data: project }] = await Promise.all([
    supabase
      .from("project_tool_data")
      .select("data")
      .eq("project_id", projectId)
      .eq("tool_id", "terreno")
      .maybeSingle(),
    supabase
      .from("projects")
      .select("name, municipio, tipo, context_summary")
      .eq("id", projectId)
      .maybeSingle(),
  ]);

  const data = tool?.data as import("@/lib/proforma/terreno").TerrenoData | null;
  if (!data?.predio?.direccion) {
    return { error: "Primero guarda los datos del terreno." };
  }

  const context = project
    ? `Proyecto "${project.name}" en ${project.municipio ?? "México"}. Tipo: ${project.tipo ?? "no especificado"}. ${project.context_summary ?? ""}`
    : "Sin contexto adicional.";

  try {
    const { analyzeTerreno } = await import("@/lib/ai/terreno");
    const analysis = await analyzeTerreno(data, context);

    const { error } = await supabase.from("project_tool_data").upsert(
      {
        project_id: projectId,
        tool_id: "terreno",
        status: "done",
        ai_analysis: { ...analysis, generated_at: new Date().toISOString() },
      },
      { onConflict: "project_id,tool_id" },
    );
    if (error) return { error: "No se pudo guardar el análisis." };
  } catch {
    return { error: "El análisis de Claude falló. Intenta de nuevo." };
  }

  revalidatePath(`/app/${projectId}/terreno`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Actualiza el estado de una herramienta (upsert por project+tool). */
export async function setToolStatus(
  projectId: string,
  toolId: string,
  status: ToolStatus,
): Promise<void> {
  if (!TOOL_IDS.includes(toolId as (typeof TOOL_IDS)[number])) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("project_tool_data")
    .upsert(
      { project_id: projectId, tool_id: toolId, status },
      { onConflict: "project_id,tool_id" },
    );

  revalidatePath(`/app/${projectId}`);
  revalidatePath(`/app/${projectId}/${toolId}`);
}

/** Guarda los datos de Zonificación en project_tool_data.data. */
export async function saveZonificacionData(
  projectId: string,
  formData: FormData,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const s = (k: string) => String(formData.get(k) ?? "").trim();
  const b = (k: string) => formData.get(k) === "on";

  const data = {
    tipo_proyecto: s("tipo_proyecto") || "habitacional",
    propuesta_unidades: s("propuesta_unidades") || undefined,
    propuesta_m2_construir: s("propuesta_m2_construir") || undefined,
    norma: {
      zona_codigo: s("zona_codigo") || undefined,
      uso_permitido: s("uso_permitido") || undefined,
      cos: s("cos") || undefined,
      cus: s("cus") || undefined,
      niveles_max: s("niveles_max") || undefined,
      area_libre_pct: s("area_libre_pct") || undefined,
      densidad_viv_ha: s("densidad_viv_ha") || undefined,
      altura_max_m: s("altura_max_m") || undefined,
    },
    restricciones: {
      afectacion: s("afectacion") || undefined,
      zona_riesgo: s("zona_riesgo") || undefined,
      zona_patrimonio: b("zona_patrimonio"),
      restricciones_ambientales: s("restricciones_ambientales") || undefined,
    },
    servicios: {
      agua: b("agua"),
      drenaje: b("drenaje"),
      electricidad: b("electricidad"),
      gas: b("gas"),
      vialidad_pavimentada: b("vialidad_pavimentada"),
      transporte_publico: b("transporte_publico"),
    },
  };

  const { error } = await supabase.from("project_tool_data").upsert(
    {
      project_id: projectId,
      tool_id: "zonificacion",
      status: "in_progress",
      data,
    },
    { onConflict: "project_id,tool_id" },
  );

  if (error) return { error: "No se pudo guardar." };
  revalidatePath(`/app/${projectId}/zonificacion`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Genera el análisis de Claude para Zonificación y lo persiste. */
export async function generateZonificacionAnalysis(
  projectId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const [{ data: toolZ }, { data: toolT }, { data: project }] = await Promise.all([
    supabase
      .from("project_tool_data")
      .select("data")
      .eq("project_id", projectId)
      .eq("tool_id", "zonificacion")
      .maybeSingle(),
    supabase
      .from("project_tool_data")
      .select("data")
      .eq("project_id", projectId)
      .eq("tool_id", "terreno")
      .maybeSingle(),
    supabase
      .from("projects")
      .select("name, municipio, tipo, context_summary")
      .eq("id", projectId)
      .maybeSingle(),
  ]);

  const z = toolZ?.data as
    | import("@/lib/proforma/zonificacion").ZonificacionData
    | null;
  if (!z?.norma?.zona_codigo) {
    return { error: "Primero guarda la normatividad de la zona." };
  }

  // Heredar contexto del terreno para que Claude tenga el panorama.
  const t = toolT?.data as
    | import("@/lib/proforma/terreno").TerrenoData
    | null;
  z.terreno_ref = {
    direccion: t?.predio?.direccion,
    municipio: t?.predio?.territorio,
    cuenta_catastral: t?.predio?.cuenta_catastral,
    superficie_terreno: t?.predio?.superficie_terreno,
  };

  const context = project
    ? `Proyecto "${project.name}" en ${project.municipio ?? "México"}. Tipo: ${project.tipo ?? "no especificado"}. ${project.context_summary ?? ""}`
    : "Sin contexto adicional.";

  try {
    const { analyzeZonificacion } = await import("@/lib/ai/zonificacion");
    const analysis = await analyzeZonificacion(z, context);

    const { error } = await supabase.from("project_tool_data").upsert(
      {
        project_id: projectId,
        tool_id: "zonificacion",
        status: "done",
        ai_analysis: { ...analysis, generated_at: new Date().toISOString() },
      },
      { onConflict: "project_id,tool_id" },
    );
if (error) return { error: "No se pudo guardar el análisis." };
  } catch {
    return { error: "El análisis de Claude falló. Intenta de nuevo." };
  }

  revalidatePath(`/app/${projectId}/mercado`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Guarda los datos de Financiero en project_tool_data.data. */
export async function saveFinancieroData(
  projectId: string,
  formData: FormData,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    inversion_total: s("inversion_total") || undefined,
    capital_propio: s("capital_propio") || undefined,
    deuda: s("deuda") || undefined,
    tasa_interes_anual: s("tasa_interes_anual") || undefined,
    plazo_credito_meses: s("plazo_credito_meses") || undefined,
    comision_apertura_pct: s("comision_apertura_pct") || undefined,
    ingreso_bruto_total: s("ingreso_bruto_total") || undefined,
    unidades_totales: s("unidades_totales") || undefined,
    m2_construir_total: s("m2_construir_total") || undefined,
    precio_m2_promedio: s("precio_m2_promedio") || undefined,
    costo_marketing_pct_ingreso: s("costo_marketing_pct_ingreso") || undefined,
    costo_comercializacion_pct_ingreso: s("costo_comercializacion_pct_ingreso") || undefined,
    costo_operacion_mensual: s("costo_operacion_mensual") || undefined,
  };

  const { error } = await supabase.from("project_tool_data").upsert(
    {
      project_id: projectId,
      tool_id: "financiero",
      status: "in_progress",
      data,
    },
    { onConflict: "project_id,tool_id" },
  );

  if (error) return { error: "No se pudo guardar." };
  revalidatePath(`/app/${projectId}/financiero`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Genera el análisis de Claude para Financiero y lo persiste. */
export async function generateFinancieroAnalysis(
  projectId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const [{ data: toolF }, { data: project }] = await Promise.all([
    supabase
      .from("project_tool_data")
      .select("data")
      .eq("project_id", projectId)
      .eq("tool_id", "financiero")
      .maybeSingle(),
    supabase
      .from("projects")
      .select("name, municipio, tipo, context_summary")
      .eq("id", projectId)
      .maybeSingle(),
  ]);

  const f = toolF?.data as
    | import("@/lib/proforma/financiero").FinancieroData
    | null;
  if (!f?.inversion_total || !f?.capital_propio) {
    return { error: "Completa inversión y capital propio antes de analizar." };
  }

  const context = project
    ? `Proyecto "${project.name}" en ${project.municipio ?? "México"}. Tipo: ${project.tipo ?? "no especificado"}. ${project.context_summary ?? ""}`
    : "Sin contexto adicional.";

  try {
    const { analyzeFinanciero } = await import("@/lib/ai/financiero");
    const analysis = await analyzeFinanciero(f, context);

    const { error } = await supabase.from("project_tool_data").upsert(
      {
        project_id: projectId,
        tool_id: "financiero",
        status: "done",
        ai_analysis: { ...analysis, generated_at: new Date().toISOString() },
      },
      { onConflict: "project_id,tool_id" },
    );
    if (error) return { error: "No se pudo guardar el análisis." };
  } catch {
    return { error: "El análisis de Claude falló. Intenta de nuevo." };
  }

  revalidatePath(`/app/${projectId}/financiero`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Guarda los datos de Costos en project_tool_data.data. */
export async function saveCostosData(
  projectId: string,
  formData: FormData,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    m2_construir: s("m2_construir") || undefined,
    niveles: s("niveles") || undefined,
    sotanos: s("sotanos") || undefined,
    tipo_estructura: s("tipo_estructura") || "concreto",
    calidad_acabados: s("calidad_acabados") || "media",
    unidades: s("unidades") || undefined,
    cajones_estacionamiento: s("cajones_estacionamiento") || undefined,
    region_factor: s("region_factor") || "1.0",
    costo_terreno: s("costo_terreno") || undefined,
    costo_permisos_tramites: s("costo_permisos_tramites") || undefined,
    costo_proyecto_arquitectonico: s("costo_proyecto_arquitectonico") || undefined,
  };

  const { error } = await supabase.from("project_tool_data").upsert(
    {
      project_id: projectId,
      tool_id: "costos",
      status: "in_progress",
      data,
    },
    { onConflict: "project_id,tool_id" },
  );

  if (error) return { error: "No se pudo guardar." };
  revalidatePath(`/app/${projectId}/costos`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Genera el análisis de Claude para Costos y lo persiste. */
export async function generateCostosAnalysis(
  projectId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const [{ data: toolC }, { data: toolT }, { data: project }] = await Promise.all([
    supabase
      .from("project_tool_data")
      .select("data")
      .eq("project_id", projectId)
      .eq("tool_id", "costos")
      .maybeSingle(),
    supabase
      .from("project_tool_data")
      .select("data")
      .eq("project_id", projectId)
      .eq("tool_id", "terreno")
      .maybeSingle(),
    supabase
      .from("projects")
      .select("name, municipio, tipo, context_summary")
      .eq("id", projectId)
      .maybeSingle(),
  ]);

  const c = toolC?.data as
    | import("@/lib/proforma/costes").CostosData
    | null;
  if (!c?.m2_construir || !c?.tipo_estructura) {
    return { error: "Primero guarda los datos de construcción." };
  }

  // Heredar costo_terreno de Terreno si falta
  const t = toolT?.data as
    | { predio?: { precio_solicitado?: string } }
    | undefined;
  if (!c.costo_terreno && t?.predio?.precio_solicitado) {
    c.costo_terreno = t.predio.precio_solicitado;
  }

  const context = project
    ? `Proyecto "${project.name}" en ${project.municipio ?? "México"}. Tipo: ${project.tipo ?? "no especificado"}. ${project.context_summary ?? ""}`
    : "Sin contexto adicional.";

  try {
    const { analyzeCostos } = await import("@/lib/ai/costes");
    const analysis = await analyzeCostos(c, context);

    const { error } = await supabase.from("project_tool_data").upsert(
      {
        project_id: projectId,
        tool_id: "costos",
        status: "done",
        ai_analysis: { ...analysis, generated_at: new Date().toISOString() },
      },
      { onConflict: "project_id,tool_id" },
    );
    if (error) return { error: "No se pudo guardar el análisis." };
  } catch {
    return { error: "El análisis de Claude falló. Intenta de nuevo." };
  }

  revalidatePath(`/app/${projectId}/costos`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Guarda los datos de Mercado en project_tool_data.data. */
export async function saveMercadoData(
  projectId: string,
  formData: FormData,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    municipio: s("municipio") || undefined,
    zona: s("zona") || undefined,
    tipo_proyecto: s("tipo_proyecto") || "habitacional",
    m2_construir_total: s("m2_construir_total") || undefined,
    unidades_totales: s("unidades_totales") || undefined,
    m2_promedio_unidad: s("m2_promedio_unidad") || undefined,
    radio_busqueda_km: s("radio_busqueda_km") || undefined,
    amenidades: s("amenidades") || undefined,
    precio_m2_esperado: s("precio_m2_esperado") || undefined,
    precio_m2_esperado_alto: s("precio_m2_esperado_alto") || undefined,
    publico_objetivo: s("publico_objetivo") || undefined,
    nivel_socioeconomico: s("nivel_socioeconomico") || "C+",
  };

  const { error } = await supabase.from("project_tool_data").upsert(
    {
      project_id: projectId,
      tool_id: "mercado",
      status: "in_progress",
      data,
    },
    { onConflict: "project_id,tool_id" },
  );

  if (error) return { error: "No se pudo guardar." };
  revalidatePath(`/app/${projectId}/mercado`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Genera el análisis de Claude para Mercado y lo persiste. */
export async function generateMercadoAnalysis(
  projectId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const [{ data: toolM }, { data: project }] = await Promise.all([
    supabase
      .from("project_tool_data")
      .select("data")
      .eq("project_id", projectId)
      .eq("tool_id", "mercado")
      .maybeSingle(),
    supabase
      .from("projects")
      .select("name, municipio, tipo, context_summary")
      .eq("id", projectId)
      .maybeSingle(),
  ]);

  const m = toolM?.data as
    | import("@/lib/proforma/mercado").MercadoData
    | null;
  if (!m?.tipo_proyecto || !m?.unidades_totales || !m?.precio_m2_esperado) {
    return {
      error: "Completa tipo, unidades y precio/m² esperado antes de analizar.",
    };
  }

  const context = project
    ? `Proyecto "${project.name}" en ${project.municipio ?? "México"}. Tipo: ${project.tipo ?? "no especificado"}. ${project.context_summary ?? ""}`
    : "Sin contexto adicional.";

  try {
    const { analyzeMercado } = await import("@/lib/ai/mercado");
    const analysis = await analyzeMercado(m, context);

    const { error } = await supabase.from("project_tool_data").upsert(
      {
        project_id: projectId,
        tool_id: "mercado",
        status: "done",
        ai_analysis: { ...analysis, generated_at: new Date().toISOString() },
      },
      { onConflict: "project_id,tool_id" },
    );
    if (error) return { error: "No se pudo guardar el análisis." };
  } catch {
    return { error: "El análisis de Claude falló. Intenta de nuevo." };
  }

  revalidatePath(`/app/${projectId}/mercado`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/** Guarda los datos de Riesgos (contexto del usuario) en project_tool_data.data. */
export async function saveRiesgosData(
  projectId: string,
  formData: FormData,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi�n expirada." };

  const s = (k: string) => String(formData.get(k) ?? "").trim();
  const b = (k: string) => formData.get(k) === "on";

  const data = {
    notas_adicionales: s("notas_adicionales") || undefined,
    experiencia_previa: s("experiencia_previa") || undefined,
    tiene_socio_inversionista: b("tiene_socio_inversionista"),
  };

  const { error } = await supabase.from("project_tool_data").upsert(
    {
      project_id: projectId,
      tool_id: "riesgos",
      status: "in_progress",
      data,
    },
    { onConflict: "project_id,tool_id" },
  );

  if (error) return { error: "No se pudo guardar." };
  revalidatePath(`/app/${projectId}/riesgos`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}

/**
 * Genera el veredicto GO/NO-GO consolidado de las 5 herramientas cr�ticas
 * (Terreno + Zonificaci�n + Costos + Mercado + Financiero) y lo persiste.
 */
export async function generateRiesgosAnalysis(
  projectId: string,
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi�n expirada." };

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const toolIds = ["terreno", "zonificacion", "costos", "mercado", "financiero"] as const;
  const { data: rows, error: rowsError } = await supabase
    .from("project_tool_data")
    .select("tool_id, data, ai_analysis")
    .eq("project_id", projectId)
    .in("tool_id", [...toolIds]);

  if (rowsError) return { error: "No se pudieron cargar las herramientas." };

  const toolsData: Record<string, { data: unknown; ai_analysis: unknown }> = {};
  for (const row of rows ?? []) {
    const id = row.tool_id as string;
    if ((toolIds as readonly string[]).includes(id)) {
      toolsData[id] = { data: row.data, ai_analysis: row.ai_analysis };
    }
  }

  const { data: riesgosRow } = await supabase
    .from("project_tool_data")
    .select("data")
    .eq("project_id", projectId)
    .eq("tool_id", "riesgos")
    .maybeSingle();

  const userData = riesgosRow?.data as
    | import("@/lib/proforma/riesgos").RiesgosData
    | undefined;

  const { data: project } = await supabase
    .from("projects")
    .select("name, municipio, tipo, context_summary")
    .eq("id", projectId)
    .maybeSingle();

const context = project
    ? `Proyecto "${project.name}" en ${project.municipio ?? "México"}. Tipo: ${project.tipo ?? "no especificado"}. ${project.context_summary ?? ""}`
    : "Sin contexto adicional.";

  const { consolidarRiesgos } = await import("@/lib/proforma/riesgos");
  const precomputed = consolidarRiesgos(toolsData, userData);

  try {
    const { analyzeRiesgos } = await import("@/lib/ai/riesgos");
    const analysis = await analyzeRiesgos(toolsData, userData, context, precomputed);

    const { error } = await supabase.from("project_tool_data").upsert(
      {
        project_id: projectId,
        tool_id: "riesgos",
        status: "done",
        ai_analysis: { ...analysis, generated_at: new Date().toISOString() } as unknown as import("@/lib/supabase/database.types").Json,
      },
      { onConflict: "project_id,tool_id" },
    );
    if (error) return { error: "No se pudo guardar el an�lisis." };
  } catch {
    return { error: "El an�lisis de Claude fall�. Intenta de nuevo." };
  }

  revalidatePath(`/app/${projectId}/riesgos`);
  revalidatePath(`/app/${projectId}`);
  return { ok: true };
}
