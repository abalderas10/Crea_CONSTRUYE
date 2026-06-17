import { useState } from "react";

const C = {
  bg: { base:"#0C0C0E", surface:"#131316", raised:"#1C1C21", hover:"#222228", border:"#2E2E38", input:"#0F0F12" },
  volt:"#C8FF00", voltGhost:"#C8FF0014", voltDim:"#8FB800",
  violet:"#8B5CF6", violetSub:"#A78BFA", violetGhost:"#8B5CF614",
  success:"#22C55E", warning:"#F59E0B", danger:"#FF3B3B",
  text:{ primary:"#F4F4F5", secondary:"#A1A1AA", muted:"#52525B", onVolt:"#000000" },
  font:{ sans:"'Inter',system-ui,sans-serif", mono:"'JetBrains Mono',monospace" },
  r:{ sm:6, md:8, lg:12, xl:16, pill:999 },
};

// ─── SVG BASE ────────────────────────────────────────────────────
const Ic = ({ d, size=24, color="currentColor", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d}/> : children}
  </svg>
);

// ─── 8 HERRAMIENTAS — íconos custom ──────────────────────────────
const ToolIcons = {
  Terreno: ({ s=24, c="currentColor" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9.2 2 7 4.2 7 7c0 3.6 5 10 5 10s5-6.4 5-10c0-2.8-2.2-5-5-5z"/>
      <circle cx="12" cy="7" r="1.5"/>
      <path d="M4 21h16"/>
      <path d="M7.5 19q4.5-2 9 0"/>
    </svg>
  ),
  Zonificacion: ({ s=24, c="currentColor" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/>
      <line x1="9" y1="3" x2="9" y2="21"/>
      <line x1="15" y1="3" x2="15" y2="21"/>
    </svg>
  ),
  Mercado: ({ s=24, c="currentColor" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <path d="M3 17l4.5-5L11 15l4-5.5 3 2"/>
      <circle cx="20.5" cy="11.5" r="1.5" fill={c} stroke="none"/>
    </svg>
  ),
  Costos: ({ s=24, c="currentColor" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <path d="M14 3v5h5"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
      <line x1="8" y1="15" x2="13" y2="15"/>
      <path d="M15.5 17a1.5 1.5 0 100 3 1.5 1.5 0 000-3"/>
      <line x1="15.5" y1="16.5" x2="15.5" y2="17"/>
    </svg>
  ),
  Financiero: ({ s=24, c="currentColor" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="20" x2="21" y2="20"/>
      <line x1="3" y1="4" x2="3" y2="20"/>
      <path d="M3 15l4-5 4 3 3-6 4 4"/>
      <path d="M17 11l2-3 2 2"/>
    </svg>
  ),
  ROI: ({ s=24, c="currentColor" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.1 18.9A9 9 0 1018.9 5.1"/>
      <path d="M12 8v4l3 3"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="M16 5l2-2 2 2M18 3v5"/>
    </svg>
  ),
  Cronograma: ({ s=24, c="currentColor" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="7" y1="14" x2="12" y2="14"/>
      <line x1="7" y1="17" x2="15" y2="17"/>
    </svg>
  ),
  Riesgos: ({ s=24, c="currentColor" }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6.5v6C4 17.1 7.4 21.5 12 23c4.6-1.5 8-5.9 8-10.5v-6L12 2z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <circle cx="12" cy="16" r="0.75" fill={c} stroke="none"/>
    </svg>
  ),
};

// ─── UI ICONS ────────────────────────────────────────────────────
const UIIcon = ({ type, size=20, color=C.text.secondary }) => {
  const p = {
    search:   <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    filter:   <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    upload:   <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    check:    <><polyline points="20 6 9 17 4 12"/></>,
    x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    edit:     <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z"/></>,
    trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    arrowR:   <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL:   <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    chevD:    <><polyline points="6 9 12 15 18 9"/></>,
    bell:     <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    user:     <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    link:     <><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    copy:     <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    refresh:  <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>,
    map:      <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    pdf:      <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h1a1 1 0 011 1v1a1 1 0 01-1 1H9v-3zM13 13v3M15 13h2"/></>,
    home:     <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    brain:    <><path d="M9.5 2A2.5 2.5 0 007 4.5v0A2.5 2.5 0 004.5 7v0a2.5 2.5 0 000 5v0A2.5 2.5 0 007 14.5v0a2.5 2.5 0 002.5 2.5h5a2.5 2.5 0 002.5-2.5v0a2.5 2.5 0 002.5-2.5v0a2.5 2.5 0 000-5v0A2.5 2.5 0 0017 4.5v0A2.5 2.5 0 0014.5 2z"/><path d="M12 2v17M8 6l4 2 4-2M8 10l4 2 4-2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {p[type]}
    </svg>
  );
};

// ─── HELPERS ─────────────────────────────────────────────────────
const Tag = ({ children, c=C.volt }) => (
  <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"3px 8px", borderRadius:4, border:`1px solid ${c}40`, background:`${c}12`, color:c }}>
    {children}
  </span>
);

const Spec = ({ k, v }) => (
  <div style={{ display:"flex", padding:"5px 0", borderBottom:`1px solid ${C.bg.border}` }}>
    <span style={{ width:180, fontSize:11, color:C.text.muted }}>{k}</span>
    <span style={{ fontSize:11, fontFamily:C.font.mono, color:C.text.secondary }}>{v}</span>
  </div>
);

const Rule = ({ children }) => (
  <div style={{ display:"flex", gap:10, padding:"6px 0", borderBottom:`1px solid ${C.bg.border}` }}>
    <span style={{ color:C.volt, fontSize:12, flexShrink:0 }}>→</span>
    <span style={{ fontSize:12, color:C.text.secondary }}>{children}</span>
  </div>
);

// ================================================================
// TAB 0 — RESPONSIVO
// ================================================================
const Responsivo = () => {
  const tools = ["T","Z","M","C","F","R","Cr","Ri"];
  return (
    <div style={{ display:"flex", gap:24, alignItems:"flex-start" }}>

      {/* Phone mockup */}
      <div style={{ flexShrink:0 }}>
        <div style={{ fontSize:10, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:10, textAlign:"center" }}>
          Mobile · 375px
        </div>
        <div style={{
          width:240, borderRadius:28, border:`2px solid ${C.bg.border}`,
          background:C.bg.base, overflow:"hidden",
          boxShadow:`0 0 0 6px ${C.bg.surface}`,
        }}>
          {/* Status bar */}
          <div style={{ padding:"10px 16px 4px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:10, fontWeight:700, color:C.text.primary, fontFamily:C.font.mono }}>9:41</span>
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              {[10,12,14].map(h => <div key={h} style={{ width:3, height:h, background:C.text.muted, borderRadius:1 }}/>)}
              <div style={{ width:16, height:8, border:`1.5px solid ${C.text.muted}`, borderRadius:2, marginLeft:2, position:"relative" }}>
                <div style={{ position:"absolute", inset:"1px 5px 1px 1px", background:C.volt, borderRadius:1 }}/>
                <div style={{ position:"absolute", right:-3, top:"50%", transform:"translateY(-50%)", width:2, height:4, background:C.text.muted, borderRadius:1 }}/>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div style={{ padding:"8px 12px", background:C.bg.surface, borderBottom:`1px solid ${C.bg.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:20, height:20, borderRadius:5, background:C.volt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#000" }}>C</div>
              <span style={{ fontSize:12, fontWeight:800 }}>crea<span style={{ color:C.volt }}>Construye</span></span>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <UIIcon type="bell" size={16} color={C.text.muted}/>
              <div style={{ width:24, height:24, borderRadius:"50%", background:C.violet, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#fff" }}>AB</div>
            </div>
          </div>

          {/* Subheader context */}
          <div style={{ padding:"8px 12px", background:C.bg.raised, borderBottom:`1px solid ${C.bg.border}` }}>
            <div style={{ fontSize:9, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:2 }}>Etapa 3 · Mercado</div>
            <div style={{ fontSize:12, fontWeight:700 }}>Naucalpan Centro</div>
          </div>

          {/* Content area */}
          <div style={{ padding:"10px 10px 0" }}>
            {/* KPI 2×2 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
              {[
                { l:"Precio/m²", v:"$8,420", c:C.volt },
                { l:"Absorción", v:"72%", c:C.text.primary },
                { l:"Déficit", v:"4,200", c:C.warning },
                { l:"Comps", v:"6", c:C.text.primary },
              ].map(k => (
                <div key={k.l} style={{ background:C.bg.raised, border:`1px solid ${k.c===C.volt ? C.volt+"25" : C.bg.border}`, borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:8, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>{k.l}</div>
                  <div style={{ fontSize:16, fontWeight:900, color:k.c, fontFamily:C.font.mono }}>{k.v}</div>
                </div>
              ))}
            </div>

            {/* Mini chart */}
            <div style={{ background:C.bg.raised, border:`1px solid ${C.bg.border}`, borderRadius:8, padding:"8px 10px", marginBottom:8 }}>
              <div style={{ fontSize:9, color:C.text.muted, marginBottom:4 }}>Tendencia precios</div>
              <svg viewBox="0 0 220 48" style={{ width:"100%", height:40 }}>
                <defs>
                  <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.volt} stopOpacity="0.3"/>
                    <stop offset="100%" stopColor={C.volt} stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polygon points="0,40 44,36 88,30 132,22 176,14 220,10 220,48 0,48" fill="url(#mg)"/>
                <polyline points="0,40 44,36 88,30 132,22 176,14 220,10" fill="none" stroke={C.volt} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="220" cy="10" r="3" fill={C.bg.base} stroke={C.volt} strokeWidth="2"/>
              </svg>
            </div>

            {/* AI panel mini */}
            <div style={{ background:`${C.violet}0E`, border:`1px solid ${C.violet}28`, borderRadius:8, padding:"8px 10px", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:5 }}>
                <div style={{ width:16, height:16, borderRadius:4, background:C.violet, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:900, color:"#fff" }}>AI</div>
                <span style={{ fontSize:9, fontWeight:700, color:C.violetSub }}>Claude · Análisis</span>
                <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:C.violet }}/>
              </div>
              <div style={{ fontSize:9, color:C.text.secondary, lineHeight:1.6 }}>
                Precio objetivo <span style={{ color:C.volt, fontFamily:C.font.mono, fontWeight:700 }}>$8,200-8,400</span>/m² · Absorción esperada <span style={{ color:C.text.primary }}>72%</span>
              </div>
            </div>
          </div>

          {/* Bottom Tab Bar */}
          <div style={{ borderTop:`1px solid ${C.bg.border}`, background:C.bg.surface, display:"flex", padding:"6px 0 10px" }}>
            {[
              { t:"home", label:"Inicio", a:false },
              { t:"copy", label:"Proforma", a:true },
              { t:"brain", label:"AI", a:false, violet:true },
              { t:"pdf", label:"Reportes", a:false },
              { t:"settings", label:"Ajustes", a:false },
            ].map(tab => (
              <div key={tab.label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <UIIcon type={tab.t} size={18} color={tab.a ? C.volt : tab.violet ? C.violetSub : C.text.muted}/>
                <span style={{ fontSize:8, color:tab.a ? C.volt : tab.violet ? C.violetSub : C.text.muted, fontWeight: tab.a ? 700 : 400 }}>{tab.label}</span>
                {tab.a && <div style={{ width:4, height:4, borderRadius:"50%", background:C.volt, marginTop:-1 }}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar mobile */}
        <div style={{ marginTop:12, padding:"10px 12px", background:C.bg.raised, borderRadius:10, border:`1px solid ${C.bg.border}`, width:240, boxSizing:"border-box" }}>
          <div style={{ fontSize:9, color:C.text.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.12em" }}>Proforma Progress</div>
          <div style={{ display:"flex", gap:3 }}>
            {tools.map((s,i)=>(
              <div key={s} style={{ flex:1, height:20, borderRadius:4, background:i<2?C.volt:i===2?C.violet:C.bg.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:800, color:i<2?"#000":i===2?"#fff":C.text.muted }}>
                {i<2?"✓":s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs column */}
      <div style={{ flex:1 }}>
        <div style={{ fontSize:16, fontWeight:800, marginBottom:4, letterSpacing:"-0.02em" }}>Sistema Responsivo</div>
        <div style={{ fontSize:12, color:C.text.secondary, marginBottom:20 }}>Breakpoints, adaptaciones y reglas de touch.</div>

        {/* Breakpoints */}
        <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8 }}>Breakpoints</div>
        <div style={{ background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.bg.border}`, padding:"12px 16px", marginBottom:16 }}>
          {[
            ["xs","0-479px","Solo mobile — stack total","12px padding"],
            ["sm","480-639px","Mobile L — grid 2 col","14px padding"],
            ["md","640-1023px","Tablet — sidebar drawer","16px padding"],
            ["lg","1024-1279px","Desktop — sidebar 220px","20px padding"],
            ["xl","1280px+","Wide — max 1600px","24px+ padding"],
          ].map(([bp,range,layout,pad])=>(
            <div key={bp} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:`1px solid ${C.bg.border}` }}>
              <span style={{ width:32, fontSize:11, fontWeight:700, color:C.volt, fontFamily:C.font.mono }}>{bp}</span>
              <span style={{ width:90, fontSize:10, fontFamily:C.font.mono, color:C.text.muted }}>{range}</span>
              <span style={{ flex:1, fontSize:11, color:C.text.secondary }}>{layout}</span>
              <span style={{ fontSize:10, color:C.text.muted }}>{pad}</span>
            </div>
          ))}
        </div>

        {/* Adaptaciones */}
        <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8 }}>Adaptaciones por componente</div>
        <div style={{ background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.bg.border}`, padding:"12px 16px", marginBottom:16 }}>
          {[
            ["Sidebar","Desaparece → Bottom Tab Bar de 64px altura"],
            ["KPI Grid","4 columnas → 2×2 grid, gap 8px"],
            ["Map + Chart","Side by side → stacked, full width"],
            ["AI Panel","Fixed height → collapsible (tap para expandir)"],
            ["Botones primarios","Auto-width → full width en mobile"],
            ["Topbar","Simplificado: logo + bell + avatar"],
            ["Tablas","Scroll horizontal, mostrar solo columnas clave"],
            ["Gantt","Vista de hitos en mobile, Gantt en tablet+"],
            ["Modales","Full-screen sheet desde abajo (iOS pattern)"],
            ["Font display-xl","36px → 22px en mobile"],
          ].map(([k,v])=>(
            <div key={k} style={{ display:"flex", gap:10, padding:"5px 0", borderBottom:`1px solid ${C.bg.border}` }}>
              <span style={{ width:150, fontSize:11, color:C.text.primary, flexShrink:0, fontWeight:600 }}>{k}</span>
              <span style={{ fontSize:11, color:C.text.secondary }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Touch specs */}
        <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8 }}>Touch Targets</div>
        <div style={{ background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.bg.border}`, padding:"12px 16px" }}>
          {[
            ["Mínimo absoluto","44×44px","Apple HIG / Material Design"],
            ["Botones primarios","48px altura","Fácil de alcanzar con pulgar"],
            ["Bottom tab items","64px altura × 20% width","Zona pulgar óptima"],
            ["Input fields","48px altura","Evitar zoom accidental en iOS"],
            ["Icon buttons","44×44px","Padding compensatorio si icono < 44px"],
            ["Row de tabla","48px min-height","Suficiente para tap preciso"],
            ["Card expandible","tap en 100% del área","No solo en ícono de chevron"],
          ].map(([k,v,n])=>(
            <div key={k} style={{ display:"flex", alignItems:"baseline", gap:10, padding:"5px 0", borderBottom:`1px solid ${C.bg.border}` }}>
              <span style={{ width:160, fontSize:11, color:C.text.primary, flexShrink:0 }}>{k}</span>
              <span style={{ width:100, fontSize:11, fontFamily:C.font.mono, color:C.volt }}>{v}</span>
              <span style={{ fontSize:10, color:C.text.muted }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ================================================================
// TAB 1 — ICONOS
// ================================================================
const Iconos = () => {
  const toolData = [
    { key:"Terreno",      label:"Terreno",      desc:"Análisis de ubicación y viabilidad" },
    { key:"Zonificacion", label:"Zonificación",  desc:"Regulaciones y envolvente construible" },
    { key:"Mercado",      label:"Mercado",       desc:"Demanda, precios y absorción" },
    { key:"Costos",       label:"Costos",        desc:"Presupuesto paramétrico por partida" },
    { key:"Financiero",   label:"Financiero",    desc:"Flujo de caja y escenarios" },
    { key:"ROI",          label:"ROI",           desc:"TIR, VAN, Payback, benchmarking" },
    { key:"Cronograma",   label:"Cronograma",    desc:"PERT, Gantt, ruta crítica" },
    { key:"Riesgos",      label:"Riesgos",       desc:"Matriz, VaR, GO/NO-GO" },
  ];

  const uiIconData = [
    ["home","Inicio"],["copy","Proforma"],["brain","Claude AI"],["pdf","Reportes"],
    ["settings","Ajustes"],["search","Buscar"],["filter","Filtrar"],["download","Exportar"],
    ["upload","Importar"],["plus","Agregar"],["check","Confirmar"],["x","Cerrar"],
    ["edit","Editar"],["trash","Eliminar"],["eye","Ver"],["arrowR","Siguiente"],
    ["bell","Alertas"],["user","Perfil"],["link","Compartir"],["refresh","Actualizar"],
    ["map","Mapa"],["chevD","Expandir"],["arrowL","Regresar"],["copy","Copiar"],
  ];

  const [hovered, setHovered] = useState(null);

  return (
    <div>
      {/* Tool Icons */}
      <div style={{ fontSize:12, color:C.text.secondary, marginBottom:20 }}>
        8 íconos custom para las herramientas de proforma + biblioteca de UI.
      </div>

      <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:12 }}>
        Herramientas de Proforma — Íconos Custom
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginBottom:28 }}>
        {toolData.map((tool, i) => {
          const Icon = ToolIcons[tool.key];
          return (
            <div
              key={tool.key}
              onMouseEnter={()=>setHovered(tool.key)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                padding:"20px 16px", background:hovered===tool.key ? C.bg.hover : C.bg.raised,
                border:`1px solid ${hovered===tool.key ? C.volt+"40" : C.bg.border}`,
                borderRadius:C.r.lg, textAlign:"center", cursor:"default",
                transition:"all 0.15s",
              }}
            >
              {/* Step number */}
              <div style={{ fontSize:9, fontWeight:800, color:hovered===tool.key ? C.volt : C.text.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.1em" }}>
                {String(i+1).padStart(2,"0")}
              </div>
              {/* Icon */}
              <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
                <Icon s={36} c={hovered===tool.key ? C.volt : C.text.secondary}/>
              </div>
              <div style={{ fontSize:12, fontWeight:700, color:hovered===tool.key ? C.text.primary : C.text.secondary, marginBottom:4 }}>
                {tool.label}
              </div>
              <div style={{ fontSize:10, color:C.text.muted, lineHeight:1.4 }}>
                {tool.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover tip */}
      <div style={{ fontSize:10, color:C.text.muted, textAlign:"center", marginBottom:24 }}>
        Hover sobre los íconos para ver el estado activo (volt)
      </div>

      {/* Tamaños */}
      <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:10 }}>
        Tamaños del sistema de íconos
      </div>
      <div style={{ display:"flex", gap:20, alignItems:"flex-end", padding:"16px 20px", background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.bg.border}`, marginBottom:24 }}>
        {[
          [12,"xs","Inline, badges","Breadcrumbs, chips"],
          [16,"sm","UI compact","Sidebar nav, inputs"],
          [20,"md","Default","Botones, labels"],
          [24,"lg","Estándar","Cards, headers"],
          [32,"xl","Feature","Vacíos, banners"],
          [40,"2xl","Hero","Onboarding, tool cards"],
        ].map(([s,n,ctx,ex])=>(
          <div key={s} style={{ textAlign:"center", flex:1 }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:8, alignItems:"flex-end" }}>
              <ToolIcons.ROI s={s} c={C.text.secondary}/>
            </div>
            <div style={{ fontSize:10, fontWeight:700, color:C.text.primary }}>{s}px</div>
            <div style={{ fontSize:9, color:C.volt }}>{n}</div>
            <div style={{ fontSize:9, color:C.text.muted }}>{ctx}</div>
          </div>
        ))}
      </div>

      {/* UI Icons Grid */}
      <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:12 }}>
        UI Icons — Biblioteca General
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(8, 1fr)", gap:4, marginBottom:16 }}>
        {uiIconData.map(([type, label])=>(
          <div key={`${type}-${label}`} style={{ padding:"10px 6px", textAlign:"center", background:C.bg.raised, borderRadius:C.r.md, border:`1px solid ${C.bg.border}`, cursor:"default" }}>
            <UIIcon type={type} size={20} color={C.text.secondary}/>
            <div style={{ fontSize:8, color:C.text.muted, marginTop:5, lineHeight:1.2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Icon specs */}
      <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8 }}>
        Especificaciones de íconos
      </div>
      <div style={{ background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.bg.border}`, padding:"12px 16px" }}>
        {[
          ["ViewBox","0 0 24 24 — siempre"],
          ["Stroke width","1.5px — todos los íconos"],
          ["Stroke linecap","round"],
          ["Stroke linejoin","round"],
          ["Fill","none (solo stroke, sin fill)"],
          ["Color default","currentColor (hereda del padre)"],
          ["Color en sidebar activo","C.volt (#C8FF00)"],
          ["Color en sidebar inactivo","C.text.muted (#52525B)"],
          ["Color en bottom nav activo","C.volt o C.violet (para AI)"],
          ["Touch target mínimo","44×44px con padding compensatorio"],
          ["Librería base","Tabler Icons outline (respaldo)"],
          ["Íconos custom","Las 8 herramientas de proforma (este archivo)"],
        ].map(([k,v])=><Spec key={k} k={k} v={v}/>)}
      </div>
    </div>
  );
};

// ================================================================
// TAB 2 — LOGO & MARCA
// ================================================================
const LogoMarca = () => {
  const [logoHover, setLogoHover] = useState(null);

  const LogoMark = ({ bg, textColor, size=32 }) => (
    <div style={{
      width:size, height:size, borderRadius:Math.round(size*0.22),
      background:bg, display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:Math.round(size*0.45), fontWeight:900, color:textColor,
      fontFamily:C.font.sans, letterSpacing:"-0.02em", flexShrink:0,
    }}>C</div>
  );

  const Wordmark = ({ creColor="#F4F4F5", construColor="#F4F4F5", dotColor, size="base" }) => {
    const sizes = { sm:[16,18], base:[22,26], lg:[28,34], xl:[36,44] };
    const [sm, lg] = sizes[size] || sizes.base;
    return (
      <div style={{ display:"flex", alignItems:"baseline", gap:0 }}>
        <span style={{ fontSize:sm, fontWeight:400, color:creColor, fontFamily:C.font.sans, letterSpacing:"0", lineHeight:1 }}>crea</span>
        <span style={{ fontSize:lg, fontWeight:900, color:construColor, fontFamily:C.font.sans, letterSpacing:"-0.02em", lineHeight:1 }}>Construye</span>
        <span style={{ fontSize:sm*0.7, fontWeight:500, color:dotColor||creColor, fontFamily:C.font.sans, letterSpacing:"0.02em", marginLeft:1, lineHeight:1 }}>.com</span>
      </div>
    );
  };

  return (
    <div>
      <div style={{ fontSize:12, color:C.text.secondary, marginBottom:24 }}>
        Exploración tipográfica del wordmark. El logo final se afina después — aquí el sistema de letras.
      </div>

      {/* MAIN TREATMENTS */}
      <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:12 }}>
        Tratamientos principales
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>

        {/* 1 — Volt background (HERO) */}
        <div
          onMouseEnter={()=>setLogoHover("volt")}
          onMouseLeave={()=>setLogoHover(null)}
          style={{ padding:"36px 28px", background:C.volt, borderRadius:C.r.xl, cursor:"default", transition:"all 0.2s" }}
        >
          <div style={{ fontSize:9, fontWeight:800, color:"rgba(0,0,0,0.4)", textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:16 }}>★ Hero · Volt Background</div>
          {/* Mark + Wordmark horizontal */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <LogoMark bg="#000000" textColor={C.volt} size={40}/>
            <Wordmark creColor="rgba(0,0,0,0.6)" construColor="#000000" dotColor="rgba(0,0,0,0.4)" size="lg"/>
          </div>
          {/* Just wordmark */}
          <Wordmark creColor="rgba(0,0,0,0.5)" construColor="#000000" dotColor="rgba(0,0,0,0.35)" size="base"/>
          <div style={{ marginTop:12, fontSize:10, color:"rgba(0,0,0,0.4)", letterSpacing:"0.12em", textTransform:"uppercase" }}>
            Proforma Inteligente · México
          </div>
        </div>

        {/* 2 — Carbon background (App native) */}
        <div
          onMouseEnter={()=>setLogoHover("carbon")}
          onMouseLeave={()=>setLogoHover(null)}
          style={{ padding:"36px 28px", background:C.bg.base, borderRadius:C.r.xl, border:`1px solid ${C.bg.border}`, cursor:"default", transition:"all 0.2s" }}
        >
          <div style={{ fontSize:9, fontWeight:800, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:16 }}>Dark Mode · App Nativa</div>
          {/* Mark + Wordmark horizontal */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <LogoMark bg={C.volt} textColor="#000000" size={40}/>
            <Wordmark creColor={C.text.secondary} construColor={C.text.primary} dotColor={C.text.muted} size="lg"/>
          </div>
          {/* Just wordmark */}
          <Wordmark creColor={C.text.secondary} construColor={C.volt} dotColor={C.text.muted} size="base"/>
          <div style={{ marginTop:12, fontSize:10, color:C.text.muted, letterSpacing:"0.12em", textTransform:"uppercase" }}>
            Proforma Inteligente · México
          </div>
        </div>

        {/* 3 — White background */}
        <div
          onMouseEnter={()=>setLogoHover("white")}
          onMouseLeave={()=>setLogoHover(null)}
          style={{ padding:"36px 28px", background:"#FFFFFF", borderRadius:C.r.xl, cursor:"default", transition:"all 0.2s" }}
        >
          <div style={{ fontSize:9, fontWeight:800, color:"#BBBBBB", textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:16 }}>Documentos · PDF · Email</div>
          {/* Mark + Wordmark horizontal */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <LogoMark bg="#0C0C0E" textColor={C.volt} size={40}/>
            <Wordmark creColor="#888888" construColor="#0C0C0E" dotColor="#BBBBBB" size="lg"/>
          </div>
          {/* Just wordmark */}
          <Wordmark creColor="#999999" construColor="#0C0C0E" dotColor="#BBBBBB" size="base"/>
          <div style={{ marginTop:12, fontSize:10, color:"#BBBBBB", letterSpacing:"0.12em", textTransform:"uppercase" }}>
            Proforma Inteligente · México
          </div>
        </div>

        {/* 4 — Minimal (compact) */}
        <div
          onMouseEnter={()=>setLogoHover("mini")}
          onMouseLeave={()=>setLogoHover(null)}
          style={{ padding:"36px 28px", background:C.bg.surface, borderRadius:C.r.xl, border:`1px solid ${C.bg.border}`, cursor:"default", display:"flex", flexDirection:"column", justifyContent:"center" }}
        >
          <div style={{ fontSize:9, fontWeight:800, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:20 }}>Compact · Sidebar · Favicon</div>
          {/* Sizes */}
          <div style={{ display:"flex", gap:16, alignItems:"flex-end", marginBottom:20 }}>
            {[16,24,32,48].map(s=>(
              <div key={s} style={{ textAlign:"center" }}>
                <LogoMark bg={C.volt} textColor="#000000" size={s}/>
                <div style={{ fontSize:8, color:C.text.muted, marginTop:4 }}>{s}px</div>
              </div>
            ))}
          </div>
          {/* App version */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <LogoMark bg={C.volt} textColor="#000000" size={28}/>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:C.text.primary }}>crea<span style={{ color:C.volt }}>Construye</span></div>
              <div style={{ fontSize:9, color:C.text.muted, letterSpacing:"0.15em", textTransform:"uppercase" }}>Proforma AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Typography anatomy */}
      <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:12 }}>
        Anatomía tipográfica del wordmark
      </div>
      <div style={{ background:C.bg.raised, borderRadius:C.r.xl, border:`1px solid ${C.bg.border}`, padding:"28px 28px" }}>
        {/* The wordmark large with annotations */}
        <div style={{ display:"flex", alignItems:"baseline", gap:0, marginBottom:24, paddingBottom:16, borderBottom:`1px solid ${C.bg.border}` }}>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:40, fontWeight:400, color:C.text.secondary, fontFamily:C.font.sans, lineHeight:1 }}>crea</span>
            <div style={{ position:"absolute", bottom:-18, left:0, right:0, textAlign:"center" }}>
              <div style={{ fontSize:9, color:C.text.muted }}>400 · text.secondary</div>
            </div>
          </div>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:48, fontWeight:900, color:C.text.primary, fontFamily:C.font.sans, letterSpacing:"-0.02em", lineHeight:1 }}>Construye</span>
            <div style={{ position:"absolute", bottom:-18, left:0, right:0, textAlign:"center" }}>
              <div style={{ fontSize:9, color:C.volt }}>900 · text.primary → volt on dark</div>
            </div>
          </div>
          <div style={{ position:"relative" }}>
            <span style={{ fontSize:24, fontWeight:500, color:C.text.muted, fontFamily:C.font.sans, letterSpacing:"0.02em", lineHeight:1 }}>.com</span>
            <div style={{ position:"absolute", bottom:-18, left:0, right:0, textAlign:"center" }}>
              <div style={{ fontSize:9, color:C.text.muted }}>500 · muted</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop:24 }}>
          <Spec k="Fuente" v="Geist / Inter — la misma que toda la UI"/>
          <Spec k='"crea"' v="font-weight: 400 — setup del nombre"/>
          <Spec k='"Construye"' v="font-weight: 900 — el poder de la palabra"/>
          <Spec k='".com"' v="font-weight: 500 · tracking 0.02em · 60% del tamaño de Construye"/>
          <Spec k="Interletraje Construye" v="letter-spacing: -0.02em"/>
          <Spec k="Casing" v="crea (todo minúscula) + Construye (capital C — intencional)"/>
          <Spec k="Separación" v="Cero — las dos palabras se tocan, forman una sola"/>
          <Spec k="Color en dark mode" v='"crea" → text.secondary · "Construye" → volt o text.primary'/>
          <Spec k="Color en volt bg" v='Todo en black — "crea" opacity 60%, "Construye" 100%'/>
          <Spec k="Color en white bg" v='"crea" #999 · "Construye" #0C0C0E · ".com" #BBB'/>
        </div>
      </div>

      {/* Rules */}
      <div style={{ fontSize:10, fontWeight:700, color:C.text.muted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8, marginTop:20 }}>
        Reglas del logo
      </div>
      <div style={{ background:C.bg.raised, borderRadius:C.r.lg, border:`1px solid ${C.bg.border}`, padding:"14px 18px" }}>
        {[
          "Nunca distorsionar las proporciones del logomark",
          '"Construye" siempre con C mayúscula — es parte del nombre, no un error',
          "El logo mínimo funcional es 80px de ancho (wordmark) o 24px (solo mark)",
          "En volt bg: texto en negro. En fondo oscuro: Construye en volt o white",
          "No usar el logomark solo en colores fuera del sistema (ni gradientes)",
          "La tagline 'Proforma Inteligente · México' es opcional — solo en contextos formales",
          "No alterar la jerarquía de peso: crea no puede ser más bold que Construye",
          ".com es siempre parte del wordmark — nunca omitir en contextos digitales",
        ].map((r,i)=><Rule key={i}>{r}</Rule>)}
      </div>
    </div>
  );
};

