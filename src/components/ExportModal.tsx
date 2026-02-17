import { useState } from "react";
import {
  executiveKPIs,
  salesChannels,
  monthlyRevenue,
  productionLines,
  topProducts,
  inventoryAlerts,
  supportTickets,
  logistics,
  retailKPIs,
  industryKPIs,
  productionOrders,
  suppliers,
  forecastData,
} from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/constants";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

type ExportFormat = "csv" | "json" | "clipboard";
type ReportSection =
  | "executive_kpis"
  | "revenue"
  | "channels"
  | "production"
  | "products"
  | "inventory"
  | "logistics"
  | "support"
  | "suppliers"
  | "forecast"
  | "retail_kpis"
  | "industry_kpis";

const SECTIONS: { key: ReportSection; label: string; icon: string; description: string }[] = [
  { key: "executive_kpis", label: "KPIs Executivos", icon: "📊", description: "Faturamento, pedidos, margem, OTD, NPS" },
  { key: "revenue", label: "Faturamento Mensal", icon: "💰", description: "Receita dos últimos 12 meses" },
  { key: "channels", label: "Canais de Venda", icon: "🛒", description: "Performance por marketplace" },
  { key: "production", label: "Ordens de Produção", icon: "🏭", description: "Status e progresso das OPs" },
  { key: "products", label: "Top Produtos", icon: "🎯", description: "Produtos mais vendidos" },
  { key: "inventory", label: "Alertas de Estoque", icon: "⚠️", description: "Materiais abaixo do mínimo" },
  { key: "logistics", label: "Logística", icon: "🚚", description: "Entregas e rastreamento" },
  { key: "support", label: "Suporte", icon: "🎧", description: "Tickets de atendimento" },
  { key: "suppliers", label: "Fornecedores", icon: "🤝", description: "Scorecard de fornecedores" },
  { key: "forecast", label: "Forecast", icon: "📈", description: "Previsão de faturamento" },
  { key: "retail_kpis", label: "KPIs Varejo", icon: "💳", description: "GMV, conversão, CAC, LTV" },
  { key: "industry_kpis", label: "KPIs Indústria", icon: "⚙️", description: "OEE, produção, refugo" },
];

