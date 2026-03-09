import { useState } from "react";
import { Loader2, MessageCircle, Target, ArrowRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const SalesConversion = () => {
  const { analyze, loading, result } = useGrowthIntelligence();
  const [conversation, setConversation] = useState("");
  const [leadInfo, setLeadInfo] = useState("");

  const handleGenerate = () => {
    if (!conversation.trim()) return;
    analyze("sales-conversion", conversation, { leadInfo });
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
        <div className="mb-12 animate-fade-in-slow">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            Motor de Conversão de Vendas
          </h1>
          <p className="text-sm text-muted-foreground">Cole a conversa com o lead e receba a próxima resposta ideal para fechar a venda.</p>
        </div>

        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Conversa com o Lead</label>
              <textarea
                value={conversation}
                onChange={(e) => setConversation(e.target.value)}
                placeholder="Cole aqui a conversa atual com o lead (WhatsApp, DM, email)..."
                className="archon-input min-h-[150px] resize-none"
                disabled={loading}
                maxLength={4000}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Info do Lead (opcional)</label>
              <input
                type="text"
                value={leadInfo}
                onChange={(e) => setLeadInfo(e.target.value)}
                placeholder="Ex: Dono de clínica, 5 funcionários, já usa outro sistema"
                className="archon-input"
                disabled={loading}
              />
            </div>
            <button onClick={handleGenerate} disabled={!conversation.trim() || loading} className="archon-button-solid w-full flex items-center justify-center gap-2 disabled:opacity-40">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> A Gerar…</> : "Gerar Resposta de Fechamento"}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6 animate-fade-in-slow">
            {/* Main Response */}
            <div className="archon-card-elevated p-6 border-l-2 border-l-primary">
              <h3 className="text-sm uppercase tracking-widest text-primary mb-3">Resposta Recomendada</h3>
              <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{result.recommended_response}</p>
              </div>
              <span className="text-xs text-muted-foreground">Técnica: {result.closing_technique}</span>
            </div>

            {/* Variants */}
            {result.variants?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Variantes</h3>
                <div className="space-y-3">
                  {result.variants.map((v: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded mb-2 inline-block">{v.tone}</span>
                      <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{v.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signals & Objections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.buying_signals?.length > 0 && (
                <div className="archon-card p-6">
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Sinais de Compra</h3>
                  <ul className="space-y-2">
                    {result.buying_signals.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2"><span className="text-primary">✓</span>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.hidden_objections?.length > 0 && (
                <div className="archon-card p-6">
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Objeções Ocultas</h3>
                  <ul className="space-y-2">
                    {result.hidden_objections.map((o: string, i: number) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2"><span className="text-destructive">⚠</span>{o}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Next Steps */}
            {result.next_steps?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Próximos Passos</h3>
                <div className="space-y-2">
                  {result.next_steps.map((s: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />{s}
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

export default SalesConversion;
