import { useState } from "react";

const C = {
  bg:{ base:"#0C0C0E", surface:"#131316", raised:"#1C1C21", hover:"#222228", border:"#2E2E38" },
  volt:"#C8FF00", voltG:"#C8FF0012",
  violet:"#8B5CF6", violetG:"#8B5CF612",
  success:"#22C55E", warning:"#F59E0B", danger:"#FF3B3B", info:"#38BDF8",
  text:{ p:"#F4F4F5", s:"#A1A1AA", m:"#52525B", onVolt:"#000" },
  font:{ sans:"'Inter',system-ui,sans-serif", mono:"'JetBrains Mono',monospace" },
  r:{ sm:6, md:8, lg:12, xl:16 },
};

// ── DATA ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    num:1, id:"terreno", name:"Terreno", icon:"📍", color:"#22C55E",
    tagline:"Ubicación, viabilidad y valoración del sitio",
    inputs:"Dirección · Superficie m² · Precio solicitado · Tipo desarrollo",
    produces:"Score ubicación · Precio mercado estimado · Recomendación",
    feedsTo:[2,3],
    autoUpdateable:["scoring","valoracion","restricciones"],
    globalRef:["Walk Score","Google Maps Places API","CENAPRED","INEGI DENUE","CoStar (ref)","SHF","Inmuebles24"],
    sections:[
      { id:"localizacion",  name:"Localización",             type:"input",  auto:false, icon:"📍",
        desc:"Formulario: dirección con autocomplete, coordenadas GPS, superficie total, precio solicitado, tipo de desarrollo (residencial/comercial/mixto). Mapa Mapbox base con pin del terreno." },
      { id:"scoring",       name:"Scoring de Ubicación",     type:"calc",   auto:true,  icon:"⭐",
        desc:"Score 0-10 ponderado: accesibilidad vial (25%), servicios cercanos (20%), riesgo zona (15%), topografía (15%), infraestructura (15%), plusvalía histórica (10%). RadialBarChart con desglose." },
      { id:"servicios",     name:"Servicios y Equipamiento", type:"data",   auto:false, icon:"🏥",
        desc:"Tabla de amenidades en radio de 1-3km: hospitales, escuelas, comercio, metro/bus, parques, centros comerciales. Distancia en metros y tiempo caminando/manejando." },
      { id:"valoracion",    name:"Valoración Comparativa",   type:"market", auto:true,  icon:"💰",
        desc:"Precio/m² de terrenos comparables en la zona (últimos 12 meses). Tabla de 5-8 comparables con mapa. Sobreprecio calculado vs. mercado. Tendencia de precios de terreno." },
      { id:"restricciones", name:"Alertas y Restricciones",  type:"legal",  auto:true,  icon:"⚠️",
        desc:"Gravámenes en Registro Público de la Propiedad (RPP), zonas de riesgo CENAPRED (sísmico, inundación), áreas patrimoniales, zonas ambientales protegidas CONABIO, restricciones de servidumbres." },
      { id:"due-diligence", name:"Due Diligence Checklist",  type:"action", auto:false, icon:"✅",
        desc:"Checklist interactivo de 20-30 puntos: escrituras, predial, agua y drenaje, CFE, antecedentes registrales. Adaptado por municipio (CDMX/Edomex/otros). Estatus: pendiente/en proceso/completo." },
      { id:"ai-t",          name:"Análisis AI + Decisión",   type:"ai",     auto:false, icon:"🤖",
        desc:"Claude genera reporte narrativo: contexto del terreno, análisis de scoring, valoración vs. precio pedido, riesgos detectados, recomendación: COMPRAR / NEGOCIAR (precio objetivo) / NO COMPRAR." },
    ]
  },
  {
    num:2, id:"zonificacion", name:"Zonificación", icon:"📐", color:"#3B82F6",
    tagline:"Regulaciones, COS/CUS y envolvente máxima",
    inputs:"Clave catastral · Municipio · Proyecto propuesto (tipo + m²)",
    produces:"m² construibles · Pisos máximos · Checklist permisos",
    feedsTo:[3,4],
    autoUpdateable:["reglamentos"],
    globalRef:["SEDUVI (CDMX)","SEDUI (Edomex)","Ventanilla Única","TestFit","Feasable.ai","Deepblocks (ref)"],
    sections:[
      { id:"catastral",    name:"Datos Catastrales",        type:"input",  auto:false, icon:"🗂️",
        desc:"Clave catastral, municipio, estado, zona regulatoria detectada automáticamente. Enlace directo a portal de consulta municipal. Confirmación de uso de suelo actual." },
      { id:"parametros",   name:"Parámetros Regulatorios",  type:"data",   auto:true,  icon:"📏",
        desc:"COS, CUS, altura máxima (m y pisos), setback frontal/lateral/posterior, permeabilidad mínima, índice de construcción. Tabla regulaciones vs. proyecto propuesto con semáforo verde/amarillo/rojo." },
      { id:"envolvente",   name:"Envolvente Construible",   type:"calc",   auto:false, icon:"🏗️",
        desc:"Cálculo automático: m² ocupación (sup × COS), m² totales (sup × CUS), pisos máximos, estacionamientos requeridos, áreas verdes mínimas. Visualización SVG isométrica del volumen." },
      { id:"compatibilidad",name:"Verificación Cumplimiento",type:"check",  auto:false, icon:"✅",
        desc:"Checklist de cumplimiento: ¿el proyecto propuesto cabe en el COS? ¿cumple CUS? ¿altura permitida? ¿estacionamientos suficientes? Estado visual: 100% CUMPLE / CON CONDICIONES / NO CUMPLE." },
      { id:"tramites",     name:"Trámites y Permisos",      type:"action", auto:false, icon:"📋",
        desc:"Lista completa de trámites: certificado de zonificación, DTAN, licencia de construcción, CFE, CAPAM. Por cada trámite: dependencia, costo, tiempo, documentos requeridos, portal web, status de avance." },
      { id:"ai-z",         name:"Análisis AI + Decisión",   type:"ai",     auto:false, icon:"🤖",
        desc:"Claude interpreta: 'En tu terreno de Xm² con COS Y y CUS Z, puedes construir hasta N m² en P pisos. Tu proyecto de Qm² CUMPLE/EXCEDE los parámetros.' Alertas si se necesita cambio de uso de suelo." },
    ]
  },
  {
    num:3, id:"mercado", name:"Mercado", icon:"📊", color:"#A855F7",
    tagline:"Demanda, precios, absorción y producto óptimo",
    inputs:"Zona · m² construibles (de Zonif.) · Tipo proyecto · Radio análisis",
    produces:"Precio/m² objetivo · Absorción · Perfil comprador · Producto recomendado",
    feedsTo:[4,5],
    autoUpdateable:["comparables","precios","absorcion"],
    globalRef:["Inmuebles24","Vivanuncios","Lamudi","INEGI","SHF","CoStar (ref)","RealAI (ref)","Softec"],
    sections:[
      { id:"producto",     name:"Definición del Producto",  type:"input",  auto:false, icon:"🎯",
        desc:"# unidades, tamaño promedio m², tipo (departamentos/casas/comercial/mixto), segmento objetivo (económico/medio/medio-alto/premium), precio objetivo. Alimentado por outputs de Terreno y Zonificación." },
      { id:"comparables-map",name:"Mapa de Comparables",   type:"map",    auto:true,  icon:"🗺️",
        desc:"Mapa Mapbox con pins de 5-10 proyectos competidores. Color por estado: verde=activo, amarillo=casi vendido, gris=terminado. Click en pin = popup con datos del proyecto." },
      { id:"comparables-table",name:"Tabla de Comparables",type:"data",   auto:true,  icon:"📋",
        desc:"Tabla sorteable: proyecto, ubicación, # unidades, m² prom, precio/m², precio total, % absorción, meses en mercado, amenidades, segmento. Filtros por tipo/segmento/radio." },
      { id:"precios-hist", name:"Tendencia de Precios",    type:"chart",  auto:true,  icon:"📈",
        desc:"Gráfica Recharts AreaChart: precio/m² histórico 5 años en la zona. Línea de proyección 12-24 meses. Comparación vs. CDMX/nacional. Fuente: INEGI, SHF, portales." },
      { id:"absorcion",    name:"Análisis de Absorción",   type:"calc",   auto:true,  icon:"⏱️",
        desc:"Velocidad de absorción de la zona (unidades/mes). Tiempo estimado para vender el 100% del proyecto. Estacionalidad. Gauge: absorción del proyecto vs. promedio zona." },
      { id:"comprador",    name:"Perfil del Comprador",    type:"data",   auto:false, icon:"👤",
        desc:"Ingreso familiar requerido, edad promedio, motivación (primera vivienda/inversión/vacacional), esquema de pago preferido, features más valorados (home office, pet-friendly, gym). Fuente: INEGI, encuestas mercado." },
      { id:"competencia",  name:"Análisis de Competencia", type:"data",   auto:true,  icon:"🏢",
        desc:"Pipeline de proyectos en construcción en radio de 2km. Saturación del mercado. Ventana de oportunidad estimada. Posicionamiento recomendado vs. competencia." },
      { id:"ai-m",         name:"Análisis AI + Producto",  type:"ai",     auto:false, icon:"🤖",
        desc:"Claude produce: reporte de mercado narrativo, posicionamiento óptimo, precio/m² recomendado con justificación, oportunidades detectadas, riesgos de mercado. Recomendación de mix de producto." },
    ]
  },
  {
    num:4, id:"costos", name:"Costos", icon:"🏗️", color:"#F59E0B",
    tagline:"Presupuesto paramétrico, partidas y optimizaciones",
    inputs:"m² a construir · # niveles · Tipo estructura · Nivel acabados · Ubicación",
    produces:"Presupuesto total · Costo/m² · Optimizaciones · Inversión total",
    feedsTo:[5,6],
    autoUpdateable:["catalogo","escalamiento"],
    globalRef:["BIMSA México","CMIC","RSMeans (ref)","Autodesk CC","Procore Budget","INPP INEGI"],
    sections:[
      { id:"parametros-c", name:"Parámetros de Construcción",type:"input", auto:false, icon:"⚙️",
        desc:"m² de construcción, # niveles, tipo de estructura (concreto armado/acero/mixta), nivel de acabados (básico/medio/premium/lujo), tipo de cimentación, sistema de instalaciones. Determina el presupuesto paramétrico." },
      { id:"presupuesto",  name:"Presupuesto por Partidas",  type:"calc",  auto:false, icon:"📊",
        desc:"Desglose completo: preliminares (4%), cimentación (10%), estructura (20%), albañilería (12%), instalaciones (15%), acabados (25%), equipamiento (6%), otros (8%). Tabla expandible por capítulo → concepto → precio unitario." },
      { id:"costos-blandos",name:"Costos Blandos",          type:"calc",  auto:false, icon:"💼",
        desc:"Proyecto arquitectónico (5-8%), permisos y licencias, notaría y escrituración, gerencia de proyecto, financiamiento durante construcción, comercialización (3-5%), imprevistos (5-8%). Suma al costo total." },
      { id:"inversion-total",name:"Resumen de Inversión",   type:"summary",auto:false,icon:"💰",
        desc:"Tabla: Terreno (de Herramienta 1) + Directos + Blandos + Contingencia + Financieros = Inversión Total. Costo/m² general. Distribución en gráfica pie chart. Comparativa vs. BIMSA zona." },
      { id:"escenarios",   name:"Comparativa de Escenarios",type:"compare",auto:false,icon:"🔄",
        desc:"3 columnas: Económico / Medio / Premium. Por cada uno: costo total, costo/m², precio de venta sugerido, margen bruto. Permite elegir el escenario que maximiza retorno vs. absorción de mercado." },
      { id:"escalamiento", name:"Escalamiento Proyectado",  type:"calc",  auto:true,  icon:"📉",
        desc:"Inflación de materiales proyectada 6-18 meses (INPP INEGI). Alerta si algún material tiene riesgo de escasez. Recomendación de compras anticipadas para fijar precio." },
      { id:"optimizaciones",name:"Optimizaciones AI",       type:"ai",    auto:false, icon:"⚡",
        desc:"Claude identifica 3-5 optimizaciones con ahorro cuantificado y sin impacto en absorción: sustitución de materiales, cambio de sistema constructivo, revisión de especificaciones. Botón 'Aplicar' recalcula presupuesto." },
      { id:"ai-c",         name:"Análisis AI + Validación", type:"ai",    auto:false, icon:"🤖",
        desc:"Claude valida: '¿El costo estimado es razonable para esta zona y tipo de proyecto?' Compara con benchmarks BIMSA. Alerta si alguna partida está muy por encima o debajo del rango esperado." },
    ]
  },
  {
    num:5, id:"financiero", name:"Financiero", icon:"💰", color:"#06B6D4",
    tagline:"Flujo de caja, Monte Carlo y punto de equilibrio",
    inputs:"Inv. total (Costos) · Precio/m² (Mercado) · Absorción · Financiamiento",
    produces:"Flujo de caja mensual · 3 escenarios · Monte Carlo · P. equilibrio",
    feedsTo:[6,7],
    autoUpdateable:["tasas","inflacion"],
    globalRef:["ARGUS Enterprise (ref)","REFM Models","TIIE/CETES Banxico","Adventures in CRE","numpy-financial"],
    sections:[
      { id:"inversion",    name:"Estructura de Inversión",   type:"input", auto:false, icon:"🏦",
        desc:"Desglose inversión total: terreno, construcción, blandos, otros. Fuente de fondos: crédito bancario (monto, tasa TIIE+spread, plazo, LTV), capital propio. Comisión de apertura, gastos de escrituración crédito." },
      { id:"ventas",       name:"Supuestos de Venta",        type:"input", auto:false, icon:"🎯",
        desc:"Precio de venta/m², # unidades, ritmo de ventas mensual, % de preventa antes de obra, descuento preventa, comisión de broker. Calendario de entregas. Alimentado por outputs de Mercado." },
      { id:"flujo",        name:"Flujo de Caja Mensual",     type:"chart", auto:false, icon:"📊",
        desc:"Recharts ComposedChart: barras de ingresos/egresos mensuales + línea de saldo acumulado por 18-36 meses. 3 tabs: pesimista/base/optimista. Resaltado en rojo cuando el saldo es negativo (financiamiento necesario)." },
      { id:"equilibrio",   name:"Punto de Equilibrio",       type:"calc",  auto:false, icon:"⚖️",
        desc:"Mes exacto donde el flujo acumulado cruza cero. Unidades mínimas a vender para cubrir costos. Indicador visual de posición actual del proyecto si hay ventas reales ingresadas." },
      { id:"monte-carlo",  name:"Simulación Monte Carlo",    type:"calc",  auto:false, icon:"🎲",
        desc:"1,000-10,000 iteraciones variando: precio ±15%, absorción ±30%, costos ±10%. Histograma de distribución de utilidades. VaR 95%. Probabilidad de utilidad positiva. 'Rango esperado: $X - $Y con 80% confianza.'" },
      { id:"sensibilidad", name:"Análisis de Sensibilidad",  type:"chart", auto:false, icon:"🌪️",
        desc:"Tornado chart: ¿cuánto cambia la utilidad si cada variable sube/baja 10%? Ranking: precio de venta > absorción > costos > tasa de interés > precio terreno. Guía qué variable controlar primero." },
      { id:"estados",      name:"Estados Financieros",       type:"data",  auto:false, icon:"📋",
        desc:"Estado de resultados del proyecto: ingresos totales, costos directos, costos indirectos, costos financieros, impuestos estimados (ISR/IVA), utilidad neta. Balance simplificado. Proyectado y real (si hay avance)." },
      { id:"ai-f",         name:"Análisis AI + Validación",  type:"ai",    auto:false, icon:"🤖",
        desc:"Claude narra el modelo: 'Tu proyecto de X unidades genera una utilidad de $Y (margen Z%). El mes crítico de liquidez es el mes N con déficit de $M. Recomiendo asegurar línea de crédito antes del mes N-2.'" },
      { id:"tasas-auto",   name:"Actualización Tasas",       type:"auto",  auto:true,  icon:"⚡",
        desc:"Actualización automática: tasa TIIE (Banxico), tasa de CETEs 28/91/182 días, inflación mensual (INEGI). Botón 'Recalcular con tasas actuales' que regenera flujo y Monte Carlo con datos frescos." },
    ]
  },
  {
    num:6, id:"roi", name:"ROI", icon:"📈", color:"#10B981",
    tagline:"TIR, VAN, CAP Rate y benchmarking de rentabilidad",
    inputs:"Flujo de caja completo (Financiero) · Capital propio · Tasa descuento",
    produces:"ROI · TIR · VAN · CAP Rate · Payback · Veredito vs. mercado",
    feedsTo:[8],
    autoUpdateable:["benchmarks"],
    globalRef:["ARGUS DCF","Fibras MX","AMPI","Softec","CBRE Research","numpy-financial","QuantLib (ref)"],
    sections:[
      { id:"metricas",     name:"Métricas Principales",      type:"calc",  auto:false, icon:"📐",
        desc:"6 tarjetas: ROI total, TIR anual, VAN (tasa descuento seleccionable), CAP Rate, Cash-on-Cash, Payback en meses. Cada métrica con valor, interpretación en texto y semáforo vs. benchmark." },
      { id:"escenarios-roi",name:"Comparativa de Escenarios",type:"compare",auto:false,icon:"🔄",
        desc:"3 columnas: pesimista/base/optimista. Por cada uno: ROI, TIR, VAN, Payback. Tabla + spider chart comparativo. Probabilidades de Monte Carlo asignadas a cada escenario (15%/70%/15%)." },
      { id:"benchmark",    name:"Benchmark de Mercado",      type:"data",  auto:true,  icon:"📊",
        desc:"Comparativa: TIR del proyecto vs. CETES (tasa libre de riesgo), vs. Fibras MX, vs. promedio sector (Estado de México residencial). Recharts BarChart de percentiles. '¿Supera el benchmark?'" },
      { id:"sensibilidad-roi",name:"Análisis de Sensibilidad",type:"chart",auto:false,icon:"🌪️",
        desc:"Tornado chart específico de ROI: ¿cuántos puntos de ROI gano/pierdo si el precio sube 5%? ¿Si los costos suben 10%? ¿Si la absorción se reduce a la mitad? Guía de decisión." },
      { id:"salida",       name:"Estrategias de Salida",     type:"compare",auto:false,icon:"🚪",
        desc:"3 estrategias: Venta 100% (ROI X%), Renta 100% (CAP Rate Y%, yield Z%), Mixto 60/40 (métricas combinadas). Por cada una: supuestos, métricas, ventajas, riesgos. Recomendación AI." },
      { id:"optimizaciones-roi",name:"Optimizaciones de ROI",type:"ai",   auto:false,icon:"⚡",
        desc:"Claude identifica top 3 optimizaciones con impacto en puntos de TIR: aumentar preventa (+ X pts), optimizar mezcla de unidades (+ Y pts), renegociar tasa de crédito (+ Z pts). Costo de implementar cada una." },
      { id:"ai-r",         name:"Análisis AI + Veredito",    type:"ai",    auto:false, icon:"🤖",
        desc:"Claude produce dictamen de inversión: 'TIR de X% supera el benchmark del mercado (Y%) y el costo de capital (Z%). El proyecto es ATRACTIVO/MARGINAL/NO ATRACTIVO para el perfil inversor estándar.' Justificación." },
    ]
  },
  {
    num:7, id:"cronograma", name:"Cronograma", icon:"📅", color:"#6366F1",
    tagline:"Gantt, ruta crítica, PERT y hitos de desembolso",
    inputs:"Alcance (Zonif.) · Trámites (Zonif.) · Costos (Costos) · Fecha inicio",
    produces:"WBS completo · Gantt · Ruta crítica · Probabilidades PERT",
    feedsTo:[8],
    autoUpdateable:[],
    globalRef:["MS Project (ref)","Primavera P6 (ref)","NetworkX (CPM)","react-gantt-chart","INEGI clima SMN"],
    sections:[
      { id:"fases",        name:"Fases y Actividades",       type:"input", auto:false, icon:"📋",
        desc:"WBS automático generado por AI basado en alcance del proyecto: pre-construcción, cimentación, estructura, albañilería, instalaciones, acabados, exteriores, entrega. El usuario puede editar duraciones y agregar actividades." },
      { id:"gantt",        name:"Diagrama de Gantt",         type:"chart", auto:false, icon:"📊",
        desc:"Gantt interactivo: barras por fase con código de color, dependencias con flechas, hitos marcados con diamante. Zoom por semana/mes/trimestre. Scroll horizontal. Click en barra = detalle de actividad." },
      { id:"critica",      name:"Ruta Crítica",              type:"calc",  auto:false, icon:"🔴",
        desc:"Actividades en ruta crítica resaltadas en rojo. Holguras de las demás actividades en gris. Tabla: 'Las 5 actividades que no pueden retrasarse sin afectar la fecha de entrega.' Duración total del camino crítico." },
      { id:"hitos",        name:"Hitos y Desembolsos",       type:"data",  auto:false, icon:"🏁",
        desc:"Timeline vertical de hitos: inicio de obra, topping out, inicio de acabados, entrega de primeras unidades, escrituración 100%. Por cada hito: fecha planificada, desembolso vinculado, status." },
      { id:"pert",         name:"Análisis PERT",             type:"calc",  auto:false, icon:"🎲",
        desc:"Por cada actividad crítica: duración optimista/probable/pesimista → duración PERT = (O+4P+E)/6. Distribución de probabilidad de la fecha de entrega. '72% de probabilidad de entregar antes del DD/MM/AAAA.'" },
      { id:"ajustes",      name:"Factores de Ajuste",        type:"input", auto:false, icon:"🎛️",
        desc:"Multiplicadores que afectan duraciones: complejidad del proyecto (0.85-1.40), experiencia del constructor (0.90-1.25), temporada de lluvias (impacto por mes), acceso al sitio (1.00-1.15). Clima automático por municipio." },
      { id:"ai-cr",        name:"Análisis AI + Optimización",type:"ai",    auto:false, icon:"🤖",
        desc:"Claude identifica cuellos de botella, sugiere paralelización de actividades, alerta sobre el cuello de botella de trámites: 'La licencia de construcción es el riesgo #1 de tiempo. Iniciar trámite inmediatamente.'" },
    ]
  },
  {
    num:8, id:"riesgos", name:"Riesgos + GO/NO-GO", icon:"⚠️", color:"#EF4444",
    tagline:"VaR, mitigación y decisión final de inversión",
    inputs:"Outputs de TODAS las herramientas anteriores (1-7)",
    produces:"Matriz riesgos · VaR · Plan mitigación · GO/NO-GO con confianza",
    feedsTo:[],
    autoUpdateable:["macro","clima"],
    globalRef:["@RISK Lumivero (ref)","ISO 31000","PMBOK Risk","SciPy Monte Carlo","Banxico","INEGI macro"],
    sections:[
      { id:"identificacion",name:"Identificación de Riesgos",type:"ai",   auto:true,  icon:"🔍",
        desc:"Claude analiza todos los outputs de las 7 herramientas anteriores e identifica riesgos específicos del proyecto. Los combina con catálogo de 200+ riesgos del sistema. El usuario puede agregar riesgos manuales." },
      { id:"matriz",       name:"Matriz de Riesgos",         type:"chart", auto:false, icon:"🗺️",
        desc:"Scatter plot interactivo: eje X = probabilidad (0-100%), eje Y = impacto financiero ($). Cuadrantes: verde/amarillo/naranja/rojo. Click en punto = detalle del riesgo. Colores por categoría: financiero/técnico/regulatorio/mercado." },
      { id:"catalogo",     name:"Catálogo de Riesgos",       type:"data",  auto:false, icon:"📋",
        desc:"Tabla expandible de los 10-20 riesgos principales: código, nombre, categoría, probabilidad %, impacto $, score (P×I), estrategia, estado. Ordenable por score. Filtrable por categoría." },
      { id:"mitigacion",   name:"Plan de Mitigación",        type:"data",  auto:false, icon:"🛡️",
        desc:"Por cada riesgo crítico: 2-3 acciones de mitigación con costo estimado, reducción de probabilidad esperada, reducción de impacto, ROI de la mitigación. Toggle 'Aplicar' actualiza el VaR y el score del riesgo." },
      { id:"correlaciones",name:"Correlaciones y Cascada",   type:"calc",  auto:false, icon:"🔗",
        desc:"Análisis de escenarios combinados: ¿qué pasa si ocurren 2-3 riesgos simultáneamente? 'Tormenta perfecta': sobrecostos + absorción baja + alza de tasas. Probabilidad combinada e impacto total calculados." },
      { id:"var",          name:"Value at Risk del Proyecto", type:"calc",  auto:false, icon:"💰",
        desc:"VaR 95%: 'En el 95% de los escenarios simulados, la pérdida no excederá $X.' CVaR (Expected Shortfall): promedio de pérdidas en el peor 5%. Monte Carlo con correlaciones entre riesgos. Sin/con mitigaciones." },
      { id:"gonogo",       name:"Panel GO / NO-GO",          type:"decision",auto:false,icon:"🚦",
        desc:"El panel más importante de toda la plataforma. Semáforo grande: VERDE (GO) / AMARILLO (CONDICIONAL) / ROJO (NO-GO). Nivel de confianza %. Resumen de métricas clave de las 8 herramientas. Condiciones si es CONDICIONAL." },
      { id:"reporte",      name:"Reporte Exportable",        type:"export",auto:false, icon:"📄",
        desc:"Genera el documento completo: Proforma Inmobiliaria / Estudio de Mercado / Memorándum de Inversión. Formatos: PDF profesional (15-20 págs), Excel con todos los modelos, PowerPoint para bancos/inversionistas." },
    ]
  },
];

