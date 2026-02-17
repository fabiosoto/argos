// Integration Engine - Simulates ERP/WMS/MES/CRM/Hub connectivity
// In production, these would be real API calls to external systems

export interface SystemStatus {
  id: string;
  name: string;
  type: string;
  status: "online" | "warning" | "offline" | "syncing";
  latency: number;
  uptime: number;
  lastSync: Date;
  totalRecords: number;
  syncErrors: number;
  apiVersion: string;
  endpoint: string;
}

export interface SyncEvent {
  id: string;
  systemFrom: string;
  systemTo: string;
  type: string;
  status: "success" | "error" | "pending" | "retrying";
  recordsProcessed: number;
  recordsFailed: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  errorMessage?: string;
}

export interface WebhookLog {
  id: string;
  source: string;
  event: string;
  payload: string;
  status: "received" | "processed" | "failed";
  timestamp: Date;
  responseTime: number;
}

export interface DataMapping {
  id: string;
  sourceSystem: string;
  sourceField: string;
  targetSystem: string;
  targetField: string;
  transformation: string;
  active: boolean;
}

// Simulated system statuses
export const systemStatuses: SystemStatus[] = [
  {
    id: "erp",
    name: "ERP Principal",
    type: "TOTVS Protheus",
    status: "online",
    latency: 45,
    uptime: 99.8,
    lastSync: new Date(Date.now() - 2 * 60 * 1000),
    totalRecords: 1247832,
    syncErrors: 3,
    apiVersion: "v3.2.1",
    endpoint: "https://erp.argos.com.br/api/v3",
  },
  {
    id: "wms",
    name: "WMS Logística",
    type: "WMS Cloud",
    status: "online",
    latency: 120,
    uptime: 99.5,
    lastSync: new Date(Date.now() - 1 * 60 * 1000),
    totalRecords: 342156,
    syncErrors: 0,
    apiVersion: "v2.8.0",
    endpoint: "https://wms.argos.com.br/api/v2",
  },
  {
    id: "mes",
    name: "MES Fábrica",
    type: "MES Industrial",
    status: "online",
    latency: 38,
    uptime: 99.9,
    lastSync: new Date(Date.now() - 30 * 1000),
    totalRecords: 891204,
    syncErrors: 1,
    apiVersion: "v4.1.0",
    endpoint: "https://mes.argos.com.br/api/v4",
  },
  {
    id: "crm",
    name: "CRM / Suporte",
    type: "Zendesk",
    status: "warning",
    latency: 890,
    uptime: 97.2,
    lastSync: new Date(Date.now() - 8 * 60 * 1000),
    totalRecords: 156789,
    syncErrors: 12,
    apiVersion: "v2",
    endpoint: "https://argos.zendesk.com/api/v2",
  },
  {
    id: "hub",
    name: "Hub Marketplaces",
    type: "Bling / Tiny",
    status: "online",
    latency: 210,
    uptime: 99.1,
    lastSync: new Date(Date.now() - 3 * 60 * 1000),
    totalRecords: 523410,
    syncErrors: 5,
    apiVersion: "v3.0",
    endpoint: "https://api.bling.com.br/v3",
  },
  {
    id: "bi",
    name: "BI Analytics",
    type: "Power BI",
    status: "online",
    latency: 65,
    uptime: 99.7,
    lastSync: new Date(Date.now() - 5 * 60 * 1000),
    totalRecords: 2834567,
    syncErrors: 0,
    apiVersion: "v1.0",
    endpoint: "https://api.powerbi.com/v1.0/myorg",
  },
];

