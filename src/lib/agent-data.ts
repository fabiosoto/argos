// Agent data layer - provides structured access to all company data for the AI agent
// This simulates what would come from real API integrations

import {
  executiveKPIs,
  retailKPIs,
  industryKPIs,
  salesChannels,
  productionOrders,
  suppliers,
  logistics,
  supportTickets,
  monthlyRevenue,
  forecastData,
  productionLines,
  topProducts,
  inventoryAlerts,
} from "./mock-data";
import { formatCurrency, formatNumber } from "./constants";

// Widget types the agent can create
export type WidgetType =
  | "kpi"
  | "bar_chart"
  | "progress_ring"
  | "horizontal_bars"
  | "sparkline"
  | "table"
  | "status_list"
  | "pie_chart"
  | "metric_comparison"
  | "alert_list";

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  subtitle?: string;
  span: 1 | 2 | 3 | 4; // grid columns
  data: any;
}

export interface GeneratedDashboard {
  title: string;
  description: string;
  widgets: DashboardWidget[];
  query: string;
  timestamp: number;
}

// Data catalog - what the agent "knows" about
export const DATA_CATALOG = {
  faturamento: {
    keywords: ["faturamento", "receita", "revenue", "vendas totais", "gmv", "billing"],
    description: "Dados de faturamento mensal e por canal",
  },
  pedidos: {
    keywords: ["pedidos", "orders", "vendas", "compras", "encomendas"],
    description: "Volume de pedidos por canal e período",
  },
  canais: {
    keywords: ["canais", "marketplace", "mercado livre", "amazon", "magalu", "shopee", "canal", "channels"],
    description: "Performance por canal de venda",
  },
  producao: {
    keywords: ["produção", "fábrica", "manufacturing", "linhas", "oee", "capacidade", "industrial"],
    description: "Dados de produção e utilização fabril",
  },
  fornecedores: {
    keywords: ["fornecedores", "suppliers", "compras", "matéria-prima", "lead time", "procurement"],
    description: "Scorecard e performance de fornecedores",
  },
  logistica: {
    keywords: ["logística", "entregas", "delivery", "transporte", "otd", "rastreamento", "shipping"],
    description: "Status de entregas e performance logística",
  },
  suporte: {
    keywords: ["suporte", "tickets", "atendimento", "sla", "nps", "reclamações", "pós-venda", "support"],
    description: "Tickets de suporte e métricas de atendimento",
  },
  estoque: {
    keywords: ["estoque", "inventory", "stock", "materiais", "ruptura", "stockout"],
    description: "Níveis de estoque e alertas de ruptura",
  },
  forecast: {
    keywords: ["forecast", "previsão", "projeção", "planejamento", "tendência", "prediction"],
    description: "Previsões de demanda e faturamento",
  },
  produtos: {
    keywords: ["produtos", "products", "top produtos", "mais vendidos", "ranking", "bestsellers"],
    description: "Ranking e performance de produtos",
  },
  margem: {
    keywords: ["margem", "margin", "lucro", "profit", "rentabilidade", "lucratividade"],
    description: "Margens e rentabilidade por produto/canal",
  },
  kpis: {
    keywords: ["kpi", "indicadores", "métricas", "dashboard", "resumo", "overview", "visão geral"],
    description: "KPIs executivos consolidados",
  },
};

// Detect which data domains a query touches
export function detectQueryDomains(query: string): string[] {
  const lower = query.toLowerCase();
  const domains: string[] = [];

  for (const [domain, config] of Object.entries(DATA_CATALOG)) {
    if (config.keywords.some((kw) => lower.includes(kw))) {
      domains.push(domain);
    }
  }

  // Default to general KPIs if nothing specific detected
  if (domains.length === 0) {
    domains.push("kpis");
  }

  return domains;
}

