// Registro de jurisdicciones (entidades) para uso de suelo / zonificación.
// Cada estado tiene su autoridad, documento de zonificación y nomenclatura,
// pero la matemática (COS/CUS → envolvente) es universal en México.
// Es extensible: agregar un estado = agregar una entrada, o usar "otro".

export type JurisdiccionId = "cdmx" | "edomex" | "otro";

export interface Jurisdiccion {
  id: JurisdiccionId;
  nombre: string;
  /** Autoridad que regula el uso de suelo. */
  autoridad: string;
  /** Documento oficial de zonificación. */
  documento: string;
  /** Tag corto de procedencia para los datos de zonificación. */
  fuenteTag: string;
  /** Etiqueta del campo de territorio (alcaldía vs municipio). */
  territorioLabel: string;
  /** Ayuda para la clave/cuenta catastral. */
  catastroHint: string;
  /** Etiqueta y ejemplo del código de zonificación. */
  zonaLabel: string;
  zonaPlaceholder: string;
  /** URL de consulta oficial (si existe). */
  consultaUrl?: string;
  /** Nota explicativa de cómo funciona en esa entidad. */
  nota: string;
  /** true = el usuario define nombre del estado y documento (estado nuevo). */
  configurable?: boolean;
}

export const JURISDICCIONES: Jurisdiccion[] = [
  {
    id: "cdmx",
    nombre: "Ciudad de México",
    autoridad: "SEDUVI / Metrópolis",
    documento: "Certificado Único de Zonificación de Uso del Suelo (CUZUS)",
    fuenteTag: "CUZUS",
    territorioLabel: "Alcaldía",
    catastroHint: "Cuenta catastral (12 dígitos)",
    zonaLabel: "Zonificación",
    zonaPlaceholder: "HM 4/20/Z",
    consultaUrl: "https://metropolis.cdmx.gob.mx/",
    nota: "Centralizado: se consulta con la cuenta catastral + alcaldía en Metrópolis/SIGCDMX. El código (ej. HM 4/20/Z = Habitacional Mixto, 4 niveles, 20% área libre) define COS, CUS y niveles.",
  },
  {
    id: "edomex",
    nombre: "Estado de México",
    autoridad: "Municipio + SEDUI",
    documento: "Cédula Informativa de Zonificación / Plan Municipal de Desarrollo Urbano",
    fuenteTag: "Plan Municipal",
    territorioLabel: "Municipio",
    catastroHint: "Clave catastral (IGECEM)",
    zonaLabel: "Clave de zona (Plan Municipal)",
    zonaPlaceholder: "H.200.A, CU, etc.",
    consultaUrl: "http://sedui.edomex.gob.mx/cedula_iformativa_de_zonificacion",
    nota: "Descentralizado por municipio: cada Plan Municipal de Desarrollo Urbano tiene su zonificación. La Cédula Informativa indica usos y parámetros; la Licencia de Uso de Suelo es la que autoriza.",
  },
  {
    id: "otro",
    nombre: "Otro estado",
    autoridad: "Autoridad estatal / municipal",
    documento: "Documento de zonificación local",
    fuenteTag: "Doc. local",
    territorioLabel: "Municipio",
    catastroHint: "Clave catastral local",
    zonaLabel: "Clave / código de zona",
    zonaPlaceholder: "Según el plan local",
    nota: "Define el estado y el documento de zonificación que aplica. Los parámetros (COS, CUS, niveles) se capturan igual; la matemática de la envolvente es la misma en todo México.",
    configurable: true,
  },
];

export function getJurisdiccion(id?: string): Jurisdiccion {
  return JURISDICCIONES.find((j) => j.id === id) ?? JURISDICCIONES[0];
}
