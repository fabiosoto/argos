import React from "react";
import { MiniBarChart, ProgressRing, HorizontalBars, Sparkline } from "@/components/MiniChart";
import { formatCurrency } from "@/lib/constants";
import type { DashboardWidget } from "@/lib/agent-data";

interface WidgetRendererProps {
  widget: DashboardWidget;
}

export function DynamicWidgetRenderer({ widget }: WidgetRendererProps) {
  switch (widget.type) {
    case "kpi":
      return <KPIWidget widget={widget} />;
    case "bar_chart":
      return <BarChartWidget widget={widget} />;
    case "progress_ring":
      return <ProgressRingWidget widget={widget} />;
    case "horizontal_bars":
      return <HorizontalBarsWidget widget={widget} />;
    case "table":
      return <TableWidget widget={widget} />;
    case "status_list":
      return <StatusListWidget widget={widget} />;
    case "alert_list":
      return <AlertListWidget widget={widget} />;
    case "metric_comparison":
      return <MetricComparisonWidget widget={widget} />;
    case "pie_chart":
      return <PieChartWidget widget={widget} />;
    case "sparkline":
      return <SparklineWidget widget={widget} />;
    default:
      return <FallbackWidget widget={widget} />;
  }
}

// ─── KPI Widget ──────────────────────────────────────────────────────────────

function KPIWidget({ widget }: WidgetRendererProps) {
  const { value, change, trend, icon } = widget.data;
  const isPositive = (trend === "up" && change > 0) || (trend === "down" && change < 0);
  const trendColor = isPositive ? "text-emerald-400" : change === 0 ? "text-zinc-500" : "text-red-400";
  const trendBg = isPositive ? "bg-emerald-500/10" : change === 0 ? "bg-zinc-500/10" : "bg-red-500/10";
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "→";

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/60 hover:bg-zinc-900/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 group h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-zinc-800/80 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className={`text-xs font-semibold ${trendColor} ${trendBg} px-2 py-1 rounded-lg flex items-center gap-1`}>
          {arrow} {change > 0 ? "+" : ""}{change}%
        </span>
      </div>
      <p className="text-2xl font-bold text-zinc-100 mb-1">{value}</p>
      <p className="text-xs text-zinc-500 font-medium">{widget.title}</p>
    </div>
  );
}

// ─── Bar Chart Widget ────────────────────────────────────────────────────────

function BarChartWidget({ widget }: WidgetRendererProps) {
  const data = widget.data as { label: string; value: number; color?: string }[];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">{widget.title}</h3>
          {widget.subtitle && <p className="text-xs text-zinc-500 mt-0.5">{widget.subtitle}</p>}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
          <span className="text-[10px] text-zinc-500">Valor</span>
        </div>
      </div>
      <MiniBarChart data={data} height={180} />
    </div>
  );
}

// ─── Progress Ring Widget ────────────────────────────────────────────────────

