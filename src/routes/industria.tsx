import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { ProgressRing, HorizontalBars } from "@/components/MiniChart";
import { DataTable, StatusBadge, PriorityDot } from "@/components/DataTable";
import { industryKPIs, productionOrders, productionLines, inventoryAlerts } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/constants";

export const Route = createFileRoute("/industria")({
  component: IndustriaPage,
});

function IndustriaPage() {
  const [viewMode, setViewMode] = useState<"orders" | "lines" | "maintenance">("orders");

  const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
    em_producao: { label: "Em Produção", variant: "info" },
    aguardando: { label: "Aguardando", variant: "neutral" },
    concluido: { label: "Concluído", variant: "success" },
    atrasado: { label: "Atrasado", variant: "danger" },
  };

  // Mock shift data
  const shifts = [
    { name: "Turno A (06h-14h)", workers: 42, efficiency: 92.3, output: 48, status: "ativo" },
    { name: "Turno B (14h-22h)", workers: 38, efficiency: 87.1, output: 41, status: "ativo" },
    { name: "Turno C (22h-06h)", workers: 15, efficiency: 78.5, output: 22, status: "reduzido" },
  ];

  // Mock maintenance schedule
  const maintenanceItems = [
    { id: "MNT-401", equipment: "Serra CNC Linha C", type: "Preventiva", scheduled: "14/02/2024", status: "agendada", priority: "media" as const },
    { id: "MNT-402", equipment: "Prensa Hidráulica #2", type: "Corretiva", scheduled: "12/02/2024", status: "em_andamento", priority: "alta" as const },
    { id: "MNT-403", equipment: "Esteira Transportadora L-A", type: "Preventiva", scheduled: "16/02/2024", status: "agendada", priority: "baixa" as const },
    { id: "MNT-404", equipment: "Coladeira de Borda", type: "Corretiva", scheduled: "13/02/2024", status: "aguardando_peca", priority: "alta" as const },
    { id: "MNT-405", equipment: "Compressor Industrial", type: "Preventiva", scheduled: "18/02/2024", status: "agendada", priority: "media" as const },
  ];

  const mntStatusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
    agendada: { label: "Agendada", variant: "neutral" },
    em_andamento: { label: "Em Andamento", variant: "info" },
    aguardando_peca: { label: "Aguard. Peça", variant: "warning" },
    concluida: { label: "Concluída", variant: "success" },
  };

  // Mock quality metrics
  const qualityMetrics = [
    { name: "Inspeção Visual", passed: 98.2, total: 3420 },
    { name: "Teste Estrutural", passed: 99.1, total: 3420 },
    { name: "Acabamento", passed: 96.8, total: 3420 },
    { name: "Embalagem", passed: 99.5, total: 3420 },
  ];

  // Production timeline (hourly output today)
  const hourlyOutput = [
    { hour: "06h", output: 8 }, { hour: "07h", output: 12 }, { hour: "08h", output: 15 },
    { hour: "09h", output: 14 }, { hour: "10h", output: 16 }, { hour: "11h", output: 13 },
    { hour: "12h", output: 6 }, { hour: "13h", output: 11 }, { hour: "14h", output: 14 },
    { hour: "15h", output: 15 }, { hour: "16h", output: 13 }, { hour: "17h", output: 0 },
  ];
  const maxOutput = Math.max(...hourlyOutput.map((h) => h.output));

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Controle Industrial</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Monitoramento da produção, qualidade e manutenção
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-0.5">
            {(["orders", "lines", "maintenance"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  viewMode === mode
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {mode === "orders" ? "📋 Ordens" : mode === "lines" ? "🏭 Linhas" : "🔧 Manutenção"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Industry KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {industryKPIs.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Production Lines Status */}
        <div className="col-span-12 lg:col-span-8 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Linhas de Produção</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Capacidade e eficiência em tempo real</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500">Atualizado agora</span>
            </div>
          </div>

          <div className="space-y-4">
            {productionLines.map((line) => {
              const utilizationColor =
                line.utilization > 90 ? "#ef4444" : line.utilization > 75 ? "#3b82f6" : "#10b981";
              const efficiencyColor =
                line.efficiency > 90 ? "#10b981" : line.efficiency > 80 ? "#f59e0b" : "#ef4444";

              return (
                <div
                  key={line.name}
                  className="bg-zinc-800/30 border border-zinc-800/40 rounded-lg p-4 hover:border-zinc-700/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🏭</span>
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-200">{line.name}</h4>
                        <p className="text-[10px] text-zinc-500">
                          {line.producing} de {line.capacity} un/dia
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <ProgressRing
                        value={line.utilization}
                        color={utilizationColor}
                        label="Utiliz."
                        size={64}
                        strokeWidth={5}
                      />
                      <ProgressRing
                        value={Math.round(line.efficiency)}
                        color={efficiencyColor}
                        label="Efic."
                        size={64}
                        strokeWidth={5}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-zinc-900/60 rounded-md p-2 text-center">
                      <p className="text-[10px] text-zinc-500">Capacidade</p>
                      <p className="text-sm font-bold text-zinc-200">{line.capacity} un</p>
                    </div>
                    <div className="bg-zinc-900/60 rounded-md p-2 text-center">
                      <p className="text-[10px] text-zinc-500">Produzindo</p>
                      <p className="text-sm font-bold text-blue-400">{line.producing} un</p>
                    </div>
                    <div className="bg-zinc-900/60 rounded-md p-2 text-center">
                      <p className="text-[10px] text-zinc-500">Utilização</p>
                      <p className="text-sm font-bold" style={{ color: utilizationColor }}>{line.utilization}%</p>
                    </div>
                    <div className="bg-zinc-900/60 rounded-md p-2 text-center">
                      <p className="text-[10px] text-zinc-500">Eficiência</p>
                      <p className="text-sm font-bold" style={{ color: efficiencyColor }}>{line.efficiency}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Hourly Output */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">Produção Hoje (por hora)</h3>
            <p className="text-xs text-zinc-500 mb-3">
              Total: {hourlyOutput.reduce((s, h) => s + h.output, 0)} unidades
            </p>
            <div className="flex items-end gap-1" style={{ height: 100 }}>
              {hourlyOutput.map((h, i) => {
                const barH = maxOutput > 0 ? (h.output / maxOutput) * 100 : 0;
                const isCurrent = i === 10;
                return (
                  <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full flex justify-center">
                      <div
                        className={`w-full max-w-[20px] rounded-t-sm transition-all duration-500 ${
                          isCurrent ? "bg-blue-500" : h.output === 0 ? "bg-zinc-800" : "bg-blue-500/50"
                        }`}
                        style={{ height: `${Math.max(barH, 2)}%` }}
                      />
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-200 text-[8px] font-medium px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {h.output} un
                      </div>
                    </div>
                    <span className="text-[7px] text-zinc-600">{h.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shifts */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">Turnos Ativos</h3>
            <p className="text-xs text-zinc-500 mb-3">Equipes e produtividade</p>
            <div className="space-y-3">
              {shifts.map((shift) => (
                <div key={shift.name} className="bg-zinc-800/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-300">{shift.name}</span>
                    <StatusBadge
                      status={shift.status === "ativo" ? "Ativo" : "Reduzido"}
                      variant={shift.status === "ativo" ? "success" : "warning"}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[10px] text-zinc-500">Operadores</p>
                      <p className="text-xs font-bold text-zinc-200">{shift.workers}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500">Eficiência</p>
                      <p className={`text-xs font-bold ${shift.efficiency > 90 ? "text-emerald-400" : shift.efficiency > 80 ? "text-amber-400" : "text-red-400"}`}>
                        {shift.efficiency}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500">Produção</p>
                      <p className="text-xs font-bold text-zinc-200">{shift.output} un</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-1">Controle de Qualidade</h3>
            <p className="text-xs text-zinc-500 mb-3">Taxa de aprovação por etapa</p>
            <HorizontalBars
              items={qualityMetrics.map((q) => ({
                label: q.name,
                value: q.passed,
                maxValue: 100,
                color: q.passed > 98 ? "#10b981" : q.passed > 95 ? "#f59e0b" : "#ef4444",
              }))}
            />
          </div>
        </div>

        {/* Production Orders Table */}
        <div className="col-span-12">
          <DataTable
            title="Ordens de Produção"
            subtitle="Acompanhamento de todas as ordens ativas"
            columns={[
              {
                key: "id", label: "OP",
                render: (item: typeof productionOrders[0]) => (
                  <span className="text-xs font-mono text-blue-400">{item.id}</span>
                ),
              },
              {
                key: "product", label: "Produto",
                render: (item: typeof productionOrders[0]) => (
                  <span className="text-xs text-zinc-300 font-medium">{item.product}</span>
                ),
              },
              {
                key: "line", label: "Linha",
                render: (item: typeof productionOrders[0]) => (
                  <span className="text-xs text-zinc-400">{item.line}</span>
                ),
              },
              {
                key: "progress", label: "Progresso",
                render: (item: typeof productionOrders[0]) => {
                  const pct = Math.round((item.completed / item.quantity) * 100);
                  return (
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <div className="flex-1 h-2 bg-zinc-800/80 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct === 100 ? "bg-emerald-500" : item.status === "atrasado" ? "bg-red-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 w-16 text-right">
                        {item.completed}/{item.quantity} ({pct}%)
                      </span>
                    </div>
                  );
                },
              },
              {
                key: "priority", label: "Prioridade", align: "center" as const,
                render: (item: typeof productionOrders[0]) => <PriorityDot priority={item.priority} />,
              },
              {
                key: "dueDate", label: "Prazo",
                render: (item: typeof productionOrders[0]) => {
                  const date = new Date(item.dueDate);
                  return (
                    <span className="text-xs text-zinc-400">
                      {date.toLocaleDateString("pt-BR")}
                    </span>
                  );
                },
              },
              {
                key: "status", label: "Status", align: "center" as const,
                render: (item: typeof productionOrders[0]) => {
                  const s = statusLabels[item.status];
                  return <StatusBadge status={s.label} variant={s.variant} />;
                },
              },
            ]}
            data={productionOrders}
            pageSize={6}
          />
        </div>

        {/* Inventory Alerts */}
        <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">⚠️</span>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Alertas de Matéria-Prima</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Materiais abaixo do estoque mínimo</p>
            </div>
          </div>
          <div className="space-y-3">
            {inventoryAlerts.map((alert) => (
              <div
                key={alert.material}
                className={`rounded-lg p-3 border transition-all duration-200 ${
                  alert.daysToStockout <= 3
                    ? "bg-red-500/5 border-red-500/20"
                    : "bg-amber-500/5 border-amber-500/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-300">{alert.material}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={`${alert.daysToStockout} dias`}
                      variant={alert.daysToStockout <= 3 ? "danger" : "warning"}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-zinc-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        alert.daysToStockout <= 3 ? "bg-red-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${(alert.current / alert.minimum) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                    {alert.current}/{alert.minimum} {alert.unit}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  {alert.daysToStockout <= 3
                    ? "⚠️ Compra urgente necessária"
                    : "📋 Incluir no próximo pedido"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Schedule */}
        <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">🔧</span>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Manutenções Programadas</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Preventivas e corretivas</p>
            </div>
          </div>
          <div className="space-y-3">
            {maintenanceItems.map((item) => {
              const s = mntStatusMap[item.status] || { label: item.status, variant: "neutral" as const };
              return (
                <div key={item.id} className="bg-zinc-800/30 rounded-lg p-3 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-500">{item.id}</span>
                      <PriorityDot priority={item.priority} />
                    </div>
                    <StatusBadge status={s.label} variant={s.variant} />
                  </div>
                  <p className="text-xs font-medium text-zinc-300 mb-0.5">{item.equipment}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500">{item.type}</span>
                    <span className="text-[10px] text-zinc-500">📅 {item.scheduled}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
