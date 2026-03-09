import { useState } from "react";
import { Loader2, Rocket, Target, TrendingUp, Lightbulb } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const GrowthStrategy = () => {
  const { analyze, loading, result } = useGrowthIntelligence();
  const [objective, setObjective] = useState("");
  const [context, setContext] = useState("");

  const handleGenerate = () => {
    if (!objective.trim()) return;
    analyze("persuasion", `Objetivo: ${objective}\n\nContexto: ${context || "Agenda Smart - sistema de agendamento para barbearias"}`);
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
        <div className="mb-10 animate-fade-in-slow">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Estratégia</p>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <Rocket className="w-6 h-6 text-primary" />
            Estratégia de Crescimento
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Defina objetivos e receba estratégias detalhadas de crescimento com técnicas de persuasão.
          </p>
        </div>

        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow animation-delay-200">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Objetivo de Crescimento</label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Ex: Adquirir 100 novas barbearias em 90 dias"
                className="archon-input"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Contexto do Mercado</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Descreva: mercado atual, concorrentes, recursos disponíveis, orçamento..."
                className="archon-input min-h-[120px] resize-none"
                disabled={loading}
                maxLength={4000}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!objective.trim() || loading}
              className="archon-button-solid w-full flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> A Gerar Estratégia…</> : "Gerar Growth Strategy"}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6 animate-fade-in-slow">
            <div className="archon-card-elevated p-6 border-l-2 border-l-primary">
              <h3 className="text-xs uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> Resumo Estratégico
              </h3>
              <p className="text-foreground leading-relaxed">{result.summary}</p>
            </div>

            {result.responses?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" /> Táticas de Crescimento
                </h3>
                {result.responses.map((r: any, i: number) => (
                  <div key={i} className="archon-card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">{r.context}</span>
                      <span className="text-xs text-muted-foreground">Tom: {r.tone}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-3">{r.message}</p>
                    {r.principles_used?.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {r.principles_used.map((p: string, j: number) => (
                          <span key={j} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{p}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result.objection_handlers?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5" /> Respostas a Objeções
                </h3>
                <div className="space-y-3">
                  {result.objection_handlers.map((h: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <p className="text-sm text-destructive font-medium mb-1">"{h.objection}"</p>
                      <p className="text-sm text-foreground mb-2">{h.response}</p>
                      <span className="text-xs text-muted-foreground">Técnica: {h.technique}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default GrowthStrategy;
