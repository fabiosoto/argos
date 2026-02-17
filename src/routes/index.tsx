import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { MiniBarChart, ProgressRing, HorizontalBars, Sparkline } from "@/components/MiniChart";
import { StatusBadge } from "@/components/DataTable";
import { ExportModal } from "@/components/ExportModal";
import {
  executiveKPIs,
  salesChannels,
  monthlyRevenue,
  productionLines,
  topProducts,
  inventoryAlerts,
  supportTickets,
  logistics,
} from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/constants";

export const Route = createFileRoute("/")({
  component: DashboardHome,
});

function DashboardHome() {
  const [exportOpen, setExportOpen] = useState(false);
  const openTickets = supportTickets.filter((t) => t.status !== "resolvido").length;
  const inTransit = logistics.filter((l) => l.status === "em_transito").length;
  const delivered = logistics.filter((l) => l.status === "entregue").length;

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Painel Executivo</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Visão consolidada de todos os processos — atualizado em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50">
            <option>Últimos 30 dias</option>
            <option>Últimos 7 dias</option>
            <option>Este mês</option>
            <option>Trimestre</option>
          </select>
          <button
            onClick={() => setExportOpen(true)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors duration-200 flex items-center gap-1.5"
          >
            📥 Exportar
          </button>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {executiveKPIs.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Revenue Chart */}
        <div className="col-span-12 lg:col-span-8 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Faturamento Mensal</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Últimos 12 meses</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span className="text-[10px] text-zinc-500">Faturamento</span>
              </div>
            </div>
          </div>
          <MiniBarChart
            data={monthlyRevenue.map((m) => ({
              label: m.month,
              value: m.revenue,
            }))}
            height={180}
          />
        </div>

        {/* Production Lines */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Linhas de Produção</h3>
          <p className="text-xs text-zinc-500 mb-4">Utilização em tempo real</p>
          <div className="flex items-center justify-around mb-4">
            {productionLines.map((line) => (
              <ProgressRing
                key={line.name}
                value={line.utilization}
                color={line.utilization > 90 ? "#ef4444" : line.utilization > 75 ? "#3b82f6" : "#10b981"}
                label={line.name.split(" - ")[1]}
                size={85}
              />
            ))}
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800/60">
            {productionLines.map((line) => (
              <div key={line.name} className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{line.name.split(" - ")[1]}</span>
                <span className="text-zinc-300 font-medium">
                  {line.producing}/{line.capacity} un/dia
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Channels */}
        <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Canais de Venda</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Performance por marketplace</p>
            </div>
          </div>
          <div className="space-y-3">
            {salesChannels.map((ch) => {
              const maxRevenue = Math.max(...salesChannels.map((c) => c.revenue));
              const pct = (ch.revenue / maxRevenue) * 100;
              return (
                <div key={ch.id} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{ch.icon}</span>
                      <span className="text-xs font-medium text-zinc-300">{ch.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">{formatNumber(ch.orders)} pedidos</span>
                      <span className="text-xs font-semibold text-zinc-200">{formatCurrency(ch.revenue)}</span>
                      <span className={`text-[10px] font-semibold ${ch.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {ch.change >= 0 ? "↑" : "↓"} {Math.abs(ch.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 group-hover:opacity-80"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, rgb(59 130 246 / 0.6), rgb(59 130 246))` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Top Produtos</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Mais vendidos no período</p>
            </div>
          </div>
          <div className="space-y-3">
            {topProducts.map((prod, i) => (
              <div key={prod.name} className="flex items-center gap-3 group">
                <span className="w-6 h-6 rounded-md bg-zinc-800/80 flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-300 truncate">{prod.name}</p>
                  <p className="text-[10px] text-zinc-500">{formatNumber(prod.sales)} vendas</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-zinc-200">{formatCurrency(prod.revenue)}</p>
                  <p className="text-[10px] text-emerald-400">Margem {prod.margin}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">⚠️</span>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Alertas de Estoque</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Materiais abaixo do mínimo</p>
            </div>
          </div>
          <div className="space-y-3">
            {inventoryAlerts.map((alert) => (
              <div key={alert.material} className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-zinc-300">{alert.material}</span>
                  <StatusBadge
                    status={`${alert.daysToStockout}d`}
                    variant={alert.daysToStockout <= 3 ? "danger" : "warning"}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all duration-500"
                      style={{ width: `${(alert.current / alert.minimum) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                    {alert.current}/{alert.minimum} {alert.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logistics Overview */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">🚚</span>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Logística</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Status das entregas</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{inTransit}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Em Trânsito</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{delivered}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Entregues</p>
            </div>
          </div>
          <HorizontalBars
            items={[
              { label: "Preparando", value: 15, maxValue: 100, color: "#a78bfa" },
              { label: "Coletado", value: 22, maxValue: 100, color: "#60a5fa" },
              { label: "Em Trânsito", value: 45, maxValue: 100, color: "#34d399" },
              { label: "Entregue", value: 94, maxValue: 100, color: "#10b981" },
            ]}
          />
        </div>

        {/* Support Summary */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">🎧</span>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Suporte Pós-Venda</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{openTickets} tickets abertos</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-400">
                {supportTickets.filter((t) => t.sla === "estourado").length}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">SLA Estourado</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">
                {supportTickets.filter((t) => t.sla === "proximo").length}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">SLA Próximo</p>
            </div>
          </div>
          <div className="space-y-2">
            {supportTickets.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/30">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  ticket.sla === "estourado" ? "bg-red-500" : ticket.sla === "proximo" ? "bg-amber-500" : "bg-emerald-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-zinc-300 truncate">{ticket.subject}</p>
                  <p className="text-[10px] text-zinc-500">{ticket.customer}</p>
                </div>
                <StatusBadge
                  status={ticket.priority === "alta" ? "Alta" : ticket.priority === "media" ? "Média" : "Baixa"}
                  variant={ticket.priority === "alta" ? "danger" : ticket.priority === "media" ? "warning" : "info"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Integration Status */}
        <div className="col-span-12 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Status das Integrações</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Conexão com sistemas externos</p>
            </div>
            <span className="text-[10px] text-zinc-500">Última sincronização: há 2 min</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: "ERP Principal", type: "TOTVS Protheus", status: "online", latency: "45ms" },
              { name: "WMS Logística", type: "WMS Cloud", status: "online", latency: "120ms" },
              { name: "MES Fábrica", type: "MES Industrial", status: "online", latency: "38ms" },
              { name: "CRM Suporte", type: "Zendesk", status: "warning", latency: "890ms" },
              { name: "Hub Marketplaces", type: "Bling / Tiny", status: "online", latency: "210ms" },
              { name: "BI Analytics", type: "Power BI", status: "online", latency: "65ms" },
            ].map((sys) => (
              <div
                key={sys.name}
                className={`rounded-lg border p-3 transition-all duration-200 hover:scale-[1.02] ${
                  sys.status === "online"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-amber-500/5 border-amber-500/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${
                    sys.status === "online" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  }`} />
                  <span className="text-xs font-semibold text-zinc-200">{sys.name}</span>
                </div>
                <p className="text-[10px] text-zinc-500">{sys.type}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Latência: {sys.latency}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}
