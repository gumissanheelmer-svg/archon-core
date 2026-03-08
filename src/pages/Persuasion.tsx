import { useState } from "react";
import { Loader2, Sparkles, MessageSquare, Shield } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const Persuasion = () => {
  const { analyze, loading, result } = useGrowthIntelligence();
  const [context, setContext] = useState("");

  const handleGenerate = () => {
    if (!context.trim()) return;
    analyze("persuasion", context);
  };

  const principleEmoji: Record<string, string> = {
    urgência: "⏰",
    "prova social": "👥",
    simplicidade: "✨",
    curiosidade: "🔍",
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
        <div className="mb-12 animate-fade-in-slow">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            Persuasion Engine
          </h1>
          <p className="text-sm text-muted-foreground">Gere respostas altamente persuasivas com urgência, prova social, simplicidade e curiosidade.</p>
        </div>

        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Contexto da Venda</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Ex: Lead é dono de barbearia com 3 profissionais, recebe 20 clientes/dia, ainda usa WhatsApp para agendar. Já demonstrou interesse mas está indeciso sobre o preço de R$49/mês..."
                className="archon-input min-h-[120px] resize-none"
                disabled={loading}
                maxLength={4000}
              />
            </div>
            <button onClick={handleGenerate} disabled={!context.trim() || loading} className="archon-button-solid w-full flex items-center justify-center gap-2 disabled:opacity-40">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> A Gerar…</> : "Gerar Respostas Persuasivas"}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6 animate-fade-in-slow">
            <div className="archon-card p-6 border-l-2 border-l-primary">
              <h3 className="text-sm uppercase tracking-widest text-primary mb-3">Resumo</h3>
              <p className="text-foreground leading-relaxed">{result.summary}</p>
            </div>

            {result.responses?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Respostas Persuasivas</h3>
                <div className="space-y-4">
                  {result.responses.map((r: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{r.context}</span>
                        <span className="text-xs text-muted-foreground">Tom: {r.tone}</span>
                      </div>
                      <p className="text-foreground mb-3 leading-relaxed">{r.message}</p>
                      <div className="flex gap-2 flex-wrap">
                        {r.principles_used?.map((p: string, j: number) => (
                          <span key={j} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {principleEmoji[p.toLowerCase()] || "📌"} {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.objection_handlers?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> Respostas a Objeções</h3>
                <div className="space-y-3">
                  {result.objection_handlers.map((h: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <p className="text-sm text-destructive font-medium mb-1">❌ "{h.objection}"</p>
                      <p className="text-foreground mb-2">{h.response}</p>
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

export default Persuasion;
