# PRODUCT

## Project

creaConstruye — SaaS mexicana de proforma inmobiliaria con IA.
Convierte el proceso complejo de evaluar un proyecto de desarrollo
inmobiliario en 8 herramientas modulares que producen documentos
profesionales (Proforma, Ejecutivo 1-pager, Memorándum de Inversión,
Estudio de Mercado) listos para presentar a socios, banca o comité.

## Users

Desarrolladores inmobiliarios pequeños y medianos en México, que
gestionan 1-5 proyectos al año sin un equipo de análisis interno.
También: inversores ángel independientes y analistas financieros que
necesitan auditar proyectos propuestos por terceros. Lectura en
pantalla, a veces con prisa, frecuentemente en campo o después de una
visita al terreno. Idioma: español-MX.

## Mode

**Operate.** La app es una herramienta de trabajo, no marketing.
Scanability, consistencia y expectativas nativas del navegador
outrank expression. La marca vive en detalles precisos (la calidez
del volt en CTAs, el violeta de los análisis AI, los tipos
monoespaciados en cifras). No compite con Notion por deleite visual;
compite con Excel y Argus por utilidad.

## Brand voice

Técnica, directa, sin hype. Habla de m² y de ROI, no de "empoderar
tu visión". Usa verbos específicos: calcular, comparar, validar,
verificar, decidir. Tono de un arquitecto senior platicando con un
inversionista: respeta el tiempo del lector, asume inteligencia, da
datos antes que opiniones. Humor cero o casi cero (no es lugar).

## Anti-references

- **Dashboards SaaS genéricos** con cards anidadas, icon-tile-above-heading
  y KPI soup. La app debe parecer un instrumento, no un showcase.
- **"AI beige"** y warm cream backgrounds. El negro grafito + volt es
  la identidad. Si alguien dice "hazlo más cálido", no.
- **Gradientes purple-to-blue / cyan-on-dark.** Ya tenemos un acento
  violeta para AI; no se duplica.
- **Italic serif display headlines.** No aplica — es una herramienta.
- **Marketing buzzwords** (empoderar, streamline, supercharge,
  world-class, next-generation). El producto es serio, la copy también.
- **Pulsing dots** sin datos cambiando. El estado debe ser fiel al dato.
- **Marquees auto-scrolling.** Nadie en proformas necesita ver 50 logos
  de constructora pasar volando.

## Core flows

1. Crear proyecto → llenar Terreno → generar análisis Claude →
   llenar Zonificación → ir completando las 8 herramientas →
   descargar Proforma PDF.
2. Proponer herramienta de comunidad → admin valida → publicar.
3. Construye Constructiva: cliente pide servicio → lead entra a bandeja
   admin → contacto comercial.

## Output

Documentos PDF profesionales (4 tipos: Proforma, Ejecutivo 1-pager,
Memorándum de Inversión, Estudio de Mercado) que el usuario se lleva
a una reunión con socios, banco o comité de inversión. La calidad
del PDF ES el producto — si el reporte se ve mal, la plataforma pierde
credibilidad aunque los números sean correctos.

## Hard constraints

- Idioma: español-MX en toda la UI. Cero strings hardcoded en inglés.
- Datos: normatividad mexicana, costos en MXN, nomenclatura CDMX/EdoMex.
- Privacidad: el RLS de Supabase garantiza que cada usuario solo ve
  sus proyectos. No exponer datos de un proyecto a otro usuario.
- Costos: 100% de los cálculos puros en `lib/proforma/*` (testeables,
  sin server-only). Ningún cálculo en componentes React.
- AI: Claude (Anthropic) con `json_schema` estructurado, nunca
  texto libre. Thinking adaptativo para análisis complejos.

## Trade-offs aceptados

- Cobertura de mercado: solo México. No pretendemos Latam ni España
  en esta fase. El "Locale: es_MX" es deliberado.
- Tipos de proyecto: residenciales y comerciales pequeños/medianos.
  Industrial pesado y gran escala se aborda en fase posterior.
- Sin app móvil: la app es web-first. Mobile es "usable, no delightful".

## Success criteria

- Un desarrollador puede terminar una proforma de 8 etapas en <2 horas
  (hoy con Excel son 2-3 días).
- El 80% de las proformas generadas se usan tal cual en reuniones
  con socios (sin retoques manuales).
- Tiempo a primera proforma completa (time-to-value) < 30 minutos.
