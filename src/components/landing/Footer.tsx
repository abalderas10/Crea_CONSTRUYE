import { Container, Logo } from "@/components/ui";

const COLS = [
  {
    title: "Producto",
    links: [
      { label: "Herramientas", href: "#herramientas" },
      { label: "Cómo funciona", href: "#como" },
      { label: "Precios", href: "#precios" },
      { label: "Caso de estudio", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "#" },
      { label: "Documentación", href: "#" },
      { label: "FAQ", href: "#faq" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos", href: "#" },
      { label: "Privacidad", href: "#" },
      { label: "Aviso de privacidad", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              La primera plataforma de proformas inmobiliarias con IA para
              México.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-faint">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row">
          <span>© 2026 creaConstruye · Hecho en México 🇲🇽</span>
          <span>Proforma Inteligente</span>
        </div>
      </Container>
    </footer>
  );
}
