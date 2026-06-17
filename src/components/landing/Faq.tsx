"use client";

import { useState } from "react";
import { Container, Eyebrow } from "@/components/ui";

const FAQS = [
  {
    q: "¿Qué datos necesito para empezar?",
    a: "Solo la dirección o ubicación del terreno, su superficie y el precio. La plataforma completa el resto con datos públicos de México y tú vas afinando los supuestos de tu proyecto.",
  },
  {
    q: "¿Funciona solo para México?",
    a: "Sí. creaConstruye está construida sobre fuentes mexicanas — INEGI, Banxico, CENAPRED, BIMSA, SHF y portales locales — y la regulación de COS/CUS por municipio. Es su mayor diferenciador frente a software genérico.",
  },
  {
    q: "¿Mis datos son seguros?",
    a: "Cada proyecto es privado y se guarda cifrado. Solo tú y las personas que invites pueden verlo. Nunca compartimos ni vendemos información de tus proyectos.",
  },
  {
    q: "¿Puedo compartir la proforma con mi banco o inversionista?",
    a: "Sí. Generas un link de solo lectura o exportas un PDF, Excel o memorándum de inversión con formato profesional, listo para presentar a bancos e inversionistas.",
  },
  {
    q: "¿Necesito completar todo en una sola sesión?",
    a: "No. Una proforma puede tomar días. Cada campo se auto-guarda y la IA recuerda el contexto completo del proyecto, así retomas exactamente donde lo dejaste.",
  },
  {
    q: "¿Qué tan precisa es la IA?",
    a: "La IA no inventa números: trabaja sobre datos reales y modelos financieros estándar (TIR, VAN, Monte Carlo, VaR). Su rol es interpretar, alertar y recomendar — tú siempre tomas la decisión final.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-ink">{q}</span>
        <span
          className={`text-faint transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && (
        <p className="-mt-1 pb-5 pr-8 text-sm leading-relaxed text-muted animate-float-up">
          {a}
        </p>
      )}
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <Container className="max-w-3xl">
        <div className="text-center">
          <Eyebrow className="text-center">FAQ</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h2>
        </div>
        <div className="mt-10">
          {FAQS.map((f) => (
            <Item key={f.q} {...f} />
          ))}
        </div>
      </Container>
    </section>
  );
}
