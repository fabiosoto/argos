import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { MiniBarChart, Sparkline, HorizontalBars } from "@/components/MiniChart";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { retailKPIs, salesChannels, monthlyRevenue, topProducts } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/constants";

export const Route = createFileRoute("/varejo")({
  component: VarejoPage,
});

function VarejoPage() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [period, setPeriod] = useState("30d");

  const totalRevenue = salesChannels.reduce((s, c) => s + c.revenue, 0);
  const totalOrders = salesChannels.reduce((s, c) => s + c.orders, 0);

  // Mock hourly orders data for sparklines
  const hourlyData: Record<string, number[]> = {
    ml: [12, 18, 22, 15, 28, 35, 42, 38, 31, 25, 19, 14],
    amazon: [8, 12, 15, 18, 22, 28, 32, 29, 24, 20, 16, 11],
    magalu: [6, 9, 14, 17, 21, 25, 28, 26, 22, 18, 13, 9],
    shopee: [10, 15, 20, 25, 30, 35, 28, 22, 18, 15, 12, 8],
    site: [3, 5, 7, 8, 10, 12, 14, 13, 11, 9, 7, 5],
    b2b: [2, 3, 4, 5, 6, 8, 7, 6, 5, 4, 3, 2],
  };

  // Mock daily revenue for last 7 days per channel
  const weeklyRevenue: Record<string, number[]> = {
    ml: [28400, 31200, 35600, 29800, 33100, 37500, 32800],
    amazon: [19200, 22100, 24800, 21300, 25600, 28900, 23400],
    magalu: [15800, 17200, 19600, 16400, 18900, 21200, 17800],
    shopee: [9800, 12100, 14200, 11500, 13800, 15600, 12900],
    site: [8200, 9400, 10800, 9100, 10200, 11500, 9800],
    b2b: [5600, 6200, 7100, 5900, 6800, 7500, 6400],
  };

  // Mock conversion funnel
  const funnelData = [
    { stage: "Visitantes", value: 485200, pct: 100 },
    { stage: "Visualizaram Produto", value: 218340, pct: 45 },
    { stage: "Adicionaram ao Carrinho", value: 48520, pct: 10 },
    { stage: "Iniciaram Checkout", value: 29112, pct: 6 },
    { stage: "Compraram", value: 18428, pct: 3.8 },
  ];

  // Mock recent orders
  const recentOrders = [
    { id: "PED-89201", customer: "Maria Silva", channel: "Mercado Livre", product: "Sofá Retrátil 3L", value: 1998, status: "confirmado" as const, date: "12/02 14:32" },
    { id: "PED-89202", customer: "João Santos", channel: "Amazon", product: "Mesa Jantar 6L", value: 2490, status: "processando" as const, date: "12/02 14:18" },
    { id: "PED-89203", customer: "Ana Oliveira", channel: "Magazine Luiza", product: "Rack TV 180cm", value: 1199, status: "confirmado" as const, date: "12/02 13:55" },
    { id: "PED-89204", customer: "Carlos Souza", channel: "Shopee", product: "Escrivaninha HO", value: 899, status: "pendente" as const, date: "12/02 13:41" },
    { id: "PED-89205", customer: "Fernanda Lima", channel: "Site Próprio", product: "Poltrona Decorativa", value: 1650, status: "confirmado" as const, date: "12/02 13:28" },
    { id: "PED-89206", customer: "Loja Decor Plus", channel: "B2B / Atacado", product: "Kit 10x Rack TV", value: 8990, status: "processando" as const, date: "12/02 13:15" },
    { id: "PED-89207", customer: "Roberto Alves", channel: "Mercado Livre", product: "Guarda-Roupa 6P", value: 2499, status: "confirmado" as const, date: "12/02 12:58" },
    { id: "PED-89208", customer: "Patricia Costa", channel: "Amazon", product: "Cama Box Queen", value: 1890, status: "pendente" as const, date: "12/02 12:42" },
  ];

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "info" }> = {
    confirmado: { label: "Confirmado", variant: "success" },
    processando: { label: "Processando", variant: "info" },
    pendente: { label: "Pendente", variant: "warning" },
  };

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Varejo & Marketplaces</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Performance de vendas em todos os canais online
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d", "12m"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                period === p
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : p === "90d" ? "90 dias" : "12 meses"}
            </button>
          ))}
        </div>
      </div>

      {/* Retail KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {retailKPIs.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Channel Cards */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-200 mb-3">Desempenho por Canal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salesChannels.map((ch) => {
            const isSelected = selectedChannel === ch.id;
            const sharePercent = ((ch.revenue / totalRevenue) * 100).toFixed(1);
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(isSelected ? null : ch.id)}
                className={`text-left bg-zinc-900/60 border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 ${
                  isSelected
                    ? "border-blue-500/40 bg-blue-500/5 ring-1 ring-blue-500/20"
                    : "border-zinc-800/60 hover:border-zinc-700/60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{ch.icon}</span>
                    <div>
                      <span className="text-sm font-semibold text-zinc-200">{ch.name}</span>
                      <p className="text-[10px] text-zinc-500">{sharePercent}% do faturamento</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    ch.change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {ch.change >= 0 ? "↑" : "↓"} {Math.abs(ch.change)}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-[10px] text-zinc-500 mb-0.5">Receita</p>
                    <p className="text-sm font-bold text-zinc-100">{formatCurrency(ch.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 mb-0.5">Pedidos</p>
                    <p className="text-sm font-bold text-zinc-100">{formatNumber(ch.orders)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 mb-0.5">Ticket Médio</p>
                    <p className="text-sm font-bold text-zinc-100">{formatCurrency(ch.avgTicket)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500">Conversão:</span>
                    <span className="text-xs font-semibold text-blue-400">{ch.conversion}%</span>
                  </div>
                  <Sparkline
                    data={weeklyRevenue[ch.id] || [1, 2, 3, 4, 5]}
                    color={ch.change >= 0 ? "#10b981" : "#ef4444"}
                    width={80}
                    height={24}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Revenue Trend */}
        <div className="col-span-12 lg:col-span-8 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Evolução do Faturamento</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Receita mensal consolidada de todos os canais</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-zinc-100">{formatCurrency(totalRevenue)}</p>
              <p className="text-[10px] text-emerald-400">+12.3% vs mês anterior</p>
            </div>
          </div>
          <MiniBarChart
            data={monthlyRevenue.map((m) => ({
              label: m.month,
              value: m.revenue,
            }))}
            height={200}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/60">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-zinc-500">Média Mensal</p>
                <p className="text-sm font-bold text-zinc-200">
                  {formatCurrency(monthlyRevenue.reduce((s, m) => s + m.revenue, 0) / monthlyRevenue.length)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500">Melhor Mês</p>
                <p className="text-sm font-bold text-zinc-200">
                  {formatCurrency(Math.max(...monthlyRevenue.map((m) => m.revenue)))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500">Total Pedidos</p>
                <p className="text-sm font-bold text-zinc-200">
                  {formatNumber(monthlyRevenue.reduce((s, m) => s + m.orders, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Funil de Conversão</h3>
          <p className="text-xs text-zinc-500 mb-4">Jornada do cliente consolidada</p>
          <div className="space-y-2">
            {funnelData.map((step, i) => {
              const widthPct = Math.max(20, step.pct);
              const isLast = i === funnelData.length - 1;
              return (
                <div key={step.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-400">{step.stage}</span>
                    <span className="text-xs font-semibold text-zinc-300">
                      {formatNumber(step.value)}
                    </span>
                  </div>
                  <div className="relative">
                    <div
                      className={`h-7 rounded-md flex items-center justify-end pr-2 transition-all duration-700 ${
                        isLast ? "bg-emerald-500/30" : "bg-blue-500/20"
                      }`}
                      style={{ width: `${widthPct}%` }}
                    >
                      <span className={`text-[10px] font-bold ${isLast ? "text-emerald-400" : "text-blue-400"}`}>
                        {step.pct}%
                      </span>
                    </div>
                  </div>
                  {i < funnelData.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <span className="text-[9px] text-zinc-600">
                        ↓ {((1 - funnelData[i + 1].value / step.value) * 100).toFixed(0)}% abandono
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products Performance */}
        <div className="col-span-12 lg:col-span-5 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Ranking de Produtos</h3>
          <p className="text-xs text-zinc-500 mb-4">Por receita no período</p>
          <div className="space-y-3">
            {topProducts.map((prod, i) => {
              const maxRev = topProducts[0].revenue;
              const barPct = (prod.revenue / maxRev) * 100;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={prod.name} className="group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-base w-6 text-center">
                      {i < 3 ? medals[i] : <span className="text-xs text-zinc-600 font-bold">{i + 1}</span>}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-300 truncate">{prod.name}</span>
                        <span className="text-xs font-bold text-zinc-100 ml-2">{formatCurrency(prod.revenue)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-zinc-500">{formatNumber(prod.sales)} vendas</span>
                        <span className="text-[10px] text-emerald-400">Margem {prod.margin}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-9 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel Share & Metrics */}
        <div className="col-span-12 lg:col-span-7 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Participação por Canal</h3>
          <p className="text-xs text-zinc-500 mb-4">Distribuição de receita e pedidos</p>

          {/* Stacked bar visualization */}
          <div className="mb-4">
            <p className="text-[10px] text-zinc-500 mb-1.5">Receita</p>
            <div className="h-6 rounded-lg overflow-hidden flex">
              {salesChannels.map((ch) => {
                const pct = (ch.revenue / totalRevenue) * 100;
                const colors: Record<string, string> = {
                  ml: "#FFE600", amazon: "#FF9900", magalu: "#0086FF",
                  shopee: "#EE4D2D", site: "#8B5CF6", b2b: "#10B981",
                };
                return (
                  <div
                    key={ch.id}
                    className="h-full transition-all duration-500 hover:opacity-80 relative group/bar"
                    style={{ width: `${pct}%`, backgroundColor: colors[ch.id] + "99" }}
                    title={`${ch.name}: ${pct.toFixed(1)}%`}
                  >
                    {pct > 8 && (
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-zinc-900">
                        {pct.toFixed(0)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {salesChannels.map((ch) => {
                const colors: Record<string, string> = {
                  ml: "#FFE600", amazon: "#FF9900", magalu: "#0086FF",
                  shopee: "#EE4D2D", site: "#8B5CF6", b2b: "#10B981",
                };
                return (
                  <div key={ch.id} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors[ch.id] }} />
                    <span className="text-[10px] text-zinc-500">{ch.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metrics comparison table */}
          <div className="border-t border-zinc-800/60 pt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase pb-2">Canal</th>
                    <th className="text-right text-[10px] font-semibold text-zinc-500 uppercase pb-2">Receita</th>
                    <th className="text-right text-[10px] font-semibold text-zinc-500 uppercase pb-2">Pedidos</th>
                    <th className="text-right text-[10px] font-semibold text-zinc-500 uppercase pb-2">Ticket</th>
                    <th className="text-right text-[10px] font-semibold text-zinc-500 uppercase pb-2">Conv.</th>
                    <th className="text-right text-[10px] font-semibold text-zinc-500 uppercase pb-2">Var.</th>
                  </tr>
                </thead>
                <tbody>
                  {salesChannels.map((ch) => (
                    <tr key={ch.id} className="border-t border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                      <td className="py-2">
                        <span className="flex items-center gap-1.5">
                          <span className="text-sm">{ch.icon}</span>
                          <span className="text-xs text-zinc-300 font-medium">{ch.name}</span>
                        </span>
                      </td>
                      <td className="py-2 text-right text-xs text-zinc-200 font-semibold">{formatCurrency(ch.revenue)}</td>
                      <td className="py-2 text-right text-xs text-zinc-400">{formatNumber(ch.orders)}</td>
                      <td className="py-2 text-right text-xs text-zinc-400">{formatCurrency(ch.avgTicket)}</td>
                      <td className="py-2 text-right text-xs text-blue-400 font-medium">{ch.conversion}%</td>
                      <td className="py-2 text-right">
                        <span className={`text-xs font-semibold ${ch.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {ch.change >= 0 ? "+" : ""}{ch.change}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-zinc-700/50">
                    <td className="py-2 text-xs font-bold text-zinc-200">Total</td>
                    <td className="py-2 text-right text-xs font-bold text-zinc-100">{formatCurrency(totalRevenue)}</td>
                    <td className="py-2 text-right text-xs font-bold text-zinc-300">{formatNumber(totalOrders)}</td>
                    <td className="py-2 text-right text-xs font-bold text-zinc-300">{formatCurrency(Math.round(totalRevenue / totalOrders))}</td>
                    <td className="py-2 text-right text-xs font-bold text-blue-400">3.8%</td>
                    <td className="py-2 text-right text-xs font-bold text-emerald-400">+12.3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-span-12">
          <DataTable
            title="Pedidos Recentes"
            subtitle="Últimos pedidos recebidos em todos os canais"
            columns={[
              { key: "id", label: "Pedido", render: (item: typeof recentOrders[0]) => (
                <span className="text-xs font-mono text-blue-400">{item.id}</span>
              )},
              { key: "date", label: "Data", render: (item: typeof recentOrders[0]) => (
                <span className="text-xs text-zinc-400">{item.date}</span>
              )},
              { key: "customer", label: "Cliente", render: (item: typeof recentOrders[0]) => (
                <span className="text-xs text-zinc-300 font-medium">{item.customer}</span>
              )},
              { key: "channel", label: "Canal", render: (item: typeof recentOrders[0]) => (
                <span className="text-xs text-zinc-400">{item.channel}</span>
              )},
              { key: "product", label: "Produto", render: (item: typeof recentOrders[0]) => (
                <span className="text-xs text-zinc-300">{item.product}</span>
              )},
              { key: "value", label: "Valor", align: "right" as const, render: (item: typeof recentOrders[0]) => (
                <span className="text-xs font-semibold text-zinc-200">{formatCurrency(item.value)}</span>
              )},
              { key: "status", label: "Status", align: "center" as const, render: (item: typeof recentOrders[0]) => {
                const s = statusMap[item.status];
                return <StatusBadge status={s.label} variant={s.variant} />;
              }},
            ]}
            data={recentOrders}
            pageSize={6}
          />
        </div>
      </div>
    </div>
  );
}
