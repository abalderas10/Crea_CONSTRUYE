"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createProject, type ProjectFormState } from "@/app/app/actions";

export function NewProjectForm() {
  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(
    createProject,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Nombre del proyecto"
        name="name"
        placeholder="Torre Naucalpan Centro"
        required
        autoFocus
      />
      <Field
        label="Municipio / ubicación"
        name="municipio"
        placeholder="Naucalpan, Edomex"
      />
      <Field
        label="Tipo de desarrollo"
        name="tipo"
        placeholder="Uso mixto · 100 unidades"
      />

      {state?.error && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {state.error}
        </p>
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-volt px-5 py-2.5 text-[13px] font-extrabold text-on-volt transition-all duration-150 hover:bg-volt-sub disabled:opacity-60"
        >
          {pending ? "Creando…" : "Crear proyecto"}
        </button>
        <Link
          href="/app"
          className="text-[13px] font-medium text-muted hover:text-ink"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
        {label}
      </span>
      <input
        {...props}
        className="rounded-md border border-line bg-input px-3 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-faint focus:border-volt focus:shadow-[0_0_0_3px_rgba(200,255,0,0.18)]"
      />
    </label>
  );
}
