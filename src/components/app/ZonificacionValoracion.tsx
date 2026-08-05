"use client";

import { CalcCard } from "@/components/proforma/CalcCard";
import { MetricCard } from "@/components/proforma/MetricCard";
import { SourceTag } from "@/components/proforma/SourceTag";
import type { CalcInput } from "@/lib/proforma/types";
import {
  calcEnvolventeZonif,
  detectarRiesgos,
  permisosRequeridos,
  type ZonificacionData,
} from "@/lib/proforma/zonificacion";
import { num } from "@/lib/proforma/terreno";

export function ZonificacionValoracion({
  data,
  superficieTerreno,
}: {
  data?: ZonificacionData;
  superficieTerreno?: number;
}) {
  const norma = data?.norma;
  const servicios = data?.servicios;
  const env = calcEnvolventeZonif(
    norma,
    superficieTerreno,
    num(data?.propuesta_m2_construir),
  );
  const riesgos = detectarRiesgos(data);
  const permisos = permisosRequeridos(data?.tipo_proyecto);

  const serviciosOK = servicios
    ? [
        servicios.agua,
        servicios.drenaje,
        servicios.electricidad,
        servicios.gas,
      ].filter(Boolean).length
    : 0;
  const serviciosTotal = 4;
  const serviciosPct = Math.round((serviciosOK / serviciosTotal) * 100);

  const envInputs: CalcInput[] = [
    {
      label: "Superficie del terreno",
      value: superficieTerreno
        ? superficieTerreno.toLocaleString("es-MX") + " m²"
        : "—",
      source: "Terreno",
      kind: "tool",
    },
    {
      label: "COS",
      value: norma?.cos || "—",
      source: "Norma local",
      kind: "data",
    },
    {
      label: "CUS",
      value: norma?.cus || "—",
      source: "Norma local",
      kind: "data",
    },
    {
      label: "Niveles máximos",
      value: norma?.niveles_max || "—",
      source: "Norma local",
      kind: "data",
    },
  ];

  return (
    <div className="space-y-3">
      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard
          label="m² construibles"
          value={Math.round(env.construibleTotal).toLocaleString("es-MX")}
          unit="m²"
          source="CUS × superficie"
          sourceKind="tool"
          accent
        />
        <MetricCard
          label="Desplante"
          value={Math.round(env.desplante).toLocaleString("es-MX")}
          unit="m²"
          source="COS × superficie"
          sourceKind="tool"
        />
        <MetricCard
          label="Niveles aprox"
          value={isFinite(env.nivelesAprox) ? Math.floor(env.nivelesAprox) : "—"}
          source="CUS ÷ COS"
          sourceKind="tool"
        />
        <MetricCard
          label="Servicios públicos"
          value={`${serviciosOK}/${serviciosTotal}`}
          source="Inspección"
          sourceKind="manual"
          hint={serviciosPct + "% cubiertos"}
        />
      </div>

      {/* Veredicto de capacidad */}
      {env.propuestaM2 > 0 && (
        <div
          className="rounded-xl border p-4"
          style={
            env.propuestaCabe
              ? { borderColor: "rgba(34,197,94,0.4)", background: "rgba(34,197,94,0.06)" }
              : { borderColor: "rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.06)" }
          }
        >
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide"
            style={{ color: env.propuestaCabe ? "var(--color-success)" : "var(--color-danger)" }}>
            {env.propuestaCabe ? "✓ La propuesta cabe en CUS" : "✗ La propuesta excede CUS"}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            {env.propuestaCabe
              ? `Te sobran ${Math.round(env.excedenteM2).toLocaleString("es-MX")} m² de potencial.`
              : `Excedes por ${Math.round(env.deficitM2).toLocaleString("es-MX")} m². Opciones: reduce m² a construir,tramita cambio de uso o compra más terreno.`}
          </p>
        </div>
      )}

      {/* Envolvente detallada */}
      <CalcCard
        title="Envolvente construible (recalculada)"
        status="auto"
        result={Math.round(env.construibleTotal).toLocaleString("es-MX") + " m²"}
        resultLabel="m² máximos a construir (alimenta Costos y Mercado)"
        inputs={envInputs}
        formula={
          "m² construibles = CUS × superficie\nDesplante = COS × superficie\nNiveles ≈ CUS ÷ COS"
        }
        formulaNote={`Área libre mínima: ${Math.round(env.areaLibre).toLocaleString("es-MX")} m².${norma?.zona_codigo ? ` Clave: ${norma.zona_codigo}.` : ""}`}
      />

      {/* Riesgos automáticos */}
      {riesgos.length > 0 && (
        <div className="rounded-xl border border-line bg-raised p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
            <SourceTag source="Detección automática" kind="data" />
            Riesgos detectados automáticamente
          </div>
          <ul className="mt-3 space-y-2">
            {riesgos.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-line bg-base/40 p-3 text-[13px] leading-relaxed text-muted"
              >
                <span
                  className="mt-0.5 shrink-0 rounded-sm px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide"
                  style={
                    r.nivel === "alto"
                      ? { background: "rgba(239,68,68,0.18)", color: "var(--color-danger)" }
                      : r.nivel === "medio"
                        ? { background: "rgba(245,158,11,0.18)", color: "var(--color-warning)" }
                        : { background: "rgba(200,255,0,0.18)", color: "var(--color-volt)" }
                  }
                >
                  {r.nivel}
                </span>
                <span>{r.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Permisos típicos (catálogo) */}
      <div className="rounded-xl border border-line bg-raised p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
          <SourceTag source="Catálogo" kind="data" />
          Catálogo de permisos para {data?.tipo_proyecto ?? "habitacional"}
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-faint">
          Base general. Claude los ajustará al municipio y al proyecto específico.
        </p>
        <ol className="mt-3 space-y-1.5 text-[13px] text-muted">
          {permisos.map((p, i) => (
            <li key={p} className="flex gap-2.5">
              <span className="tabular w-5 shrink-0 text-right text-faint">
                {i + 1}.
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
