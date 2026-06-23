import type { ReactNode } from "react";
import { P, H2, H3, UL, LI, Quote, Strong, Formula } from "@/components/blog/Prose";

// ── Categorías ───────────────────────────────────────────────
export type BlogCategory =
  | "proforma"
  | "herramientas"
  | "arquitectura"
  | "normatividad"
  | "constructiva";

export interface CategoryMeta {
  id: BlogCategory;
  name: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "proforma", name: "Proforma", color: "#C8FF00" },
  { id: "herramientas", name: "Herramientas", color: "#8B5CF6" },
  { id: "arquitectura", name: "Diseño & Arquitectura", color: "#06B6D4" },
  { id: "normatividad", name: "Normatividad", color: "#F59E0B" },
  { id: "constructiva", name: "Constructiva", color: "#C6F24E" },
];

export function getCategory(id: BlogCategory): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

// ── Posts ────────────────────────────────────────────────────
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  date: string; // ISO
  readMin: number;
  body: ReactNode;
}

export const POSTS: Post[] = [
  {
    slug: "que-es-una-proforma-inmobiliaria",
    title: "Qué es una proforma inmobiliaria (y por qué la mayoría está mal hecha)",
    excerpt:
      "Una proforma no es un Excel con números optimistas. Es el modelo que decide si un proyecto se construye o se cancela. Así debería hacerse.",
    category: "proforma",
    author: "creaConstruye",
    date: "2026-06-15",
    readMin: 6,
    body: (
      <>
        <P>
          La proforma inmobiliaria es el documento que responde una sola
          pregunta: <Strong>¿este proyecto vale la pena?</Strong> Reúne el
          terreno, la normatividad, el mercado, los costos y el financiamiento
          en un modelo que termina en un veredicto de inversión.
        </P>
        <P>
          El problema es que la mayoría se arma en una hoja de cálculo heredada,
          con supuestos que nadie revisa y números que se acomodan para que el
          proyecto «dé». Eso no es analizar: es justificar una decisión ya
          tomada.
        </P>

        <H2>Las partes de una proforma seria</H2>
        <UL>
          <LI>
            <Strong>Terreno:</Strong> ubicación, viabilidad y valor residual del
            suelo — cuánto vale realmente, no lo que pide el vendedor.
          </LI>
          <LI>
            <Strong>Zonificación:</Strong> COS/CUS y envolvente máxima
            construible según la normatividad local.
          </LI>
          <LI>
            <Strong>Mercado:</Strong> precio/m² objetivo, absorción y producto
            óptimo para la zona.
          </LI>
          <LI>
            <Strong>Costos:</Strong> presupuesto paramétrico por partidas, no un
            «costo/m²» sacado de la memoria.
          </LI>
          <LI>
            <Strong>Financiero y ROI:</Strong> flujo de caja, TIR, VAN y punto
            de equilibrio.
          </LI>
          <LI>
            <Strong>Riesgos:</Strong> qué puede salir mal y con qué
            probabilidad, hasta el GO/NO-GO final.
          </LI>
        </UL>

        <H2>El error de fondo</H2>
        <Quote>
          Una proforma optimista no te protege de un mal proyecto: te lo
          esconde.
        </Quote>
        <P>
          Cada número debería ser trazable a su origen — boleta predial, plan de
          desarrollo urbano, comparables de mercado — y cada fórmula visible y
          editable. Esa transparencia es justo lo que construimos en
          creaConstruye: cálculos que muestran de dónde sale cada cifra y un
          análisis de IA que es honesto cuando el proyecto no cierra.
        </P>
      </>
    ),
  },
  {
    slug: "cos-cus-envolvente-construible",
    title: "COS y CUS: cómo se calcula la envolvente construible",
    excerpt:
      "Dos coeficientes deciden cuánto puedes construir en un terreno. Entenderlos es la diferencia entre un proyecto viable y una multa.",
    category: "herramientas",
    author: "creaConstruye",
    date: "2026-06-18",
    readMin: 5,
    body: (
      <>
        <P>
          Antes de pensar en cuántos departamentos caben, hay dos números que lo
          deciden todo: el <Strong>COS</Strong> y el <Strong>CUS</Strong>. Salen
          de la normatividad de uso de suelo y definen la envolvente máxima que
          la autoridad te permite construir.
        </P>

        <H3>COS — Coeficiente de Ocupación del Suelo</H3>
        <P>
          Indica qué porción del terreno puedes ocupar en planta baja. Un COS de
          0.6 significa que el 60% de la superficie puede tener construcción; el
          resto debe quedar libre.
        </P>

        <H3>CUS — Coeficiente de Utilización del Suelo</H3>
        <P>
          Indica cuántas veces la superficie del terreno puedes construir en
          total, sumando todos los niveles.
        </P>

        <H2>Las fórmulas</H2>
        <Formula>{`Desplante (planta baja) = COS × superficie del terreno
m² construibles totales = CUS × superficie del terreno
Niveles aproximados   ≈ CUS ÷ COS`}</Formula>
        <P>
          Ejemplo: un terreno de 520 m² con COS 0.6 y CUS 3.0 permite un
          desplante de 312 m², hasta 1,560 m² construibles y alrededor de 5
          niveles.
        </P>

        <H2>El detalle que cambia todo: la jurisdicción</H2>
        <P>
          El COS y el CUS no se calculan igual en todos lados. En la CDMX vienen
          del CUZUS y SEDUVI; en el Estado de México, de los planes municipales
          y la SEDUI. Mismo cálculo, distinta autoridad y distinto documento —
          por eso la herramienta de Terreno en creaConstruye se adapta a la
          entidad que elijas.
        </P>
      </>
    ),
  },
  {
    slug: "por-que-creamos-creaconstruye",
    title: "Por qué creamos creaConstruye",
    excerpt:
      "El sector que construye el país sigue decidiendo a ojo. Queremos ser la plataforma de referencia para crear, construir y calcular.",
    category: "proforma",
    author: "creaConstruye",
    date: "2026-06-20",
    readMin: 4,
    body: (
      <>
        <P>
          El desarrollo inmobiliario en México mueve cifras enormes y, aun así,
          buena parte de las decisiones se toman con intuición, plantillas
          viejas y prisa. La información existe, pero está dispersa: el predial
          por un lado, la normatividad por otro, el mercado en la cabeza de
          alguien.
        </P>
        <Quote>
          Creemos que crear y construir merece las mismas herramientas que
          cualquier otra industria seria.
        </Quote>
        <P>
          creaConstruye nació para reunir todo eso en un solo lugar: una
          proforma inteligente y automatizada, sí, pero también un espacio para
          construir comunidad. Arquitectos, ingenieros, brokers, instaladores y
          gente de mantenimiento aportando herramientas, validándolas con su
          expertise y compartiéndolas.
        </P>
        <P>
          Cada herramienta nueva, cada cálculo, cada cambio de normatividad lo
          vamos a contar aquí, en el blog. Porque queremos ser la plataforma de
          referencia de este sector — y eso se gana explicando, no presumiendo.
        </P>
      </>
    ),
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function postsByDate(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

const MESES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

/** Formatea una fecha ISO (YYYY-MM-DD) sin depender de zona horaria. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[(m ?? 1) - 1]} ${y}`;
}
