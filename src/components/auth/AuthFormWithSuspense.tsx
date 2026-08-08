"use client";

import { Suspense } from "react";
import { AuthForm } from "./AuthForm";

/**
 * Wrapper de AuthForm con Suspense para uso de useSearchParams.
 * (Next.js 15 requiere Suspense boundary en el padre de cualquier
 * componente que use useSearchParams.)
 */
export function AuthFormWithSuspense({ mode }: { mode: "login" | "registro" }) {
  return (
    <Suspense
      fallback={
        <div className="h-40 animate-pulse rounded-md bg-line/30" />
      }
    >
      <AuthForm mode={mode} />
    </Suspense>
  );
}