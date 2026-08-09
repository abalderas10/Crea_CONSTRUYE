// Tipos y constantes del módulo de Documentación.
// Documentos subidos por el usuario (planos, certificados, boletas, contratos,
// fotos) que Claude analiza para extraer datos estructurados y pre-llenar
// los formularios de las herramientas.

/** Tipos de documento soportados. Coinciden con el `document_type` de la BD. */
export type DocumentType =
  | "plano_topografico"
  | "certificado_uso_suelo"
  | "boleta_predial"
  | "contrato"
  | "avaluo"
  | "licencia_obra"
  | "fotos"
  | "otro";

/** Estados del pipeline de extracción de un documento. */
export type ExtractionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

/** Tool al que se asocia el documento. "general" = no ligado a una tool. */
export type DocumentTool =
  | "terreno"
  | "zonificacion"
  | "mercado"
  | "costos"
  | "financiero"
  | "roi"
  | "cronograma"
  | "riesgos"
  | "general"
  | string;

/** Fila de `project_documents` (coincide con la migración 0009). */
export interface ProjectDocument {
  id: string;
  project_id: string;
  tool: DocumentTool;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  extracted_data: Record<string, unknown> | null;
  extraction_status: ExtractionStatus;
  extraction_error: string | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

/** Filtros opcionales para listar documentos. */
export interface DocumentListFilter {
  tool?: DocumentTool;
  document_type?: DocumentType;
  extraction_status?: ExtractionStatus;
  limit?: number;
}

// ── Datos extraídos por tipo de documento ─────────────────────────
// Lo que Claude devuelve en `extracted_data` (jsonb) según el tipo.

/** Plano topográfico: superficies, rumbos, linderos, coordenadas. */
export interface ExtractedTerrenoData {
  superficie_terreno_m2?: number;
  superficie_construccion_m2?: number;
  direccion?: string;
  colonia?: string;
  municipio?: string;
  estado?: string;
  cuenta_catastral?: string;
  valor_catastral?: string;
  rumbos?: Array<{
    lado: number;
    rumbo: string;
    distancia_m: number;
  }>;
  referencias?: string[];
  coordenadas_utm?: {
    x: number;
    y: number;
    zona: string;
  };
  propietario_nombre?: string;
  fecha_levantamiento?: string;
  perito_nombre?: string;
  perito_cedula?: string;
  notas?: string;
}

/** Certificado / Dictamen de uso de suelo. */
export interface ExtractedUsoSueloData {
  clave_zona?: string;
  uso_permitido?: string;
  cos?: number;
  cus?: number;
  niveles_max?: number;
  area_libre_pct?: number;
  densidad_viv_ha?: number;
  altura_max_m?: number;
  vigencia?: string;
  autoridad_emisora?: string;
  folio?: string;
  fecha_emision?: string;
  restricciones?: string[];
  notas?: string;
}

/** Boleta predial. */
export interface ExtractedBoletaPredialData {
  cuenta_catastral?: string;
  valor_catastral?: string;
  superficie_terreno_m2?: number;
  superficie_construccion_m2?: number;
  domicilio?: string;
  propietario?: string;
  periodo?: string;
  notas?: string;
}

/** Contrato (compraventa, promesa, etc.). */
export interface ExtractedContratoData {
  tipo_contrato?: string;
  partes?: Array<{ rol: string; nombre: string }>;
  monto?: string;
  moneda?: string;
  fecha_firma?: string;
  vigencia?: string;
  condiciones_clave?: string[];
  notas?: string;
}

/** Avalúo. */
export interface ExtractedAvaluoData {
  valor_comercial?: string;
  valor_mercado?: string;
  fecha_avaluo?: string;
  perito_nombre?: string;
  perito_cedula?: string;
  superficie_terreno_m2?: number;
  superficie_construccion_m2?: number;
  ubicacion?: string;
  metodo_valuacion?: string;
  notas?: string;
}

/** Licencia de obra. */
export interface ExtractedLicenciaObraData {
  numero_licencia?: string;
  fecha_emision?: string;
  vigencia?: string;
  superficie_autorizada_m2?: number;
  niveles_autorizados?: number;
  usos_autorizados?: string[];
  autoridad_emisora?: string;
  notas?: string;
}

/** Foto del proyecto. No se extraen datos, solo se guarda. */
export interface ExtractedFotoData {
  descripcion?: string | null;
  fecha_toma?: string | null;
}

/** Tipo de documento → datos extraídos (discriminated union). */
export type ExtractionByType =
  | { type: "plano_topografico"; data: ExtractedTerrenoData }
  | { type: "certificado_uso_suelo"; data: ExtractedUsoSueloData }
  | { type: "boleta_predial"; data: ExtractedBoletaPredialData }
  | { type: "contrato"; data: ExtractedContratoData }
  | { type: "avaluo"; data: ExtractedAvaluoData }
  | { type: "licencia_obra"; data: ExtractedLicenciaObraData }
  | { type: "fotos"; data: ExtractedFotoData }
  | { type: "otro"; data: Record<string, unknown> };

// ── Constantes ────────────────────────────────────────────────────

/** MIME types permitidos para subir. */
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/tiff",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/** Tamaño máximo de archivo: 20 MB. */
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

/** Tamaño máximo en MB para mostrar al usuario. */
export const MAX_FILE_SIZE_MB = 20;

/** Tipos de documento disponibles, con etiqueta legible e icono. */
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  plano_topografico: "Plano topográfico",
  certificado_uso_suelo: "Certificado de uso de suelo",
  boleta_predial: "Boleta predial",
  contrato: "Contrato",
  avaluo: "Avalúo",
  licencia_obra: "Licencia de obra",
  fotos: "Fotos",
  otro: "Otro",
};