// Generate widgets based on detected domains
export function generateWidgetsForQuery(query: string): DashboardWidget[] {
  const domains = detectQueryDomains(query);
  const widgets: DashboardWidget[] = [];
  let widgetId = 0;

  const nextId = () => `w-${++widgetId}`;

  for (const domain of domains) {
    switch (domain) {
      case "faturamento": {
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Faturamento Mensal",
          span: 1,
          data: {
            value: "R$ 2.847.500",
            change: 12.3,
            trend: "up",
            icon: "💰",
          },
        });
        widgets.push({
          id: nextId(),
          type: "bar_chart",
          title: "Faturamento Mensal",
          subtitle: "Últimos 12 meses",
          span: 4,
          data: monthlyRevenue.map((m) => ({
            label: m.month,
            value: m.revenue,
          })),
        });
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Ticket Médio",
          span: 1,
          data: {
            value: "R$ 1.546",
            change: 3.2,
            trend: "up",
            icon: "🎯",
          },
        });
        break;
      }

      case "pedidos": {
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Pedidos Totais",
          span: 1,
          data: {
            value: "1.842",
            change: 8.7,
            trend: "up",
            icon: "📦",
          },
        });
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Pedidos Hoje",
          span: 1,
          data: {
            value: "89",
            change: 22.1,
            trend: "up",
            icon: "📋",
          },
        });
        widgets.push({
          id: nextId(),
          type: "bar_chart",
          title: "Pedidos por Mês",
          subtitle: "Últimos 12 meses",
          span: 4,
          data: monthlyRevenue.map((m) => ({
            label: m.month,
            value: m.orders,
          })),
        });
        break;
      }

      case "canais": {
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Canais Ativos",
          span: 1,
          data: {
            value: "6",
            change: 0,
            trend: "stable",
            icon: "🛒",
          },
        });
        widgets.push({
          id: nextId(),
          type: "horizontal_bars",
          title: "Receita por Canal",
          subtitle: "Participação no faturamento",
          span: 2,
          data: salesChannels.map((ch) => ({
            label: `${ch.icon} ${ch.name}`,
            value: ch.revenue,
            maxValue: Math.max(...salesChannels.map((c) => c.revenue)),
            color: ch.id === "ml" ? "#FFE600" : ch.id === "amazon" ? "#FF9900" : ch.id === "magalu" ? "#0086FF" : ch.id === "shopee" ? "#EE4D2D" : ch.id === "site" ? "#8B5CF6" : "#10B981",
            suffix: "",
            displayValue: formatCurrency(ch.revenue),
          })),
        });
        widgets.push({
          id: nextId(),
          type: "table",
          title: "Performance por Canal",
          subtitle: "Comparativo detalhado",
          span: 4,
          data: {
            headers: ["Canal", "Receita", "Pedidos", "Ticket Médio", "Conversão", "Variação"],
            rows: salesChannels.map((ch) => [
              `${ch.icon} ${ch.name}`,
              formatCurrency(ch.revenue),
              formatNumber(ch.orders),
              formatCurrency(ch.avgTicket),
              `${ch.conversion}%`,
              `${ch.change >= 0 ? "+" : ""}${ch.change}%`,
            ]),
          },
        });
        widgets.push({
          id: nextId(),
          type: "metric_comparison",
          title: "Crescimento por Canal",
          span: 2,
          data: salesChannels.map((ch) => ({
            label: ch.name,
            value: ch.change,
            icon: ch.icon,
          })),
        });
        break;
      }

      case "producao": {
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "OEE Geral",
          span: 1,
          data: {
            value: "78,5%",
            change: 3.2,
            trend: "up",
            icon: "⚙️",
          },
        });
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Produção Mensal",
          span: 1,
          data: {
            value: "3.420 un",
            change: 7.8,
            trend: "up",
            icon: "🏭",
          },
        });
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Refugo",
          span: 1,
          data: {
            value: "1,8%",
            change: -0.5,
            trend: "down",
            icon: "🗑️",
          },
        });
        widgets.push({
          id: nextId(),
          type: "progress_ring",
          title: "Utilização das Linhas",
          subtitle: "Capacidade em tempo real",
          span: 2,
          data: productionLines.map((line) => ({
            label: line.name.split(" - ")[1],
            value: line.utilization,
            color: line.utilization > 90 ? "#ef4444" : line.utilization > 75 ? "#3b82f6" : "#10b981",
            detail: `${line.producing}/${line.capacity} un/dia`,
          })),
        });
        widgets.push({
          id: nextId(),
          type: "status_list",
          title: "Ordens de Produção",
          subtitle: `${productionOrders.filter((o) => o.status === "em_producao").length} em produção`,
          span: 2,
          data: productionOrders.slice(0, 6).map((op) => ({
            id: op.id,
            label: op.product,
            sublabel: op.line,
            status: op.status,
            progress: Math.round((op.completed / op.quantity) * 100),
            detail: `${op.completed}/${op.quantity} un`,
          })),
        });
        break;
      }

      case "fornecedores": {
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Fornecedores Ativos",
          span: 1,
          data: {
            value: String(suppliers.filter((s) => s.status === "ativo").length),
            change: 0,
            trend: "stable",
            icon: "🤝",
          },
        });
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "On-Time Rate Médio",
          span: 1,
          data: {
            value: `${(suppliers.reduce((a, s) => a + s.onTimeRate, 0) / suppliers.length).toFixed(1)}%`,
            change: 2.1,
            trend: "up",
            icon: "⏱️",
          },
        });
        widgets.push({
          id: nextId(),
          type: "horizontal_bars",
          title: "Quality Score por Fornecedor",
          span: 2,
          data: suppliers.map((s) => ({
            label: s.name,
            value: s.qualityScore,
            maxValue: 100,
            color: s.qualityScore >= 90 ? "#10b981" : s.qualityScore >= 80 ? "#3b82f6" : "#ef4444",
            suffix: "%",
          })),
        });
        widgets.push({
          id: nextId(),
          type: "table",
          title: "Scorecard de Fornecedores",
          span: 4,
          data: {
            headers: ["Fornecedor", "Categoria", "Lead Time", "On-Time", "Qualidade", "Status"],
            rows: suppliers.map((s) => [
              s.name,
              s.category,
              `${s.leadTime} dias`,
              `${s.onTimeRate}%`,
              `${s.qualityScore}/100`,
              s.status === "ativo" ? "✅ Ativo" : s.status === "em_avaliacao" ? "⚠️ Em Avaliação" : "🚫 Bloqueado",
            ]),
          },
        });
        break;
      }

      case "logistica": {
        const statusCounts = {
          preparando: logistics.filter((l) => l.status === "preparando").length,
          coletado: logistics.filter((l) => l.status === "coletado").length,
          em_transito: logistics.filter((l) => l.status === "em_transito").length,
          entregue: logistics.filter((l) => l.status === "entregue").length,
          devolvido: logistics.filter((l) => l.status === "devolvido").length,
        };
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "OTD (On-Time Delivery)",
          span: 1,
          data: {
            value: "94,2%",
            change: 2.8,
            trend: "up",
            icon: "🚚",
          },
        });
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Em Trânsito",
          span: 1,
          data: {
            value: String(statusCounts.em_transito),
            change: 0,
            trend: "stable",
            icon: "📍",
          },
        });
        widgets.push({
          id: nextId(),
          type: "horizontal_bars",
          title: "Pipeline de Entregas",
          span: 2,
          data: [
            { label: "Preparando", value: statusCounts.preparando, maxValue: logistics.length, color: "#a855f7", suffix: "" },
            { label: "Coletado", value: statusCounts.coletado, maxValue: logistics.length, color: "#3b82f6", suffix: "" },
            { label: "Em Trânsito", value: statusCounts.em_transito, maxValue: logistics.length, color: "#f59e0b", suffix: "" },
            { label: "Entregue", value: statusCounts.entregue, maxValue: logistics.length, color: "#10b981", suffix: "" },
            { label: "Devolvido", value: statusCounts.devolvido, maxValue: logistics.length, color: "#ef4444", suffix: "" },
          ],
        });
        widgets.push({
          id: nextId(),
          type: "table",
          title: "Rastreamento de Entregas",
          span: 4,
          data: {
            headers: ["Código", "Cliente", "Destino", "Transportadora", "Canal", "Status"],
            rows: logistics.map((l) => [
              l.id,
              l.customer,
              `${l.city}/${l.state}`,
              l.carrier,
              l.channel,
              l.status === "entregue" ? "✅ Entregue" : l.status === "em_transito" ? "🚛 Em Trânsito" : l.status === "coletado" ? "📦 Coletado" : l.status === "devolvido" ? "↩️ Devolvido" : "⏳ Preparando",
            ]),
          },
        });
        break;
      }

      case "suporte": {
        const openTickets = supportTickets.filter((t) => t.status !== "resolvido").length;
        const slaBreached = supportTickets.filter((t) => t.sla === "estourado").length;
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Tickets Abertos",
          span: 1,
          data: {
            value: String(openTickets),
            change: -15.3,
            trend: "down",
            icon: "🎧",
          },
        });
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "SLA Estourado",
          span: 1,
          data: {
            value: String(slaBreached),
            change: 0,
            trend: "stable",
            icon: "⚠️",
          },
        });
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "NPS Score",
          span: 1,
          data: {
            value: "72",
            change: 4.0,
            trend: "up",
            icon: "⭐",
          },
        });
        widgets.push({
          id: nextId(),
          type: "status_list",
          title: "Tickets Recentes",
          subtitle: `${openTickets} abertos`,
          span: 4,
          data: supportTickets.map((t) => ({
            id: t.id,
            label: t.subject,
            sublabel: `${t.customer} · ${t.channel}`,
            status: t.status,
            priority: t.priority,
            detail: t.sla === "estourado" ? "🔴 SLA Estourado" : t.sla === "proximo" ? "🟡 SLA Próximo" : "🟢 Dentro do SLA",
          })),
        });
        break;
      }

      case "estoque": {
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Alertas de Estoque",
          span: 1,
          data: {
            value: String(inventoryAlerts.length),
            change: 0,
            trend: "stable",
            icon: "📦",
          },
        });
        widgets.push({
          id: nextId(),
          type: "alert_list",
          title: "Materiais em Risco de Ruptura",
          subtitle: "Abaixo do estoque mínimo",
          span: 4,
          data: inventoryAlerts.map((a) => ({
            label: a.material,
            current: a.current,
            minimum: a.minimum,
            unit: a.unit,
            daysToStockout: a.daysToStockout,
            severity: a.daysToStockout <= 3 ? "critical" : a.daysToStockout <= 5 ? "warning" : "info",
          })),
        });
        break;
      }

      case "forecast": {
        widgets.push({
          id: nextId(),
          type: "bar_chart",
          title: "Previsão de Faturamento",
          subtitle: "Realizado vs Previsto",
          span: 4,
          data: forecastData.map((f) => ({
            label: f.month,
            value: f.actual || f.predicted,
            color: f.actual ? "rgb(59 130 246)" : "rgb(59 130 246 / 0.4)",
          })),
        });
        widgets.push({
          id: nextId(),
          type: "table",
          title: "Detalhamento do Forecast",
          span: 4,
          data: {
            headers: ["Mês", "Previsto", "Realizado", "Limite Inferior", "Limite Superior", "Acurácia"],
            rows: forecastData.map((f) => [
              f.month,
              formatCurrency(f.predicted),
              f.actual ? formatCurrency(f.actual) : "—",
              formatCurrency(f.lowerBound),
              formatCurrency(f.upperBound),
              f.actual ? `${((1 - Math.abs(f.actual - f.predicted) / f.predicted) * 100).toFixed(1)}%` : "—",
            ]),
          },
        });
        break;
      }

      case "produtos": {
        widgets.push({
          id: nextId(),
          type: "horizontal_bars",
          title: "Top Produtos por Receita",
          subtitle: "Mais vendidos no período",
          span: 2,
          data: topProducts.map((p) => ({
            label: p.name,
            value: p.revenue,
            maxValue: Math.max(...topProducts.map((tp) => tp.revenue)),
            color: "#3b82f6",
            suffix: "",
            displayValue: formatCurrency(p.revenue),
          })),
        });
        widgets.push({
          id: nextId(),
          type: "table",
          title: "Ranking de Produtos",
          span: 2,
          data: {
            headers: ["#", "Produto", "Vendas", "Receita", "Margem"],
            rows: topProducts.map((p, i) => [
              String(i + 1),
              p.name,
              formatNumber(p.sales),
              formatCurrency(p.revenue),
              `${p.margin}%`,
            ]),
          },
        });
        break;
      }

      case "margem": {
        widgets.push({
          id: nextId(),
          type: "kpi",
          title: "Margem Bruta",
          span: 1,
          data: {
            value: "38,4%",
            change: -1.2,
            trend: "down",
            icon: "📊",
          },
        });
        widgets.push({
          id: nextId(),
          type: "horizontal_bars",
          title: "Margem por Produto",
          span: 2,
          data: topProducts.map((p) => ({
            label: p.name,
            value: p.margin,
            maxValue: 50,
            color: p.margin >= 40 ? "#10b981" : p.margin >= 35 ? "#3b82f6" : "#f59e0b",
            suffix: "%",
          })),
        });
        break;
      }

      case "kpis":
      default: {
        executiveKPIs.slice(0, 4).forEach((kpi) => {
          widgets.push({
            id: nextId(),
            type: "kpi",
            title: kpi.label,
            span: 1,
            data: {
              value: kpi.value,
              change: kpi.change,
              trend: kpi.trend,
              icon: kpi.icon,
            },
          });
        });
        widgets.push({
          id: nextId(),
          type: "bar_chart",
          title: "Faturamento Mensal",
          subtitle: "Últimos 12 meses",
          span: 4,
          data: monthlyRevenue.map((m) => ({
            label: m.month,
            value: m.revenue,
          })),
        });
        break;
      }
    }
  }

  return widgets;
}

