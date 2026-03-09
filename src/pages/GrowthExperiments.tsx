import { useState } from "react";
import { Loader2, Beaker, ArrowRight, BarChart3, Clock, Zap } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const GrowthExperiments = () => {
  const { analyze, loading, result } = useGrowthIntelligence();
  const [objective, setObjective] = useState("");
  const [context, setContext] = useState("");

  const handleGenerate = () => {
    if (!objective.trim()) return;
    analyze("growth-experiments", `Objetivo: ${objective}\n\nContexto: ${context || "Agenda Smart - sistema de agendamento online para barbearias. Queremos adquirir mais clientes barbearias."}`);
  };

  const iceColor = (score: number) => {
    if (score >= 8) return "text-primary";
    if (score >= 5) return "text-accent-foreground";
    return "text-muted-foreground";
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-5xl mx-auto">
        <div className="mb-10 animate-fade-in-slow">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Experimentation</p>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <Beaker className="w-6 h-6 text-primary" />
            Growth Experiments
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Generate and track marketing experiments with ICE scoring to grow Agenda Smart.
          </p>
        </div>

        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow animation-delay-200">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Growth Objective</label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g., Acquire 50 new barbershops in 30 days"
                className="archon-input"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Current Context</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Current channels, budget, team size, past results..."
                className="archon-input min-h-[100px] resize-none"
                disabled={loading}
                maxLength={4000}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!objective.trim() || loading}
              className="archon-button-solid w-full flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating experiments...</>
              ) : (
                <><Beaker className="w-4 h-4" /> Generate Growth Experiments</>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6 animate-fade-in-slow">
            {/* Summary */}
            <div className="archon-card-elevated p-6 border-l-2 border-l-primary">
              <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Strategy Summary</h3>
              <p className="text-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Recommended Order */}
            {result.recommended_order?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> Recommended Execution Order
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.recommended_order.map((name: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-mono font-bold">{i + 1}</span>
                      <span className="text-sm text-foreground">{name}</span>
                      {i < result.recommended_order.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experiments */}
            {result.experiments?.map((exp: any, i: number) => (
              <div key={i} className="archon-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground">{exp.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{exp.channel}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{exp.hypothesis}</p>
                  </div>
                  {exp.ice_score && (
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className={`text-xl font-bold font-mono ${iceColor(exp.ice_score.total)}`}>
                        {exp.ice_score.total.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase">ICE Score</div>
                      <div className="flex gap-2 mt-1 text-[10px] font-mono text-muted-foreground">
                        <span>I:{exp.ice_score.impact}</span>
                        <span>C:{exp.ice_score.confidence}</span>
                        <span>E:{exp.ice_score.ease}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Steps */}
                {exp.steps?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Execution Steps</h4>
                    <div className="space-y-1.5">
                      {exp.steps.map((step: string, j: number) => (
                        <div key={j} className="flex items-start gap-2 text-sm">
                          <span className="text-primary font-mono text-xs mt-0.5">{j + 1}.</span>
                          <span className="text-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics & Timeline */}
                <div className="flex flex-wrap gap-4 pt-3 border-t border-border">
                  {exp.success_metrics?.length > 0 && (
                    <div className="flex-1 min-w-[200px]">
                      <h4 className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" /> Success Metrics
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {exp.success_metrics.map((m: string, j: number) => (
                          <span key={j} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exp.timeline}</span>
                    {exp.budget && <span>Budget: {exp.budget}</span>}
                  </div>
                </div>

                {exp.expected_result && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-primary">Expected: {exp.expected_result}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default GrowthExperiments;