const LANDING_SECTIONS = [
  { id:"nav",       name:"Navegación",      icon:"🔝", priority:"P0",
    content:"Logo + Links (Herramientas, Precios, Blog, Casos) + CTA 'Empezar Gratis'. Sticky en scroll. En mobile: hamburger." },
  { id:"hero",      name:"Hero",            icon:"🚀", priority:"P0",
    content:"H1: 'La proforma inmobiliaria que trabaja mientras tú duermes.' H2: 'Análisis de mercado, costos, ROI y riesgos — en horas, no semanas. Con datos reales de México.' CTA principal + demo video/GIF del dashboard." },
  { id:"proof",     name:"Prueba Social",   icon:"✨", priority:"P1",
    content:"Barra: 'Más de 120 proyectos evaluados en México' · logos de desarrolladoras early adopters · calificación promedio 4.9/5." },
  { id:"problema",  name:"El Problema",     icon:"😤", priority:"P0",
    content:"3 cards: 'Excel manual → semanas de trabajo' | 'Estudios de mercado → $80,000+ | 'Sin actualización automática → decisiones desactualizadas'. Contrast visual: antes vs. después." },
  { id:"solucion",  name:"La Solución",     icon:"💡", priority:"P0",
    content:"'creaConstruye hace en horas lo que toma semanas.' Diagrama de flujo: Ingresa terreno → AI analiza → Proforma lista. 3 diferenciadores: Datos MX reales, AI nativa, Colaborativa." },
  { id:"como",      name:"Cómo Funciona",   icon:"⚙️", priority:"P0",
    content:"3 pasos numerados con iconos: 1. Crea un proyecto y agrega el terreno. 2. Completa las 8 herramientas (puedes hacerlo en días). 3. Descarga tu proforma profesional." },
  { id:"tools",     name:"Las 8 Herramientas",icon:"🛠️",priority:"P0",
    content:"Grid 4×2 o carrusel: cada herramienta con ícono custom, nombre, 1 línea de descripción, hover que muestra 3 secciones principales. CTA: 'Ver ejemplo en vivo'." },
  { id:"naucalpan", name:"Caso de Estudio",  icon:"🏙️", priority:"P1",
    content:"Caso real Naucalpan: 'Terreno de 500m², 100 unidades residenciales, TIR 24.5%, GO con 91% de confianza.' Screenshots del dashboard con datos reales. Tiempo: 4 horas vs. 3 semanas manual." },
  { id:"vs",        name:"Comparativa",      icon:"⚖️", priority:"P1",
    content:"Tabla: creaConstruye vs. Excel manual vs. Despacho de consultoría. Filas: Tiempo, Costo, Datos actualizados, AI integrada, Colaboración, Exportación profesional. creaConstruye gana en todo." },
  { id:"usuarios",  name:"Para Quién",       icon:"👥", priority:"P1",
    content:"6 tarjetas con ícono + título: Desarrolladores, Constructores, Arquitectos, Propietarios de terrenos, Brokers, Inversionistas. Por cada uno: '¿Cómo te ayuda?' en 2 líneas." },
  { id:"testimonios",name:"Testimonios",     icon:"💬", priority:"P2",
    content:"3 quotes de early adopters con foto, nombre, empresa, ciudad. Enfoque en resultados: 'Pasé de tardar 3 semanas a tener la proforma en un día.'" },
  { id:"pricing",   name:"Precios",          icon:"💳", priority:"P0",
    content:"3 planes: Starter (gratis, 1 proyecto), Pro ($799/mes, proyectos ilimitados, export PDF/Excel), Enterprise (cotizar, multi-usuario, API, white label). Comparativa de features." },
  { id:"faq",       name:"FAQ",              icon:"❓", priority:"P1",
    content:"8-10 preguntas frecuentes en acordeón: ¿Qué datos necesito para empezar? ¿Funciona solo para México? ¿Mis datos son seguros? ¿Puedo compartir con mi banco/inversionista?" },
  { id:"cta-final", name:"CTA Final",        icon:"🎯", priority:"P0",
    content:"'Evalúa tu primer terreno gratis hoy.' Botón grande volt. Nota: 'Sin tarjeta de crédito. 1 proyecto completo gratis.' Caja de email para lista de espera si hay waitlist." },
  { id:"footer",    name:"Footer",           icon:"📌", priority:"P0",
    content:"Logo + tagline · Links (Herramientas, Precios, Blog, Docs, Legal) · RRSS · 'Hecho en México 🇲🇽' · © creaConstruye 2025" },
];

