# DESIGN

## System

creaConstruye's visual system is a **graphite industrial** palette with a
single high-energy accent (volt) and a reserved AI color (violet). The
aesthetic is "instrument, not showcase" — the app should feel like a
professional tool, not a marketing site. Inspired by Linear, Vercel
dashboards, and Bloomberg Terminal rather than SaaS landing pages.

## Tokens

### Backgrounds (layered dark system)
- `--color-base`: `#0c0c0e` — page background
- `--color-surface`: `#131316` — sidebar, header
- `--color-raised`: `#1c1c21` — cards, modals
- `--color-hover`: `#222228` — interactive hover
- `--color-active`: `#2a2a32` — pressed state
- `--color-line`: `#2e2e38` — borders, dividers
- `--color-input`: `#0f0f12` — form input fill

### Accents
- `--color-volt`: `#c8ff00` — single primary accent (CTAs only)
- `--color-volt-sub`: `#d4ff33` — volt hover
- `--color-volt-dim`: `#8fb800` — volt pressed

### AI
- `--color-violet`: `#8b5cf6` — Claude analysis containers
- `--color-violet-sub`: `#a78bfa` — Claude text/icons
- `--color-violet-dim`: `#6d28d9` — Claude pressed

### Semantic
- `--color-success`: `#22c55e` — verdicts COMPRAR / PROCEDE
- `--color-warning`: `#f59e0b` — verdicts NEGOCIAR / AJUSTAR
- `--color-danger`: `#ff3b3b` — verdicts NO_COMPRAR / errors
- `--color-info`: `#38bdf8` — informational badges

### Text
- `--color-ink`: `#f4f4f5` — primary text
- `--color-muted`: `#a1a1aa` — secondary text, descriptions
- `--color-faint`: `#52525b` — meta, labels, axis ticks
- `--color-disabled`: `#3f3f46` — disabled
- `--color-on-volt`: `#000000` — text on volt backgrounds

### Typography
- Sans: Geist Sans (Vercel) — headings, UI, body
- Mono: Geist Mono — numbers, code, tabular data
- Letter spacing: tight on display, normal on body, wide on
  uppercase labels (eyebrow pattern)

### Type scale
- `text-[10px]` uppercase tracked labels
- `text-[11px]` small caption / numeric
- `text-[12px]` meta / tertiary
- `text-[13px]` body
- `text-[15px]` emphasized body
- `text-base` (16px) UI body default
- `text-xl` (20px) section heading
- `text-2xl` (24px) page heading
- `text-3xl/4xl` (30/36px) marketing only

### Radii
- `4px` (xs) — small chips
- `6px` (sm) — buttons, inputs
- `8px` (md) — cards
- `12px` (lg) — large cards
- `16px` (xl) — major surfaces
- `pill` (9999px) — tags only, never on cards

### Spacing
8-point grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160
Tailwind classes. The grid is strict — do not introduce 7px or 13px
gaps. Section padding is 32-40px vertical. Card padding is 20-24px.

### Shadows
- `shadow-card`: `0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset`
- `shadow-volt-glow`: `0 0 16px rgba(200,255,0,0.3)` — only on primary CTA
- `shadow-violet-glow`: `0 0 16px rgba(139,92,246,0.3)` — only on AI analysis

## Motion

- 150ms transitions on interactive states (hover, active)
- ease-out (no bounce, no elastic, no overshoot)
- No pulsing dots, no auto-scrolling marquees, no decorative blinking
  cursors
- The only animation allowed without data change is the "draw-c"
  logo animation (one-time, on first paint) and the float-up
  entrance on hero sections
- Use `transform` and `opacity` only — never animate width, height,
  padding, or margin
- Respect `prefers-reduced-motion`

## Components

- **Pill** (badge): 9-10px uppercase tracked, rounded-xs, color-bordered
- **Cta** (button): three variants (primary = volt, secondary = violet,
  ghost = line border). Font-weight extrabold. 5-7px horizontal padding.
- **Logo** (Chispa C mark): animated draw-once on first paint
- **Eyebrow** (label): 11px uppercase tracked, faint color
- **MetricCard** (KPI): label / value / hint / source, mono numbers
- **CalcCard** (proforma formula): inputs list + result + formula + note
- **SourceTag**: 9px uppercase, color-bordered, with dot prefix
- **Prose**: blog post typography wrapper

## Voice

See `PRODUCT.md` for full voice rules. Visual echoes of voice:
- Numbers are king: every metric is mono, prominent, sourced
- Sources are shown next to data (Boleta predial, Mercado, etc.) —
  transparency is a feature
- Status badges (Completado / En proceso / Pendiente) are small,
  colored, and never decorative
- AI analysis containers are visually distinct: violet border tint,
  "AI" badge in corner, never confused with user input

## Brand

- Name: **creaConstruye** (lowercase c, capital C — distinctive
  "crea" + "Construye" wordmark)
- Domain: `creaconstruye.com`
- Locale: `es-MX`
- Voice: técnico, directo, sin hype (see PRODUCT.md)

## PDF Reports (separate system)

The 4 PDF reports (Proforma, Ejecutivo, Memorándum, Mercado) use
their own style system in `src/lib/pdf/styles.ts`. They mirror the
web system: same colors, same type, same spacing scale. The PDF
adapts to "document mode" — serif-free, more whitespace, more
typography hierarchy, but the palette and tone are consistent.

## Anti-patterns (banned)

- ❌ Inter font (overused AI default). We use Geist.
- ❌ Side-tab colored borders on cards (AI tell). Use full border or
  no border.
- ❌ Cards nested in cards. Flatten with spacing.
- ❌ Icon-tile-above-heading. Use icon-in-flow with heading.
- ❌ Hero kicker/eyebrow chip in app surfaces. Eyebrow is fine in
  marketing only.
- ❌ Italic serif display. We're a tool, not a magazine.
- ❌ Purple-to-blue gradients. We already have violet for AI; don't
  duplicate.
- ❌ Pulsing status dots. The status is the data.
- ❌ Cream / beige backgrounds. We are graphite, always.
- ❌ Bounce / elastic easing. Use ease-out only.
- ❌ Em-dash overuse in copy. Use commas, colons, periods.
- ❌ Marketing buzzwords. "empoderar", "streamline", "world-class"
  are banned.
- ❌ Hero metric layout (big number + 3 supporting stats). We use
  the metric grid pattern with CalcCard instead.
- ❌ Icon-on-hover image transform. Let imagery sit still.

## Components shared with Future Tools

When adding new components, prefer these patterns:
- A "form" component (e.g. `ZonificacionForm`) for capturing inputs
- A "valoracion" component showing calculations transparently with
  inputs and formulas
- A "analysis" component for AI output with verdict badge, confidence,
  and structured groups
- The pattern repeats per tool, with tool-specific shapes
