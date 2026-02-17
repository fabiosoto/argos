import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KPICard } from "@/components/KPICard";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { Sparkline } from "@/components/MiniChart";
import {
  systemStatuses,
  recentSyncEvents,
  webhookLogs,
  dataMappings,
  syncSchedules,
  dailySyncStats,
  formatRelativeTime,
  getOverallHealth,
  type SyncEvent,
  type WebhookLog,
  type DataMapping,
} from "@/lib/integration-engine";

export const Route = createFileRoute("/integracoes")({
  component: IntegracoesPage,
});

type TabKey = "overview" | "sync" | "webhooks" | "mappings" | "config";

function IntegracoesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const health = getOverallHealth();

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "overview", label: "Visão Geral", icon: "📊" },
    { key: "sync", label: "Sincronizações", icon: "🔄" },
    { key: "webhooks", label: "Webhooks", icon: "🔔" },
    { key: "mappings", label: "Mapeamentos", icon: "🗺️" },
    { key: "config", label: "Configuração", icon: "⚙️" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Integrações & Conectividade</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Monitoramento de ERP, WMS, MES, CRM e Hub de Marketplaces
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${
            health.status === "healthy"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : health.status === "degraded"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              health.status === "healthy" ? "bg-emerald-500" : health.status === "degraded" ? "bg-amber-500 animate-pulse" : "bg-red-500 animate-pulse"
            }`} />
            Saúde: {health.score}% — {health.status === "healthy" ? "Saudável" : health.status === "degraded" ? "Degradado" : "Crítico"}
          </div>
          <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
            🔄 Forçar Sync
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "sync" && <SyncTab />}
      {activeTab === "webhooks" && <WebhooksTab />}
      {activeTab === "mappings" && <MappingsTab />}
      {activeTab === "config" && <ConfigTab />}
    </div>
  );
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab() {
  const kpis = [
    { label: "Syncs Hoje", value: dailySyncStats.totalSyncs.toLocaleString("pt-BR"), change: 12.3, trend: "up" as const, icon: "🔄" },
    { label: "Taxa de Sucesso", value: `${dailySyncStats.successRate}%`, change: 0.8, trend: "up" as const, icon: "✅" },
    { label: "Registros Processados", value: `${(dailySyncStats.totalRecords / 1000).toFixed(1)}K`, change: 15.2, trend: "up" as const, icon: "📊" },
    { label: "Latência Média", value: `${dailySyncStats.avgLatency}ms`, change: -8.3, trend: "down" as const, icon: "⚡" },
    { label: "Erros", value: String(dailySyncStats.errors), change: -22.1, trend: "down" as const, icon: "❌" },
    { label: "Retries", value: String(dailySyncStats.retries), change: -15.0, trend: "down" as const, icon: "🔁" },
    { label: "Pico de Volume", value: `${dailySyncStats.peakVolume}/h`, change: 5.4, trend: "up" as const, icon: "📈" },
    { label: "Sistemas Online", value: `${systemStatuses.filter((s) => s.status === "online").length}/${systemStatuses.length}`, change: 0, trend: "stable" as const, icon: "🟢" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => <KPICard key={k.label} {...k} />)}
      </div>

      {/* System Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemStatuses.map((sys) => (
          <div
            key={sys.id}
            className={`bg-zinc-900/60 border rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 ${
              sys.status === "online"
                ? "border-zinc-800/60 hover:border-emerald-500/30"
                : sys.status === "warning"
                ? "border-amber-500/30"
                : "border-red-500/30"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">{sys.name}</h3>
                <p className="text-[10px] text-zinc-500">{sys.type}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold ${
                sys.status === "online"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : sys.status === "warning"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-red-500/10 text-red-400"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  sys.status === "online" ? "bg-emerald-500" : sys.status === "warning" ? "bg-amber-500 animate-pulse" : "bg-red-500 animate-pulse"
                }`} />
                {sys.status === "online" ? "Online" : sys.status === "warning" ? "Lento" : "Offline"}
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 mb-3 font-mono truncate">{sys.endpoint}</p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <MetricBox label="Latência" value={`${sys.latency}ms`} color={sys.latency < 100 ? "emerald" : sys.latency < 500 ? "amber" : "red"} />
              <MetricBox label="Uptime" value={`${sys.uptime}%`} color={sys.uptime >= 99 ? "emerald" : sys.uptime >= 97 ? "amber" : "red"} />
              <MetricBox label="Registros" value={formatLargeNumber(sys.totalRecords)} color="zinc" />
              <MetricBox label="Erros Sync" value={String(sys.syncErrors)} color={sys.syncErrors === 0 ? "emerald" : sys.syncErrors < 5 ? "amber" : "red"} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
              <span className="text-[10px] text-zinc-500">Última sync: {formatRelativeTime(sys.lastSync)}</span>
              <span className="text-[10px] text-zinc-500">API {sys.apiVersion}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Data Flow Diagram */}
      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-1">Fluxo de Dados em Tempo Real</h3>
        <p className="text-xs text-zinc-500 mb-4">Mapeamento das integrações entre sistemas</p>
        <DataFlowDiagram />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <RecentSyncList events={recentSyncEvents.slice(0, 5)} />
        </div>
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">Volume de Sync (24h)</h3>
          <p className="text-xs text-zinc-500 mb-4">Registros processados por hora</p>
          <Sparkline data={[120, 85, 45, 30, 22, 18, 35, 89, 156, 245, 312, 289, 267, 234, 198, 210, 245, 278, 256, 223, 189, 167, 145, 134]} color="#3b82f6" height={80} width={260} />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/60">
            <span className="text-[10px] text-zinc-500">Pico: {dailySyncStats.peakHour}</span>
            <span className="text-[10px] text-zinc-400 font-semibold">{dailySyncStats.peakVolume} registros/h</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── SYNC TAB ─── */
function SyncTab() {
  return (
    <>
      <RecentSyncList events={recentSyncEvents} />

      {/* Sync Schedule */}
      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-1">Agenda de Sincronização</h3>
        <p className="text-xs text-zinc-500 mb-4">Configuração dos intervalos de sync</p>
        <div className="space-y-2">
          {syncSchedules.map((sch) => (
            <div key={sch.id} className="flex items-center justify-between p-3 bg-zinc-800/30 border border-zinc-700/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${sch.enabled ? "bg-emerald-500" : "bg-zinc-600"}`} />
                <span className="text-xs font-medium text-zinc-300">{sch.flow}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-400">{sch.interval}</span>
                <span className="text-[10px] text-zinc-500">Próximo: {sch.nextRun}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${sch.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700/50 text-zinc-500"}`}>
                  {sch.enabled ? "Ativo" : "Pausado"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── WEBHOOKS TAB ─── */
function WebhooksTab() {
  const processed = webhookLogs.filter((w) => w.status === "processed").length;
  const failed = webhookLogs.filter((w) => w.status === "failed").length;

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-zinc-100">{webhookLogs.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Total Recebidos</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">{processed}</p>
          <p className="text-xs text-zinc-500 mt-1">Processados</p>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-red-400">{failed}</p>
          <p className="text-xs text-zinc-500 mt-1">Falharam</p>
        </div>
      </div>

      <DataTable
        title="Log de Webhooks"
        subtitle="Eventos recebidos dos sistemas externos"
        columns={[
          { key: "id", label: "ID", render: (i: WebhookLog) => <span className="text-xs font-mono text-blue-400">{i.id}</span> },
          { key: "source", label: "Origem", render: (i: WebhookLog) => <span className="text-xs text-zinc-300 font-medium">{i.source}</span> },
          { key: "event", label: "Evento", render: (i: WebhookLog) => <span className="text-xs font-mono text-purple-400">{i.event}</span> },
          { key: "payload", label: "Payload", render: (i: WebhookLog) => <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[200px] block">{i.payload}</span> },
          { key: "responseTime", label: "Tempo", align: "right" as const, render: (i: WebhookLog) => (
            <span className={`text-xs font-semibold ${i.responseTime < 200 ? "text-emerald-400" : i.responseTime < 1000 ? "text-amber-400" : "text-red-400"}`}>
              {i.responseTime}ms
            </span>
          )},
          { key: "timestamp", label: "Quando", render: (i: WebhookLog) => <span className="text-xs text-zinc-400">{formatRelativeTime(i.timestamp)}</span> },
          { key: "status", label: "Status", align: "center" as const, render: (i: WebhookLog) => (
            <StatusBadge
              status={i.status === "processed" ? "OK" : i.status === "received" ? "Recebido" : "Falhou"}
              variant={i.status === "processed" ? "success" : i.status === "received" ? "info" : "danger"}
            />
          )},
        ]}
        data={webhookLogs}
        pageSize={10}
      />
    </>
  );
}

/* ─── MAPPINGS TAB ─── */
function MappingsTab() {
  return (
    <DataTable
      title="Mapeamento de Campos"
      subtitle="Transformações de dados entre sistemas"
      columns={[
        { key: "id", label: "ID", render: (i: DataMapping) => <span className="text-xs font-mono text-blue-400">{i.id}</span> },
        { key: "sourceSystem", label: "Sistema Origem", render: (i: DataMapping) => <span className="text-xs text-zinc-300 font-medium">{i.sourceSystem}</span> },
        { key: "sourceField", label: "Campo Origem", render: (i: DataMapping) => <span className="text-xs font-mono text-amber-400">{i.sourceField}</span> },
        { key: "targetSystem", label: "Sistema Destino", render: (i: DataMapping) => <span className="text-xs text-zinc-300 font-medium">{i.targetSystem}</span> },
        { key: "targetField", label: "Campo Destino", render: (i: DataMapping) => <span className="text-xs font-mono text-emerald-400">{i.targetField}</span> },
        { key: "transformation", label: "Transformação", render: (i: DataMapping) => <span className="text-xs text-purple-400">{i.transformation}</span> },
        { key: "active", label: "Status", align: "center" as const, render: (i: DataMapping) => (
          <StatusBadge status={i.active ? "Ativo" : "Inativo"} variant={i.active ? "success" : "neutral"} />
        )},
      ]}
      data={dataMappings}
      pageSize={10}
    />
  );
}

/* ─── CONFIG TAB ─── */
function ConfigTab() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Connection Settings */}
      <div className="col-span-12 lg:col-span-6 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-1">⚙️ Configurações de Conexão</h3>
        <p className="text-xs text-zinc-500 mb-4">Parâmetros de cada sistema integrado</p>
        <div className="space-y-3">
          {systemStatuses.map((sys) => (
            <div key={sys.id} className="p-3 bg-zinc-800/30 border border-zinc-700/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-200">{sys.name}</span>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                  sys.status === "online" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sys.status === "online" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {sys.status === "online" ? "Conectado" : "Instável"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-zinc-500">Endpoint</p>
                  <p className="text-[10px] font-mono text-zinc-400 truncate">{sys.endpoint}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500">API Version</p>
                  <p className="text-[10px] font-mono text-zinc-400">{sys.apiVersion}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-700/20">
                <button className="px-2 py-1 bg-zinc-700/50 rounded text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors">
                  Testar Conexão
                </button>
                <button className="px-2 py-1 bg-zinc-700/50 rounded text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors">
                  Editar
                </button>
                <button className="px-2 py-1 bg-zinc-700/50 rounded text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors">
                  Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retry & Alert Settings */}
      <div className="col-span-12 lg:col-span-6 space-y-4">
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">🔁 Política de Retry</h3>
          <p className="text-xs text-zinc-500 mb-4">Configuração de tentativas automáticas</p>
          <div className="space-y-3">
            <ConfigRow label="Máximo de Retries" value="3" />
            <ConfigRow label="Intervalo entre Retries" value="30s, 60s, 120s (exponencial)" />
            <ConfigRow label="Timeout por Requisição" value="30 segundos" />
            <ConfigRow label="Circuit Breaker" value="5 falhas consecutivas" />
            <ConfigRow label="Cooldown após Circuit Break" value="5 minutos" />
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">🔔 Alertas</h3>
          <p className="text-xs text-zinc-500 mb-4">Notificações de problemas de integração</p>
          <div className="space-y-3">
            <AlertRow label="Latência > 500ms" channel="Slack + Email" enabled />
            <AlertRow label="Taxa de erro > 5%" channel="Slack + Email + SMS" enabled />
            <AlertRow label="Sistema offline" channel="Slack + Email + SMS + Telefone" enabled />
            <AlertRow label="Sync atrasada > 15min" channel="Slack" enabled />
            <AlertRow label="Webhook falhou" channel="Slack" enabled />
            <AlertRow label="Dados inconsistentes" channel="Email" enabled={false} />
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">🔐 Segurança</h3>
          <p className="text-xs text-zinc-500 mb-4">Autenticação e criptografia</p>
          <div className="space-y-3">
            <ConfigRow label="Autenticação" value="OAuth 2.0 + API Keys" />
            <ConfigRow label="Criptografia" value="TLS 1.3 (AES-256)" />
            <ConfigRow label="Rate Limiting" value="1000 req/min por sistema" />
            <ConfigRow label="IP Whitelist" value="Ativo (6 IPs)" />
            <ConfigRow label="Rotação de Chaves" value="A cada 90 dias" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SHARED COMPONENTS ─── */
function RecentSyncList({ events }: { events: SyncEvent[] }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">Sincronizações Recentes</h3>
      <p className="text-xs text-zinc-500 mb-4">Últimas operações de sync entre sistemas</p>
      <div className="space-y-2">
        {events.map((ev) => (
          <div
            key={ev.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              ev.status === "success"
                ? "bg-zinc-800/20 border-zinc-800/40 hover:border-zinc-700/50"
                : ev.status === "error"
                ? "bg-red-500/5 border-red-500/15"
                : ev.status === "retrying"
                ? "bg-amber-500/5 border-amber-500/15"
                : "bg-zinc-800/20 border-zinc-800/40"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
              ev.status === "success"
                ? "bg-emerald-500/10"
                : ev.status === "error"
                ? "bg-red-500/10"
                : "bg-amber-500/10"
            }`}>
              {ev.status === "success" ? "✅" : ev.status === "error" ? "❌" : "🔁"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-zinc-300">{ev.systemFrom}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-xs font-medium text-zinc-300">{ev.systemTo}</span>
                <span className="text-[10px] text-blue-400 font-medium">{ev.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-500">{ev.recordsProcessed.toLocaleString("pt-BR")} registros</span>
                {ev.recordsFailed > 0 && (
                  <span className="text-[10px] text-red-400">{ev.recordsFailed} falhas</span>
                )}
                {ev.duration !== undefined && (
                  <span className="text-[10px] text-zinc-500">{ev.duration < 1000 ? `${ev.duration}ms` : `${(ev.duration / 1000).toFixed(1)}s`}</span>
                )}
                {ev.errorMessage && (
                  <span className="text-[10px] text-red-400 truncate max-w-[300px]">{ev.errorMessage}</span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-zinc-500">{formatRelativeTime(ev.startedAt)}</span>
            </div>

            <StatusBadge
              status={ev.status === "success" ? "OK" : ev.status === "error" ? "Erro" : ev.status === "retrying" ? "Retry" : "Pendente"}
              variant={ev.status === "success" ? "success" : ev.status === "error" ? "danger" : ev.status === "retrying" ? "warning" : "info"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DataFlowDiagram() {
  const flows = [
    { from: "Hub Marketplaces", to: "ERP Principal", label: "Pedidos", freq: "Tempo real", status: "ok" as const },
    { from: "ERP Principal", to: "MES Fábrica", label: "Ordens Produção", freq: "15 min", status: "ok" as const },
    { from: "MES Fábrica", to: "ERP Principal", label: "Apontamentos", freq: "Tempo real", status: "ok" as const },
    { from: "ERP Principal", to: "WMS Logística", label: "Notas Fiscais", freq: "5 min", status: "ok" as const },
    { from: "WMS Logística", to: "Hub Marketplaces", label: "Rastreamento", freq: "30 min", status: "ok" as const },
    { from: "Hub Marketplaces", to: "CRM / Suporte", label: "Reclamações", freq: "Tempo real", status: "warning" as const },
    { from: "Todos", to: "BI Analytics", label: "Dados Consolidados", freq: "1 hora", status: "ok" as const },
  ];

  return (
    <div className="space-y-2">
      {flows.map((flow, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
            flow.status === "ok"
              ? "bg-zinc-800/20 border-zinc-800/40 hover:border-zinc-700/50"
              : "bg-amber-500/5 border-amber-500/20"
          }`}
        >
          <div className="w-40 shrink-0">
            <span className="text-xs font-medium text-zinc-300">{flow.from}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600 shrink-0">
            <div className="h-px w-6 bg-zinc-700" />
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              flow.status === "ok" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" : "border-amber-500/30 text-amber-400 bg-amber-500/5"
            }`}>
              →
            </span>
            <div className="h-px w-6 bg-zinc-700" />
          </div>
          <div className="w-40 shrink-0">
            <span className="text-xs font-medium text-zinc-300">{flow.to}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs text-blue-400 font-medium">{flow.label}</span>
          </div>
          <div className="text-right shrink-0 flex items-center gap-3">
            <span className="text-[10px] text-zinc-500">{flow.freq}</span>
            <span className={`w-2 h-2 rounded-full shrink-0 ${flow.status === "ok" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
    zinc: "text-zinc-200",
  };

  return (
    <div className="bg-zinc-800/40 rounded-md p-2 text-center">
      <p className="text-[9px] text-zinc-500">{label}</p>
      <p className={`text-xs font-bold ${colorMap[color] || "text-zinc-200"}`}>{value}</p>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800/40 last:border-0">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="text-xs text-zinc-200 font-medium">{value}</span>
    </div>
  );
}

function AlertRow({ label, channel, enabled }: { label: string; channel: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800/40 last:border-0">
      <div>
        <p className="text-xs text-zinc-300">{label}</p>
        <p className="text-[10px] text-zinc-500">{channel}</p>
      </div>
      <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${enabled ? "bg-emerald-500" : "bg-zinc-700"}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${enabled ? "left-4.5" : "left-0.5"}`} />
      </div>
    </div>
  );
}

function formatLargeNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}
