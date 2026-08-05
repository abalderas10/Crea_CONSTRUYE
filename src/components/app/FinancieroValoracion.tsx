"use client";

import { MetricCard } from "@/components/proforma/MetricCard";
import { CalcCard } from "@/components/proforma/CalcCard";
import { calcFinanciero, type FinancieroData } from "@/lib/proforma/financiero";
import { money } from "@/lib/proforma/terreno";

export function FinancieroValoracion({ data }: { data?: FinancieroData }) {
  const r = calcFinanciero(data);
  const base = r.escenarios[1]; // Escenario base

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard
          label="Inversión total"
          value={money(r.capitalPropio + r.deuda)}
          source="Calculado"
          sourceKind="tool"
        />
        <MetricCard
          label="Capital propio"
          value={money(r.capitalPropio)}
          source="Declarado"
          sourceKind="manual"
        />
        <MetricCard
          label="Deuda"
          value={money(r.deuda)}
          source="Declarado"
          sourceKind="manual"
        />
        <MetricCard
          label="Pago mensual"
          value={money(r.pagoMensualCredito)}
          source="Calculado"
          sourceKind="tool"
          accent
        />
      </div>

      <CalcCard
        title="3 Escenarios financieros"
        status="auto"
        result={`ROI ${base.roi.toFixed(1)}%`}
        resultLabel="Escenario Base · retorno sobre capital propio"
        inputs={[]}
        formula={
          "Conservador: precio -8%, absorción 1.2%/mes\n" +
          "Base: precio 0%, absorción 2.2%/mes\n" +
          "Agresivo: precio +8%, absorción 3.5%/mes"
        }
        formulaNote="Los 3 escenarios se calculan automáticamente con tu capital propio + deuda + costo de inversión."
      />

      <div className="rounded-xl border border-line bg-raised p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-faint">
          Tabla de escenarios
        </div>
        <table className="mt-3 w-full text-[13px]">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-wide text-faint">
              <th className="py-2 text-left">Escenario</th>
              <th className="py-2 text-right">Absorción</th>
              <th className="py-2 text-right">Precio/m²</th>
              <th className="py-2 text-right">Venta total</th>
              <th className="py-2 text-right">Margen</th>
              <th className="py-2 text-right">ROI</th>
            </tr>
          </thead>
          <tbody>
            {r.escenarios.map((e, i) => (
              <tr
                key={e.nombre}
                className={`border-b border-line/40 ${i === 1 ? "bg-volt/[0.04]" : ""}`}
              >
                <td className="py-2 font-semibold text-ink">{e.nombre}</td>
                <td className="tabular py-2 text-right text-muted">
                  {e.absorcionMensual.toFixed(1)} u/mes
                </td>
                <td className="tabular py-2 text-right text-muted">
                  {money(e.precioM2)}
                </td>
                <td className="tabular py-2 text-right text-muted">
                  {e.mesesParaVentaTotal} m
                </td>
                <td className="tabular py-2 text-right text-ink">
                  {e.margenNeto.toFixed(1)}%
                </td>
                <td className="tabular py-2 text-right font-bold text-ink">
                  {e.roi.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {r.recomendaciones.length > 0 && (
        <div className="rounded-xl border border-warning/40 bg-warning/[0.06] p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-warning">
            Recomendaciones del sistema
          </div>
          <ul className="mt-3 space-y-1.5">
            {r.recomendaciones.map((rec, i) => (
              <li key={i} className="text-[13px] text-muted">
                · {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}