// ================================================================
// APP
// ================================================================
const TABS = ["Responsivo", "Iconos", "Logo & Marca"];

export default function MobileIconsLogo() {
  const [tab, setTab] = useState(0);
  const panels = [Responsivo, Iconos, LogoMarca];
  const Panel = panels[tab];

  return (
    <div style={{ fontFamily:C.font.sans, background:C.bg.base, minHeight:"100vh", color:C.text.primary }}>
      {/* Header */}
      <div style={{ background:C.bg.surface, borderBottom:`1px solid ${C.bg.border}`, padding:"0 20px", display:"flex", alignItems:"center", gap:16, height:48, position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:24, borderRadius:6, background:C.volt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#000" }}>C</div>
          <span style={{ fontSize:13, fontWeight:800 }}>crea<span style={{ color:C.volt }}>Construye</span></span>
          <span style={{ fontSize:10, color:C.text.muted, borderLeft:`1px solid ${C.bg.border}`, paddingLeft:10 }}>Design System · Mobile + Icons + Logo</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom:`1px solid ${C.bg.border}`, display:"flex", background:C.bg.surface }}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)} style={{
            flex:1, padding:"13px 8px", background:"transparent", border:"none",
            borderBottom:tab===i ? `2px solid ${C.volt}` : "2px solid transparent",
            color:tab===i ? C.volt : C.text.muted,
            fontSize:13, fontWeight:tab===i ? 700 : 500, cursor:"pointer",
            transition:"all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:"28px 24px 80px" }}>
        <Panel/>
      </div>
    </div>
  );
}
