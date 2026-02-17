import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/KPICard";
import { HorizontalBars, ProgressRing } from "@/components/MiniChart";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { suppliers } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/constants";

export const Route = createFileRoute("/fornecedores")({
  component: FornecedoresPage,
});

function FornecedoresPage() {
  const supplierKPIs = [
    { label: "Fornecedores Ativos", value: "24", change: 4.2, trend: "up" as const, icon: "🤝" },
    { label: "Lead Time Médio", value: "5,8 dias", change: -8.3, trend: "down" as const, icon: "⏱️" },
    { label: "On-Time Rate", value: "92,4%", change: 3.1, trend: "up" as const, icon: "✅" },
    { label: "Pedidos Pendentes", value: "13", change: -12.0, trend: "down" as const, icon: "📋" },
    { label: "Qualidade Média", value: "90,3%", change: 1.8, trend: "up" as const, icon: "⭐" },
    { label: "Compras no Mês", value: "R$ 892K", change: 15.2, trend: "up" as const, icon: "💰" },
    { label: "Em Avaliação", value: "3", change: 0, trend: "stable" as const, icon: "🔍" },
    { label: "Economia Negociada", value: "R$ 47K", change: 22.5, trend: "up" as const, icon: "📉" },
  ];

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
    ativo: { label: "Ativo", variant: "success" },
    em_avaliacao: { label: "Em Avaliação", variant: "warning" },
    bloqueado: { label: "Bloqueado", variant: "danger" },
  };

  const purchaseOrders = [
    { id: "OC-2024-0341", supplier: "MadeiraTech Ltda", material: "MDF Branco 15mm", qty: "200 chapas", value: 48000, status: "aprovada", eta: "15/02/2024" },
    { id: "OC-2024-0342", supplier: "TecidosBR S.A.", material: "Tecido Suede Cinza", qty: "300 metros", value: 22500, status: "em_transito", eta: "13/02/2024" },
    { id: "OC-2024-0343", supplier: "Ferragens Premium", material: "Dobradiça 35mm", qty: "1000 pares", value: 8900, status: "entregue", eta: "11/02/2024" },
    { id: "OC-2024-0344", supplier: "EcoFoam Indústria", material: "Espuma D33", qty: "150 blocos", value: 31500, status: "aprovada", eta: "17/02/2024" },
    { id: "OC-2024-0345", supplier: "Cola & Acabamento", material: "Verniz PU Fosco", qty: "80 galões", value: 12400, status: "pendente", eta: "19/02/2024" },
    { id: "OC-2024-0346", supplier: "Vidros Especiais", material: "Vidro Temperado 6mm", qty: "50 peças", value: 18750, status: "em_transito", eta: "14/02/2024" },
  ];

  const poStatusMap: Record<string, { label: string; variant: "success" | "warning" | "info" | "neutral" }> = {
    aprovada: { label: "Aprovada", variant: "info" },
    em_transito: { label: "Em Trânsito", variant: "warning" },
    entregue: { label: "Entregue", variant: "success" },
    pendente: { label: "Pendente", variant: "neutral" },
  };

  return (
    <div className="space-y-6 max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Fornecedores & Compras</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Gestão de fornecedores e ordens de compra de matéria-prima</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors duration-200">
          + Nova Ordem de Compra
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {supplierKPIs.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} compact />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Supplier Scorecard */}
        <div className="col-span-12 lg:col-span-8">
          <DataTable
            title="Scorecard de Fornecedores"
            subtitle="Avaliação de desempenho e confiabilidade"
            columns={[
              { key: "name", label: "Fornecedor", render: (item: typeof suppliers[0]) => (
                <div>
                  <p className="text-xs font-medium text-zinc-300">{item.name}</p>
                  <p className="text-[10px] text-zinc-500">{item.category}</p>
                </div>
              )},
              { key: "leadTime", label: "Lead Time", align: "center" as const, render: (item: typeof suppliers[0]) => (
                <span className={`text-xs font-semibold ${item.leadTime <= 5 ? "text-emerald-400" : item.leadTime <= 7 ? "text-amber-400" : "text-red-400"}`}>
                  {item.leadTime} dias
                </span>
              )},
              { key: "onTimeRate", label: "On-Time", align: "center" as const, render: (item: typeof suppliers[0]) => (
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.onTimeRate > 95 ? "bg-emerald-500" : item.onTimeRate > 85 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${item.onTimeRate}%` }} />
                  </div>
                  <span className="text-xs text-zinc-300">{item.onTimeRate}%</span>
                </div>
              )},
              { key: "qualityScore", label: "Qualidade", align: "center" as const, render: (item: typeof suppliers[0]) => (
                <span className={`text-xs font-semibold ${item.qualityScore > 93 ? "text-emerald-400" : item.qualityScore > 85 ? "text-amber-400" : "text-red-400"}`}>
                  {item.qualityScore}%
                </span>
              )},
              { key: "pendingOrders", label: "Pendentes", align: "center" as const, render: (item: typeof suppliers[0]) => (
                <span className="text-xs text-zinc-400">{item.pendingOrders}</span>
              )},
              { key: "status", label: "Status", align: "center" as const, render: (item: typeof suppliers[0]) => {
                const s = statusMap[item.status];
                return <StatusBadge status={s.label} variant={s.variant} />;
              }},
            ]}
            data={suppliers}
            pageSize={6}
          />
        </div>

        {/* Supplier Performance */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">Performance por Categoria</h3>
            <p className="text-xs text-zinc-500 mb-4">On-Time Rate médio</p>
            <HorizontalBars
              items={[
                { label: "Ferragens / Acessórios", value: 98.5, maxValue: 100, color: "#10b981" },
                { label: "Madeira / MDF", value: 96.2, maxValue: 100, color: "#3b82f6" },
                { label: "Tecidos / Espumas", value: 92.4, maxValue: 100, color: "#f59e0b" },
                { label: "Químicos / Acabamento", value: 85.3, maxValue: 100, color: "#ef4444" },
                { label: "Vidro / Espelhos", value: 78.9, maxValue: 100, color: "#ef4444" },
              ]}
            />
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">Concentração de Compras</h3>
            <p className="text-xs text-zinc-500 mb-4">Top 3 fornecedores = 68% do volume</p>
            <div className="flex items-center justify-around">
              <ProgressRing value={68} color="#3b82f6" label="Top 3" size={75} />
              <ProgressRing value={89} color="#8b5cf6" label="Top 5" size={75} />
              <ProgressRing value={100} color="#10b981" label="Todos" size={75} />
            </div>
          </div>
        </div>

        {/* Purchase Orders */}
        <div className="col-span-12">
          <DataTable
            title="Ordens de Compra Recentes"
            subtitle="Acompanhamento de pedidos aos fornecedores"
            columns={[
              { key: "id", label: "OC", render: (item: typeof purchaseOrders[0]) => (
                <span className="text-xs font-mono text-blue-400">{item.id}</span>
              )},
              { key: "supplier", label: "Fornecedor", render: (item: typeof purchaseOrders[0]) => (
                <span className="text-xs text-zinc-300 font-medium">{item.supplier}</span>
              )},
              { key: "material", label: "Material", render: (item: typeof purchaseOrders[0]) => (
                <span className="text-xs text-zinc-400">{item.material}</span>
              )},
              { key: "qty", label: "Quantidade", render: (item: typeof purchaseOrders[0]) => (
                <span className="text-xs text-zinc-400">{item.qty}</span>
              )},
              { key: "value", label: "Valor", align: "right" as const, render: (item: typeof purchaseOrders[0]) => (
                <span className="text-xs font-semibold text-zinc-200">{formatCurrency(item.value)}</span>
              )},
              { key: "eta", label: "Previsão", render: (item: typeof purchaseOrders[0]) => (
                <span className="text-xs text-zinc-400">{item.eta}</span>
              )},
              { key: "status", label: "Status", align: "center" as const, render: (item: typeof purchaseOrders[0]) => {
                const s = poStatusMap[item.status];
                return <StatusBadge status={s.label} variant={s.variant} />;
              }},
            ]}
            data={purchaseOrders}
            pageSize={6}
          />
        </div>
      </div>
    </div>
  );
}
