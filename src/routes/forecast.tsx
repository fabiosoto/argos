import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/KPICard";
import { MiniBarChart, Sparkline } from "@/components/MiniChart";
import { forecastData, salesChannels, monthlyRevenue } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/constants";

export const Route = createFileRoute("/forecast")({
  component: ForecastPage,
});

function ForecastPage() {
  const kpis = [
    { label: "Previsão Próx. Mês", value: "R$ 3,05M", change: 7.1, trend: "up" as const, icon: "📈" },
    { label: "Acurácia do Modelo", value: "94,2%", change: 1.8, trend: "up" as const, icon: "🎯" },
    { label: "Demanda Planejada", value: "3.680 un", change: 9.4, trend: "up" as const, icon: "📦" },
    { label: "Capacidade Ociosa", value: "12%", change: -3.1, trend: "down" as const, icon: "🏭" },
  ];

  const maxVal = Math.max(...forecastData.map((d) => d.upperBound));

  return (
    <div className="space-y-6 max-w-[1600px]">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Forecast & Planejamento</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Previsão de demanda e planejamento de capacidade</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => <KPICard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Forecast Chart */}
        <div className="col-span-12 lg:col-span-8 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Previsão de Faturamento</h3>
          <p className="text-xs text-zinc-500 mb-4">Realizado vs. Previsto (com intervalo de confiança)</p>
          <div className="space-y-2">
            {forecastData.map((d) => {
              const predPct = (d.predicted / maxVal) * 100;
              const actPct = d.actual ? (d.actual / maxVal) * 100 : 0;
              const loPct = (d.lowerBound / maxVal) * 100;
              const hiPct = (d.upperBound / maxVal) * 100;
              return (
                <div key={d.month} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-8 shrink-0">{d.month}</span>
                  <div className="flex-1 relative h-8">
                    {/* Confidence interval */}
                    <div className="absolute top-1/2 -translate-y-1/2 h-3 bg-blue-500/10 rounded-full" style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }} />
                    {/* Predicted */}
                    <div className="absolute top-1/2 -translate-y-1/2 h-5 bg-blue-500/30 rounded-full border border-blue-500/40" style={{ width: `${predPct}%` }}>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-blue-300">{formatCurrency(d.predicted)}</span>
                    </div>
                    {/* Actual */}
                    {d.actual && (
                      <div className="absolute top-1/2 -translate-y-1/2 h-5 bg-emerald-500/40 rounded-full border border-emerald-500/50" style={{ width: `${actPct}%` }}>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-emerald-300">{formatCurrency(d.actual)}</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] w-16 text-right font-medium ${d.actual ? "text-emerald-400" : "text-zinc-500"}`}>
                    {d.actual ? "Realizado" : "Previsto"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-800/60">
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-emerald-500/40 border border-emerald-500/50" /><span className="text-[10px] text-zinc-500">Realizado</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-blue-500/30 border border-blue-500/40" /><span className="text-[10px] text-zinc-500">Previsto</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-blue-500/10" /><span className="text-[10px] text-zinc-500">Intervalo de Confiança</span></div>
          </div>
        </div>

        {/* Channel Forecast */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Previsão por Canal</h3>
          <p className="text-xs text-zinc-500 mb-4">Próximo mês estimado</p>
          <div className="space-y-3">
            {salesChannels.map((ch) => {
              const forecast = Math.round(ch.revenue * (1 + ch.change / 100));
              return (
                <div key={ch.id} className="flex items-center gap-3">
                  <span className="text-sm">{ch.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-zinc-300 font-medium truncate">{ch.name}</span>
                      <span className="text-xs font-semibold text-zinc-200">{formatCurrency(forecast)}</span>
                    </div>
                    <Sparkline data={[ch.revenue * 0.85, ch.revenue * 0.9, ch.revenue * 0.95, ch.revenue, forecast]} color={ch.change >= 0 ? "#10b981" : "#ef4444"} width={160} height={20} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Production Planning */}
        <div className="col-span-12 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Planejamento de Produção</h3>
          <p className="text-xs text-zinc-500 mb-4">Demanda prevista vs. capacidade instalada</p>
          <MiniBarChart
            data={forecastData.map((d) => ({ label: d.month, value: d.predicted }))}
            height={140}
          />
        </div>
      </div>
    </div>
  );
}
