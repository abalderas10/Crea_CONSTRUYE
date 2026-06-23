import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogNav } from "@/components/blog/BlogNav";
import { Footer } from "@/components/landing/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/ui";
import {
  getPost,
  getCategory,
  formatDate,
  postsByDate,
  POSTS,
} from "@/content/blog";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const cat = getCategory(post.category);
  const related = postsByDate()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <BlogNav />
      <main className="flex-1">
        <article>
          <Container className="py-12">
            <Link
              href="/blog"
              className="text-[12px] font-semibold text-muted hover:text-ink"
            >
              ← Blog
            </Link>

            <div className="mt-5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: `${cat.color}1f`, color: cat.color }}
                >
                  {cat.name}
                </span>
                <span className="text-[11px] text-faint">
                  {formatDate(post.date)} · {post.readMin} min · {post.author}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">
                {post.excerpt}
              </p>
            </div>

            {/* Cuerpo */}
            <div className="mt-8 max-w-2xl border-t border-line pt-2">
              {post.body}
            </div>

            {/* CTA */}
            <div className="mt-12 max-w-2xl rounded-2xl border border-line bg-raised p-6 sm:p-8">
              <h3 className="text-lg font-extrabold tracking-tight text-ink">
                Arma tu proforma con datos reales
              </h3>
              <p className="mt-1.5 text-[14px] text-muted">
                Evalúa tu primer terreno y deja que las herramientas construyan
                el análisis.
              </p>
              <Link
                href="/registro"
                className="mt-4 inline-flex rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-colors hover:bg-volt-sub"
              >
                Empezar gratis →
              </Link>
            </div>
          </Container>
        </article>

        {/* Relacionados */}
        {related.length > 0 && (
          <Container className="pb-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-faint">
              Sigue leyendo
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </Container>
        )}
      </main>
      <Footer />
    </>
  );
}