export function ExportModal({ open, onClose }: ExportModalProps) {
  const [selected, setSelected] = useState<Set<ReportSection>>(new Set(["executive_kpis", "revenue", "channels"]));
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  if (!open) return null;

  const toggleSection = (key: ReportSection) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === SECTIONS.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(SECTIONS.map((s) => s.key)));
    }
  };

  const generateData = (): string => {
    const parts: string[] = [];

    if (format === "json") {
      const obj: Record<string, unknown> = { exportDate: new Date().toISOString(), report: "Argos - Relatório Executivo" };
      if (selected.has("executive_kpis")) obj.executiveKPIs = executiveKPIs;
      if (selected.has("revenue")) obj.monthlyRevenue = monthlyRevenue;
      if (selected.has("channels")) obj.salesChannels = salesChannels;
      if (selected.has("production")) obj.productionOrders = productionOrders;
      if (selected.has("products")) obj.topProducts = topProducts;
      if (selected.has("inventory")) obj.inventoryAlerts = inventoryAlerts;
      if (selected.has("logistics")) obj.logistics = logistics;
      if (selected.has("support")) obj.supportTickets = supportTickets;
      if (selected.has("suppliers")) obj.suppliers = suppliers;
      if (selected.has("forecast")) obj.forecast = forecastData;
      if (selected.has("retail_kpis")) obj.retailKPIs = retailKPIs;
      if (selected.has("industry_kpis")) obj.industryKPIs = industryKPIs;
      return JSON.stringify(obj, null, 2);
    }

    // CSV format
    if (selected.has("executive_kpis")) {
      parts.push("=== KPIs EXECUTIVOS ===");
      parts.push("Indicador,Valor,Variação,Tendência");
      executiveKPIs.forEach((k) => parts.push(`"${k.label}","${k.value}",${k.change}%,${k.trend}`));
      parts.push("");
    }

    if (selected.has("revenue")) {
      parts.push("=== FATURAMENTO MENSAL ===");
      parts.push("Mês,Faturamento,Pedidos");
      monthlyRevenue.forEach((m) => parts.push(`${m.month},${m.revenue},${m.orders}`));
      parts.push("");
    }

    if (selected.has("channels")) {
      parts.push("=== CANAIS DE VENDA ===");
      parts.push("Canal,Faturamento,Pedidos,Ticket Médio,Conversão,Variação");
      salesChannels.forEach((c) => parts.push(`"${c.name}",${c.revenue},${c.orders},${c.avgTicket},${c.conversion}%,${c.change}%`));
      parts.push("");
    }

    if (selected.has("production")) {
      parts.push("=== ORDENS DE PRODUÇÃO ===");
      parts.push("OP,Produto,Linha,Quantidade,Concluído,Status,Prioridade,Prazo");
      productionOrders.forEach((o) => parts.push(`${o.id},"${o.product}","${o.line}",${o.quantity},${o.completed},${o.status},${o.priority},${o.dueDate}`));
      parts.push("");
    }

    if (selected.has("products")) {
      parts.push("=== TOP PRODUTOS ===");
      parts.push("Produto,Vendas,Faturamento,Margem");
      topProducts.forEach((p) => parts.push(`"${p.name}",${p.sales},${p.revenue},${p.margin}%`));
      parts.push("");
    }

    if (selected.has("inventory")) {
      parts.push("=== ALERTAS DE ESTOQUE ===");
      parts.push("Material,Atual,Mínimo,Unidade,Dias p/ Ruptura");
      inventoryAlerts.forEach((a) => parts.push(`"${a.material}",${a.current},${a.minimum},${a.unit},${a.daysToStockout}`));
      parts.push("");
    }

    if (selected.has("logistics")) {
      parts.push("=== LOGÍSTICA ===");
      parts.push("ID,Pedido,Cliente,Cidade,UF,Transportadora,Status,Previsão,Canal");
      logistics.forEach((l) => parts.push(`${l.id},${l.orderId},"${l.customer}","${l.city}",${l.state},"${l.carrier}",${l.status},${l.estimatedDate},"${l.channel}"`));
      parts.push("");
    }

    if (selected.has("support")) {
      parts.push("=== SUPORTE ===");
      parts.push("Ticket,Cliente,Assunto,Categoria,Prioridade,Status,Canal,SLA");
      supportTickets.forEach((t) => parts.push(`${t.id},"${t.customer}","${t.subject}",${t.category},${t.priority},${t.status},"${t.channel}",${t.sla}`));
      parts.push("");
    }

    if (selected.has("suppliers")) {
      parts.push("=== FORNECEDORES ===");
      parts.push("ID,Nome,Categoria,Lead Time,On-Time Rate,Qualidade,Status");
      suppliers.forEach((s) => parts.push(`${s.id},"${s.name}","${s.category}",${s.leadTime},${s.onTimeRate}%,${s.qualityScore},${s.status}`));
      parts.push("");
    }

    if (selected.has("forecast")) {
      parts.push("=== FORECAST ===");
      parts.push("Mês,Previsto,Realizado,Limite Inferior,Limite Superior");
      forecastData.forEach((f) => parts.push(`${f.month},${f.predicted},${f.actual ?? ""},${f.lowerBound},${f.upperBound}`));
      parts.push("");
    }

    if (selected.has("retail_kpis")) {
      parts.push("=== KPIs VAREJO ===");
      parts.push("Indicador,Valor,Variação,Tendência");
      retailKPIs.forEach((k) => parts.push(`"${k.label}","${k.value}",${k.change}%,${k.trend}`));
      parts.push("");
    }

    if (selected.has("industry_kpis")) {
      parts.push("=== KPIs INDÚSTRIA ===");
      parts.push("Indicador,Valor,Variação,Tendência");
      industryKPIs.forEach((k) => parts.push(`"${k.label}","${k.value}",${k.change}%,${k.trend}`));
      parts.push("");
    }

    return parts.join("\n");
  };

  const handleExport = async () => {
    if (selected.size === 0) return;
    setExporting(true);

    const data = generateData();

    if (format === "clipboard") {
      await navigator.clipboard.writeText(data);
      setExported(true);
      setTimeout(() => { setExported(false); setExporting(false); }, 2000);
      return;
    }

    const blob = new Blob([data], {
      type: format === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `argos-relatorio-${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => { setExported(false); setExporting(false); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/60 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-zinc-100">📥 Exportar Relatório Executivo</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Selecione as seções e o formato de exportação</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80 transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-2 block">Formato</label>
            <div className="flex gap-2">
              {([
                { key: "csv" as ExportFormat, label: "CSV", icon: "📄", desc: "Planilha" },
                { key: "json" as ExportFormat, label: "JSON", icon: "🔧", desc: "Dados brutos" },
                { key: "clipboard" as ExportFormat, label: "Clipboard", icon: "📋", desc: "Copiar" },
              ]).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFormat(f.key)}
                  className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                    format === f.key
                      ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                      : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400 hover:border-zinc-600/50"
                  }`}
                >
                  <span className="text-lg block mb-1">{f.icon}</span>
                  <span className="text-xs font-semibold block">{f.label}</span>
                  <span className="text-[10px] text-zinc-500 block">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-300">Seções do Relatório</label>
              <button onClick={selectAll} className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                {selected.size === SECTIONS.length ? "Desmarcar Tudo" : "Selecionar Tudo"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SECTIONS.map((section) => {
                const isSelected = selected.has(section.key);
                return (
                  <button
                    key={section.key}
                    onClick={() => toggleSection(section.key)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "bg-blue-600/10 border-blue-500/30"
                        : "bg-zinc-800/30 border-zinc-700/20 hover:border-zinc-600/40"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "bg-blue-600 border-blue-500" : "border-zinc-600"
                    }`}>
                      {isSelected && <span className="text-[10px] text-white">✓</span>}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{section.icon}</span>
                        <span className="text-xs font-medium text-zinc-200">{section.label}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate">{section.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800/60 flex items-center justify-between shrink-0">
          <span className="text-xs text-zinc-500">
            {selected.size} {selected.size === 1 ? "seção selecionada" : "seções selecionadas"}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-700/80 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleExport}
              disabled={selected.size === 0 || exporting}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                exported
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              {exported ? "✅ Exportado!" : exporting ? "⏳ Exportando..." : format === "clipboard" ? "📋 Copiar" : "📥 Baixar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
