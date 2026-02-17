import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { DataTable, StatusBadge, PriorityDot } from "@/components/DataTable";
import { HorizontalBars, Sparkline } from "@/components/MiniChart";
import { formatCurrency } from "@/lib/constants";
import {
  supportTicketsDetailed,
  warrantyRecords,
  technicalVisits,
  returnRequests,
  supportMetrics,
  type SupportTicketDetail,
  type TechnicalVisit,
  type ReturnRequest,
  type WarrantyRecord,
} from "@/lib/mock-data-support";

export const Route = createFileRoute("/suporte")({
  component: SuportePage,
});

type TabKey = "overview" | "tickets" | "garantias" | "visitas" | "devolucoes";

function SuportePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketDetail | null>(null);

  const tabs: { key: TabKey; label: string; icon: string; count?: number }[] = [
    { key: "overview", label: "Visão Geral", icon: "📊" },
    { key: "tickets", label: "Tickets", icon: "🎧", count: supportTicketsDetailed.filter((t) => t.status !== "resolvido" && t.status !== "fechado").length },
    { key: "garantias", label: "Garantias", icon: "🛡️", count: warrantyRecords.filter((w) => w.status === "acionada").length },
    { key: "visitas", label: "Visitas Técnicas", icon: "🔧", count: technicalVisits.filter((v) => v.status === "agendada").length },
    { key: "devolucoes", label: "Devoluções", icon: "↩️", count: returnRequests.filter((r) => r.status !== "reembolsada" && r.status !== "negada").length },
  ];

  return (
    <div className="space-y-6 max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Suporte & Pós-Venda</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Portal completo de atendimento, garantias, visitas técnicas e devoluções
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-700/80 transition-colors flex items-center gap-1.5">
            📋 Relatório
          </button>
          <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
            ➕ Novo Ticket
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedTicket(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.key ? "bg-blue-500/30 text-blue-300" : "bg-zinc-700/50 text-zinc-400"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "tickets" && (
        selectedTicket
          ? <TicketDetailView ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
          : <TicketsTab onSelectTicket={setSelectedTicket} />
      )}
      {activeTab === "garantias" && <GarantiasTab />}
      {activeTab === "visitas" && <VisitasTab />}
      {activeTab === "devolucoes" && <DevolucoesTab />}
    </div>
  );
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab() {
  const kpis = [
    { label: "Tickets Abertos", value: "47", change: -15.3, trend: "down" as const, icon: "🎧" },
    { label: "Tempo Médio Resposta", value: "2,4h", change: -18.2, trend: "down" as const, icon: "⏱️" },
    { label: "SLA Cumprido", value: "87,3%", change: 4.1, trend: "up" as const, icon: "✅" },
    { label: "Resolução 1º Contato", value: "42,3%", change: 3.8, trend: "up" as const, icon: "🎯" },
    { label: "CSAT", value: "4,2/5", change: 0.3, trend: "up" as const, icon: "😊" },
    { label: "NPS Suporte", value: "68", change: 5.2, trend: "up" as const, icon: "⭐" },
    { label: "Visitas Agendadas", value: "3", change: -2.0, trend: "down" as const, icon: "🔧" },
    { label: "Devoluções Pendentes", value: "4", change: -1.0, trend: "down" as const, icon: "↩️" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => <KPICard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Tickets by Category */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Tickets por Categoria</h3>
          <p className="text-xs text-zinc-500 mb-4">Distribuição dos chamados</p>
          <HorizontalBars
            items={supportMetrics.ticketsByCategory.map((c) => ({
              label: c.category,
              value: c.percentage,
              maxValue: 100,
              color: c.category === "Defeito" ? "#ef4444" : c.category === "Montagem" ? "#3b82f6" : c.category === "Troca" ? "#f59e0b" : c.category === "Reclamação" ? "#f97316" : c.category === "Garantia" ? "#8b5cf6" : "#10b981",
              suffix: "%",
            }))}
          />
        </div>

        {/* Tickets by Channel */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Tickets por Canal</h3>
          <p className="text-xs text-zinc-500 mb-4">Origem dos chamados</p>
          <HorizontalBars
            items={supportMetrics.ticketsByChannel.map((c) => ({
              label: c.channel,
              value: c.percentage,
              maxValue: 100,
              color: c.channel.includes("Mercado") ? "#FFE600" : c.channel.includes("Amazon") ? "#FF9900" : c.channel.includes("Shopee") ? "#EE4D2D" : c.channel.includes("Magalu") || c.channel.includes("Magazine") ? "#0086FF" : c.channel.includes("Site") ? "#8B5CF6" : "#10B981",
              suffix: "%",
            }))}
          />
        </div>

        {/* Weekly Trend */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Tendência Semanal</h3>
          <p className="text-xs text-zinc-500 mb-4">Tickets abertos vs resolvidos</p>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400">Tickets Abertos</span>
                <span className="text-xs font-semibold text-red-400">43 esta semana</span>
              </div>
              <Sparkline data={supportMetrics.weeklyTrend} color="#ef4444" height={40} width={260} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400">Taxa de Resolução (%)</span>
                <span className="text-xs font-semibold text-emerald-400">84% esta semana</span>
              </div>
              <Sparkline data={supportMetrics.resolutionRate} color="#10b981" height={40} width={260} />
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="col-span-12 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Performance da Equipe</h3>
          <p className="text-xs text-zinc-500 mb-4">Métricas individuais dos atendentes</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {supportMetrics.technicianPerformance.map((tech) => (
              <div key={tech.name} className="bg-zinc-800/40 border border-zinc-700/30 rounded-lg p-4 hover:border-zinc-600/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm">
                    {tech.name.split(" ")[0][0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">{tech.name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500">Resolvidos</span>
                    <span className="text-xs font-bold text-zinc-200">{tech.resolved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500">Tempo Médio</span>
                    <span className="text-xs font-bold text-zinc-200">{tech.avgTime}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500">Satisfação</span>
                    <span className="text-xs font-bold text-amber-400">{"⭐".repeat(Math.round(tech.satisfaction))} {tech.satisfaction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Critical Tickets */}
        <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">🚨 Tickets Críticos</h3>
          <p className="text-xs text-zinc-500 mb-4">Requerem atenção imediata</p>
          <div className="space-y-2">
            {supportTicketsDetailed
              .filter((t) => t.priority === "critica" || t.sla === "estourado")
              .map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-red-400">{t.id}</span>
                      <StatusBadge status={t.sla === "estourado" ? "SLA Estourado" : "Crítico"} variant="danger" />
                    </div>
                    <p className="text-xs text-zinc-300 mt-0.5 truncate">{t.subject}</p>
                    <p className="text-[10px] text-zinc-500">{t.customer} · {t.channel}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">{t.createdAt}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Upcoming Visits */}
        <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">📅 Próximas Visitas</h3>
          <p className="text-xs text-zinc-500 mb-4">Agenda de visitas técnicas</p>
          <div className="space-y-2">
            {technicalVisits
              .filter((v) => v.status === "agendada")
              .map((v) => (
                <div key={v.id} className="flex items-center gap-3 p-3 bg-zinc-800/40 border border-zinc-700/30 rounded-lg">
                  <div className="text-center min-w-[48px]">
                    <p className="text-lg font-bold text-blue-400">{new Date(v.scheduledDate).getDate()}</p>
                    <p className="text-[10px] text-zinc-500">{v.scheduledTime}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-200">{v.customer}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{v.product}</p>
                    <p className="text-[10px] text-zinc-500">{v.city}/{v.state} · {v.technician}</p>
                  </div>
                  <StatusBadge
                    status={v.type === "reparo" ? "Reparo" : v.type === "montagem" ? "Montagem" : v.type === "troca" ? "Troca" : "Vistoria"}
                    variant={v.type === "reparo" ? "warning" : v.type === "montagem" ? "info" : v.type === "troca" ? "danger" : "neutral"}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── TICKETS TAB ─── */
function TicketsTab({ onSelectTicket }: { onSelectTicket: (t: SupportTicketDetail) => void }) {
  const [filter, setFilter] = useState<string>("todos");

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
    aberto: { label: "Aberto", variant: "danger" },
    em_andamento: { label: "Em Andamento", variant: "info" },
    aguardando_cliente: { label: "Aguard. Cliente", variant: "warning" },
    aguardando_peca: { label: "Aguard. Peça", variant: "warning" },
    visita_agendada: { label: "Visita Agendada", variant: "info" },
    resolvido: { label: "Resolvido", variant: "success" },
    fechado: { label: "Fechado", variant: "neutral" },
  };

  const priorityMap: Record<string, "alta" | "media" | "baixa"> = {
    critica: "alta",
    alta: "alta",
    media: "media",
    baixa: "baixa",
  };

  const filtered = filter === "todos"
    ? supportTicketsDetailed
    : supportTicketsDetailed.filter((t) => t.status === filter);

  const statusCounts = supportTicketsDetailed.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {/* Status filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter("todos")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === "todos" ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 hover:text-zinc-200"
          }`}
        >
          Todos ({supportTicketsDetailed.length})
        </button>
        {Object.entries(statusMap).map(([key, val]) => {
          const count = statusCounts[key] || 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === key ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 hover:text-zinc-200"
              }`}
            >
              {val.label} ({count})
            </button>
          );
        })}
      </div>

      <DataTable
        title="Tickets de Suporte"
        subtitle={`${filtered.length} chamados ${filter !== "todos" ? `com status "${statusMap[filter]?.label}"` : ""}`}
        columns={[
          {
            key: "id", label: "Ticket",
            render: (i: SupportTicketDetail) => (
              <button onClick={() => onSelectTicket(i)} className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                {i.id}
              </button>
            ),
          },
          { key: "customer", label: "Cliente", render: (i: SupportTicketDetail) => <span className="text-xs text-zinc-300 font-medium">{i.customer}</span> },
          { key: "product", label: "Produto", render: (i: SupportTicketDetail) => <span className="text-xs text-zinc-400 truncate max-w-[180px] block">{i.product}</span> },
          { key: "subject", label: "Assunto", render: (i: SupportTicketDetail) => <span className="text-xs text-zinc-400 truncate max-w-[200px] block">{i.subject}</span> },
          { key: "category", label: "Categoria", render: (i: SupportTicketDetail) => <CategoryBadge category={i.category} /> },
          { key: "channel", label: "Canal", render: (i: SupportTicketDetail) => <span className="text-xs text-zinc-400">{i.channel}</span> },
          { key: "priority", label: "Prioridade", align: "center" as const, render: (i: SupportTicketDetail) => i.priority === "critica" ? <StatusBadge status="Crítica" variant="danger" /> : <PriorityDot priority={priorityMap[i.priority]} /> },
          { key: "sla", label: "SLA", align: "center" as const, render: (i: SupportTicketDetail) => <StatusBadge status={i.sla === "dentro" ? "OK" : i.sla === "proximo" ? "Próximo" : "Estourado"} variant={i.sla === "dentro" ? "success" : i.sla === "proximo" ? "warning" : "danger"} /> },
          { key: "status", label: "Status", align: "center" as const, render: (i: SupportTicketDetail) => { const s = statusMap[i.status]; return s ? <StatusBadge status={s.label} variant={s.variant} /> : null; } },
          { key: "assignedTo", label: "Responsável", render: (i: SupportTicketDetail) => <span className="text-xs text-zinc-400">{i.assignedTo || "—"}</span> },
        ]}
        data={filtered}
        pageSize={8}
      />
    </>
  );
}

/* ─── TICKET DETAIL VIEW ─── */
function TicketDetailView({ ticket, onBack }: { ticket: SupportTicketDetail; onBack: () => void }) {
  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
    aberto: { label: "Aberto", variant: "danger" },
    em_andamento: { label: "Em Andamento", variant: "info" },
    aguardando_cliente: { label: "Aguard. Cliente", variant: "warning" },
    aguardando_peca: { label: "Aguard. Peça", variant: "warning" },
    visita_agendada: { label: "Visita Agendada", variant: "info" },
    resolvido: { label: "Resolvido", variant: "success" },
    fechado: { label: "Fechado", variant: "neutral" },
  };

  const timelineIcons: Record<string, string> = {
    created: "📝",
    assigned: "👤",
    status_change: "🔄",
    message: "💬",
    escalated: "🚨",
    resolved: "✅",
    visit_scheduled: "📅",
  };

  const st = statusMap[ticket.status];

  return (
    <div className="space-y-4">
      {/* Back button & header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700/80 transition-colors">
          ← Voltar
        </button>
        <span className="text-sm font-mono text-blue-400 font-bold">{ticket.id}</span>
        {st && <StatusBadge status={st.label} variant={st.variant} />}
        <StatusBadge status={ticket.sla === "dentro" ? "SLA OK" : ticket.sla === "proximo" ? "SLA Próximo" : "SLA Estourado"} variant={ticket.sla === "dentro" ? "success" : ticket.sla === "proximo" ? "warning" : "danger"} />
        {ticket.priority === "critica" && <StatusBadge status="CRÍTICO" variant="danger" />}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Main content */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Ticket info */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h2 className="text-base font-bold text-zinc-100 mb-2">{ticket.subject}</h2>
            <p className="text-sm text-zinc-400 mb-4">{ticket.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoField label="Produto" value={ticket.product} />
              <InfoField label="Pedido" value={ticket.orderNumber} />
              <InfoField label="Canal" value={ticket.channel} />
              <InfoField label="Categoria" value={ticket.category} />
            </div>
          </div>

          {/* Messages */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">💬 Conversação</h3>
            <div className="space-y-3">
              {ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.senderType === "customer"
                      ? "bg-zinc-800/40 border border-zinc-700/30 ml-0 mr-12"
                      : msg.senderType === "agent"
                      ? "bg-blue-500/10 border border-blue-500/20 ml-12 mr-0"
                      : "bg-amber-500/5 border border-amber-500/10 mx-6"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${
                      msg.senderType === "customer" ? "text-zinc-300" : msg.senderType === "agent" ? "text-blue-400" : "text-amber-400"
                    }`}>
                      {msg.senderType === "system" ? "🤖 Sistema" : msg.sender}
                    </span>
                    <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Reply box */}
            <div className="mt-4 pt-4 border-t border-zinc-800/60">
              <textarea
                placeholder="Escreva uma resposta..."
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1.5 bg-zinc-800/50 border border-zinc-700/30 rounded-md text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors">
                    📎 Anexar
                  </button>
                  <button className="px-2.5 py-1.5 bg-zinc-800/50 border border-zinc-700/30 rounded-md text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors">
                    📋 Template
                  </button>
                </div>
                <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors">
                  Enviar Resposta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Customer info */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">👤 Cliente</h3>
            <div className="space-y-3">
              <InfoField label="Nome" value={ticket.customer} />
              <InfoField label="Email" value={ticket.customerEmail} />
              <InfoField label="Telefone" value={ticket.customerPhone} />
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">🎯 Atribuição</h3>
            <div className="space-y-3">
              <InfoField label="Responsável" value={ticket.assignedTo || "Não atribuído"} />
              <InfoField label="Criado em" value={ticket.createdAt} />
              <InfoField label="Atualizado" value={ticket.updatedAt} />
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800/60 flex gap-2">
              <button className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700/30 rounded-lg text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors font-semibold">
                Reatribuir
              </button>
              <button className="flex-1 px-3 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
                Resolver
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">📋 Histórico</h3>
            <div className="space-y-0">
              {ticket.timeline.map((event, i) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-sm">{timelineIcons[event.type] || "📌"}</span>
                    {i < ticket.timeline.length - 1 && <div className="w-px h-full bg-zinc-800/60 min-h-[24px]" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-zinc-300">{event.description}</p>
                    <p className="text-[10px] text-zinc-500">{event.timestamp} · {event.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">⚡ Ações Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/30 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700/50 transition-colors text-left flex items-center gap-2">
                📅 Agendar Visita Técnica
              </button>
              <button className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/30 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700/50 transition-colors text-left flex items-center gap-2">
                📦 Enviar Peça de Reposição
              </button>
              <button className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/30 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700/50 transition-colors text-left flex items-center gap-2">
                ↩️ Iniciar Devolução
              </button>
              <button className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/30 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700/50 transition-colors text-left flex items-center gap-2">
                🚨 Escalar Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── GARANTIAS TAB ─── */
function GarantiasTab() {
  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
    ativa: { label: "Ativa", variant: "success" },
    expirada: { label: "Expirada", variant: "neutral" },
    acionada: { label: "Acionada", variant: "warning" },
  };

  const activeCt = warrantyRecords.filter((w) => w.status === "ativa").length;
  const claimedCt = warrantyRecords.filter((w) => w.status === "acionada").length;
  const expiredCt = warrantyRecords.filter((w) => w.status === "expirada").length;

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">{activeCt}</p>
          <p className="text-xs text-zinc-500 mt-1">Garantias Ativas</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-400">{claimedCt}</p>
          <p className="text-xs text-zinc-500 mt-1">Garantias Acionadas</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-zinc-500">{expiredCt}</p>
          <p className="text-xs text-zinc-500 mt-1">Garantias Expiradas</p>
        </div>
      </div>

      <DataTable
        title="Registro de Garantias"
        subtitle="Controle de garantias por produto e cliente"
        columns={[
          { key: "id", label: "ID", render: (i: WarrantyRecord) => <span className="text-xs font-mono text-blue-400">{i.id}</span> },
          { key: "orderNumber", label: "Pedido", render: (i: WarrantyRecord) => <span className="text-xs text-zinc-400">{i.orderNumber}</span> },
          { key: "product", label: "Produto", render: (i: WarrantyRecord) => <span className="text-xs text-zinc-300 font-medium truncate max-w-[180px] block">{i.product}</span> },
          { key: "customer", label: "Cliente", render: (i: WarrantyRecord) => <span className="text-xs text-zinc-300">{i.customer}</span> },
          { key: "purchaseDate", label: "Compra", render: (i: WarrantyRecord) => <span className="text-xs text-zinc-400">{new Date(i.purchaseDate).toLocaleDateString("pt-BR")}</span> },
          { key: "warrantyExpiry", label: "Vencimento", render: (i: WarrantyRecord) => {
            const isExpiring = new Date(i.warrantyExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            return <span className={`text-xs ${isExpiring ? "text-amber-400 font-semibold" : "text-zinc-400"}`}>{new Date(i.warrantyExpiry).toLocaleDateString("pt-BR")}</span>;
          }},
          { key: "claims", label: "Acionamentos", align: "center" as const, render: (i: WarrantyRecord) => <span className={`text-xs font-bold ${i.claims > 0 ? "text-amber-400" : "text-zinc-500"}`}>{i.claims}</span> },
          { key: "channel", label: "Canal", render: (i: WarrantyRecord) => <span className="text-xs text-zinc-400">{i.channel}</span> },
          { key: "status", label: "Status", align: "center" as const, render: (i: WarrantyRecord) => { const s = statusMap[i.status]; return s ? <StatusBadge status={s.label} variant={s.variant} /> : null; } },
        ]}
        data={warrantyRecords}
        pageSize={8}
      />
    </>
  );
}

/* ─── VISITAS TAB ─── */
function VisitasTab() {
  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
    agendada: { label: "Agendada", variant: "info" },
    em_rota: { label: "Em Rota", variant: "warning" },
    concluida: { label: "Concluída", variant: "success" },
    cancelada: { label: "Cancelada", variant: "danger" },
    reagendada: { label: "Reagendada", variant: "neutral" },
  };

  const typeMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
    montagem: { label: "Montagem", variant: "info" },
    reparo: { label: "Reparo", variant: "warning" },
    troca: { label: "Troca", variant: "danger" },
    vistoria: { label: "Vistoria", variant: "neutral" },
  };

  const scheduled = technicalVisits.filter((v) => v.status === "agendada").length;
  const completed = technicalVisits.filter((v) => v.status === "concluida").length;

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-blue-400">{scheduled}</p>
          <p className="text-xs text-zinc-500 mt-1">Agendadas</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-400">0</p>
          <p className="text-xs text-zinc-500 mt-1">Em Rota</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">{completed}</p>
          <p className="text-xs text-zinc-500 mt-1">Concluídas</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-red-400">{technicalVisits.filter((v) => v.status === "cancelada").length}</p>
          <p className="text-xs text-zinc-500 mt-1">Canceladas</p>
        </div>
      </div>

      <DataTable
        title="Visitas Técnicas"
        subtitle="Agenda de montagem, reparo e vistoria"
        columns={[
          { key: "id", label: "ID", render: (i: TechnicalVisit) => <span className="text-xs font-mono text-blue-400">{i.id}</span> },
          { key: "ticketId", label: "Ticket", render: (i: TechnicalVisit) => <span className="text-xs text-zinc-400">{i.ticketId}</span> },
          { key: "customer", label: "Cliente", render: (i: TechnicalVisit) => <span className="text-xs text-zinc-300 font-medium">{i.customer}</span> },
          { key: "product", label: "Produto", render: (i: TechnicalVisit) => <span className="text-xs text-zinc-400 truncate max-w-[160px] block">{i.product}</span> },
          { key: "city", label: "Local", render: (i: TechnicalVisit) => <span className="text-xs text-zinc-400">{i.city}/{i.state}</span> },
          { key: "scheduledDate", label: "Data", render: (i: TechnicalVisit) => <span className="text-xs text-zinc-300 font-medium">{new Date(i.scheduledDate).toLocaleDateString("pt-BR")} {i.scheduledTime}</span> },
          { key: "technician", label: "Técnico", render: (i: TechnicalVisit) => <span className="text-xs text-zinc-400">{i.technician}</span> },
          { key: "type", label: "Tipo", align: "center" as const, render: (i: TechnicalVisit) => { const t = typeMap[i.type]; return t ? <StatusBadge status={t.label} variant={t.variant} /> : null; } },
          { key: "status", label: "Status", align: "center" as const, render: (i: TechnicalVisit) => { const s = statusMap[i.status]; return s ? <StatusBadge status={s.label} variant={s.variant} /> : null; } },
        ]}
        data={technicalVisits}
        pageSize={8}
      />
    </>
  );
}

/* ─── DEVOLUÇÕES TAB ─── */
function DevolucoesTab() {
  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
    solicitada: { label: "Solicitada", variant: "info" },
    aprovada: { label: "Aprovada", variant: "info" },
    coleta_agendada: { label: "Coleta Agendada", variant: "warning" },
    em_transito: { label: "Em Trânsito", variant: "warning" },
    recebida: { label: "Recebida", variant: "info" },
    reembolsada: { label: "Reembolsada", variant: "success" },
    negada: { label: "Negada", variant: "danger" },
  };

  const reasonMap: Record<string, string> = {
    defeito: "Defeito",
    arrependimento: "Arrependimento",
    produto_errado: "Produto Errado",
    avaria_transporte: "Avaria no Transporte",
    incompleto: "Incompleto",
  };

  const totalRefund = returnRequests.filter((r) => r.status === "reembolsada").reduce((sum, r) => sum + r.refundAmount, 0);
  const pendingRefund = returnRequests.filter((r) => r.status !== "reembolsada" && r.status !== "negada").reduce((sum, r) => sum + r.refundAmount, 0);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-zinc-100">{returnRequests.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Total Devoluções</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-400">{returnRequests.filter((r) => r.status !== "reembolsada" && r.status !== "negada").length}</p>
          <p className="text-xs text-zinc-500 mt-1">Pendentes</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(totalRefund)}</p>
          <p className="text-xs text-zinc-500 mt-1">Reembolsado</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-xl font-bold text-amber-400">{formatCurrency(pendingRefund)}</p>
          <p className="text-xs text-zinc-500 mt-1">Reembolso Pendente</p>
        </div>
      </div>

      <DataTable
        title="Solicitações de Devolução"
        subtitle="Controle de devoluções e reembolsos"
        columns={[
          { key: "id", label: "ID", render: (i: ReturnRequest) => <span className="text-xs font-mono text-blue-400">{i.id}</span> },
          { key: "orderNumber", label: "Pedido", render: (i: ReturnRequest) => <span className="text-xs text-zinc-400">{i.orderNumber}</span> },
          { key: "customer", label: "Cliente", render: (i: ReturnRequest) => <span className="text-xs text-zinc-300 font-medium">{i.customer}</span> },
          { key: "product", label: "Produto", render: (i: ReturnRequest) => <span className="text-xs text-zinc-400 truncate max-w-[180px] block">{i.product}</span> },
          { key: "reason", label: "Motivo", render: (i: ReturnRequest) => <span className="text-xs text-zinc-400">{reasonMap[i.reason]}</span> },
          { key: "channel", label: "Canal", render: (i: ReturnRequest) => <span className="text-xs text-zinc-400">{i.channel}</span> },
          { key: "requestDate", label: "Data", render: (i: ReturnRequest) => <span className="text-xs text-zinc-400">{new Date(i.requestDate).toLocaleDateString("pt-BR")}</span> },
          { key: "refundAmount", label: "Valor", align: "right" as const, render: (i: ReturnRequest) => <span className="text-xs font-semibold text-zinc-200">{formatCurrency(i.refundAmount)}</span> },
          { key: "status", label: "Status", align: "center" as const, render: (i: ReturnRequest) => { const s = statusMap[i.status]; return s ? <StatusBadge status={s.label} variant={s.variant} /> : null; } },
        ]}
        data={returnRequests}
        pageSize={8}
      />
    </>
  );
}

/* ─── HELPERS ─── */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs text-zinc-300 font-medium">{value}</p>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, { label: string; color: string }> = {
    defeito: { label: "Defeito", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    montagem: { label: "Montagem", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    troca: { label: "Troca", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    duvida: { label: "Dúvida", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    reclamacao: { label: "Reclamação", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    garantia: { label: "Garantia", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  };
  const m = map[category] || { label: category, color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${m.color}`}>
      {m.label}
    </span>
  );
}
