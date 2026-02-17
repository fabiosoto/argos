import { useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 5,
  title,
  subtitle,
  emptyMessage = "Nenhum dado encontrado",
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);
  const paged = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl overflow-hidden">
      {(title || subtitle) && (
        <div className="px-5 pt-5 pb-3">
          {title && <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>}
          {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ${
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                  }`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-sm text-zinc-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-800/30 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-3 text-sm ${
                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                      }`}
                    >
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800/60">
          <span className="text-xs text-zinc-500">
            {page * pageSize + 1}-{Math.min((page + 1) * pageSize, data.length)} de {data.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-2.5 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-2.5 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Próximo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Status badge component
export function StatusBadge({
  status,
  variant,
}: {
  status: string;
  variant: "success" | "warning" | "danger" | "info" | "neutral";
}) {
  const colors = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    neutral: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colors[variant]}`}>
      {status}
    </span>
  );
}

// Priority indicator
export function PriorityDot({ priority }: { priority: "alta" | "media" | "baixa" }) {
  const colors = {
    alta: "bg-red-500",
    media: "bg-amber-500",
    baixa: "bg-blue-500",
  };
  const labels = { alta: "Alta", media: "Média", baixa: "Baixa" };

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[priority]}`} />
      <span className="text-xs text-zinc-400">{labels[priority]}</span>
    </span>
  );
}
