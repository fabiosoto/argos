// Design system constants for Argos - Furniture Industry ERP Dashboard

export const APP_NAME = "Argos";
export const APP_TAGLINE = "Visibilidade Ponta-a-Ponta";

// Navigation structure
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Painel Geral", path: "/", icon: "📊" },
  { label: "Varejo", path: "/varejo", icon: "🛒" },
  { label: "Indústria", path: "/industria", icon: "🏭" },
  { label: "Fornecedores", path: "/fornecedores", icon: "🤝" },
  { label: "Logística", path: "/logistica", icon: "🚚" },
  { label: "Suporte", path: "/suporte", icon: "🎧", badge: 12 },
  { label: "Forecast", path: "/forecast", icon: "📈" },
  { label: "Integrações", path: "/integracoes", icon: "🔗" },
  { label: "Argos AI", path: "/agente", icon: "🤖" },
];

// KPI color coding
export const STATUS_COLORS = {
  success: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  danger: { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
  info: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  neutral: { bg: "bg-zinc-500/10", text: "text-zinc-500", border: "border-zinc-500/20" },
} as const;

// Sales channels
export const SALES_CHANNELS = [
  { id: "ml", name: "Mercado Livre", color: "#FFE600", icon: "🟡" },
  { id: "amazon", name: "Amazon", color: "#FF9900", icon: "🟠" },
  { id: "magalu", name: "Magazine Luiza", color: "#0086FF", icon: "🔵" },
  { id: "shopee", name: "Shopee", color: "#EE4D2D", icon: "🔴" },
  { id: "site", name: "Site Próprio", color: "#8B5CF6", icon: "🟣" },
  { id: "b2b", name: "B2B / Atacado", color: "#10B981", icon: "🟢" },
] as const;

// Integration systems
export const INTEGRATIONS = [
  { id: "erp", name: "ERP Principal", type: "ERP", status: "online" as const },
  { id: "wms", name: "WMS Logística", type: "Logística", status: "online" as const },
  { id: "mes", name: "MES Fábrica", type: "Manufatura", status: "online" as const },
  { id: "crm", name: "CRM Suporte", type: "Atendimento", status: "warning" as const },
  { id: "bi", name: "BI Analytics", type: "Dados", status: "online" as const },
  { id: "marketplace", name: "Hub Marketplaces", type: "Varejo", status: "online" as const },
] as const;

// Mock data helpers
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
