import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const routerState = useRouterState();
  const isAgentPage = routerState.location.pathname === "/agente";
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-zinc-500 capitalize">{dateStr}</p>
          <h2 className="text-sm font-semibold text-zinc-200">
            Bem-vindo de volta, <span className="text-blue-400">Administrador</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className={`relative transition-all duration-300 ${searchOpen ? "w-64" : "w-9"}`}>
          {searchOpen && (
            <input
              autoFocus
              type="text"
              placeholder="Buscar pedidos, produtos..."
              className="w-full h-9 bg-zinc-800/80 border border-zinc-700/50 rounded-lg pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              onBlur={() => setSearchOpen(false)}
            />
          )}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`${searchOpen ? "absolute left-2.5 top-1/2 -translate-y-1/2" : ""} text-zinc-400 hover:text-zinc-200 transition-colors`}
          >
            🔍
          </button>
        </div>

        {/* AI Agent Quick Access */}
        {!isAgentPage && (
          <Link
            to="/agente"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 text-violet-300 hover:from-violet-500/20 hover:to-blue-500/20 transition-all duration-200"
          >
            <span className="text-sm">🤖</span>
            <span className="text-[11px] font-medium">Argos AI</span>
          </Link>
        )}

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all duration-200">
          🔔
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
            5
          </span>
        </button>

        {/* Sync status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-emerald-400">Sincronizado</span>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
          AD
        </div>
      </div>
    </header>
  );
}
