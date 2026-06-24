"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { addComment, deleteComment } from "@/app/app/herramientas/actions";
import type { ToolComment } from "@/lib/data/community-tools";

type AddState = { error: string } | { ok: true } | null;

export function Discussion({
  proposalId,
  comments,
  currentUserId,
  canComment,
  isAdmin,
}: {
  proposalId: string;
  comments: ToolComment[];
  currentUserId: string | null;
  canComment: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action = addComment.bind(null, proposalId);
  const [state, formAction, pending] = useActionState<AddState, FormData>(
    async (_prev, fd) => action(fd),
    null,
  );

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <h2 className="text-[15px] font-extrabold tracking-tight text-ink">
          Discusión
        </h2>
        <span className="tabular rounded-full bg-raised px-2 py-0.5 text-[11px] font-bold text-muted">
          {comments.length}
        </span>
      </div>
      <p className="mt-1 text-[12.5px] text-muted">
        Aporta desde tu área de conocimiento. Así pulimos la herramienta hasta
        dejarla lista.
      </p>

      {/* Formulario */}
      {canComment ? (
        <form ref={formRef} action={formAction} className="mt-4">
          <textarea
            name="body"
            rows={3}
            required
            placeholder="Comparte tu aporte, duda o sugerencia técnica…"
            className="w-full rounded-lg border border-line bg-base px-3 py-2.5 text-[13.5px] text-ink placeholder:text-faint focus:border-volt focus:outline-none"
          />
          {state && "error" in state && (
            <p className="mt-2 text-[12px] text-danger">{state.error}</p>
          )}
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-volt px-4 py-2 text-[13px] font-extrabold text-on-volt hover:bg-volt-sub disabled:opacity-50"
            >
              {pending ? "Publicando…" : "Publicar aporte"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-line bg-raised/40 px-4 py-3 text-[13px] text-muted">
          Inicia sesión para participar en la discusión.
        </div>
      )}

      {/* Lista */}
      <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <p className="text-[13px] text-faint">
            Aún no hay aportes. Sé el primero en comentar.
          </p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              proposalId={proposalId}
              canDelete={isAdmin || c.author_id === currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  proposalId,
  canDelete,
}: {
  comment: ToolComment;
  proposalId: string;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("¿Borrar este comentario?")) return;
    setBusy(true);
    const r = await deleteComment(comment.id, proposalId);
    setBusy(false);
    if (!("error" in r)) router.refresh();
  }

  const initials = comment.author_name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet/15 text-[11px] font-bold text-violet-sub">
        {initials}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-ink">
            {comment.author_name}
          </span>
          {comment.author_area && (
            <span className="rounded-sm bg-raised px-1.5 py-0.5 text-[10px] font-semibold text-muted">
              {comment.author_area}
            </span>
          )}
          <span className="text-[11px] text-faint">
            {new Date(comment.created_at).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "short",
            })}
          </span>
          {canDelete && (
            <button
              onClick={onDelete}
              disabled={busy}
              className="ml-auto text-[11px] text-faint hover:text-danger disabled:opacity-50"
            >
              Borrar
            </button>
          )}
        </div>
        <p className="mt-1 whitespace-pre-wrap text-[13.5px] leading-relaxed text-muted">
          {comment.body}
        </p>
      </div>
    </div>
  );
}
