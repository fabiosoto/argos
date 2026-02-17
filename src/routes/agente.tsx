import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { AgentChat } from "@/components/AgentChat";
import { DashboardGrid } from "@/components/DynamicWidgetRenderer";
import type { GeneratedDashboard } from "@/lib/agent-data";
import { SUGGESTED_QUERIES, generateAgentResponse } from "@/lib/agent-data";

export const Route = createFileRoute("/agente")({
  component: AgentPage,
});

interface SavedDashboardLocal {
  id: string;
  dashboard: GeneratedDashboard;
  savedAt: number;
  pinned: boolean;
}

function AgentPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState<GeneratedDashboard | null>(null);
  const [savedDashboards, setSavedDashboards] = useState<SavedDashboardLocal[]>([]);
  const [viewMode, setViewMode] = useState<"dashboard" | "saved">("dashboard");
  const [saveConfirm, setSaveConfirm] = useState(false);

  const handleDashboardGenerated = useCallback((dashboard: GeneratedDashboard) => {
    setActiveDashboard(dashboard);
    setViewMode("dashboard");
    setChatOpen(false);
  }, []);

  const handleSaveDashboard = useCallback(() => {
    if (!activeDashboard) return;
    const exists = savedDashboards.some((s) => s.dashboard.query === activeDashboard.query);
    if (exists) return;

    setSavedDashboards((prev) => [
      ...prev,
      {
        id: `saved-${Date.now()}`,
        dashboard: activeDashboard,
        savedAt: Date.now(),
        pinned: false,
      },
    ]);
    setSaveConfirm(true);
    setTimeout(() => setSaveConfirm(false), 2500);
  }, [activeDashboard, savedDashboards]);

  const handleDeleteSaved = useCallback((id: string) => {
    setSavedDashboards((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleTogglePin = useCallback((id: string) => {
    setSavedDashboards((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s))
    );
  }, []);

  const handleLoadSaved = useCallback((saved: SavedDashboardLocal) => {
    // Re-generate with fresh data to simulate "always updated"
    const freshResult = generateAgentResponse(saved.dashboard.query);
    setActiveDashboard({
      ...freshResult.dashboard,
      title: saved.dashboard.title,
    });
    setViewMode("dashboard");
  }, []);

  const handleQuickQuery = useCallback(
    (query: string) => {
      const result = generateAgentResponse(query);
      setActiveDashboard(result.dashboard);
      setViewMode("dashboard");
    },
    []
  );

  const isSaved = activeDashboard
    ? savedDashboards.some((s) => s.dashboard.query === activeDashboard.query)
    : false;

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            🤖 Argos AI
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Pergunte sobre qualquer aspecto da empresa e receba dashboards personalizados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("saved")}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
              viewMode === "saved"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            💾 Salvos
            {savedDashboards.length > 0 && (
              <span className="bg-violet-500/30 text-violet-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {savedDashboards.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setChatOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
          >
            💬 Perguntar ao Agente
          </button>
        </div>
      </div>

      {/* Active Dashboard View */}
      {viewMode === "dashboard" && activeDashboard && (
        <div className="space-y-4">
          {/* Dashboard Header */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-100">{activeDashboard.title}</h2>
                <p className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-2">
                  <span>Pergunta: &quot;{activeDashboard.query}&quot;</span>
                  <span className="text-zinc-700">·</span>
                  <span>{activeDashboard.widgets.length} indicadores</span>
                  <span className="text-zinc-700">·</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Dados em tempo real
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saveConfirm ? (
                <div className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  ✅ Dashboard salvo!
                </div>
              ) : (
                <button
                  onClick={handleSaveDashboard}
                  disabled={isSaved}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                    isSaved
                      ? "bg-zinc-800/40 text-zinc-600 cursor-not-allowed"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                  }`}
                >
                  {isSaved ? "✅ Salvo" : "💾 Salvar Dashboard"}
                </button>
              )}
              <button
                onClick={() => setChatOpen(true)}
                className="px-3 py-2 bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 text-xs font-medium rounded-lg hover:text-zinc-200 hover:bg-zinc-800 transition-all"
              >
                ✏️ Refinar
              </button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <DashboardGrid widgets={activeDashboard.widgets} />
        </div>
      )}

      {/* Saved Dashboards View */}
      {viewMode === "saved" && (
        <div className="space-y-4">
          {savedDashboards.length === 0 ? (
            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">💾</div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-1">Nenhum dashboard salvo</h3>
              <p className="text-xs text-zinc-500 mb-4 max-w-sm mx-auto">
                Pergunte ao agente e salve os dashboards que atenderem ao conselho para acompanhamento contínuo.
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                💬 Criar Primeiro Dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...savedDashboards]
                .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.savedAt - a.savedAt)
                .map((saved) => (
                  <div
                    key={saved.id}
                    className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700/60 transition-all duration-300 group"
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-zinc-800/40">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {saved.pinned && <span className="text-amber-400 text-xs">📌</span>}
                            <h3 className="text-sm font-semibold text-zinc-200 truncate">
                              {saved.dashboard.title}
                            </h3>
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-1 truncate">
                            &quot;{saved.dashboard.query}&quot;
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            onClick={() => handleTogglePin(saved.id)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/60 transition-all opacity-0 group-hover:opacity-100"
                            title={saved.pinned ? "Desafixar" : "Fixar"}
                          >
                            📌
                          </button>
                          <button
                            onClick={() => handleDeleteSaved(saved.id)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60 transition-all opacity-0 group-hover:opacity-100"
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mini Preview */}
                    <div className="px-4 py-3 grid grid-cols-4 gap-1.5">
                      {saved.dashboard.widgets.slice(0, 6).map((w) => (
                        <div
                          key={w.id}
                          className={`rounded bg-zinc-800/40 p-1.5 ${
                            w.span >= 4 ? "col-span-4" : w.span >= 2 ? "col-span-2" : "col-span-1"
                          }`}
                        >
                          {w.type === "kpi" ? (
                            <div>
                              <div className="text-[8px] text-zinc-600 truncate">{w.title}</div>
                              <div className="text-[10px] font-bold text-zinc-300">{w.data.value}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-[8px] text-zinc-600 truncate">{w.title}</div>
                              <div className="flex gap-px mt-1 h-3">
                                {[40, 65, 55, 80, 45].map((h, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 bg-blue-500/30 rounded-t-sm"
                                    style={{ height: `${h}%` }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 py-3 border-t border-zinc-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-zinc-500">
                          {saved.dashboard.widgets.length} indicadores · Atualizado em tempo real
                        </span>
                      </div>
                      <button
                        onClick={() => handleLoadSaved(saved)}
                        className="px-3 py-1.5 bg-blue-600/20 text-blue-400 text-[11px] font-medium rounded-md hover:bg-blue-600/30 transition-colors"
                      >
                        Abrir →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State - No Dashboard Active */}
      {viewMode === "dashboard" && !activeDashboard && (
        <div className="space-y-6">
          {/* Hero CTA */}
          <div className="bg-gradient-to-br from-violet-500/10 via-zinc-900/60 to-blue-500/10 border border-zinc-800/60 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/20">
              <span className="text-2xl">🤖</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-100 mb-2">
              Crie dashboards com linguagem natural
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto mb-6">
              Pergunte sobre faturamento, produção, fornecedores, logística ou qualquer outro aspecto da empresa.
              O Argos AI analisa os dados e monta um dashboard personalizado em segundos.
            </p>
            <button
              onClick={() => setChatOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-105"
            >
              💬 Iniciar Conversa com o Agente
            </button>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Perguntas Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SUGGESTED_QUERIES.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuery(q)}
                  className="text-left px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 hover:border-zinc-700/50 transition-all duration-200 group"
                >
                  <span className="text-zinc-600 group-hover:text-blue-400 mr-2 transition-colors">→</span>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Dashboards Preview */}
          {savedDashboards.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Dashboards Salvos
                </h3>
                <button
                  onClick={() => setViewMode("saved")}
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Ver todos →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedDashboards.slice(0, 3).map((saved) => (
                  <button
                    key={saved.id}
                    onClick={() => handleLoadSaved(saved)}
                    className="text-left bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4 hover:border-zinc-700/60 hover:bg-zinc-900/80 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {saved.pinned && <span className="text-amber-400 text-[10px]">📌</span>}
                      <h4 className="text-xs font-semibold text-zinc-200 truncate">{saved.dashboard.title}</h4>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate">{saved.dashboard.widgets.length} indicadores</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Agent Chat Panel */}
      <AgentChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onDashboardGenerated={handleDashboardGenerated}
      />
    </div>
  );
}