// Recent sync events
export const recentSyncEvents: SyncEvent[] = [
  {
    id: "sync-001",
    systemFrom: "Hub Marketplaces",
    systemTo: "ERP Principal",
    type: "Pedidos de Venda",
    status: "success",
    recordsProcessed: 47,
    recordsFailed: 0,
    startedAt: new Date(Date.now() - 5 * 60 * 1000),
    completedAt: new Date(Date.now() - 4.5 * 60 * 1000),
    duration: 32,
  },
  {
    id: "sync-002",
    systemFrom: "ERP Principal",
    systemTo: "MES Fábrica",
    type: "Ordens de Produção",
    status: "success",
    recordsProcessed: 8,
    recordsFailed: 0,
    startedAt: new Date(Date.now() - 15 * 60 * 1000),
    completedAt: new Date(Date.now() - 14.8 * 60 * 1000),
    duration: 12,
  },
  {
    id: "sync-003",
    systemFrom: "MES Fábrica",
    systemTo: "ERP Principal",
    type: "Apontamentos de Produção",
    status: "success",
    recordsProcessed: 156,
    recordsFailed: 2,
    startedAt: new Date(Date.now() - 2 * 60 * 1000),
    completedAt: new Date(Date.now() - 1.5 * 60 * 1000),
    duration: 28,
  },
  {
    id: "sync-004",
    systemFrom: "ERP Principal",
    systemTo: "WMS Logística",
    type: "Notas Fiscais",
    status: "success",
    recordsProcessed: 23,
    recordsFailed: 0,
    startedAt: new Date(Date.now() - 8 * 60 * 1000),
    completedAt: new Date(Date.now() - 7.8 * 60 * 1000),
    duration: 15,
  },
  {
    id: "sync-005",
    systemFrom: "WMS Logística",
    systemTo: "Hub Marketplaces",
    type: "Rastreamento de Entregas",
    status: "success",
    recordsProcessed: 34,
    recordsFailed: 1,
    startedAt: new Date(Date.now() - 30 * 60 * 1000),
    completedAt: new Date(Date.now() - 29.5 * 60 * 1000),
    duration: 22,
  },
  {
    id: "sync-006",
    systemFrom: "Hub Marketplaces",
    systemTo: "CRM / Suporte",
    type: "Reclamações de Clientes",
    status: "error",
    recordsProcessed: 3,
    recordsFailed: 2,
    startedAt: new Date(Date.now() - 10 * 60 * 1000),
    completedAt: new Date(Date.now() - 9 * 60 * 1000),
    duration: 45,
    errorMessage: "Timeout na API do Zendesk - latência acima do limite (890ms)",
  },
  {
    id: "sync-007",
    systemFrom: "ERP Principal",
    systemTo: "BI Analytics",
    type: "Dados Consolidados",
    status: "success",
    recordsProcessed: 12450,
    recordsFailed: 0,
    startedAt: new Date(Date.now() - 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 55 * 60 * 1000),
    duration: 312,
  },
  {
    id: "sync-008",
    systemFrom: "Hub Marketplaces",
    systemTo: "CRM / Suporte",
    type: "Reclamações de Clientes",
    status: "retrying",
    recordsProcessed: 0,
    recordsFailed: 2,
    startedAt: new Date(Date.now() - 1 * 60 * 1000),
    duration: undefined,
    errorMessage: "Retry automático #2 - aguardando resposta do CRM",
  },
];

// Webhook logs
export const webhookLogs: WebhookLog[] = [
  { id: "wh-001", source: "Mercado Livre", event: "order.created", payload: '{"order_id":"MLB-2847291","total":1599.90}', status: "processed", timestamp: new Date(Date.now() - 3 * 60 * 1000), responseTime: 120 },
  { id: "wh-002", source: "Amazon", event: "order.shipped", payload: '{"order_id":"AMZ-9812345","tracking":"JD987654321BR"}', status: "processed", timestamp: new Date(Date.now() - 5 * 60 * 1000), responseTime: 85 },
  { id: "wh-003", source: "Shopee", event: "order.cancelled", payload: '{"order_id":"SHP-456789","reason":"buyer_request"}', status: "processed", timestamp: new Date(Date.now() - 12 * 60 * 1000), responseTime: 95 },
  { id: "wh-004", source: "Magazine Luiza", event: "return.requested", payload: '{"order_id":"MLZ-123456","reason":"defect"}', status: "processed", timestamp: new Date(Date.now() - 18 * 60 * 1000), responseTime: 110 },
  { id: "wh-005", source: "Zendesk", event: "ticket.updated", payload: '{"ticket_id":"TK-3204","status":"escalated"}', status: "failed", timestamp: new Date(Date.now() - 20 * 60 * 1000), responseTime: 3200 },
  { id: "wh-006", source: "TOTVS", event: "nf.emitted", payload: '{"nf_number":"NF-89012","total":2499.90}', status: "processed", timestamp: new Date(Date.now() - 25 * 60 * 1000), responseTime: 45 },
  { id: "wh-007", source: "Mercado Livre", event: "question.created", payload: '{"item_id":"MLB-1234","question":"Qual o prazo?"}', status: "processed", timestamp: new Date(Date.now() - 30 * 60 * 1000), responseTime: 78 },
  { id: "wh-008", source: "WMS Cloud", event: "shipment.collected", payload: '{"tracking":"JD123456789BR","carrier":"Jadlog"}', status: "processed", timestamp: new Date(Date.now() - 35 * 60 * 1000), responseTime: 62 },
];

