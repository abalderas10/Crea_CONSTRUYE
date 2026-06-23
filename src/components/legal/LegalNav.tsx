import Link from "next/link";
import { Container, Cta, Logo } from "@/components/ui";

export function LegalNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/" className="text-[13px] font-medium text-muted transition-colors hover:text-ink">
            Inicio
          </Link>
          <Link href="/blog" className="text-[13px] font-medium text-muted transition-colors hover:text-ink">
            Blog
          </Link>
          <Link href="/legal" className="text-[13px] font-medium text-ink">
            Legal
          </Link>
          <Link href="/constructiva" className="text-[13px] font-medium text-muted transition-colors hover:text-ink">
            Constructiva
          </Link>
        </nav>
        <Cta href="/registro">Empezar gratis →</Cta>
      </Container>
    </header>
  );
}
