<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:impeccable-rules -->
# Design system: Impeccable is installed

The Impeccable skill (pbakaus/impeccable) is installed at `.opencode/skills/impeccable/`. It provides 23 design commands and 64 deterministic detector rules.

## Context
- `PRODUCT.md` (root): audience, mode (Operate), brand voice, anti-references
- `DESIGN.md` (root): tokens, components, banned patterns
- `.impeccable/config.json`: detector ignore rules for this project

## Before UI edits
- Re-read `DESIGN.md` if uncertain about tokens or banned patterns.
- For new surfaces, follow the Operate mode conventions (scanability, consistency, native expectations).

## After UI edits
- Run `npm run detect` to scan for AI slop and quality issues.
- If the detector reports findings, fix them or add to `.impeccable/config.json` `ignoreRules` with a justification.
- For new components, follow the patterns in `DESIGN.md` (Pill, Cta, MetricCard, CalcCard, SourceTag, Prose).

## When the user asks for design work
- Use `/impeccable <command> <target>` (commands include `polish`, `audit`, `critique`, `harden`, `init`, `document`, `extract`, `shape`).
- Most relevant for this project: `harden` (edge cases, error states, i18n) and `polish` (final quality pass).
- Never override `DESIGN.md` rules without asking.
<!-- END:impeccable-rules -->
