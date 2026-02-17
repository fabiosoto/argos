import { formatPercent } from "@/lib/constants";

interface KPICardProps {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down" | "stable";
  icon: string;
  compact?: boolean;
}

export function KPICard({ label, value, change, trend, icon, compact }: KPICardProps) {
  const isPositive = (trend === "up" && change > 0) || (trend === "down" && change < 0);
  const trendColor = isPositive ? "text-emerald-400" : change === 0 ? "text-zinc-500" : "text-red-400";
  const trendBg = isPositive ? "bg-emerald-500/10" : change === 0 ? "bg-zinc-500/10" : "bg-red-500/10";
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "→";

  if (compact) {
    return (
      <div className="group bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4 hover:border-zinc-700/60 hover:bg-zinc-900/80 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500 font-medium truncate pr-2">{label}</span>
          <span className="text-base">{icon}</span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="text-lg font-bold text-zinc-100">{value}</span>
          <span className={`text-[11px] font-semibold ${trendColor} ${trendBg} px-1.5 py-0.5 rounded-md`}>
            {arrow} {formatPercent(change)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/60 hover:bg-zinc-900/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-zinc-800/80 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className={`text-xs font-semibold ${trendColor} ${trendBg} px-2 py-1 rounded-lg flex items-center gap-1`}>
          {arrow} {formatPercent(change)}
        </span>
      </div>
      <p className="text-2xl font-bold text-zinc-100 mb-1">{value}</p>
      <p className="text-xs text-zinc-500 font-medium">{label}</p>
    </div>
  );
}
