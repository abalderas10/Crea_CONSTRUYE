# creaConstruye

> **Plataforma mexicana de proforma inmobiliaria con IA.**
> Convierte el desarrollo inmobiliario en documentos profesionales auditables,
> mediante 8 herramientas modulares con IA y un sistema de comunidad con rigor
> verificable.

**No es mejor Excel. Es otra cosa.**

---

## Documentos de referencia

Este proyecto se sostiene sobre cuatro documentos estratégicos (en la raíz
del monorepo, no en `creaconstruye/`):

| Documento | Para qué sirve |
|---|---|
| [`../FILOSOFIA-PLATAFORMA.md`](../FILOSOFIA-PLATAFORMA.md) | La tesis. Los dos principios. Por qué la plataforma **declara**, no calcula en silencio. |
| [`../MENSAJE-MAESTRO-creaConstruye.md`](../MENSAJE-MAESTRO-creaConstruye.md) | Voz, tono, frases por público, mapa de objeciones. La fuente de todo copy. |
| [`../Definición de Producto_ CreaConstruye.com.md`](../Definición%20de%20Producto_%20CreaConstruye.com.md) | Producto, público, competencia, modelo de negocio, roadmap. |
| [`../Diseño UX_UI Conceptual para CreaConstruye.com.md`](../Dise%C3%B1o%20UX_UI%20Conceptual%20para%20CreaConstruye.com.md) | User journeys, arquitectura, wireframes, sitemap. |

Y los documentos de implementación, dentro de `creaconstruye/`:

- [`PRODUCT.md`](./PRODUCT.md) — audiencia, modo (Operate), brand voice, anti-references
- [`DESIGN.md`](./DESIGN.md) — tokens, componentes, anti-patterns baneados
- [`AGENTS.md`](./AGENTS.md) — instrucciones para el agente AI (Next.js + Impeccable)

> **Si vas a tomar una decisión de producto o diseño, lee primero los docs.**
> Si algo no se puede rastrear a esos documentos, se corrige el producto o se
> actualizan los docs. Nunca se publica sin trazabilidad.

---

## Qué hay construido (estado actual)

### Plataforma principal (`creaconstruye/`)

| Bloque | Estado |
|---|---|
| Landing + marketing | ✅ Completo |
| Autenticación (Supabase + OAuth Google) | ✅ Completo |
| App shell + sidebar + project switcher | ✅ Completo |
| Dashboard de proyectos | ✅ Completo |
| **Herramienta 1: Terreno** (form + cálculo + Claude) | ✅ Completo |
| **Herramienta 2: Zonificación** (form + cálculo + Claude) | ✅ Completo |
| **Herramienta 3: Mercado** (demanda, precios, absorción + Claude) | ✅ Completo |
| **Herramienta 4: Costos** (presupuesto paramétrico + Claude) | ✅ Completo |
| **Herramienta 5: Financiero** (3 escenarios + Claude) | ✅ Completo |
| **Herramienta 6: ROI** (TIR, VAN, CAP Rate) | 🚧 Pendiente |
| **Herramienta 7: Cronograma** (Gantt, PERT) | 🚧 Pendiente |
| **Herramienta 8: Riesgos + GO/NO-GO** (veredicto final + Claude) | ✅ Completo |
| Composición de proforma (modularidad) | ✅ Completo |
| Catálogo de comunidad + proponer/avalar/discusión | ✅ Completo |
| Admin panel (KPIs, leads, propuestas, interesados) | ✅ Completo |
| **Reportes PDF** (Proforma Completa, Ejecutivo 1-pager, Memorándum, Mercado) | ✅ Completo |
| Constructiva (vertical de servicios) | ✅ Completo |
| Legal (biblioteca de normatividad con alertas) | ✅ Completo |
| Blog (5+ posts) | ✅ Completo |
| Únete (captura de interesados) | ✅ Completo |
| Suscripciones (Stripe) | ❌ Pendiente |
| Emails transaccionales (Resend) | ❌ Pendiente |
| Tests | ❌ Pendiente (alta prioridad) |

### Stack técnico

- **Next.js 15.5.9** (App Router, React 19, Server Components)
- **Supabase** (Auth + PostgreSQL + RLS)
- **Anthropic Claude** Opus 4.8 (análisis AI con `json_schema` estructurado)
- **Tailwind CSS 4** con design system custom (Graphite Industrial + Volt + Violet AI)
- **`@react-pdf/renderer`** para los 4 tipos de reportes
- **TypeScript 5** strict
- **Bun** como package manager (`bun.lock`)

### Sistema de diseño

- **Graphite Industrial** — fondo grafito + acento volt único (CTAs) + violeta reservado para AI
- **8-point grid** estricto, sin magic numbers
- **Cero "AI slop"** — detector de Impeccable corre en CI (`npm run detect`)
- **Documentado en** [`DESIGN.md`](./DESIGN.md) con tokens, componentes y anti-patterns baneados

---

## Empezar

### Prerrequisitos

- **Node 22.12+** (para Impeccable)
- **Bun 1.x** (recomendado; el repo tiene `bun.lock`)
- **PostgreSQL remoto** vía Supabase (URL + API key)
- **Anthropic API key** para los análisis con Claude

### Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
cp .env.example .env.local
```

| Variable | De dónde sale | Requerida |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API | Sí (en producción) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → API (llave nueva `sb_publishable_...`) | Sí (en producción) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Alternativa legacy (JWT) | Solo si no hay publishable |
| `ANTHROPIC_API_KEY` | Anthropic Console → API Keys | Sí (en producción, para Claude) |

**Si dejas las variables vacías**, la plataforma funciona en modo **demo**:
se puede navegar el shell, ver PDFs, probar formularios — sin tocar Supabase
ni gastar tokens de Claude. Es lo que usa la versión de preview.

### Desarrollo local

```bash
bun install        # más rápido que npm (las deps nativas de Windows funcionan aquí)
bun run dev        # localhost:3000
```

Alternativa con npm (puede fallar en Windows con deps nativas):

```bash
npm install
npm run dev
```

### Lint y detector de diseño

```bash
npm run lint       # ESLint
npm run detect     # Impeccable: busca AI slop y problemas de diseño
```

El detector **debe pasar limpio** antes de cada commit. Si encuentra findings,
se arreglan o se documenta en `.impeccable/config.json` `ignoreRules`.

### Build de producción

```bash
npm run build
```

---

## Despliegue

### Vercel (recomendado)

1. Conecta el repo `abalderas10/Crea_CONSTRUYE` (subcarpeta `creaconstruye/`)
2. Configura las variables de entorno en Vercel Dashboard (ver `.env.example`)
3. Configura el dominio `creaconstruye.abdev.click` (ver [`docs/deploy-vercel.md`](./docs/deploy-vercel.md))
4. Cada push a `main` despliega automáticamente

Ver guía detallada en [`docs/deploy-vercel.md`](./docs/deploy-vercel.md).

### Estructura del proyecto

```
creaconstruye/
├── .agents/skills/impeccable/    ← no tocar: skill de Impeccable (submodule)
├── .impeccable/                   ← config del detector (tracked)
├── .opencode/skills/impeccable/   ← link del skill para opencode
├── docs/                          ← documentación operativa (deploy, etc.)
├── PRODUCT.md                     ← contexto de producto
├── DESIGN.md                      ← design system
├── AGENTS.md                      ← instrucciones para AI
├── public/                        ← assets estáticos
├── scripts/                       ← tests manuales, scripts
├── src/
│   ├── app/                       ← App Router (rutas)
│   │   ├── (marketing)/           ← landing, blog, legal, constructiva, unete
│   │   ├── app/                   ← área autenticada (proyectos, herramientas, admin)
│   │   ├── auth/                  ← callback de OAuth
│   │   ├── api/                   ← (futuro) Route Handlers
│   │   ├── globals.css            ← design system tokens
│   │   └── layout.tsx             ← root layout
│   ├── components/                ← componentes reutilizables (UI, app, auth, blog, community, etc.)
│   ├── content/                   ← contenido estático (blog posts)
│   ├── lib/
│   │   ├── proforma/              ← cálculos puros (testeables, sin server)
│   │   ├── ai/                    ← analizadores Claude (server-only)
│   │   ├── pdf/                   ← 4 tipos de reporte PDF
│   │   ├── community/             ← catálogo, rigor, secciones
│   │   ├── data/                  ← acceso a Supabase
│   │   ├── supabase/              ← clients (server, browser, middleware)
│   │   └── ...                    ← auth, admin, legal, tools, constructiva
│   └── middleware.ts              ← Supabase session refresh
└── supabase/migrations/           ← 8 migraciones SQL versionadas
```

### Convenciones del código

- **Cálculos puros** siempre en `lib/proforma/*` (sin server-only, testeables con `bun test`)
- **AI con `json_schema`** estructurado. Nunca texto libre. Thinking adaptativo para análisis complejos.
- **Server actions** en `app/<route>/actions.ts` con prefijo del dominio (`saveTerrenoData`, `generateToolSuggestion`)
- **Componentes** en `src/components/<dominio>/` con sufijo de responsabilidad (`Form`, `Valoracion`, `Analysis`, `Card`)
- **Cada métrica lleva su fuente visible** (`SourceTag`) — la transparencia es una feature, no decoración
- **No hay pulsos decorativos**. El estado es el dato.
- **Cero buzzwords** en copy: nada de "empoderar", "transforma tu vida", "el mejor del mercado"

---

## Sistema de cálculo: el proforma

Las **8 herramientas modulares** que componen la proforma, con sus
dependencias (qué consume cada una → qué alimenta):

```
                  Terreno ── Zonificación ── Costos
                     │           │             │
                     └───────────┴── Mercado ───┴── Cronograma
                                                    │
                       Financiero ◄────────────────┘
                            │
                       ROI
                            │
                  Riesgos + GO/NO-GO
```

Estado actual: **Terreno** y **Zonificación** operativas. El resto en roadmap.

Cada herramienta sigue el mismo patrón:
1. `lib/proforma/<tool>.ts` — tipos + cálculos puros
2. `lib/ai/<tool>.ts` — analizador Claude (`json_schema`)
3. `app/app/<tool>/` — página + server actions
4. `components/app/<Tool>{Form,Valoracion,Analysis}.tsx`

---

## Comunidad con rigor verificable

Las herramientas de la comunidad no se autodeclaran: pasan por un sistema
de **4 niveles de rigor** basados en evidencia:

```
 borrador → sustentada → revisada → avalada → certificada
                                       ↑
                              avalada por profesional
                              con cédula RNP verificable
```

Las propuestas con fuentes, casos de prueba resueltos y avales con cédula
profesional (verificable en el Registro Nacional de Profesionistas) suben
de nivel automáticamente. El rigor **se calcula**, no se autodeclara.

---

## Licencia

Privado. Todos los derechos reservados. ABDev · Alberto Balderas.

---

## Links operativos

- Repositorio: https://github.com/abalderas10/Crea_CONSTRUYE
- Plataforma: https://creaconstruye.com (próximamente en `creaconstruye.abdev.click`)
- Stack: Next.js 15 · Supabase · Claude Opus 4.8 · Tailwind 4 · TypeScript 5

> *«Lo que crees, creas.» — principio 1, FILOSOFIA-PLATAFORMA.md*