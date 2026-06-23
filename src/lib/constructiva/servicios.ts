// Catálogo de servicios de Constructiva.
// Fuente única para la landing y el formulario de solicitud.

export type ServiceType = "construccion" | "mantenimiento";

export interface Servicio {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
}

export const SERVICIOS: Servicio[] = [
  // ── Construcción ─────────────────────────────────────────────
  {
    id: "obra-nueva",
    type: "construccion",
    name: "Obra nueva",
    description:
      "Construcción completa de tu proyecto: casa, edificio o desarrollo, con proforma y presupuesto respaldados por datos reales.",
  },
  {
    id: "obra-por-fases",
    type: "construccion",
    name: "Obra por fases",
    description:
      "Ejecutamos etapas específicas: cimentación, estructura, instalaciones o acabados.",
  },
  {
    id: "gestion-proyecto",
    type: "construccion",
    name: "Gestión de proyecto",
    description:
      "Dirección de obra, control de costos y supervisión con datos en tiempo real.",
  },
  // ── Mantenimiento ────────────────────────────────────────────
  {
    id: "pintura",
    type: "mantenimiento",
    name: "Pintura",
    description: "Interiores y exteriores, residencial y comercial.",
  },
  {
    id: "fachadas",
    type: "mantenimiento",
    name: "Fachadas",
    description:
      "Rehabilitación, impermeabilización y renovación estética de fachadas.",
  },
  {
    id: "remodelacion",
    type: "mantenimiento",
    name: "Remodelaciones",
    description:
      "Desde un espacio hasta una remodelación completa, con levantamiento y presupuesto detallado.",
  },
  {
    id: "domotica",
    type: "mantenimiento",
    name: "Domótica",
    description:
      "Integración de sistemas inteligentes: iluminación, clima, seguridad y control por voz.",
  },
  {
    id: "automatizacion",
    type: "mantenimiento",
    name: "Automatización",
    description:
      "Automatización de accesos, cortinas, riego y escenarios para casa u oficina.",
  },
];

export const SERVICE_LABEL: Record<ServiceType, string> = {
  construccion: "Construcción",
  mantenimiento: "Mantenimiento",
};