// Simulated agent responses based on query analysis
export function generateAgentResponse(query: string): {
  message: string;
  dashboard: GeneratedDashboard;
} {
  const domains = detectQueryDomains(query);
  const widgets = generateWidgetsForQuery(query);
  const lower = query.toLowerCase();

  // Generate contextual response
  let message = "";

  if (domains.includes("faturamento") || domains.includes("pedidos")) {
    message = `📊 **Análise de Faturamento**\n\nO faturamento mensal atual é de **R$ 2.847.500**, representando um crescimento de **+12,3%** em relação ao mês anterior. O volume de pedidos alcançou **1.842 unidades** com ticket médio de **R$ 1.546**.\n\nO Mercado Livre lidera com R$ 892.400 em receita, seguido pela Amazon com R$ 634.200. Destaque para o crescimento da Shopee (+31,2%).`;
  } else if (domains.includes("canais")) {
    message = `🛒 **Performance dos Canais de Venda**\n\nOperamos em **6 canais ativos**. O Mercado Livre lidera com **R$ 892.400** (${((892400 / 2847500) * 100).toFixed(1)}% do total), seguido pela Amazon com **R$ 634.200**.\n\nMaior crescimento: **Shopee (+31,2%)** e **Amazon (+24,1%)**. O canal B2B apresenta retração de -3,2%, necessitando atenção.`;
  } else if (domains.includes("producao")) {
    message = `🏭 **Status da Produção**\n\nO OEE geral está em **78,5%** com produção mensal de **3.420 unidades**. A Linha C (MDF) opera com **93% de utilização** — próximo da capacidade máxima.\n\nTemos **${productionOrders.filter((o) => o.status === "em_producao").length} ordens em produção** e **${productionOrders.filter((o) => o.status === "atrasado").length} atrasada(s)**. O refugo está controlado em **1,8%**.`;
  } else if (domains.includes("fornecedores")) {
    message = `🤝 **Scorecard de Fornecedores**\n\nTemos **${suppliers.filter((s) => s.status === "ativo").length} fornecedores ativos** e **${suppliers.filter((s) => s.status === "em_avaliacao").length} em avaliação**. O on-time rate médio é de **${(suppliers.reduce((a, s) => a + s.onTimeRate, 0) / suppliers.length).toFixed(1)}%**.\n\nDestaque positivo: **Ferragens Premium** com 98,5% de pontualidade e quality score de 97. Atenção: **Vidros Especiais** com apenas 78,9% de pontualidade.`;
  } else if (domains.includes("logistica")) {
    message = `🚚 **Status Logístico**\n\nO OTD está em **94,2%** (+2,8pp). Atualmente temos **${logistics.filter((l) => l.status === "em_transito").length} entregas em trânsito**, **${logistics.filter((l) => l.status === "coletado").length} coletadas** e **${logistics.filter((l) => l.status === "preparando").length} em preparação**.\n\n${logistics.filter((l) => l.status === "devolvido").length > 0 ? `⚠️ Há **${logistics.filter((l) => l.status === "devolvido").length} devolução(ões)** registrada(s).` : "Sem devoluções no período."}`;
  } else if (domains.includes("suporte")) {
    message = `🎧 **Suporte Pós-Venda**\n\nTemos **${supportTickets.filter((t) => t.status !== "resolvido").length} tickets abertos**, sendo **${supportTickets.filter((t) => t.priority === "alta").length} de alta prioridade**. O NPS está em **72** (+4 pontos).\n\n⚠️ **${supportTickets.filter((t) => t.sla === "estourado").length} ticket(s) com SLA estourado** requerem atenção imediata. Principais categorias: defeitos e reclamações.`;
  } else if (domains.includes("estoque")) {
    message = `📦 **Alertas de Estoque**\n\nHá **${inventoryAlerts.length} materiais abaixo do estoque mínimo**. Situação mais crítica: **${inventoryAlerts.sort((a, b) => a.daysToStockout - b.daysToStockout)[0].material}** com apenas **${inventoryAlerts.sort((a, b) => a.daysToStockout - b.daysToStockout)[0].daysToStockout} dias** para ruptura.\n\nRecomendação: acionar fornecedores imediatamente para os itens com menos de 5 dias de cobertura.`;
  } else if (domains.includes("forecast")) {
    message = `📈 **Forecast & Planejamento**\n\nA previsão para março é de **${formatCurrency(forecastData[2].predicted)}** (intervalo: ${formatCurrency(forecastData[2].lowerBound)} a ${formatCurrency(forecastData[2].upperBound)}). A acurácia do modelo nos últimos 2 meses foi superior a **97%**.\n\nTendência de crescimento sustentado para o próximo trimestre, com pico previsto em maio (${formatCurrency(forecastData[4].predicted)}).`;
  } else if (domains.includes("produtos")) {
    message = `🏆 **Top Produtos**\n\nO **${topProducts[0].name}** lidera com **${formatNumber(topProducts[0].sales)} vendas** e receita de **${formatCurrency(topProducts[0].revenue)}** (margem de ${topProducts[0].margin}%).\n\nMaior margem: **${topProducts.sort((a, b) => b.margin - a.margin)[0].name}** com ${topProducts.sort((a, b) => b.margin - a.margin)[0].margin}%. Oportunidade de push comercial nos produtos de alta margem.`;
  } else if (domains.includes("margem")) {
    message = `📊 **Análise de Margens**\n\nA margem bruta geral está em **38,4%** (-1,2pp). A **Escrivaninha Home Office** tem a melhor margem (44,2%), enquanto o **Guarda-Roupa 6 Portas** tem a menor (33,6%).\n\nRecomendação: revisar precificação dos guarda-roupas e avaliar custos de produção da Linha C.`;
  } else {
    message = `📊 **Visão Geral da Empresa**\n\nFaturamento mensal de **R$ 2.847.500** (+12,3%), com **1.842 pedidos** processados. Margem bruta em **38,4%**.\n\nProdução operando a **78,5% OEE**, entregas com **94,2% OTD** e NPS de **72 pontos**. ${supportTickets.filter((t) => t.sla === "estourado").length} tickets com SLA estourado requerem atenção.`;
  }

  // Build title based on domains
  const domainTitles: Record<string, string> = {
    faturamento: "Análise de Faturamento",
    pedidos: "Volume de Pedidos",
    canais: "Performance dos Canais",
    producao: "Controle de Produção",
    fornecedores: "Scorecard de Fornecedores",
    logistica: "Status Logístico",
    suporte: "Suporte Pós-Venda",
    estoque: "Alertas de Estoque",
    forecast: "Forecast & Planejamento",
    produtos: "Ranking de Produtos",
    margem: "Análise de Margens",
    kpis: "Painel Executivo",
  };

  const title = domains.map((d) => domainTitles[d] || "Dashboard").join(" + ");

  return {
    message,
    dashboard: {
      title,
      description: query,
      widgets,
      query,
      timestamp: Date.now(),
    },
  };
}

// Suggested queries for the agent
export const SUGGESTED_QUERIES = [
  "Qual o faturamento por canal de venda?",
  "Como está a produção e utilização das linhas?",
  "Mostre os fornecedores e seus scorecards",
  "Qual o status das entregas e logística?",
  "Quais tickets de suporte estão com SLA estourado?",
  "Mostre o forecast para os próximos meses",
  "Quais materiais estão em risco de ruptura?",
  "Ranking dos produtos mais vendidos e suas margens",
  "Visão geral de todos os KPIs da empresa",
  "Compare a performance de todos os canais de venda",
];
