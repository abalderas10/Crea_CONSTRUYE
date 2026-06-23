import type { Metadata } from "next";
import { BlogNav } from "@/components/blog/BlogNav";
import { Footer } from "@/components/landing/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/ui";
import { postsByDate, CATEGORIES } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Ideas sobre proformas, herramientas, diseño, normatividad y construcción. La plataforma de referencia del sector creativo-constructor.",
};

export default function BlogIndexPage() {
  const posts = postsByDate();
  const [featured, ...rest] = posts;

  return (
    <>
      <BlogNav />
      <main className="flex-1">
        <Container className="py-14">
          {/* Encabezado */}
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
              Blog
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Crear, construir y calcular.
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Hablamos de proformas, de cada herramienta que publicamos, de
              diseño para arquitectura y de la normatividad que rige el sector.
              Sin humo: explicamos cómo se hace.
            </p>
          </div>

          {/* Filtros (categorías) */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c.id}
                className="rounded-full border border-line px-3 py-1 text-[12px] font-semibold text-muted"
                style={{ borderColor: `${c.color}40` }}
              >
                {c.name}
              </span>
            ))}
          </div>

          {/* Destacado */}
          {featured && (
            <div className="mt-10">
              <PostCard post={featured} featured />
            </div>
          )}

          {/* Resto */}
          {rest.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
