import { useState } from "react";

// ================================================================
// creaConstruye — DESIGN SYSTEM v2.0
// Graphite Industrial + Volt + Violet AI
// ================================================================

const DS = {
  // ── COLORES ─────────────────────────────────────────────────
  bg: {
    base:    "#0C0C0E",  // Página — carbón neutro cálido
    surface: "#131316",  // Sidebar, topbar
    raised:  "#1C1C21",  // Cards, panels
    hover:   "#222228",  // Hover states
    active:  "#2A2A32",  // Active/pressed
    border:  "#2E2E38",  // Todos los bordes
    input:   "#0F0F12",  // Campos de entrada
    overlay: "#0C0C0ECC", // Modal backdrop
  },
  volt:     "#C8FF00",  // ★ SIGNATURE — el color que define todo
  voltSub:  "#D4FF33",  // Volt hover
  voltDim:  "#8FB800",  // Volt dimmed
  voltGhost:"#C8FF0015", // Volt ghost bg
  violet:   "#8B5CF6",  // AI accent
  violetSub:"#A78BFA",  // Violet light
  violetDim:"#6D28D9",  // Violet dark
  violetGhost:"#8B5CF615",
  success:  "#22C55E",
  warning:  "#F59E0B",
  danger:   "#FF3B3B",
  info:     "#38BDF8",
  text: {
    primary:   "#F4F4F5",
    secondary: "#A1A1AA",
    muted:     "#52525B",
    disabled:  "#3F3F46",
    volt:      "#C8FF00",
    violet:    "#A78BFA",
    onVolt:    "#000000",
  },
  chart: ["#C8FF00","#8B5CF6","#FF6430","#22C55E","#38BDF8","#F59E0B","#FF3B3B","#A78BFA"],

  // ── TIPOGRAFÍA ───────────────────────────────────────────────
  font: {
    sans: "'Geist', 'Inter', system-ui, sans-serif",
    mono: "'Geist Mono', 'JetBrains Mono', monospace",
  },

  // ── RADIO ───────────────────────────────────────────────────
  r: { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, pill: 999 },

  // ── SOMBRAS ─────────────────────────────────────────────────
  shadow: {
    card:      "0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
    voltFocus: "0 0 0 3px rgba(200,255,0,0.2)",
    voltGlow:  "0 0 16px rgba(200,255,0,0.3)",
    violetGlow:"0 0 16px rgba(139,92,246,0.3)",
  },
};

// ── PRIMITIVOS ──────────────────────────────────────────────────
const Label = ({ c }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: DS.text.muted, marginBottom: 14, marginTop: 28, paddingBottom: 6, borderBottom: `1px solid ${DS.bg.border}` }}>{c}</div>
);
const Row = ({ k, v, mono }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "5px 0", borderBottom: `1px solid ${DS.bg.border}15` }}>
    <span style={{ fontSize: 11, color: DS.text.muted, width: 200, flexShrink: 0 }}>{k}</span>
    <span style={{ fontSize: 11, fontFamily: mono ? DS.font.mono : DS.font.sans, color: DS.text.secondary }}>{v}</span>
  </div>
);