function ProgressRingWidget({ widget }: WidgetRendererProps) {
  const data = widget.data as { label: string; value: number; color: string; detail: string }[];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full">
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">{widget.title}</h3>
      {widget.subtitle && <p className="text-xs text-zinc-500 mb-4">{widget.subtitle}</p>}
      <div className="flex items-center justify-around mb-4">
        {data.map((item, i) => (
          <ProgressRing
            key={i}
            value={item.value}
            color={item.color}
            label={item.label}
            size={85}
          />
        ))}
      </div>
      <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800/60">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">{item.label}</span>
            <span className="text-zinc-300 font-medium">{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Horizontal Bars Widget ──────────────────────────────────────────────────

function HorizontalBarsWidget({ widget }: WidgetRendererProps) {
  const data = widget.data as {
    label: string;
    value: number;
    maxValue: number;
    color: string;
    suffix?: string;
    displayValue?: string;
  }[];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full">
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">{widget.title}</h3>
      {widget.subtitle && <p className="text-xs text-zinc-500 mb-4">{widget.subtitle}</p>}
      <div className="space-y-3">
        {data.map((item, i) => {
          const pct = (item.value / item.maxValue) * 100;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400 font-medium truncate pr-2">{item.label}</span>
                <span className="text-xs text-zinc-300 font-semibold whitespace-nowrap">
                  {item.displayValue || `${item.value}${item.suffix || ""}`}
                </span>
              </div>
              <div className="h-2 bg-zinc-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Table Widget ────────────────────────────────────────────────────────────

function TableWidget({ widget }: WidgetRendererProps) {
  const { headers, rows } = widget.data as { headers: string[]; rows: string[][] };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full">
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">{widget.title}</h3>
      {widget.subtitle && <p className="text-xs text-zinc-500 mb-4">{widget.subtitle}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800/60">
              {headers.map((h, i) => (
                <th key={i} className="text-left py-2 px-2 text-zinc-500 font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                {row.map((cell, ci) => {
                  const isPositiveChange = cell.startsWith("+") && cell.endsWith("%");
                  const isNegativeChange = cell.startsWith("-") && cell.endsWith("%") && ci === row.length - 1;
                  const isStatus = cell.startsWith("✅") || cell.startsWith("⚠️") || cell.startsWith("🚫") || cell.startsWith("🚛") || cell.startsWith("📦") || cell.startsWith("↩️") || cell.startsWith("⏳");
                  return (
                    <td
                      key={ci}
                      className={`py-2.5 px-2 whitespace-nowrap ${
                        ci === 0 ? "text-zinc-200 font-medium" : "text-zinc-400"
                      } ${isPositiveChange ? "text-emerald-400 font-semibold" : ""} ${
                        isNegativeChange ? "text-red-400 font-semibold" : ""
                      } ${isStatus ? "text-zinc-300" : ""}`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Status List Widget ──────────────────────────────────────────────────────

function StatusListWidget({ widget }: WidgetRendererProps) {
  const data = widget.data as {
    id: string;
    label: string;
    sublabel: string;
    status: string;
    progress?: number;
    priority?: string;
    detail: string;
  }[];

  const statusColors: Record<string, string> = {
    em_producao: "bg-blue-500",
    aguardando: "bg-amber-500",
    concluido: "bg-emerald-500",
    atrasado: "bg-red-500",
    aberto: "bg-red-500",
    em_andamento: "bg-blue-500",
    aguardando_cliente: "bg-amber-500",
    resolvido: "bg-emerald-500",
  };

  const statusLabels: Record<string, string> = {
    em_producao: "Em Produção",
    aguardando: "Aguardando",
    concluido: "Concluído",
    atrasado: "Atrasado",
    aberto: "Aberto",
    em_andamento: "Em Andamento",
    aguardando_cliente: "Aguardando Cliente",
    resolvido: "Resolvido",
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">{widget.title}</h3>
          {widget.subtitle && <p className="text-xs text-zinc-500 mt-0.5">{widget.subtitle}</p>}
        </div>
      </div>
      <div className="space-y-2.5">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-800/30 border border-zinc-800/40 hover:bg-zinc-800/50 transition-colors"
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${statusColors[item.status] || "bg-zinc-500"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{item.label}</p>
              <p className="text-[10px] text-zinc-500 truncate">{item.sublabel}</p>
            </div>
            {item.progress !== undefined && (
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 font-medium w-8 text-right">{item.progress}%</span>
              </div>
            )}
            <div className="shrink-0 flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                statusColors[item.status]?.replace("bg-", "bg-").replace("500", "500/20") || "bg-zinc-500/20"
              } ${statusColors[item.status]?.replace("bg-", "text-") || "text-zinc-400"}`}>
                {statusLabels[item.status] || item.status}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 shrink-0">{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Alert List Widget ───────────────────────────────────────────────────────

function AlertListWidget({ widget }: WidgetRendererProps) {
  const data = widget.data as {
    label: string;
    current: number;
    minimum: number;
    unit: string;
    daysToStockout: number;
    severity: "critical" | "warning" | "info";
  }[];

  const severityConfig = {
    critical: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: "🔴" },
    warning: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", icon: "🟡" },
    info: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", icon: "🔵" },
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full">
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">{widget.title}</h3>
      {widget.subtitle && <p className="text-xs text-zinc-500 mb-4">{widget.subtitle}</p>}
      <div className="space-y-2.5">
        {data.map((item, i) => {
          const config = severityConfig[item.severity];
          const pct = (item.current / item.minimum) * 100;
          return (
            <div
              key={i}
              className={`p-3 rounded-lg ${config.bg} border ${config.border} transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{config.icon}</span>
                  <span className="text-xs font-medium text-zinc-200">{item.label}</span>
                </div>
                <span className={`text-[10px] font-bold ${config.text}`}>
                  {item.daysToStockout} dias para ruptura
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-zinc-800/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.severity === "critical" ? "bg-red-500" : item.severity === "warning" ? "bg-amber-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                  {item.current}/{item.minimum} {item.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Metric Comparison Widget ────────────────────────────────────────────────

function MetricComparisonWidget({ widget }: WidgetRendererProps) {
  const data = widget.data as { label: string; value: number; icon: string }[];
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">{widget.title}</h3>
      <div className="space-y-3">
        {sorted.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs text-zinc-400 flex-1 truncate">{item.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.value >= 0 ? "bg-emerald-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(Math.abs(item.value) / Math.max(...data.map((d) => Math.abs(d.value))) * 100, 100)}%` }}
                />
              </div>
              <span
                className={`text-xs font-semibold w-12 text-right ${
                  item.value >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {item.value >= 0 ? "+" : ""}{item.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pie Chart Widget (CSS-based) ────────────────────────────────────────────

function PieChartWidget({ widget }: WidgetRendererProps) {
  const data = widget.data as { label: string; value: number; color: string }[];
  const total = data.reduce((a, d) => a + d.value, 0);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">{widget.title}</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {data.reduce<{ elements: React.ReactNode[]; offset: number }>(
              (acc, item, i) => {
                const pct = (item.value / total) * 100;
                acc.elements.push(
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="3"
                    strokeDasharray={`${pct} ${100 - pct}`}
                    strokeDashoffset={-acc.offset}
                    className="transition-all duration-700"
                  />
                );
                acc.offset += pct;
                return acc;
              },
              { elements: [], offset: 0 }
            ).elements}
          </svg>
        </div>
        <div className="space-y-2 flex-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-zinc-400 flex-1 truncate">{item.label}</span>
              <span className="text-xs text-zinc-300 font-medium">{((item.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sparkline Widget ────────────────────────────────────────────────────────

function SparklineWidget({ widget }: WidgetRendererProps) {
  const data = widget.data as { label: string; values: number[]; color: string; currentValue: string }[];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">{widget.title}</h3>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-xs text-zinc-400 w-24 truncate">{item.label}</span>
            <Sparkline data={item.values} color={item.color} height={24} width={80} />
            <span className="text-xs text-zinc-200 font-semibold">{item.currentValue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Fallback Widget ─────────────────────────────────────────────────────────

function FallbackWidget({ widget }: WidgetRendererProps) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 h-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-zinc-400">{widget.title}</p>
        <p className="text-[10px] text-zinc-600 mt-1">Tipo: {widget.type}</p>
      </div>
    </div>
  );
}

// ─── Dashboard Grid Renderer ─────────────────────────────────────────────────

interface DashboardGridProps {
  widgets: DashboardWidget[];
}

export function DashboardGrid({ widgets }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={`${
            widget.span === 4
              ? "col-span-4"
              : widget.span === 3
              ? "col-span-4 lg:col-span-3"
              : widget.span === 2
              ? "col-span-4 sm:col-span-2"
              : "col-span-2 sm:col-span-1"
          }`}
        >
          <DynamicWidgetRenderer widget={widget} />
        </div>
      ))}
    </div>
  );
}