// Data mappings
export const dataMappings: DataMapping[] = [
  { id: "dm-001", sourceSystem: "Hub Marketplaces", sourceField: "order.buyer_name", targetSystem: "ERP Principal", targetField: "cliente.razao_social", transformation: "uppercase + trim", active: true },
  { id: "dm-002", sourceSystem: "Hub Marketplaces", sourceField: "order.total", targetSystem: "ERP Principal", targetField: "pedido.valor_total", transformation: "BRL currency parse", active: true },
  { id: "dm-003", sourceSystem: "ERP Principal", sourceField: "op.numero", targetSystem: "MES Fábrica", targetField: "production_order.code", transformation: "prefix OP-", active: true },
  { id: "dm-004", sourceSystem: "MES Fábrica", sourceField: "apontamento.qtd_produzida", targetSystem: "ERP Principal", targetField: "op.qtd_realizada", transformation: "sum aggregate", active: true },
  { id: "dm-005", sourceSystem: "ERP Principal", sourceField: "nf.chave_acesso", targetSystem: "WMS Logística", targetField: "shipment.invoice_key", transformation: "direct copy", active: true },
  { id: "dm-006", sourceSystem: "WMS Logística", sourceField: "tracking.status", targetSystem: "Hub Marketplaces", targetField: "order.shipping_status", transformation: "status mapping table", active: true },
  { id: "dm-007", sourceSystem: "Hub Marketplaces", sourceField: "complaint.text", targetSystem: "CRM / Suporte", targetField: "ticket.description", transformation: "HTML sanitize + translate", active: false },
];

// Sync schedule configuration
export const syncSchedules = [
  { id: "sch-001", flow: "Pedidos → ERP", interval: "Tempo real (webhook)", nextRun: "Contínuo", enabled: true },
  { id: "sch-002", flow: "ERP → MES", interval: "A cada 15 min", nextRun: new Date(Date.now() + 8 * 60 * 1000).toLocaleTimeString("pt-BR"), enabled: true },
  { id: "sch-003", flow: "MES → ERP", interval: "Tempo real (push)", nextRun: "Contínuo", enabled: true },
  { id: "sch-004", flow: "ERP → WMS", interval: "A cada 5 min", nextRun: new Date(Date.now() + 2 * 60 * 1000).toLocaleTimeString("pt-BR"), enabled: true },
  { id: "sch-005", flow: "WMS → Hub", interval: "A cada 30 min", nextRun: new Date(Date.now() + 18 * 60 * 1000).toLocaleTimeString("pt-BR"), enabled: true },
  { id: "sch-006", flow: "Hub → CRM", interval: "Tempo real (webhook)", nextRun: "Contínuo", enabled: true },
  { id: "sch-007", flow: "Todos → BI", interval: "A cada 1 hora", nextRun: new Date(Date.now() + 42 * 60 * 1000).toLocaleTimeString("pt-BR"), enabled: true },
];

// Helper to format relative time
export function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `há ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  return `há ${Math.floor(hours / 24)}d`;
}

// Simulated health check
export function getOverallHealth(): { score: number; status: "healthy" | "degraded" | "critical" } {
  const onlineCount = systemStatuses.filter((s) => s.status === "online").length;
  const total = systemStatuses.length;
  const score = Math.round((onlineCount / total) * 100);
  return {
    score,
    status: score >= 90 ? "healthy" : score >= 70 ? "degraded" : "critical",
  };
}

// Daily sync stats
export const dailySyncStats = {
  totalSyncs: 1847,
  successRate: 98.7,
  totalRecords: 45230,
  avgLatency: 148,
  errors: 24,
  retries: 8,
  peakHour: "10:00-11:00",
  peakVolume: 312,
};