const PLATFORM_PAGES = [
  {
    id:"dashboard", name:"Dashboard del Proyecto", icon:"📊",
    sections:[
      { name:"Header del proyecto",  desc:"Nombre del proyecto, municipio, tipo, fecha de creación, botón Editar. Progress badge: '3/8 herramientas completadas'." },
      { name:"Estado de herramientas",desc:"8 círculos de progreso (uno por herramienta): vacío/en proceso/completo/auto-actualizado. Click → ir a esa herramienta. Muestra última fecha de edición." },
      { name:"Métricas clave",       desc:"4-6 KPIs consolidados de todas las herramientas: Score terreno, Precio/m² objetivo, Costo total inversión, TIR estimada, Duración proyecto, Nivel de riesgo." },
      { name:"Log de actividad",     desc:"Timeline: 'Hace 2 días · Mercado auto-actualizado: precio promedio zona subió a $8,420/m²' | 'Hace 1 semana · Ingresaste datos de Costos' | 'Ayer · Claude completó análisis de Riesgos'." },
      { name:"Alertas pendientes",   desc:"Cards de alerta: datos desactualizados (>30 días), herramientas con inputs faltantes, tasas de interés cambiadas desde última visita, nuevos comparables disponibles." },
      { name:"Acceso rápido",        desc:"Botones directos: 'Continuar donde lo dejé' → abre la herramienta menos avanzada. 'Ver Reporte' → Reportes. 'Compartir' → link de solo lectura para inversionistas." },
    ]
  },
  {
    id:"reportes", name:"Reportes y Exportación", icon:"📄",
    sections:[
      { name:"Proforma completa",     desc:"Vista de la proforma ensamblada automáticamente con todos los outputs de las 8 herramientas. Secciones colapsables. Preview antes de exportar." },
      { name:"Estudio de mercado",    desc:"Reporte standalone de la Herramienta 3 (Mercado): análisis de zona, comparables, tendencias, perfil comprador. Para presentar a clientes o socios." },
      { name:"Reporte ejecutivo",     desc:"1-pager con las métricas clave: terreno, producto, inversión total, TIR, cronograma, decisión GO/NO-GO. Para primera presentación a bancos." },
      { name:"Memorándum de inversión",desc:"Documento formal para levantar capital: resumen ejecutivo, análisis de mercado, modelo financiero, perfil del equipo, GO/NO-GO. Template bancario." },
      { name:"Historial de versiones",desc:"Cada vez que se exporta, se guarda una versión. Permite comparar v1 vs v3: ¿qué cambió en el ROI? ¿qué riesgos se agregaron? Útil para due diligence." },
    ]
  },
  {
    id:"config", name:"Configuración del Proyecto", icon:"⚙️",
    sections:[
      { name:"Datos del proyecto",    desc:"Editar nombre, tipo, municipio, mercado objetivo. Fecha de inicio deseada. Notas internas." },
      { name:"Colaboradores",         desc:"Invitar por email con roles: Propietario, Editor, Viewer. El Viewer solo puede ver y descargar. Útil para compartir con socio, banco, o arquitecto." },
      { name:"Notificaciones",        desc:"Configurar qué alertas recibir: auto-actualización de datos, recordatorio de herramientas pendientes, tasas de interés cambiadas." },
      { name:"Contexto del proyecto", desc:"Resumen de contexto que Claude usa en todos los análisis. Puede editarse manualmente. 'Este proyecto es una Torre de Uso Mixto en Naucalpan, Edomex, para el segmento medio-alto...'" },
    ]
  },
];