/** Tool por defecto según la herramienta del proyecto. */
export const DEFAULT_DOCUMENT_TYPE_BY_TOOL: Record<DocumentTool, DocumentType> = {
  terreno: "plano_topografico",
  zonificacion: "certificado_uso_suelo",
  mercado: "otro",
  costos: "otro",
  financiero: "otro",
  roi: "otro",
  cronograma: "otro",
  riesgos: "otro",
  general: "otro",
};

/** Estados de extracción con etiqueta legible y color. */
export const EXTRACTION_STATUS_LABELS: Record<ExtractionStatus, string> = {
  pending: "En cola",
  processing: "Analizando…",
  completed: "Extraído",
  failed: "Falló",
};

// ── Validación ────────────────────────────────────────────────────

/** Mapa de extensiones esperadas por MIME (para validación cruzada). */
const EXT_BY_MIME: Record<AllowedMimeType, string[]> = {
  "application/pdf": ["pdf"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/heic": ["heic"],
  "image/heif": ["heif"],
  "image/tiff": ["tiff", "tif"],
};

export interface FileValidationOk {
  ok: true;
}
export interface FileValidationErr {
  ok: false;
  reason: string;
}
export type FileValidation = FileValidationOk | FileValidationErr;

/** Valida un archivo antes de subirlo (tamaño, MIME, extensión). */
export function validateFile(file: File): FileValidation {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      reason: `Archivo demasiado grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo ${MAX_FILE_SIZE_MB} MB.`,
    };
  }
  if (file.size === 0) {
    return { ok: false, reason: "El archivo está vacío." };
  }
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return {
      ok: false,
      reason: `Tipo de archivo no soportado (${file.type || "desconocido"}). Permitidos: PDF, JPEG, PNG, HEIC, HEIF, TIFF.`,
    };
  }
  // Cruzar MIME con extensión.
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const expectedExts = EXT_BY_MIME[file.type as AllowedMimeType] ?? [];
  if (expectedExts.length > 0 && !expectedExts.includes(ext)) {
    return {
      ok: false,
      reason: `La extensión .${ext} no coincide con el tipo ${file.type}.`,
    };
  }
  return { ok: true };
}

/** Convierte un File a base64 (sin prefijo `data:...`). */
export async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  // Conversión a base64 sin usar Buffer (que es Node-only).
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  // btoa está disponible en runtime de Next.js (edge y node 18+).
  return btoa(binary);
}

// ── Mapeo de campos extraídos → inputs de los formularios ────────

/**
 * Para un (tool, documentType) dados, devuelve el mapa `nombre_input →
 * valor_extraído` que el componente `DocumentosAdjuntos` ofrece aplicar
 * al formulario del tool. Las claves son los `name` de los inputs en los
 * componentes *Form.tsx de cada tool.
 */
