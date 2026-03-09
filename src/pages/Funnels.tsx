import { useState } from "react";
import { Loader2, Filter, ArrowDown } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const Funnels = () => {
  const { analyze, loading, result } = useGrowthIntelligence();
  const [target, setTarget] = useState("");

  const handleGenerate = () => {
    if (!target.trim()) return;
    analyze("funnel-generator", target);
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
        <div className="mb-12 animate-fade-in-slow">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 flex items-center gap-3">
            <Filter className="w-6 h-6 text-primary" />
            Motor de Funis
          </h1>
          <p className="text-sm text-muted-foreground">Gere funis de vendas completos para Instagram, TikTok, Google Maps e WhatsApp.</p>
        </div>

        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Público-alvo / Contexto</label>
              <textarea
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Ex: Barbearias no Brasil que ainda não usam sistema de agendamento online. Ticket médio R$49/mês. Foco em São Paulo e Rio de Janeiro..."
                className="archon-input min-h-[120px] resize-none"
                disabled={loading}
                maxLength={4000}
              />
            </div>
            <button onClick={handleGenerate} disabled={!target.trim() || loading} className="archon-button-solid w-full flex items-center justify-center gap-2 disabled:opacity-40">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> A Gerar…</> : "Gerar Funis de Vendas"}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6 animate-fade-in-slow">
            <div className="archon-card p-6 border-l-2 border-l-primary">
              <h3 className="text-sm uppercase tracking-widest text-primary mb-3">Funil Recomendado</h3>
              <p className="text-foreground leading-relaxed">{result.recommended_funnel}</p>
            </div>

            <div className="archon-card p-6 border-l-2 border-l-accent">
              <h3 className="text-sm uppercase tracking-widest text-accent mb-3">Resumo</h3>
              <p className="text-foreground leading-relaxed">{result.summary}</p>
            </div>

            {result.funnels?.map((funnel: any, i: number) => (
              <div key={i} className="archon-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground">{funnel.platform} — {funnel.name}</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">ROI: {funnel.estimated_roi}</span>
                </div>
                <div className="space-y-3">
                  {funnel.steps?.map((step: any, j: number) => (
                    <div key={j} className="flex items-start gap-4 border border-border rounded-lg p-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground font-medium mb-1">{step.action}</p>
                        <p className="text-sm text-muted-foreground mb-2">{step.copy}</p>
                        <span className="text-xs text-primary">Conversão esperada: {step.expected_conversion}</span>
                      </div>
                      {j < funnel.steps.length - 1 && (
                        <ArrowDown className="w-4 h-4 text-muted-foreground mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Funnels;
