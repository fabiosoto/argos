import { createFileRoute } from "@tanstack/react-router";
import { KPICard } from "@/components/KPICard";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { logistics } from "@/lib/mock-data";

export const Route = createFileRoute("/logistica")({
  component: LogisticaPage,
});

function LogisticaPage() {
  const kpis = [
    { label: "Entregas Hoje", value: "34", change: 12.5, trend: "up" as const, icon: "📦" },
    { label: "OTD Rate", value: "94,2%", change: 2.8, trend: "up" as const, icon: "✅" },
    { label: "Tempo Médio Entrega", value: "4,3 dias", change: -6.2, trend: "down" as const, icon: "⏱️" },
    { label: "Devoluções", value: "2,1%", change: -0.3, trend: "down" as const, icon: "↩️" },
  ];

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
    preparando: { label: "Preparando", variant: "neutral" },
    coletado: { label: "Coletado", variant: "info" },
    em_transito: { label: "Em Trânsito", variant: "warning" },
    entregue: { label: "Entregue", variant: "success" },
    devolvido: { label: "Devolvido", variant: "danger" },
  };

  const byStatus = (s: string) => logistics.filter((l) => l.status === s).length;

  return (
    <div className="space-y-6 max-w-[1600px]">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Logística & Entregas</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Rastreamento e performance de entregas</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => <KPICard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-5 gap-3">
        {(["preparando","coletado","em_transito","entregue","devolvido"] as const).map((s) => {
          const m = statusMap[s];
          return (
            <div key={s} className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-zinc-100">{byStatus(s)}</p>
              <StatusBadge status={m.label} variant={m.variant} />
            </div>
          );
        })}
      </div>

      <DataTable
        title="Rastreamento de Entregas"
        subtitle="Todas as remessas ativas"
        columns={[
          { key: "id", label: "ID", render: (i: typeof logistics[0]) => <span className="text-xs font-mono text-blue-400">{i.id}</span> },
          { key: "orderId", label: "Pedido", render: (i: typeof logistics[0]) => <span className="text-xs text-zinc-400">{i.orderId}</span> },
          { key: "customer", label: "Cliente", render: (i: typeof logistics[0]) => <span className="text-xs text-zinc-300 font-medium">{i.customer}</span> },
          { key: "city", label: "Destino", render: (i: typeof logistics[0]) => <span className="text-xs text-zinc-400">{i.city}, {i.state}</span> },
          { key: "carrier", label: "Transportadora", render: (i: typeof logistics[0]) => <span className="text-xs text-zinc-400">{i.carrier}</span> },
          { key: "channel", label: "Canal", render: (i: typeof logistics[0]) => <span className="text-xs text-zinc-400">{i.channel}</span> },
          { key: "estimatedDate", label: "Previsão", render: (i: typeof logistics[0]) => <span className="text-xs text-zinc-400">{new Date(i.estimatedDate).toLocaleDateString("pt-BR")}</span> },
          { key: "status", label: "Status", align: "center" as const, render: (i: typeof logistics[0]) => { const m = statusMap[i.status]; return <StatusBadge status={m.label} variant={m.variant} />; }},
        ]}
        data={logistics}
        pageSize={8}
      />
    </div>
  );
}