export function fieldsForToolByExtraction(
  tool: DocumentTool,
  documentType: DocumentType,
  data: Record<string, unknown> | null,
): Record<string, string> {
  if (!data) return {};
  const out: Record<string, string> = {};

  // Helpers
  const s = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim() ? v.trim() : undefined;
  const n = (v: unknown): string | undefined => {
    if (typeof v === "number" && isFinite(v)) return String(v);
    if (typeof v === "string" && v.trim() && isFinite(parseFloat(v))) {
      return parseFloat(v).toString();
    }
    return undefined;
  };

  // Terreno
  if (tool === "terreno") {
    if (documentType === "plano_topografico") {
      const d = data as Partial<ExtractedTerrenoData>;
      if (n(d.superficie_terreno_m2)) out["superficie_terreno"] = n(d.superficie_terreno_m2)!;
      if (n(d.superficie_construccion_m2)) out["superficie_construccion"] = n(d.superficie_construccion_m2)!;
      if (s(d.direccion)) out["direccion"] = s(d.direccion)!;
      if (s(d.colonia)) out["colonia"] = s(d.colonia)!;
      if (s(d.municipio)) out["territorio"] = s(d.municipio)!;
      if (s(d.estado)) out["entidad_estado"] = s(d.estado)!;
      if (s(d.cuenta_catastral)) out["cuenta_catastral"] = s(d.cuenta_catastral)!;
      if (s(d.valor_catastral)) out["valor_catastral"] = s(d.valor_catastral)!;
    }
    if (documentType === "boleta_predial") {
      const d = data as Partial<ExtractedBoletaPredialData>;
      if (s(d.cuenta_catastral)) out["cuenta_catastral"] = s(d.cuenta_catastral)!;
      if (s(d.valor_catastral)) out["valor_catastral"] = s(d.valor_catastral)!;
      if (n(d.superficie_terreno_m2)) out["superficie_terreno"] = n(d.superficie_terreno_m2)!;
      if (n(d.superficie_construccion_m2)) out["superficie_construccion"] = n(d.superficie_construccion_m2)!;
      if (s(d.domicilio)) out["direccion"] = s(d.domicilio)!;
    }
  }

  // Zonificación
  if (tool === "zonificacion") {
    if (documentType === "certificado_uso_suelo") {
      const d = data as Partial<ExtractedUsoSueloData>;
      if (s(d.clave_zona)) out["zona_codigo"] = s(d.clave_zona)!;
      if (s(d.uso_permitido)) out["uso_permitido"] = s(d.uso_permitido)!;
      if (n(d.cos)) out["cos"] = n(d.cos)!;
      if (n(d.cus)) out["cus"] = n(d.cus)!;
      if (n(d.niveles_max)) out["niveles_max"] = n(d.niveles_max)!;
      if (n(d.area_libre_pct)) out["area_libre_pct"] = n(d.area_libre_pct)!;
      if (n(d.densidad_viv_ha)) out["densidad_viv_ha"] = n(d.densidad_viv_ha)!;
      if (n(d.altura_max_m)) out["altura_max_m"] = n(d.altura_max_m)!;
    }
    if (documentType === "plano_topografico") {
      const d = data as Partial<ExtractedTerrenoData>;
      if (s(d.municipio)) out["zona_codigo"] = s(d.municipio)!; // heurística: municipio como hint
    }
  }

  // Terreno también acepta certificados para completar la zonificación.
  if (tool === "terreno" && documentType === "certificado_uso_suelo") {
    const d = data as Partial<ExtractedUsoSueloData>;
    if (s(d.clave_zona)) out["zona_codigo"] = s(d.clave_zona)!;
    if (s(d.uso_permitido)) out["uso_permitido"] = s(d.uso_permitido)!;
    if (n(d.cos)) out["cos"] = n(d.cos)!;
    if (n(d.cus)) out["cus"] = n(d.cus)!;
    if (n(d.niveles_max)) out["niveles_max"] = n(d.niveles_max)!;
    if (n(d.area_libre_pct)) out["area_libre_pct"] = n(d.area_libre_pct)!;
  }

  // ── Mercado ─────────────────────────────────────────────────────
  if (tool === "mercado") {
    if (documentType === "contrato") {
      const d = data as Partial<ExtractedContratoData>;
      if (d.condiciones_clave && d.condiciones_clave.length > 0) {
        const txt = d.condiciones_clave.join(" ");
        const m = txt.match(/(\d+)\s*(unidades|deptos|locales|naves|viviendas)/i);
        if (m) out["unidades_totales"] = m[1];
      }
      if (n(d.monto)) out["precio_m2_esperado"] = n(d.monto)!; // heurística base
    }
    if (documentType === "otro") {
      const d = data as Record<string, unknown>;
      const precioM2 = d.precio_m2_bajo ?? d.precio_m2;
      if (n(precioM2)) out["precio_m2_esperado"] = n(precioM2)!;
      if (n(d.precio_m2_alto)) out["precio_m2_esperado_alto"] = n(d.precio_m2_alto)!;
      const municipio = s(d.municipio);
      if (municipio) out["municipio"] = municipio;
      const zona = s(d.zona) ?? s(d.colonia);
      if (zona) out["zona"] = zona;
      const m2 = d.m2_total ?? d.m2_construir;
      if (n(m2)) out["m2_construir_total"] = n(m2)!;
      if (n(d.unidades)) out["unidades_totales"] = n(d.unidades)!;
      if (n(d.radio_km)) out["radio_busqueda_km"] = n(d.radio_km)!;
      if (s(d.amenidades)) out["amenidades"] = s(d.amenidades)!;
      if (s(d.publico_objetivo)) out["publico_objetivo"] = s(d.publico_objetivo)!;
    }
  }

  // ── Costos ──────────────────────────────────────────────────────
  if (tool === "costos") {
    if (documentType === "avaluo") {
      const d = data as Partial<ExtractedAvaluoData>;
      if (s(d.valor_comercial)) out["costo_terreno"] = s(d.valor_comercial)!;
      if (n(d.superficie_construccion_m2)) out["m2_construir"] = n(d.superficie_construccion_m2)!;
    }
    if (documentType === "plano_topografico") {
      const d = data as Partial<ExtractedTerrenoData>;
      if (n(d.superficie_construccion_m2)) out["m2_construir"] = n(d.superficie_construccion_m2)!;
    }
    if (documentType === "boleta_predial") {
      const d = data as Partial<ExtractedBoletaPredialData>;
      if (s(d.valor_catastral)) out["costo_terreno"] = s(d.valor_catastral)!;
    }
    if (documentType === "otro") {
      const d = data as Record<string, unknown>;
      if (n(d.costo_terreno)) out["costo_terreno"] = n(d.costo_terreno)!;
      const permisos = d.costo_permisos ?? d.costo_permisos_tramites;
      if (n(permisos)) out["costo_permisos_tramites"] = n(permisos)!;
      const proyecto = d.costo_proyecto ?? d.costo_proyecto_arquitectonico;
      if (n(proyecto)) out["costo_proyecto_arquitectonico"] = n(proyecto)!;
      const m2 = d.m2_construir ?? d.m2_total;
      if (n(m2)) out["m2_construir"] = n(m2)!;
      if (n(d.niveles)) out["niveles"] = n(d.niveles)!;
      if (n(d.sotanos)) out["sotanos"] = n(d.sotanos)!;
      if (n(d.cajones)) out["cajones_estacionamiento"] = n(d.cajones)!;
    }
  }

  // ── Financiero ──────────────────────────────────────────────────
  if (tool === "financiero") {
    if (documentType === "contrato") {
      const d = data as Partial<ExtractedContratoData>;
      if (n(d.monto)) out["inversion_total"] = n(d.monto)!;
      if (d.condiciones_clave && d.condiciones_clave.length > 0) {
        const txt = d.condiciones_clave.join(" ");
        const t = txt.match(/tasa\s*(?:del\s*)?(\d+(?:\.\d+)?)\s*%/i);
        if (t) out["tasa_interes_anual"] = t[1];
        const p = txt.match(/plazo\s*(?:de\s*)?(\d+)\s*meses/i);
        if (p) out["plazo_credito_meses"] = p[1];
      }
    }
    if (documentType === "avaluo") {
      const d = data as Partial<ExtractedAvaluoData>;
      if (s(d.valor_comercial)) out["inversion_total"] = s(d.valor_comercial)!;
    }
    if (documentType === "boleta_predial") {
      const d = data as Partial<ExtractedBoletaPredialData>;
      if (s(d.valor_catastral)) out["inversion_total"] = s(d.valor_catastral)!;
    }
    if (documentType === "otro") {
      const d = data as Record<string, unknown>;
      if (n(d.inversion_total)) out["inversion_total"] = n(d.inversion_total)!;
      if (n(d.capital_propio)) out["capital_propio"] = n(d.capital_propio)!;
      if (n(d.deuda)) out["deuda"] = n(d.deuda)!;
      const tasa = d.tasa ?? d.tasa_interes_anual;
      if (n(tasa)) out["tasa_interes_anual"] = n(tasa)!;
      const plazo = d.plazo ?? d.plazo_credito_meses;
      if (n(plazo)) out["plazo_credito_meses"] = n(plazo)!;
    }
  }

  return out;
}