// ── COMPONENTES LIVE ────────────────────────────────────────────
const Swatch = ({ hex, name, token, star }) => (
  <div>
    <div style={{ height: 44, borderRadius: DS.r.md, background: hex, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 5, boxShadow: star ? DS.shadow.voltGlow : "none" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {star && <span style={{ color: DS.volt, fontSize: 10 }}>★</span>}
      <span style={{ fontSize: 11, fontWeight: star ? 700 : 500, color: star ? DS.volt : DS.text.primary }}>{name}</span>
    </div>
    <span style={{ fontSize: 10, fontFamily: DS.font.mono, color: DS.text.muted, display: "block" }}>{hex}</span>
    {token && <span style={{ fontSize: 9, fontFamily: DS.font.mono, color: DS.text.muted, opacity: 0.6 }}>{token}</span>}
  </div>
);

const BtnPrimary = ({ children }) => (
  <button style={{ padding: "10px 22px", borderRadius: DS.r.md, background: DS.volt, border: "none", fontSize: 12, fontWeight: 800, color: DS.text.onVolt, cursor: "pointer", fontFamily: DS.font.sans, letterSpacing: "0.02em" }}>{children}</button>
);
const BtnSecondary = ({ children }) => (
  <button style={{ padding: "10px 22px", borderRadius: DS.r.md, background: DS.violetGhost, border: `1px solid ${DS.violet}50`, fontSize: 12, fontWeight: 700, color: DS.violetSub, cursor: "pointer", fontFamily: DS.font.sans }}>{children}</button>
);
const BtnGhost = ({ children }) => (
  <button style={{ padding: "10px 22px", borderRadius: DS.r.md, background: "transparent", border: `1px solid ${DS.bg.border}`, fontSize: 12, fontWeight: 600, color: DS.text.secondary, cursor: "pointer", fontFamily: DS.font.sans }}>{children}</button>
);
const BtnDanger = ({ children }) => (
  <button style={{ padding: "10px 22px", borderRadius: DS.r.md, background: `${DS.danger}15`, border: `1px solid ${DS.danger}40`, fontSize: 12, fontWeight: 700, color: DS.danger, cursor: "pointer", fontFamily: DS.font.sans }}>{children}</button>
);

const Pill = ({ label, color }) => (
  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px", borderRadius: DS.r.xs, border: `1px solid ${color}40`, background: `${color}12`, color, fontFamily: DS.font.sans }}>{label}</span>
);

const CardBox = ({ children, glow, style }) => (
  <div style={{ background: DS.bg.raised, border: `1px solid ${glow === "volt" ? DS.volt+"28" : glow === "violet" ? DS.violet+"28" : DS.bg.border}`, borderRadius: DS.r.lg, padding: "16px 20px", boxShadow: DS.shadow.card, ...style }}>{children}</div>
);

const MiniBar = ({ pct, color }) => (
  <div style={{ height: 4, background: DS.bg.border, borderRadius: DS.r.pill }}>
    <div style={{ height: 4, width: `${pct}%`, background: color, borderRadius: DS.r.pill }} />
  </div>
);

// ================================================================
// SECCIONES
// ================================================================
const sections = ["Filosofía", "Tokens", "Colores", "Tipografía", "Componentes", "Layouts", "Data & Maps", "AI Patterns", "Motion", "Quick Ref"];

const Filosofia = () => (
  <div>
    <p style={{ fontSize: 14, color: DS.text.secondary, lineHeight: 1.8, margin: "0 0 24px" }}>
      creaConstruye es la primera plataforma de proformas inmobiliarias con IA para México.<br/>
      Su diseño no puede parecer otro SaaS. Debe sentirse como la herramienta de quienes van un paso adelante.
    </p>

    <Label c="Referentes visuales" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {[
        { brand: "NVIDIA", why: "El Volt viene de su amarillo-verde. Señala energía, GPU, precisión de cómputo." },
        { brand: "SpaceX", why: "Oscuro + texto blanco limpio + un solo acento brillante. Seriedad con tecnología extrema." },
        { brand: "Vercel", why: "El negro/grafito como fondo premium, tipografía Geist, interfaces densas y funcionales." },
      ].map(r => (
        <div key={r.brand} style={{ padding: "14px", background: DS.bg.raised, borderRadius: DS.r.lg, border: `1px solid ${DS.bg.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: DS.volt, marginBottom: 6 }}>{r.brand}</div>
          <div style={{ fontSize: 11, color: DS.text.secondary, lineHeight: 1.65 }}>{r.why}</div>
        </div>
      ))}
    </div>

    <Label c="Los 5 principios" />
    {[
      ["Datos primero", "Los números son los protagonistas. El diseño sirve para que ROI, TIR, precios y riesgos sean legibles en un vistazo. Ningún elemento visual sin información detrás."],
      ["Un solo acento", "El Volt #C8FF00 aparece en UN dato por tarjeta — el más importante. Si todo brilla, nada brilla."],
      ["AI con identidad propia", "El output de Claude tiene su propio lenguaje visual (violet, panel diferenciado). El usuario siempre sabe si está leyendo datos o inteligencia artificial."],
      ["Silencio calculado", "Los fondos son oscuros y silenciosos para que los datos hablen. No hay decoración que no transmita información."],
      ["Confianza institucional", "Los desarrolladores presentan proformas a bancos. El diseño proyecta rigor, precisión y profesionalismo — no startup casual."],
    ].map(([t, d]) => (
      <div key={t} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <div style={{ width: 4, borderRadius: DS.r.pill, background: DS.volt, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: DS.text.primary, marginBottom: 3 }}>{t}</div>
          <div style={{ fontSize: 12, color: DS.text.secondary, lineHeight: 1.65 }}>{d}</div>
        </div>
      </div>
    ))}

    <Label c="Personalidad — es vs no es" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ background: `${DS.success}10`, border: `1px solid ${DS.success}25`, borderRadius: DS.r.lg, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: DS.success, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>✓ Es</div>
        {["Oscuro + carbón cálido","Volt solo en lo más importante","Tablas densas y legibles","Mono para todos los números","Animaciones funcionales, no decorativas","Profesional como Bloomberg","Inesperado para proptech"].map(i => (
          <div key={i} style={{ fontSize: 12, color: DS.text.secondary, padding: "3px 0" }}>→ {i}</div>
        ))}
      </div>
      <div style={{ background: `${DS.danger}10`, border: `1px solid ${DS.danger}25`, borderRadius: DS.r.lg, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: DS.danger, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>✗ No es</div>
        {["Azul corporativo genérico","Gradientes decorativos","Colores pastel o tierra","Whitespace vacío sin razón","Serif editorial","SaaS B2C casual","Igual que la competencia"].map(i => (
          <div key={i} style={{ fontSize: 12, color: DS.text.muted, padding: "3px 0", textDecoration: "line-through" }}>✗ {i}</div>
        ))}
      </div>
    </div>
  </div>
);

const Tokens = () => (
  <div>
    <p style={{ fontSize: 13, color: DS.text.secondary, margin: "0 0 20px", lineHeight: 1.7 }}>
      Los tokens son el lenguaje del sistema. Nunca usar valores hex directos en el código — siempre el token. Así un cambio de tema afecta todo de un golpe.
    </p>
    <Label c="Tokens de color — referencia completa" />
    <div style={{ fontFamily: DS.font.mono, fontSize: 11 }}>
      {[
        ["─── FONDOS ─────────────────────────────────────────","","",""],
        ["bg.base",      DS.bg.base,    "Fondo de página","Fondo más oscuro"],
        ["bg.surface",   DS.bg.surface, "Sidebar, topbar","Superficie secundaria"],
        ["bg.raised",    DS.bg.raised,  "Cards, modales","Superficie elevada"],
        ["bg.hover",     DS.bg.hover,   "Hover de cualquier elemento",""],
        ["bg.active",    DS.bg.active,  "Estado pressed / selected",""],
        ["bg.border",    DS.bg.border,  "Bordes de cards, dividers",""],
        ["bg.input",     DS.bg.input,   "Fondo de inputs",""],
        ["─── ACCENTS ────────────────────────────────────────","","",""],
        ["volt",         DS.volt,       "★ PRIMARY — datos clave, CTAs","Solo 1 por tarjeta"],
        ["voltSub",      DS.voltSub,    "Volt hover",""],
        ["voltDim",      DS.voltDim,    "Volt secundario","En barras de progreso"],
        ["voltGhost",    DS.voltGhost,  "Volt bg sutil","En cards de énfasis"],
        ["violet",       DS.violet,     "AI accent — todo lo de Claude","Panels de análisis AI"],
        ["violetSub",    DS.violetSub,  "Violet claro","Texto en bg violet"],
        ["violetGhost",  DS.violetGhost,"Violet bg sutil",""],
        ["─── SEMÁNTICOS ─────────────────────────────────────","","",""],
        ["success",      DS.success,    "GO, valores positivos",""],
        ["warning",      DS.warning,    "Alerta, CONDICIONAL",""],
        ["danger",       DS.danger,     "NO-GO, error crítico",""],
        ["info",         DS.info,       "Información",""],
        ["─── TEXTO ──────────────────────────────────────────","","",""],
        ["text.primary",   DS.text.primary,   "Títulos, datos numéricos",""],
        ["text.secondary", DS.text.secondary, "Body, labels, descripciones",""],
        ["text.muted",     DS.text.muted,     "Metadata, placeholders",""],
        ["text.disabled",  DS.text.disabled,  "Elementos deshabilitados",""],
        ["text.volt",      DS.text.volt,      "Texto sobre bg oscuro, links",""],
        ["text.violet",    DS.text.violet,    "Texto AI, etiquetas violet",""],
        ["text.onVolt",    DS.text.onVolt,    "Texto SOBRE el volt (#000)",""],
      ].map(([k, hex, desc, note]) => (
        k.startsWith("─") ? (
          <div key={k} style={{ fontSize: 9, color: DS.text.muted, padding: "10px 0 4px", opacity: 0.5 }}>{k}</div>
        ) : (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0", borderBottom: `1px solid ${DS.bg.border}20` }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: hex, border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }} />
            <span style={{ width: 160, color: hex === DS.volt ? DS.volt : DS.text.secondary, fontWeight: hex === DS.volt ? 700 : 400 }}>{k}</span>
            <span style={{ width: 80, color: DS.text.muted }}>{hex}</span>
            <span style={{ color: DS.text.muted, fontFamily: DS.font.sans }}>{desc}</span>
            {note && <span style={{ color: DS.text.muted, opacity: 0.5, fontFamily: DS.font.sans }}>· {note}</span>}
          </div>
        )
      ))}
    </div>

    <Label c="Tokens de espaciado" />
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {[[1,4,"Gap mínimo"],[2,8,"Gap pequeño"],[3,12,"Padding inline"],[4,16,"Padding card"],[5,20,"Padding sección"],[6,24,"Gap entre cards"],[8,32,"Sección a sección"],[10,40,"Sección mayor"],[12,48,"Hero padding"],[16,64,"Espaciado XL"]].map(([s,px,use]) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, fontFamily: DS.font.mono, color: DS.text.muted, width: 50 }}>space-{s}</span>
          <span style={{ fontSize: 10, fontFamily: DS.font.mono, color: DS.volt, width: 40 }}>{px}px</span>
          <div style={{ height: 8, width: px, background: DS.volt, opacity: 0.6, borderRadius: 2, maxWidth: 200 }} />
          <span style={{ fontSize: 10, color: DS.text.muted }}>{use}</span>
        </div>
      ))}
    </div>

    <Label c="Tokens de radio" />
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {[["xs",4,"Tags, chips"],["sm",6,"Inputs pequeños"],["md",8,"Botones, inputs"],["lg",12,"Cards"],["xl",16,"Modales"],["pill",999,"Badges, pills"]].map(([n,r,u]) => (
        <div key={n} style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: `2px solid ${DS.volt}60`, borderRadius: r, margin: "0 auto 6px" }} />
          <div style={{ fontSize: 10, fontFamily: DS.font.mono, color: DS.text.secondary }}>r-{n}</div>
          <div style={{ fontSize: 9, color: DS.text.muted }}>{r}px</div>
          <div style={{ fontSize: 9, color: DS.text.muted, marginTop: 2 }}>{u}</div>
        </div>
      ))}
    </div>
  </div>
);

const Colores = () => (
  <div>
    <Label c="Paleta de fondos — layered dark system" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
      {[
        [DS.bg.base, "bg.base", "#0C0C0E", "Página"],
        [DS.bg.surface, "bg.surface", "#131316", "Sidebar/top"],
        [DS.bg.raised, "bg.raised", "#1C1C21", "Cards"],
        [DS.bg.hover, "bg.hover", "#222228", "Hover"],
        [DS.bg.active, "bg.active", "#2A2A32", "Active"],
        [DS.bg.border, "bg.border", "#2E2E38", "Bordes"],
        [DS.bg.input, "bg.input", "#0F0F12", "Inputs"],
      ].map(([hex, name, h, d]) => (
        <div key={name}>
          <div style={{ height: 40, borderRadius: DS.r.md, background: hex, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }} />
          <div style={{ fontSize: 10, fontFamily: DS.font.mono, color: DS.text.secondary }}>{name}</div>
          <div style={{ fontSize: 9, fontFamily: DS.font.mono, color: DS.text.muted }}>{h}</div>
          <div style={{ fontSize: 9, color: DS.text.muted }}>{d}</div>
        </div>
      ))}
    </div>

    <Label c="★ Volt — el color que define todo" />
    <div style={{ padding: "20px", background: `${DS.volt}10`, border: `2px solid ${DS.volt}30`, borderRadius: DS.r.lg, marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {[[DS.volt,"volt","#C8FF00","PRIMARY ★"],[DS.voltSub,"voltSub","#D4FF33","Hover"],[DS.voltDim,"voltDim","#8FB800","Dimmed"],[DS.voltGhost,"voltGhost","bg sutil","Ghost"]].map(([hex, n, h, d]) => (
          <div key={n}>
            <div style={{ width: 48, height: 48, borderRadius: DS.r.md, background: hex, border: "1px solid rgba(255,255,255,0.1)", marginBottom: 4 }} />
            <div style={{ fontSize: 10, fontFamily: DS.font.mono, color: DS.text.secondary }}>{n}</div>
            <div style={{ fontSize: 9, fontFamily: DS.font.mono, color: DS.text.muted }}>{h}</div>
            <div style={{ fontSize: 9, color: n === "volt" ? DS.volt : DS.text.muted, fontWeight: n === "volt" ? 700 : 400 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: DS.text.secondary, lineHeight: 1.7 }}>
        <span style={{ color: DS.volt, fontWeight: 700 }}>Regla de uso:</span> El Volt aparece en exactamente UN valor por tarjeta — el dato más importante. En botones primarios, el fondo es volt con texto negro (#000). En datos, solo el número es volt. Nunca dos elementos volt a la misma jerarquía visual.
      </div>
    </div>

    <Label c="Violet AI — solo para Claude" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
      {[[DS.violet,"violet","#8B5CF6"],[DS.violetSub,"violetSub","#A78BFA"],[DS.violetDim,"violetDim","#6D28D9"],[DS.violetGhost,"violetGhost","ghost bg"]].map(([hex, n, h]) => (
        <Swatch key={n} hex={hex} name={n} token={h} />
      ))}
    </div>

    <Label c="Semánticos" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
      {[[DS.success,"success","GO, positivo"],[DS.warning,"warning","CONDICIONAL"],[DS.danger,"danger","NO-GO, error"],[DS.info,"info","Información"]].map(([hex, n, d]) => (
        <div key={n}>
          <div style={{ height: 40, borderRadius: DS.r.md, background: hex, marginBottom: 4 }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: DS.text.primary }}>{n}</div>
          <div style={{ fontSize: 9, fontFamily: DS.font.mono, color: DS.text.muted }}>{hex}</div>
          <div style={{ fontSize: 9, color: DS.text.muted }}>{d}</div>
        </div>
      ))}
    </div>
  </div>
);

const Tipografia = () => (
  <div>
    <Label c="Fuentes" />
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { name: "Geist / Inter", role: "Display + UI", sample: "ROI 24.5%", family: DS.font.sans, note: "Toda la interfaz, títulos, body" },
        { name: "Geist Mono / JetBrains Mono", role: "Datos + Código", sample: "$8,420/m²", family: DS.font.mono, note: "TODOS los números financieros" },
      ].map(f => (
        <div key={f.name} style={{ display: "flex", gap: 16, padding: "16px 20px", background: DS.bg.raised, borderRadius: DS.r.lg, border: `1px solid ${DS.bg.border}`, alignItems: "center" }}>
          <div style={{ fontSize: 36, fontFamily: f.family, fontWeight: 800, color: DS.volt, minWidth: 120 }}>{f.sample}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: DS.text.primary }}>{f.name}</div>
            <div style={{ fontSize: 11, color: DS.volt, marginBottom: 3 }}>{f.role}</div>
            <div style={{ fontSize: 11, color: DS.text.secondary }}>{f.note}</div>
          </div>
        </div>
      ))}
    </div>

    <Label c="Escala tipográfica completa" />
    {[
      { name: "display-2xl", px: 48, w: 900, lh: 1.1,  ls: "-0.03em", use: "Hero, splash",        sample: "creaConstruye",        mono: false },
      { name: "display-xl",  px: 36, w: 800, lh: 1.15, ls: "-0.025em",use: "Títulos de sección",  sample: "Análisis de Mercado",  mono: false },
      { name: "title-lg",    px: 24, w: 800, lh: 1.25, ls: "-0.02em", use: "Título card principal",sample: "Naucalpan Centro",      mono: false },
      { name: "title-md",    px: 18, w: 700, lh: 1.3,  ls: "-0.01em", use: "Subtítulos",           sample: "Precio objetivo / m²", mono: false },
      { name: "body-lg",     px: 16, w: 400, lh: 1.65, ls: "0",       use: "Cuerpo principal",     sample: "El déficit es de 4,200 unidades anuales en Naucalpan.", mono: false },
      { name: "body-md",     px: 14, w: 400, lh: 1.6,  ls: "0",       use: "UI, labels, body",     sample: "Etapa 3 de 8 — Análisis de Mercado completado",mono: false },
      { name: "body-sm",     px: 13, w: 400, lh: 1.6,  ls: "0",       use: "Contenido secundario", sample: "Actualizado hace 2 minutos · Fuente: INEGI",    mono: false },
      { name: "label",       px: 11, w: 700, lh: 1.4,  ls: "0.1em",   use: "Labels, eyebrows",     sample: "ANÁLISIS DE MERCADO",  mono: false },
      { name: "caption",     px: 10, w: 600, lh: 1.4,  ls: "0.15em",  use: "Ejes, metadata",       sample: "ENE 2025",             mono: false },
      { name: "data-xl",     px: 28, w: 900, lh: 1.1,  ls: "-0.02em", use: "KPI principal",        sample: "$8,420",               mono: true  },
      { name: "data-lg",     px: 22, w: 800, lh: 1.15, ls: "-0.015em",use: "KPI secundario",       sample: "24.5%",                mono: true  },
      { name: "data-md",     px: 15, w: 600, lh: 1.5,  ls: "0",       use: "Valores en tablas",    sample: "$14.2M",               mono: true  },
      { name: "code",        px: 12, w: 500, lh: 1.6,  ls: "0",       use: "Código, tokens CSS",   sample: "cos: 0.60 · cus: 3.0", mono: true  },
    ].map(s => (
      <div key={s.name} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "9px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <div style={{ width: 110, flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontFamily: DS.font.mono, color: DS.text.muted }}>{s.name}</div>
          <div style={{ fontSize: 9, color: DS.text.muted }}>{s.px}px·{s.w}·{s.lh}</div>
        </div>
        <div style={{
          flex: 1, fontSize: s.px > 24 ? 20 : s.px, fontWeight: s.w,
          lineHeight: s.lh, letterSpacing: s.ls,
          fontFamily: s.mono ? DS.font.mono : DS.font.sans,
          color: s.mono ? DS.volt : s.name.startsWith("label") || s.name.startsWith("caption") ? DS.text.muted : DS.text.primary,
          textTransform: s.ls > "0" ? "uppercase" : "none",
          overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
          maxWidth: 320,
        }}>{s.sample}</div>
        <div style={{ fontSize: 10, color: DS.text.muted, width: 170, flexShrink: 0 }}>{s.use}</div>
      </div>
    ))}

    <Label c="Reglas de tipografía" />
    {[
      "TODOS los valores numéricos van en font-family mono. Sin excepción.",
      "Labels y eyebrows siempre en UPPERCASE + letter-spacing 0.1em+",
      "El dato más importante de cada card en color volt + data-xl",
      "Máximo 3 tamaños distintos en una misma card",
      "Body text: max 65-70 caracteres por línea para legibilidad",
      "font-weight 900 solo en display-2xl y data-xl. Nunca en párrafos.",
    ].map((r,i) => (
      <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <span style={{ color: DS.volt, fontSize: 12 }}>→</span>
        <span style={{ fontSize: 12, color: DS.text.secondary }}>{r}</span>
      </div>
    ))}
  </div>
);

const Componentes = () => (
  <div>
    <Label c="Buttons — 4 variantes" />
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
      <BtnPrimary>Analizar terreno →</BtnPrimary>
      <BtnSecondary>Ver análisis AI</BtnSecondary>
      <BtnGhost>Cancelar</BtnGhost>
      <BtnDanger>NO-GO</BtnDanger>
    </div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {[["sm","8px 14px",11],["md","10px 20px",12],["lg","12px 28px",14]].map(([s,p,fs]) => (
        <button key={s} style={{ padding: p, borderRadius: DS.r.md, background: DS.volt, border: "none", fontSize: fs, fontWeight: 800, color: "#000", cursor: "pointer" }}>
          btn-{s}
        </button>
      ))}
    </div>

    <Label c="Cards — variantes" />
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <CardBox>
        <div style={{ fontSize: 9, fontWeight: 700, color: DS.text.muted, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Card Default</div>
        <div style={{ fontSize: 22, fontWeight: 900, fontFamily: DS.font.mono, color: DS.text.primary }}>$8,420<span style={{ fontSize: 13, fontWeight: 400, color: DS.text.muted }}>/m²</span></div>
        <div style={{ fontSize: 11, color: DS.text.muted, marginTop: 4 }}>Precio promedio · Naucalpan</div>
      </CardBox>
      <CardBox glow="volt">
        <div style={{ fontSize: 9, fontWeight: 700, color: DS.volt, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>★ Card Volt (dato principal)</div>
        <div style={{ fontSize: 22, fontWeight: 900, fontFamily: DS.font.mono, color: DS.volt }}>24.5%<span style={{ fontSize: 13, fontWeight: 400, color: DS.text.muted, fontFamily: DS.font.sans }}>  TIR anual</span></div>
        <div style={{ fontSize: 11, color: DS.text.secondary, marginTop: 4 }}>Supera benchmark 18% · Percentil 85</div>
      </CardBox>
      <CardBox glow="violet">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: DS.r.sm, background: DS.violet, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff" }}>AI</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: DS.violetSub }}>Card AI (análisis Claude)</span>
        </div>
        <div style={{ fontSize: 12, color: DS.text.secondary, lineHeight: 1.7 }}>
          Déficit de <span style={{ color: DS.text.primary, fontWeight: 700 }}>~4,200 unidades</span> en zona. Precio objetivo: <span style={{ color: DS.volt, fontFamily: DS.font.mono, fontWeight: 700 }}>$8,200-8,400/m²</span>
        </div>
      </CardBox>
    </div>

    <Label c="Badges y Pills" />
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Pill label="GO" color={DS.success} />
      <Pill label="NO-GO" color={DS.danger} />
      <Pill label="CONDICIONAL" color={DS.warning} />
      <Pill label="AI ACTIVO" color={DS.violet} />
      <Pill label="VOLT" color={DS.volt} />
      <Pill label="COMPLETADO" color={DS.volt} />
      <Pill label="PENDIENTE" color={DS.text.muted} />
    </div>

    <Label c="Inputs — 3 estados" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {[
        { label: "Default", val: "", border: DS.bg.border, col: DS.text.primary, ph: "Dirección del terreno..." },
        { label: "Focus (volt)", val: "500", border: DS.volt, col: DS.volt, shadow: DS.shadow.voltFocus, mono: true, ph: "m²" },
        { label: "Error", val: "abc", border: DS.danger, col: DS.danger, ph: "Valor inválido" },
      ].map(i => (
        <div key={i.label}>
          <label style={{ fontSize: 10, fontWeight: 700, color: i.border === DS.volt ? DS.volt : i.border === DS.danger ? DS.danger : DS.text.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>{i.label}</label>
          <input readOnly value={i.val} placeholder={i.ph} style={{
            width: "100%", padding: "9px 12px", background: DS.bg.input,
            border: `1px solid ${i.border}`, borderRadius: DS.r.md,
            color: i.col, fontSize: 12,
            fontFamily: i.mono ? DS.font.mono : DS.font.sans,
            boxShadow: i.shadow || "none", boxSizing: "border-box",
          }} />
        </div>
      ))}
    </div>

    <Label c="GO / NO-GO Decision Panel" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
      {[
        { label: "GO", icon: "✓", pct: 91, c: DS.success },
        { label: "CONDICIONAL", icon: "◑", pct: 68, c: DS.warning },
        { label: "NO-GO", icon: "✗", pct: 31, c: DS.danger },
      ].map(d => (
        <div key={d.label} style={{ padding: "18px", borderRadius: DS.r.lg, background: `${d.c}10`, border: `2px solid ${d.c}35`, textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: d.c }}>{d.icon}</div>
          <div style={{ fontSize: 10, fontWeight: 800, color: d.c, letterSpacing: "0.15em", marginBottom: 6 }}>{d.label}</div>
          <div style={{ fontSize: 16, fontFamily: DS.font.mono, fontWeight: 800, color: d.c }}>{d.pct}%</div>
          <div style={{ fontSize: 9, color: DS.text.muted }}>confianza</div>
        </div>
      ))}
    </div>

    <Label c="Proforma Step Indicator" />
    <div style={{ padding: "16px 20px", background: DS.bg.raised, borderRadius: DS.r.lg, border: `1px solid ${DS.bg.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: DS.text.secondary }}>Progreso de proforma</span>
        <span style={{ fontSize: 11, fontFamily: DS.font.mono, color: DS.volt, fontWeight: 700 }}>3 / 8</span>
      </div>
      <div style={{ height: 4, background: DS.bg.border, borderRadius: DS.r.pill, marginBottom: 10 }}>
        <div style={{ height: 4, width: "37.5%", background: DS.volt, borderRadius: DS.r.pill }} />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[["T","done"],["Z","done"],["M","active"],["C",""],["F",""],["R",""],["Cr",""],["Ri",""]].map(([s,st]) => (
          <div key={s} style={{
            flex: 1, height: 28, borderRadius: DS.r.sm,
            background: st === "done" ? DS.volt : st === "active" ? DS.violet : DS.bg.border,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 800,
            color: st === "done" ? "#000" : st === "active" ? "#fff" : DS.text.muted,
          }}>
            {st === "done" ? "✓" : s}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Layouts = () => (
  <div>
    <Label c="Sidebar — especificaciones exactas" />
    {[["Ancho expanded","220px","width: 220px"],["Ancho collapsed","64px","Solo iconos, sin texto"],["Background","bg.surface","#131316"],["Border right","1px bg.border","#2E2E38"],["Top","Logo + proyecto","28px logo + nombre"],["Middle","Nav 8 etapas","Ver Step Indicator"],["Bottom","Progress + settings","Pegado al bottom"],["Item height","40px","Constante en todas"],["Item padding","10px 14px","Horizontal + vertical"],["Item radius","radius-md","8px"],["Active background","violet ghost","rgba(139,92,246,0.15)"],["Active border-left","2px solid violet","Color AI"],["Hover background","bg.hover","#222228"],["Icon size","16px","Tabler outline"]].map(([k,v,d]) => (
      <div key={k} style={{ display: "flex", padding: "5px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <span style={{ width: 170, fontSize: 11, color: DS.text.muted }}>{k}</span>
        <span style={{ width: 120, fontSize: 11, fontFamily: DS.font.mono, color: DS.volt }}>{v}</span>
        <span style={{ fontSize: 11, color: DS.text.secondary }}>{d}</span>
      </div>
    ))}

    <Label c="Metric Cards Row — especificaciones" />
    {[["Grid","4 columnas","gap: 10px"],["Altura mínima","96px","height: min-content"],["Padding","12px 16px","Compacto pero respirable"],["Label","9-10px · 700 · uppercase","color: text.muted"],["Valor principal","22-28px · 900 · mono","Solo 1 en volt"],["Trend","10px · color semántico","↑ verde, ↓ rojo"],["Border","1px bg.border","Default card"],["Border volt card","1px volt 25%","Solo en KPI principal"],["Border radius","radius-lg","12px"],["Background","bg.raised","#1C1C21"]].map(([k,v,d]) => (
      <div key={k} style={{ display: "flex", padding: "5px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <span style={{ width: 170, fontSize: 11, color: DS.text.muted }}>{k}</span>
        <span style={{ width: 140, fontSize: 11, color: DS.text.secondary }}>{v}</span>
        <span style={{ fontSize: 11, color: DS.text.muted }}>{d}</span>
      </div>
    ))}

    <Label c="Modal / Overlay" />
    {[["Backdrop","bg.overlay","rgba(12,12,14,0.85) + blur(4px)"],["Modal bg","bg.raised","#1C1C21"],["Modal border","1px bg.border → volt 25%","Solo cuando es crítico"],["Modal radius","radius-xl","16px"],["Max width","560px","Para formularios estándar"],["Padding","24px","Cuerpo del modal"],["Header padding","20px 24px","Con border-bottom"],["Footer","bg.surface · border-top","Botones alineados a la derecha"]].map(([k,v,d]) => (
      <div key={k} style={{ display: "flex", padding: "5px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <span style={{ width: 170, fontSize: 11, color: DS.text.muted }}>{k}</span>
        <span style={{ width: 140, fontSize: 11, color: DS.text.secondary }}>{v}</span>
        <span style={{ fontSize: 11, color: DS.text.muted }}>{d}</span>
      </div>
    ))}
  </div>
);

const DataMaps = () => (
  <div>
    <Label c="Recharts — configuración global" />
    <div style={{ padding: 14, background: DS.bg.raised, borderRadius: DS.r.lg, border: `1px solid ${DS.bg.border}` }}>
      <pre style={{ fontSize: 10, fontFamily: DS.font.mono, color: DS.text.secondary, margin: 0, lineHeight: 1.8 }}>{`const chartConfig = {
  background: "transparent",
  grid: { stroke: "#2E2E38", strokeDasharray: "3 3", strokeOpacity: 0.6 },
  axis: {
    tick: { fill: "#52525B", fontSize: 10, fontFamily: "monospace" },
    line: { stroke: "#2E2E38" },
  },
  tooltip: {
    contentStyle: {
      background: "#222228",
      border: "1px solid #2E2E38",
      borderRadius: 8,
      fontSize: 12,
    },
    labelStyle: { color: "#F4F4F5", fontWeight: 700 },
    itemStyle: { color: "#A1A1AA" },
  },
  line: { stroke: "#C8FF00", strokeWidth: 2.5 },
  area: { fill: "url(#voltGrad)", strokeWidth: 2.5 },
  bar: { fill: "#8B5CF6", radius: [4, 4, 0, 0] },
  dot: { fill: "#0C0C0E", stroke: "#C8FF00", strokeWidth: 2, r: 4 },
};
// Gradient definition:
<defs>
  <linearGradient id="voltGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#C8FF00" stopOpacity="0.25"/>
    <stop offset="100%" stopColor="#C8FF00" stopOpacity="0"/>
  </linearGradient>
</defs>`}</pre>
    </div>

    <Label c="Paleta de colores para gráficas (en orden)" />
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {DS.chart.map((c,i) => (
        <div key={c} style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: DS.r.sm, background: c, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 3 }} />
          <div style={{ fontSize: 9, fontFamily: DS.font.mono, color: DS.text.muted }}>chart-{i+1}</div>
        </div>
      ))}
    </div>
    <div style={{ fontSize: 11, color: DS.text.secondary, marginTop: 8 }}>chart-1 (volt) = línea / métrica principal siempre. chart-2 (violet) = IA / segunda métrica.</div>

    <Label c="Mapbox — dark style config" />
    <div style={{ padding: 14, background: DS.bg.raised, borderRadius: DS.r.lg, border: `1px solid ${DS.bg.border}` }}>
      <pre style={{ fontSize: 10, fontFamily: DS.font.mono, color: DS.text.secondary, margin: 0, lineHeight: 1.8 }}>{`// Style base: 'mapbox://styles/mapbox/dark-v11'
// Customizaciones:
map.setPaintProperty('background', 'background-color', '#0C0C0E');
map.setPaintProperty('water', 'fill-color', '#131316');
map.setPaintProperty('building', 'fill-color', '#1C1C21');
map.setPaintProperty('road-primary', 'line-color', '#2E2E38');
map.setPaintProperty('road-secondary', 'line-color', '#222228');

// Marcador terreno principal:
color: #C8FF00, tamaño: 16px, border: 2px #000
boxShadow: 0 0 14px rgba(200,255,0,0.5)  /* glow volt */

// Marcadores comparables:
color: #8B5CF6, tamaño: 10px, border: 2px #0C0C0E

// Heatmap de precios:
colorRamp: ['#131316', '#2E2E38', '#8FB800', '#C8FF00']

// Popup:
background: #1C1C21, border: #2E2E38
borderRadius: 10px, padding: 12px 16px`}</pre>
    </div>

    <Label c="Tablas de datos" />
    {[["Header","bg.surface · uppercase · label style · sticky top","9-10px · text.muted · letter-spacing 0.15em"],["Row default","background: transparent · border-bottom: 1px bg.border","hover: bg.hover (#222228)"],["Row seleccionado","bg volt ghost · border-left: 3px volt","Marca row activo"],["Celdas numéricas","font-mono · text-right · text.primary","data-md style"],["Celdas texto","font-sans · text.secondary","body-sm"],["Badge cells","Pill componente inline","Status / categoría"],["Acciones","Icon buttons ghost · visible solo en row hover","16px icons tabler"]].map(([k,v,d]) => (
      <div key={k} style={{ padding: "7px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: DS.text.primary, marginBottom: 2 }}>{k}</div>
        <div style={{ fontSize: 11, color: DS.text.secondary }}>{v}</div>
        <div style={{ fontSize: 10, color: DS.text.muted }}>{d}</div>
      </div>
    ))}
  </div>
);

const AIPatterns = () => (
  <div>
    <Label c="Regla fundamental" />
    <div style={{ padding: "14px 18px", background: `${DS.violet}12`, border: `1px solid ${DS.violet}30`, borderRadius: DS.r.lg, marginBottom: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: DS.violetSub, marginBottom: 6 }}>Violet = Claude. Siempre. Sin excepción.</div>
      <div style={{ fontSize: 12, color: DS.text.secondary, lineHeight: 1.7 }}>Todo output de Claude usa violet. Los datos estáticos usan volt. El usuario nunca debe dudar si está leyendo IA o datos ingresados. La diferencia es visual e inmediata.</div>
    </div>

    <Label c="AI Report Panel — anatomía" />
    <div style={{ padding: "16px 20px", background: `${DS.violet}0E`, border: `1px solid ${DS.violet}28`, borderRadius: DS.r.lg, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: DS.r.sm, background: DS.violet, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff" }}>AI</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: DS.violetSub }}>Claude · Análisis de Mercado</div>
          <div style={{ fontSize: 9, color: DS.text.muted }}>Etapa 3 · Naucalpan Centro</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: DS.violet }} />
          <span style={{ fontSize: 9, color: DS.violetSub }}>Generando</span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: DS.text.secondary, lineHeight: 1.8 }}>
        Déficit de <span style={{ color: DS.text.primary, fontWeight: 700 }}>~4,200 unidades</span> en segmento medio-alto. Precio objetivo: <span style={{ color: DS.volt, fontFamily: DS.font.mono, fontWeight: 700 }}>$8,200-8,400/m²</span>. Recomiedo unidades de <span style={{ color: DS.text.primary, fontWeight: 700 }}>85-100m²</span> con home office<span style={{ display: "inline-block", width: 2, height: 13, background: DS.violetSub, marginLeft: 2, verticalAlign: "middle" }} />
      </div>
    </div>

    <Label c="Specs del AI Panel" />
    {[["Background","rgba(139,92,246,0.05)","Tinte violet muy sutil"],["Border","1px solid rgba(139,92,246,0.28)","Violet dim"],["Header badge","26×26px · bg violet · texto '★ AI'","Identifica el panel siempre"],["Header label","text.violetSub · 11px · 700","Nombre del análisis"],["Status dot","6px · violet · pulse animation","Indica si está generando"],["Cursor streaming","2px × 13px · violetSub · blink 1s","Solo durante generación"],["Keywords","text.primary · 700","Conceptos clave en bold"],["Valores numéricos","DS.volt · mono · 700","Datos financieros en volt"],["Estado completado","Confidence badge · success color","'91.2% confianza'"],["Borde completado","border-left: 3px volt","Indica análisis finalizado"]].map(([k,v,d]) => (
      <div key={k} style={{ display: "flex", padding: "5px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <span style={{ width: 170, fontSize: 11, color: DS.text.muted }}>{k}</span>
        <span style={{ width: 200, fontSize: 11, fontFamily: DS.font.mono, color: DS.text.secondary }}>{v}</span>
        <span style={{ fontSize: 11, color: DS.text.muted }}>{d}</span>
      </div>
    ))}

    <Label c="Loading y thinking states" />
    {[["Skeleton","Rectangles en bg.hover, pulse 2s ease-in-out","Same border-radius que el contenido"],["AI Thinking","3 dots violetSub, scale 0→1 sequencial","'Claude está analizando...'"],["Edge Function","Barra linear volt, steps: Calculando → Simulando → Generando","Duración real del proceso"],["Spinner","24px ring, stroke violet, dashoffset rotation","Para acciones < 3 segundos"],["Progress bar","Volt, shimmer animado, label de paso actual","Para procesos multi-etapa"]].map(([n,s,d]) => (
      <div key={n} style={{ padding: "8px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: DS.text.primary, marginBottom: 2 }}>{n}</div>
        <div style={{ fontSize: 11, color: DS.text.secondary }}>{s}</div>
        <div style={{ fontSize: 10, color: DS.text.muted }}>{d}</div>
      </div>
    ))}
  </div>
);

const Motion = () => (
  <div>
    <Label c="Duraciones" />
    {[
      ["fast","100ms ease","Hover color, opacity","Cambios de estado instantáneos"],
      ["base","180ms ease","Transiciones UI estándar","Botones, inputs, nav items"],
      ["slow","300ms cubic(0.4,0,0.2,1)","Modales, drawers, acordiones","Elementos que entran/salen"],
      ["spring","400ms cubic(0.34,1.56,0.64,1)","Cards, tooltips, GO panel","Elementos que 'emergen'"],
      ["data","600ms ease-out","Count-up numérico","Valores que cambian en pantalla"],
      ["chart","800ms ease-in-out","Líneas de gráficas","Dibujado de izq a der"],
      ["pulse","2s ease-in-out infinite","Status dots, AI indicator","Nunca en datos estáticos"],
    ].map(([n,t,u,d]) => (
      <div key={n} style={{ display: "flex", padding: "7px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <span style={{ width: 70, fontSize: 11, fontFamily: DS.font.mono, color: DS.volt }}>{n}</span>
        <span style={{ width: 200, fontSize: 11, fontFamily: DS.font.mono, color: DS.text.muted }}>{t}</span>
        <span style={{ width: 180, fontSize: 11, color: DS.text.secondary }}>{u}</span>
        <span style={{ fontSize: 11, color: DS.text.muted }}>{d}</span>
      </div>
    ))}

    <Label c="Microinteracciones por componente" />
    {[
      ["BtnPrimary hover","scale(1.01) + brightness(1.08)","fast"],
      ["BtnPrimary press","scale(0.97)","100ms"],
      ["Card hover","translateY(-2px) + border brightens","base"],
      ["Sidebar nav item","bg fade + border-left slide","base"],
      ["Step completado","checkmark scale 0→1.2→1","spring"],
      ["Metric value update","count-up de valor anterior al nuevo","data"],
      ["Chart line draw","strokeDashoffset 100%→0%","chart"],
      ["Map pin appear","scale 0→1.15→1 + opacity","spring"],
      ["Modal open","opacity 0→1 + translateY(8→0)","slow"],
      ["Toast","slide desde arriba + bounce","spring"],
      ["Score radial","fill 0→valor con easing","chart"],
      ["Progress bar","width animado left→right","slow"],
      ["GO/NO-GO reveal","scale 0.5→1 + glow pulse","spring"],
      ["AI cursor blink","opacity 1→0→1","1s ease infinite"],
    ].map(([c,a,d]) => (
      <div key={c} style={{ display: "flex", padding: "5px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <span style={{ width: 200, fontSize: 11, color: DS.text.primary }}>{c}</span>
        <span style={{ width: 220, fontSize: 11, fontFamily: DS.font.mono, color: DS.text.muted }}>{a}</span>
        <span style={{ fontSize: 11, color: DS.volt }}>{d}</span>
      </div>
    ))}

    <Label c="Reglas de animación" />
    {["Siempre respetar prefers-reduced-motion — sin excepciones","Nunca animar más de 2 propiedades simultáneas en el mismo elemento","Los números financieros sí se animan cuando cambian — comunican 'esto es nuevo'","Framer Motion para spring y enter/exit; CSS transitions para hover/focus","El streaming de Claude es lo más importante — nunca interrumpir con otras animaciones","Las animaciones de página son opt-in, no default en cada render","Glow effects solo en volt y violet — nunca en elementos neutros"].map((r,i) => (
      <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <span style={{ color: DS.volt, fontSize: 12, flexShrink: 0 }}>→</span>
        <span style={{ fontSize: 12, color: DS.text.secondary }}>{r}</span>
      </div>
    ))}
  </div>
);

const QuickRef = () => (
  <div>
    <div style={{ padding: "16px 20px", background: `${DS.volt}10`, border: `1px solid ${DS.volt}25`, borderRadius: DS.r.lg, marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: DS.volt, marginBottom: 8 }}>★ LOS 3 COLORES QUE NECESITAS SABER</div>
      <div style={{ display: "flex", gap: 16 }}>
        {[["#C8FF00","VOLT","Dato más importante, CTAs primarios"],["#8B5CF6","VIOLET","Todo output de Claude"],["#2E2E38","BORDER","Todos los bordes del sistema"]].map(([h,n,d]) => (
          <div key={n} style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 24, height: 24, borderRadius: DS.r.sm, background: h }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: h }}>{n}</div>
              <div style={{ fontSize: 10, color: DS.text.muted }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <Label c="Los 12 tokens más usados" />
    {[["bg.base","#0C0C0E","Fondo de página"],["bg.surface","#131316","Sidebar, header"],["bg.raised","#1C1C21","Todas las cards"],["bg.border","#2E2E38","Todos los bordes"],["volt","#C8FF00","★ Acento primario"],["violet","#8B5CF6","★ AI accent"],["text.primary","#F4F4F5","Títulos, datos"],["text.secondary","#A1A1AA","Body, labels"],["text.muted","#52525B","Metadata"],["success","#22C55E","GO, positivo"],["danger","#FF3B3B","NO-GO, error"],["warning","#F59E0B","Condicional, alerta"]].map(([t,h,d]) => (
      <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <div style={{ width: 14, height: 14, borderRadius: 3, background: h, flexShrink: 0 }} />
        <span style={{ width: 140, fontSize: 11, fontFamily: DS.font.mono, color: h === DS.volt ? DS.volt : DS.text.secondary }}>{t}</span>
        <span style={{ width: 80, fontSize: 10, fontFamily: DS.font.mono, color: DS.text.muted }}>{h}</span>
        <span style={{ fontSize: 11, color: DS.text.muted }}>{d}</span>
      </div>
    ))}

    <Label c="Checklist antes de entregar un diseño" />
    {["¿Los valores numéricos (precios, ROI, %) están en font mono?","¿El color volt aparece en solo UN elemento por card?","¿El output de Claude usa violet, no volt?","¿Los bordes usan bg.border (#2E2E38)?","¿Hay estado de loading (skeleton o spinner)?","¿El estado vacío tiene copy de acción, no solo un mensaje?","¿Los errores son específicos ('Ingresa una dirección válida', no 'Error')?","¿El contraste text.secondary sobre bg.raised pasa WCAG AA (4.5:1)?","¿Funciona en 375px (iPhone) sin scroll horizontal?","¿Los modales funcionan sin position:fixed?","¿prefers-reduced-motion está respetado?","¿Hay máximo 3 tamaños de texto en cada card?"].map((item,i) => (
      <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: `1px solid ${DS.bg.border}` }}>
        <div style={{ width: 18, height: 18, borderRadius: DS.r.xs, border: `2px solid ${DS.bg.border}`, flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: DS.text.secondary }}>{item}</span>
      </div>
    ))}

    <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: DS.r.lg, background: DS.bg.raised, border: `1px solid ${DS.bg.border}` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: DS.volt, marginBottom: 6 }}>LA REGLA DE ORO</div>
      <div style={{ fontSize: 13, color: DS.text.secondary, lineHeight: 1.75 }}>
        Si no sabes qué hacer con un elemento, haz la versión más silenciosa — fondo oscuro, texto secondary, sin borde de énfasis. El sistema de carbón es el silencio. El Volt es el grito. Solo uno grita a la vez.
      </div>
    </div>
  </div>
);

const PANELS = [Filosofia, Tokens, Colores, Tipografia, Componentes, Layouts, DataMaps, AIPatterns, Motion, QuickRef];

// ================================================================
// APP
// ================================================================
export default function DesignSystem() {
  const [active, setActive] = useState(0);
  const Panel = PANELS[active];

  return (
    <div style={{ fontFamily: DS.font.sans, background: DS.bg.base, minHeight: "100vh", color: DS.text.primary, display: "flex", flexDirection: "column" }}>

      {/* Topbar */}
      <div style={{ background: DS.bg.surface, borderBottom: `1px solid ${DS.bg.border}`, padding: "0 20px", display: "flex", alignItems: "center", gap: 16, height: 48, flexShrink: 0, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: DS.r.sm, background: DS.volt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#000" }}>C</div>
          <span style={{ fontSize: 13, fontWeight: 800 }}>crea<span style={{ color: DS.volt }}>Construye</span></span>
          <span style={{ fontSize: 10, color: DS.text.muted, borderLeft: `1px solid ${DS.bg.border}`, paddingLeft: 10 }}>Design System v2.0 · Graphite + Volt</span>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 180, background: DS.bg.surface, borderRight: `1px solid ${DS.bg.border}`, padding: "16px 8px", flexShrink: 0, position: "sticky", top: 48, height: "calc(100vh - 48px)", overflowY: "auto" }}>
          {sections.map((s, i) => (
            <button key={s} onClick={() => setActive(i)} style={{
              width: "100%", padding: "8px 12px", borderRadius: DS.r.md,
              background: active === i ? DS.voltGhost : "transparent",
              borderLeft: active === i ? `2px solid ${DS.volt}` : "2px solid transparent",
              border: "none",
              color: active === i ? DS.volt : DS.text.muted,
              fontSize: 12, fontWeight: active === i ? 700 : 400,
              cursor: "pointer", textAlign: "left",
              marginBottom: 2, display: "block",
              transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "28px 32px 80px", overflowY: "auto", maxWidth: 820 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{sections[active]}</h2>
          <div style={{ height: 2, width: 32, background: DS.volt, borderRadius: DS.r.pill, marginBottom: 24 }} />
          <Panel />
        </div>
      </div>
    </div>
  );
}
