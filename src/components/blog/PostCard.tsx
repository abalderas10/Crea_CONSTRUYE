import Link from "next/link";
import { getCategory, formatDate, type Post } from "@/content/blog";

export function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  const cat = getCategory(post.category);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col rounded-xl border border-line bg-raised p-5 transition-colors hover:border-faint ${
        featured ? "sm:p-7" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: `${cat.color}1f`, color: cat.color }}
        >
          {cat.name}
        </span>
        <span className="text-[11px] text-faint">
          {formatDate(post.date)} · {post.readMin} min
        </span>
      </div>

      <h3
        className={`mt-3 font-extrabold leading-tight tracking-tight text-ink ${
          featured ? "text-2xl" : "text-[17px]"
        }`}
      >
        {post.title}
      </h3>
      <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted">
        {post.excerpt}
      </p>
      <span className="mt-4 inline-block text-[12px] font-bold text-volt opacity-0 transition-opacity group-hover:opacity-100">
        Leer →
      </span>
    </Link>
  );
}
