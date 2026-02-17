import { useState, useRef, useEffect, useCallback } from "react";
import { generateAgentResponse, SUGGESTED_QUERIES, type GeneratedDashboard } from "@/lib/agent-data";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  dashboard?: GeneratedDashboard;
  timestamp: number;
}

interface AgentChatProps {
  open: boolean;
  onClose: () => void;
  onDashboardGenerated: (dashboard: GeneratedDashboard) => void;
}

export function AgentChat({ open, onClose, onDashboardGenerated }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agent",
      content:
        "Olá! Sou o **Argos AI**, seu assistente de inteligência empresarial. 🤖\n\nPergunte sobre qualquer aspecto da empresa — faturamento, produção, fornecedores, logística, suporte — e eu crio um dashboard personalizado com os indicadores relevantes.\n\nVocê pode salvar qualquer dashboard gerado para acompanhamento contínuo.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = useCallback(
    async (text?: string) => {
      const query = (text || input).trim();
      if (!query) return;

      setInput("");
      setShowSuggestions(false);

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: query,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      setIsTyping(true);

      // Simulate AI processing delay
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

      const result = generateAgentResponse(query);

      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: result.message,
        dashboard: result.dashboard,
        timestamp: Date.now(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, agentMsg]);
    },
    [input]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-100 font-semibold">$1</strong>')
      .replace(/\n/g, "<br />");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-[520px] bg-zinc-950 border-l border-zinc-800/60 z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white text-sm">🤖</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Argos AI</h2>
              <p className="text-[10px] text-zinc-500">Assistente de Inteligência Empresarial</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: "welcome",
                    role: "agent",
                    content:
                      "Conversa reiniciada. Como posso ajudar? 🤖",
                    timestamp: Date.now(),
                  },
                ]);
                setShowSuggestions(true);
              }}
              className="px-2.5 py-1.5 rounded-lg text-[11px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
              title="Nova conversa"
            >
              🔄 Nova
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[90%] ${
                  msg.role === "user"
                    ? "bg-blue-600/20 border border-blue-500/30 rounded-2xl rounded-br-md px-4 py-3"
                    : "space-y-3"
                }`}
              >
                {msg.role === "agent" && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] text-white">AI</span>
                    </div>
                    <div
                      className="text-sm text-zinc-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
                  </div>
                )}
                {msg.role === "user" && (
                  <p className="text-sm text-blue-100">{msg.content}</p>
                )}

                {/* Dashboard Preview Card */}
                {msg.dashboard && (
                  <div className="ml-8 mt-2">
                    <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-zinc-800/40 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-200">{msg.dashboard.title}</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            {msg.dashboard.widgets.length} indicadores gerados
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[10px] text-emerald-400 font-medium">Pronto</span>
                        </div>
                      </div>

                      {/* Mini widget preview */}
                      <div className="px-4 py-3 grid grid-cols-4 gap-2">
                        {msg.dashboard.widgets.slice(0, 8).map((w) => (
                          <div
                            key={w.id}
                            className={`rounded-lg bg-zinc-800/50 border border-zinc-700/30 p-2 ${
                              w.span >= 4 ? "col-span-4" : w.span >= 2 ? "col-span-2" : "col-span-1"
                            }`}
                          >
                            {w.type === "kpi" && (
                              <div>
                                <p className="text-[9px] text-zinc-500 truncate">{w.title}</p>
                                <p className="text-sm font-bold text-zinc-100 mt-0.5">{w.data.value}</p>
                                <span
                                  className={`text-[9px] font-semibold ${
                                    w.data.change > 0 ? "text-emerald-400" : w.data.change < 0 ? "text-red-400" : "text-zinc-500"
                                  }`}
                                >
                                  {w.data.change > 0 ? "↑" : w.data.change < 0 ? "↓" : "→"}{" "}
                                  {Math.abs(w.data.change)}%
                                </span>
                              </div>
                            )}
                            {w.type === "bar_chart" && (
                              <div>
                                <p className="text-[9px] text-zinc-500 truncate">{w.title}</p>
                                <div className="flex items-end gap-px mt-1.5 h-6">
                                  {(w.data as any[]).slice(-8).map((d: any, i: number) => {
                                    const max = Math.max(...(w.data as any[]).map((x: any) => x.value));
                                    return (
                                      <div
                                        key={i}
                                        className="flex-1 bg-blue-500/60 rounded-t-sm"
                                        style={{ height: `${(d.value / max) * 100}%`, minHeight: 2 }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            {w.type === "horizontal_bars" && (
                              <div>
                                <p className="text-[9px] text-zinc-500 truncate">{w.title}</p>
                                <div className="space-y-1 mt-1.5">
                                  {(w.data as any[]).slice(0, 3).map((d: any, i: number) => (
                                    <div key={i} className="h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full"
                                        style={{
                                          width: `${(d.value / d.maxValue) * 100}%`,
                                          backgroundColor: d.color,
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {w.type === "progress_ring" && (
                              <div>
                                <p className="text-[9px] text-zinc-500 truncate">{w.title}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {(w.data as any[]).map((d: any, i: number) => (
                                    <div key={i} className="text-center">
                                      <div className="text-[10px] font-bold text-zinc-200">{d.value}%</div>
                                      <div className="text-[8px] text-zinc-500">{d.label}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {(w.type === "table" || w.type === "status_list" || w.type === "alert_list" || w.type === "metric_comparison") && (
                              <div>
                                <p className="text-[9px] text-zinc-500 truncate">{w.title}</p>
                                <div className="mt-1 space-y-0.5">
                                  {[0, 1, 2].map((i) => (
                                    <div key={i} className="h-1 bg-zinc-700/30 rounded-full" style={{ width: `${90 - i * 15}%` }} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="px-4 py-3 border-t border-zinc-800/40 flex items-center gap-2">
                        <button
                          onClick={() => onDashboardGenerated(msg.dashboard!)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          📊 Visualizar Dashboard
                        </button>
                        <button
                          onClick={() => onDashboardGenerated(msg.dashboard!)}
                          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          💾 Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-white">AI</span>
                </div>
                <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/40 rounded-xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="space-y-2 pt-2">
              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Sugestões</p>
              <div className="grid grid-cols-1 gap-1.5">
                {SUGGESTED_QUERIES.slice(0, 6).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-left px-3 py-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/40 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 hover:border-zinc-700/50 transition-all duration-200 group"
                  >
                    <span className="text-zinc-600 group-hover:text-blue-400 mr-2">→</span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800/60 p-4 shrink-0">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre faturamento, produção, fornecedores..."
              rows={1}
              className="w-full bg-zinc-900/80 border border-zinc-800/60 rounded-xl px-4 py-3 pr-12 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 resize-none"
              style={{ minHeight: 44, maxHeight: 120 }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center transition-all duration-200"
            >
              ↑
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 text-center">
            Pressione Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </>
  );
}