// ── ATOMS ─────────────────────────────────────────────────────────
const Tag = ({ c, children }) => (
  <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"2px 8px", borderRadius:4, border:`1px solid ${c}40`, background:`${c}12`, color:c }}>{children}</span>
);
const Dot = ({ c }) => <span style={{ width:7, height:7, borderRadius:"50%", background:c, display:"inline-block" }}/>;

const TypeColor = { input:C.volt, calc:C.info, data:C.text.s, market:C.violet, legal:C.warning, action:C.success, ai:C.violet, chart:C.info, compare:C.warning, check:C.success, auto:C.volt, decision:C.danger, export:C.success, summary:C.text.s, map:C.info };
const TypeLabel = { input:"Entrada",calc:"Cálculo",data:"Datos",market:"Mercado",legal:"Legal",action:"Acción",ai:"AI·Claude",chart:"Gráfica",compare:"Comparativa",check:"Checklist",auto:"Auto",decision:"Decisión",export:"Export",summary:"Resumen",map:"Mapa" };

// ── TABS ──────────────────────────────────────────────────────────
const TABS = ["Arquitectura", "8 Herramientas", "Landing Page", "Brief para Claude"];

// ================================================================
//  TAB 0 — ARQUITECTURA
// ================================================================
const Arquitectura = () => {
  const [open, setOpen] = useState({ landing:true, auth:false, platform:true, reports:false, settings:false });
  const toggle = (k) => setOpen(p => ({ ...p, [k]:!p[k] }));

  const Branch = ({ label, color=C.text.s, children, onClick, open:isOpen, count }) => (
    <div style={{ marginBottom:2 }}>
      <div onClick={onClick} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:C.r.md, background:isOpen?`${color}10`:"transparent", cursor:onClick?"pointer":"default", border:`1px solid ${isOpen?color+"25":"transparent"}` }}>
        <span style={{ fontSize:12, color }}>{isOpen?"▾":"▸"}</span>
        <span style={{ fontSize:13, fontWeight:700, color:C.text.p }}>{label}</span>
        {count && <span style={{ fontSize:10, background:C.bg.border, color:C.text.m, padding:"1px 6px", borderRadius:C.r.pill }}>{count}</span>}
      </div>
      {isOpen && children && <div style={{ marginLeft:20, borderLeft:`1px solid ${C.bg.border}`, paddingLeft:12, marginTop:2 }}>{children}</div>}
    </div>
  );

  const Leaf = ({ label, badge, color=C.text.s, auto }) => (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 10px", borderRadius:C.r.sm, marginBottom:2 }}>
      <span style={{ fontSize:9, color:C.text.m }}>—</span>
      <span style={{ fontSize:12, color:C.text.s }}>{label}</span>
      {badge && <Tag c={color}>{badge}</Tag>}
      {auto && <Tag c={C.volt}>auto</Tag>}
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, alignItems:"start" }}>
      {/* Left: tree */}
      <div>
        <div style={{ fontSize:10, color:C.text.m, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:12 }}>Arquitectura de información</div>

        <Branch label="creaConstruye.com — Landing" color="#22C55E" onClick={()=>toggle("landing")} open={open.landing} count="15 secciones">
          {LANDING_SECTIONS.slice(0,7).map(s=><Leaf key={s.id} label={s.name} badge={s.priority} color={s.priority==="P0"?C.volt:C.text.m}/>)}
          <Leaf label="... +8 más" color={C.text.m}/>
        </Branch>

        <Branch label="Auth" color={C.info} onClick={()=>toggle("auth")} open={open.auth} count="3 páginas">
          {["Login / SSO Google","Registro + onboarding","Recuperar contraseña"].map(s=><Leaf key={s} label={s}/>)}
        </Branch>

        <Branch label="app.creaconstruye.com — Plataforma" color={C.volt} onClick={()=>toggle("platform")} open={open.platform}>
          {/* Shell */}
          <div style={{ padding:"6px 10px", borderRadius:C.r.sm, background:`${C.volt}10`, border:`1px solid ${C.volt}25`, marginBottom:6 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.volt, marginBottom:4 }}>Shell (siempre visible)</div>
            {["Project Switcher TOP BAR — selección de proyecto activo","Sidebar: nav de 8 herramientas + dashboard + reportes","Notification center: auto-updates + alertas","Context bar: Claude recuerda el proyecto completo"].map(s=><Leaf key={s} label={s}/>)}
          </div>

          {/* Dashboard */}
          <Branch label="Dashboard del Proyecto" color={C.info} onClick={()=>toggle("dash")} open={open.dash} count="6 secciones">
            {PLATFORM_PAGES[0].sections.map(s=><Leaf key={s.name} label={s.name}/>)}
          </Branch>

          {/* 8 tools */}
          {TOOLS.map(t => (
            <Branch key={t.id} label={`${t.num}. ${t.name}`} color={t.color} onClick={()=>toggle(t.id)} open={open[t.id]} count={`${t.sections.length} secciones`}>
              {t.sections.map(s=><Leaf key={s.id} label={s.name} badge={TypeLabel[s.type]} color={TypeColor[s.type]} auto={s.auto}/>)}
            </Branch>
          ))}

          <Branch label="Reportes y Exportación" color={C.success} onClick={()=>toggle("reports")} open={open.reports} count="5 reportes">
            {PLATFORM_PAGES[1].sections.map(s=><Leaf key={s.name} label={s.name}/>)}
          </Branch>

          <Branch label="Configuración del Proyecto" color={C.text.s} onClick={()=>toggle("settings")} open={open.settings} count="4 secciones">
            {PLATFORM_PAGES[2].sections.map(s=><Leaf key={s.name} label={s.name}/>)}
          </Branch>
        </Branch>
      </div>

      {/* Right: key concepts */}
      <div>
        <div style={{ fontSize:10, color:C.text.m, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:12 }}>Conceptos clave de la plataforma</div>

        {/* Project switcher */}
        <div style={{ padding:"14px 16px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.volt}25`, marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.volt, marginBottom:8 }}>★ Project Switcher (TOP BAR)</div>
          {/* Mockup */}
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:C.bg.base, borderRadius:C.r.md, border:`1px solid ${C.bg.border}`, fontSize:12 }}>
            <span style={{ fontSize:16 }}>🏗️</span>
            <span style={{ color:C.text.p, fontWeight:600, flex:1 }}>Torre Naucalpan Centro</span>
            <span style={{ color:C.text.m, fontSize:10 }}>▾ cambiar</span>
            <div style={{ width:1, height:16, background:C.bg.border }}/>
            <span style={{ background:`${C.success}15`, color:C.success, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4 }}>3/8</span>
          </div>
          <div style={{ fontSize:11, color:C.text.s, marginTop:8, lineHeight:1.6 }}>
            Al cambiar de proyecto → todas las 8 herramientas cargan los datos de ese proyecto. La URL cambia a <code style={{ fontFamily:C.font.mono, color:C.volt }}>/app/[project-id]/[tool]</code>. Claude carga el contexto completo de ese proyecto.
          </div>
        </div>

        {/* Persistent state */}
        <div style={{ padding:"14px 16px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.violet}25`, marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.violetSub||"#A78BFA", marginBottom:8 }}>Estado Persistente + Contexto AI</div>
          <div style={{ fontSize:11, color:C.text.s, lineHeight:1.7 }}>
            <b style={{ color:C.text.p }}>Problema:</b> Una proforma toma días o semanas. El usuario no puede completarla en una sola sesión.<br/>
            <b style={{ color:C.text.p }}>Solución:</b> Cada campo se auto-guarda en Supabase. Al regresar, todo está exactamente como lo dejó. Los campos con <Tag c={C.volt}>auto</Tag> se actualizan en background.<br/>
            <b style={{ color:C.text.p }}>Claude:</b> Cada proyecto tiene un <code style={{ fontFamily:C.font.mono, color:C.violet }}>context_summary</code> en Supabase que se actualiza después de cada análisis. Claude lo recibe en el system prompt → no pierde contexto entre sesiones.
          </div>
        </div>

        {/* Auto-update */}
        <div style={{ padding:"14px 16px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.warning}25`, marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.warning, marginBottom:8 }}>⚡ Auto-actualización de datos</div>
          <div style={{ fontSize:11, color:C.text.s, lineHeight:1.7 }}>
            Los datos de mercado cambian. El sistema actualiza automáticamente:<br/>
            <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:3 }}>
              {[["Precios/m² zona","Scraping Inmuebles24/Vivanuncios","Cada 7 días"],["Tasas TIIE/CETES","API Banxico","Cada día"],["Inflación materiales","INPP INEGI","Cada mes"],["Riesgos CENAPRED","API pública","Cada semana"],["Benchmarks ROI","Base de datos propia","Cada mes"]].map(([d,f,p])=>(
                <div key={d} style={{ display:"flex", gap:6 }}>
                  <span style={{ color:C.volt, fontSize:10 }}>→</span>
                  <span style={{ color:C.text.p, fontWeight:600, width:160 }}>{d}</span>
                  <span style={{ color:C.text.m }}>{f} · {p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Type legend */}
        <div style={{ padding:"12px 16px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.bg.border}` }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.text.m, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.1em" }}>Leyenda de tipos de sección</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {Object.entries(TypeLabel).map(([k,v])=><Tag key={k} c={TypeColor[k]}>{v}</Tag>)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ================================================================
// TAB 1 — 8 HERRAMIENTAS
// ================================================================
const HerramientasTab = () => {
  const [sel, setSel] = useState(0);
  const t = TOOLS[sel];

  return (
    <div>
      {/* Tool selector */}
      <div style={{ display:"flex", gap:4, marginBottom:20, flexWrap:"wrap" }}>
        {TOOLS.map((tool,i)=>(
          <button key={tool.id} onClick={()=>setSel(i)} style={{
            padding:"7px 14px", borderRadius:C.r.pill,
            background:sel===i?tool.color:C.bg.raised,
            border:`1px solid ${sel===i?tool.color:C.bg.border}`,
            color:sel===i?"#000":C.text.s, fontSize:12, fontWeight:sel===i?700:500,
            cursor:"pointer", transition:"all 0.15s",
          }}>
            {tool.icon} {tool.num}. {tool.name}
          </button>
        ))}
      </div>

      {/* Tool detail */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, alignItems:"start" }}>
        {/* Sections list */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:36, height:36, borderRadius:C.r.md, background:t.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{t.icon}</div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:C.text.p }}>{t.num}. {t.name}</div>
              <div style={{ fontSize:12, color:C.text.s }}>{t.tagline}</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:11, background:`${t.color}15`, color:t.color, padding:"4px 10px", borderRadius:C.r.pill, fontWeight:700 }}>
              {t.sections.length} secciones
            </div>
          </div>

          {t.sections.map((s,i)=>(
            <div key={s.id} style={{
              display:"flex", gap:12, padding:"14px 16px", marginBottom:6,
              background:s.type==="ai"?C.violetG:s.auto?C.voltG:C.bg.raised,
              borderRadius:C.r.lg,
              border:`1px solid ${s.type==="ai"?C.violet+"30":s.auto?C.volt+"25":C.bg.border}`,
            }}>
              <div style={{ width:28, height:28, borderRadius:C.r.sm, background:C.bg.base, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:C.text.p }}>{i+1}. {s.name}</span>
                  <Tag c={TypeColor[s.type]}>{TypeLabel[s.type]}</Tag>
                  {s.auto && <Tag c={C.volt}>Auto-update</Tag>}
                </div>
                <div style={{ fontSize:11, color:C.text.s, lineHeight:1.65 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right panel: meta info */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ padding:"14px 16px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${t.color}25` }}>
            <div style={{ fontSize:10, fontWeight:700, color:t.color, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Datos de entrada</div>
            <div style={{ fontSize:12, color:C.text.s, lineHeight:1.7 }}>{t.inputs}</div>
          </div>

          <div style={{ padding:"14px 16px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.success}25` }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.success, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Produce / Outputs</div>
            <div style={{ fontSize:12, color:C.text.s, lineHeight:1.7 }}>{t.produces}</div>
          </div>

          {t.feedsTo.length > 0 && (
            <div style={{ padding:"14px 16px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.info}25` }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.info, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Alimenta a</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {t.feedsTo.map(n=>{
                  const target = TOOLS.find(x=>x.num===n);
                  return <Tag key={n} c={target.color}>{target.icon} {target.name}</Tag>;
                })}
              </div>
            </div>
          )}

          {t.autoUpdateable.length > 0 && (
            <div style={{ padding:"14px 16px", background:C.voltG, borderRadius:C.r.lg, border:`1px solid ${C.volt}25` }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.volt, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>⚡ Secciones auto-actualizables</div>
              {t.autoUpdateable.map(a=><div key={a} style={{ fontSize:11, color:C.text.s, padding:"2px 0" }}>→ {a}</div>)}
            </div>
          )}

          <div style={{ padding:"14px 16px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.bg.border}` }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.text.m, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Herramientas globales de ref.</div>
            {t.globalRef.map(r=>(
              <div key={r} style={{ fontSize:11, color:C.text.s, padding:"2px 0", borderBottom:`1px solid ${C.bg.border}` }}>→ {r}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ================================================================
// TAB 2 — LANDING PAGE
// ================================================================
const LandingTab = () => (
  <div>
    <div style={{ fontSize:12, color:C.text.s, marginBottom:20, lineHeight:1.7 }}>
      La landing page es el punto de entrada para desarrolladores inmobiliarios, constructores, arquitectos, propietarios de terrenos, brokers e inversionistas en México. Objetivo: conversión a registro gratuito.
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
      {LANDING_SECTIONS.map((s,i)=>(
        <div key={s.id} style={{ padding:"14px 16px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${s.priority==="P0"?C.volt+"25":C.bg.border}` }}>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
            <span style={{ fontSize:18 }}>{s.icon}</span>
            <span style={{ fontSize:13, fontWeight:700, color:C.text.p }}>{i+1}. {s.name}</span>
            <Tag c={s.priority==="P0"?C.volt:s.priority==="P1"?C.text.s:C.text.m}>{s.priority}</Tag>
          </div>
          <div style={{ fontSize:11, color:C.text.s, lineHeight:1.65 }}>{s.content}</div>
        </div>
      ))}
    </div>
  </div>
);

// ================================================================
// TAB 3 — BRIEF PARA CLAUDE
// ================================================================
const BriefTab = () => {
  const brief = `# creaConstruye — Brief Completo para Claude Design
## Documento autocontenido · No requiere contexto adicional

---

## 1. QUÉ ES LA PLATAFORMA

creaConstruye es la primera plataforma de elaboración de Proformas Inmobiliarias con IA para el mercado mexicano. Permite a desarrolladores, arquitectos, constructores e inversionistas generar un estudio de factibilidad profesional completo — normalmente 3 semanas de trabajo manual — en horas.

La plataforma tiene DOS PARTES:
- **creaConstruye.com** (landing page pública): marketing, conversión, blog
- **app.creaconstruye.com** (plataforma): la herramienta SaaS con las 8 herramientas de proforma

---

## 2. DESIGN SYSTEM

**Paleta de colores:**
- bg.base: #0C0C0E | bg.surface: #131316 | bg.raised: #1C1C21 | bg.border: #2E2E38
- VOLT #C8FF00 — el color firma. Solo en el dato más importante por card. Texto sobre volt: #000000
- VIOLET #8B5CF6 — exclusivo para Claude AI y análisis inteligentes
- success: #22C55E | warning: #F59E0B | danger: #FF3B3B
- text.primary: #F4F4F5 | text.secondary: #A1A1AA | text.muted: #52525B

**Tipografía:** Geist / Inter para UI. JetBrains Mono para TODOS los valores numéricos.
**Radius:** cards 12px, botones 8px, pills 999px.
**Sombras:** glow en volt: 0 0 16px rgba(200,255,0,0.3). Glow en violet: 0 0 16px rgba(139,92,246,0.3).

---

## 3. ARQUITECTURA DE LA PLATAFORMA

### Shell (siempre visible en la plataforma)

**TOP BAR** — 48px:
- Project Switcher: dropdown con todos los proyectos del usuario
- Selector muestra: [ícono] Nombre del proyecto ▾ | badge "3/8 tools"
- Botón + Nuevo Proyecto
- Notificaciones (campana con badge de auto-updates)
- Avatar del usuario

**SIDEBAR** — 220px collapsed 64px:
- Logo creaConstruye
- Nombre del proyecto activo
- Nav items (8 herramientas + Dashboard + Reportes + Config)
- Progress bar al fondo: X/8 herramientas completadas
- Sidebar item activo: border-left 2px violet + bg violet ghost

---

## 4. LAS 8 HERRAMIENTAS — SECCIONES COMPLETAS

### HERRAMIENTA 1: TERRENO (7 secciones)
1. Localización — Formulario: dirección autocomplete, coordenadas, superficie, precio, tipo
2. Scoring de Ubicación — Score 0-10 ponderado. RadialBarChart. AUTO-UPDATE
3. Servicios y Equipamiento — Tabla de amenidades con distancias
4. Valoración Comparativa — Precio/m² de terrenos similares. AUTO-UPDATE
5. Alertas y Restricciones — RPP, CENAPRED, ambiental. AUTO-UPDATE
6. Due Diligence Checklist — 20-30 puntos por municipio (CDMX/Edomex/otros)
7. Análisis AI + Decisión — Claude: COMPRAR / NEGOCIAR / NO COMPRAR

### HERRAMIENTA 2: ZONIFICACIÓN (6 secciones)
1. Datos Catastrales — Clave catastral, municipio, zona detectada
2. Parámetros Regulatorios — COS, CUS, altura, setbacks. Tabla con semáforo
3. Envolvente Construible — Cálculo + visualización SVG isométrica
4. Verificación de Cumplimiento — Checklist proyecto vs. regulación
5. Trámites y Permisos — Lista con costo, tiempo, docs, portal, status
6. Análisis AI + Decisión — Claude interpreta regulaciones y alerta si requiere cambio de uso

### HERRAMIENTA 3: MERCADO (8 secciones)
1. Definición del Producto — # unidades, m², tipo, segmento, precio objetivo
2. Mapa de Comparables — Mapbox con pins de competidores. AUTO-UPDATE
3. Tabla de Comparables — Sorteable con todos los datos. AUTO-UPDATE
4. Tendencia de Precios — Histórico 5 años + proyección. AUTO-UPDATE
5. Análisis de Absorción — Velocidad zona, meses para vender. AUTO-UPDATE
6. Perfil del Comprador — Demografía, ingresos, motivación
7. Análisis de Competencia — Pipeline, saturación. AUTO-UPDATE
8. Análisis AI + Producto — Reporte de mercado completo, precio/m² recomendado

### HERRAMIENTA 4: COSTOS (8 secciones)
1. Parámetros de Construcción — m², niveles, estructura, acabados
2. Presupuesto por Partidas — Tabla expandible: capítulo → concepto → precio unitario
3. Costos Blandos — Diseño, permisos, gerencia, comercialización
4. Resumen de Inversión — Terreno + Directos + Blandos + Contingencia = Total
5. Comparativa de Escenarios — Económico / Medio / Premium
6. Escalamiento Proyectado — Inflación materiales INPP. AUTO-UPDATE
7. Optimizaciones AI — Claude: 3-5 optimizaciones con ahorro cuantificado
8. Análisis AI + Validación — Claude valida vs. benchmarks BIMSA

### HERRAMIENTA 5: FINANCIERO (9 secciones)
1. Estructura de Inversión — Fuentes: crédito + capital propio
2. Supuestos de Venta — Precio, absorción, preventa, comisiones
3. Flujo de Caja Mensual — Recharts ComposedChart × 3 escenarios
4. Punto de Equilibrio — Mes donde flujo acumulado = 0
5. Simulación Monte Carlo — 1K-10K iteraciones, histograma de utilidades
6. Análisis de Sensibilidad — Tornado chart de variables
7. Estados Financieros — P&L del proyecto
8. Análisis AI + Validación — Claude narra el modelo completo
9. Actualización de Tasas — TIIE/CETES auto-update Banxico. AUTO-UPDATE

### HERRAMIENTA 6: ROI (7 secciones)
1. Métricas Principales — 6 tarjetas: ROI, TIR, VAN, CAP Rate, Cash-on-Cash, Payback
2. Comparativa de Escenarios — Pesimista/Base/Optimista con probabilidades
3. Benchmark de Mercado — Percentil vs. CETES, Fibras, sector. AUTO-UPDATE
4. Análisis de Sensibilidad — Tornado chart impacto en TIR
5. Estrategias de Salida — Venta / Renta / Mixto comparadas
6. Optimizaciones AI — Claude: top 3 mejoras en puntos de TIR
7. Análisis AI + Veredito — ATRACTIVO / MARGINAL / NO ATRACTIVO

### HERRAMIENTA 7: CRONOGRAMA (7 secciones)
1. Fases y Actividades — WBS auto-generado por AI, editable
2. Diagrama de Gantt — Interactivo, scroll horizontal, zoom
3. Ruta Crítica — Actividades en rojo, holguras en gris
4. Hitos y Desembolsos — Timeline con fechas y montos vinculados
5. Análisis PERT — Probabilidades por actividad crítica
6. Factores de Ajuste — Clima, complejidad, experiencia
7. Análisis AI + Optimización — Claude identifica cuellos de botella

### HERRAMIENTA 8: RIESGOS + GO/NO-GO (8 secciones)
1. Identificación de Riesgos — AI + catálogo 200+ riesgos. AUTO-UPDATE (macro)
2. Matriz de Riesgos — Scatter plot probabilidad × impacto
3. Catálogo de Riesgos — Tabla top 10-20 con detalle completo
4. Plan de Mitigación — Acciones, costos, ROI por mitigación
5. Correlaciones y Cascada — Escenarios combinados "tormenta perfecta"
6. Value at Risk — VaR 95% + CVaR con/sin mitigaciones
7. Panel GO / NO-GO — EL COMPONENTE MÁS IMPORTANTE. Semáforo grande + confianza %
8. Reporte Exportable — PDF 15-20 págs + Excel + PPT

---

## 5. PÁGINAS ADICIONALES DE LA PLATAFORMA

### Dashboard del Proyecto
- Header: nombre, municipio, tipo, fecha, badge de progreso
- 8 círculos de estado de herramientas
- KPIs consolidados (score terreno, precio objetivo, inversión total, TIR, duración, riesgo)
- Log de actividad (cambios propios + auto-updates)
- Alertas pendientes
- Acceso rápido

### Reportes y Exportación
- Proforma completa (preview + export)
- Estudio de mercado standalone
- Reporte ejecutivo 1-pager
- Memorándum de inversión
- Historial de versiones

### Configuración del Proyecto
- Datos del proyecto (editar)
- Colaboradores (invitar con roles: Propietario/Editor/Viewer)
- Notificaciones
- Contexto del proyecto para Claude

---

## 6. PATRONES UX CLAVE

**Project Switcher:** El selector de proyecto vive en el top bar, siempre visible. Al cambiar → todas las herramientas cargan los datos de ese proyecto. URL: /app/[project-id]/[tool-slug]

**Estado persistente:** Cada campo se auto-guarda. Al regresar, el usuario ve exactamente lo que dejó. Los campos auto-actualizables muestran badge "⚡ Actualizado" con la fecha.

**Contexto de Claude:** Cada proyecto tiene un context_summary en base de datos. Se incluye en el system prompt de cada llamada a Claude → no pierde contexto entre sesiones.

**Cada herramienta tiene estructura:** Header (nombre + proyecto + % completo + última actualización) → Secciones → Panel AI → Estado + Siguiente paso

**Tipos de sección:** Entrada (volt), Cálculo (info blue), Datos (secundario), Mercado (violet), Legal (warning), AI·Claude (violet con borde especial), Auto (volt pulsante)

---

## 7. LANDING PAGE — SECCIONES EN ORDEN

1. Nav (P0): Logo + links + CTA "Empezar Gratis"
2. Hero (P0): Headline poderosa + subheadline + CTA + visual del dashboard
3. Prueba social (P1): # proyectos evaluados + logos
4. El problema (P0): Manual/lento/caro → antes vs. después
5. La solución (P0): creaConstruye en 3 pasos simples
6. Cómo funciona (P0): Flujo visual 3 pasos
7. Las 8 herramientas (P0): Grid con íconos custom + descripción
8. Caso de estudio (P1): Naucalpan con datos reales (TIR 24.5%, GO 91%)
9. Comparativa (P1): vs. Excel manual vs. Despacho consultoría
10. Para quién (P1): 6 perfiles de usuario
11. Testimonios (P2): Quotes early adopters
12. Precios (P0): 3 planes (Starter gratis / Pro $799 / Enterprise)
13. FAQ (P1): 8-10 preguntas en acordeón
14. CTA final (P0): "Evalúa tu primer terreno gratis"
15. Footer (P0): Links + legal + "Hecho en México 🇲🇽"

---

## 8. STACK TECNOLÓGICO

- Framework: Next.js 14 (App Router)
- UI: shadcn/ui + Tailwind CSS
- Charts: Recharts
- Mapas: Mapbox GL JS
- Animaciones: Framer Motion
- Base de datos: Supabase (PostgreSQL + RLS + Realtime)
- Edge Functions: Supabase Deno
- AI: Claude API (Anthropic) con streaming
- Deploy: Vercel
- PDF Export: react-pdf / Puppeteer

---

## 9. USUARIOS OBJETIVO

- Desarrolladores inmobiliarios (PyME: 1-10 proyectos/año)
- Constructores que quieren evaluar antes de proponer
- Arquitectos que necesitan validar la viabilidad financiera
- Propietarios de terrenos que quieren saber si pueden desarrollar
- Brokers que necesitan argumentos de valor para sus clientes
- Inversionistas privados que evalúan proyectos

Mercado piloto: Naucalpan, Edomex. Expansión: CDMX, Nuevo León, Querétaro, Quintana Roo.`;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, letterSpacing:"-0.02em" }}>Brief Completo para Claude Design</div>
          <div style={{ fontSize:12, color:C.text.s, marginTop:2 }}>Autocontenido · Copia y pega al inicio de la sesión en Claude Design</div>
        </div>
        <div style={{ padding:"8px 16px", borderRadius:C.r.md, background:C.volt, fontSize:12, fontWeight:800, color:"#000", cursor:"pointer" }}>
          Copiar todo
        </div>
      </div>
      <div style={{ padding:"20px 24px", background:C.bg.raised, borderRadius:C.r.xl, border:`1px solid ${C.bg.border}`, fontFamily:C.font.mono, fontSize:11, color:C.text.s, lineHeight:1.85, whiteSpace:"pre-wrap", maxHeight:600, overflowY:"auto" }}>
        {brief}
      </div>
      <div style={{ marginTop:12, padding:"10px 14px", background:`${C.volt}10`, borderRadius:C.r.md, border:`1px solid ${C.volt}25`, fontSize:11, color:C.text.s }}>
        <span style={{ color:C.volt, fontWeight:700 }}>★ Instrucción de uso: </span>
        Al abrir una sesión de Claude Design, pegar este brief primero y decir: <span style={{ fontFamily:C.font.mono, color:C.volt }}>"Con este contexto, diseña [componente específico]"</span>. Claude tendrá todo el contexto sin necesitar preguntar nada.
      </div>
    </div>
  );
};

// ================================================================
// APP
// ================================================================
export default function SitemapBrief() {
  const [tab, setTab] = useState(0);
  const PANELS = [Arquitectura, HerramientasTab, LandingTab, BriefTab];
  const Panel = PANELS[tab];

  return (
    <div style={{ fontFamily:C.font.sans, background:C.bg.base, minHeight:"100vh", color:C.text.p }}>
      {/* Header */}
      <div style={{ background:C.bg.surface, borderBottom:`1px solid ${C.bg.border}`, padding:"0 20px", display:"flex", alignItems:"center", height:48, position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:24, borderRadius:6, background:C.volt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#000" }}>C</div>
          <span style={{ fontSize:13, fontWeight:800 }}>crea<span style={{ color:C.volt }}>Construye</span></span>
          <span style={{ fontSize:10, color:C.text.m, borderLeft:`1px solid ${C.bg.border}`, paddingLeft:10 }}>Sitemap + Brief · Versión 1.0</span>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          <span style={{ fontSize:10, color:C.text.m }}>8 herramientas</span>
          <span style={{ fontSize:10, color:C.bg.border }}>·</span>
          <span style={{ fontSize:10, color:C.text.m }}>50+ secciones</span>
          <span style={{ fontSize:10, color:C.bg.border }}>·</span>
          <span style={{ fontSize:10, color:C.volt }}>autocontenido para Claude Design</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom:`1px solid ${C.bg.border}`, background:C.bg.surface, display:"flex" }}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)} style={{
            flex:1, padding:"13px 8px", background:"transparent", border:"none",
            borderBottom:tab===i?`2px solid ${C.volt}`:"2px solid transparent",
            color:tab===i?C.volt:C.text.m,
            fontSize:13, fontWeight:tab===i?700:500, cursor:"pointer", transition:"all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding:"28px 24px 80px" }}>
        <Panel/>
      </div>
    </div>
  );
}
