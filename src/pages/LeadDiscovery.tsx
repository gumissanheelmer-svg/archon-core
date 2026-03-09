import { useState } from "react";
import { Loader2, Search, MapPin, Star, MessageCircle, TrendingUp, Users } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const LeadDiscovery = () => {
  const { analyze, loading, result } = useGrowthIntelligence();
  const [location, setLocation] = useState("");
  const [context, setContext] = useState("");

  const handleDiscover = () => {
    if (!location.trim()) return;
    analyze("lead-discovery", `Localização: ${location}\n\nContexto adicional: ${context || "Procurar barbearias e salões que não usam sistema de agendamento online. Foco no Agenda Smart."}`);
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-accent-foreground";
    if (score >= 40) return "text-muted-foreground";
    return "text-muted-foreground/50";
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return "bg-primary/20 border-primary/30";
    if (score >= 60) return "bg-accent/20 border-accent/30";
    return "bg-secondary border-border";
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-5xl mx-auto">
        <div className="mb-10 animate-fade-in-slow">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Motor de Descoberta</p>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <Search className="w-6 h-6 text-primary" />
            Descoberta de Leads
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Procure no Google Maps, Instagram, TikTok e Facebook para descobrir leads de barbearias para o Agenda Smart.
          </p>
        </div>

        {/* Search Input */}
        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow animation-delay-200">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Localização / Mercado Alvo
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="ex: São Paulo, Brasil / Porto, Portugal / Nova Iorque, EUA"
                className="archon-input"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Contexto da Pesquisa (opcional)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="ex: Focar em barbearias com 2+ cadeiras, sem sistema de agendamento online, ativas no Instagram..."
                className="archon-input min-h-[80px] resize-none"
                disabled={loading}
                maxLength={4000}
              />
            </div>
            <button
              onClick={handleDiscover}
              disabled={!location.trim() || loading}
              className="archon-button-solid w-full flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> A procurar nas plataformas...</>
              ) : (
                <><Search className="w-4 h-4" /> Descobrir Leads de Barbearias</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in-slow">
            {/* Summary */}
            <div className="archon-card-elevated p-6 border-l-2 border-l-primary">
              <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Resumo da Descoberta</h3>
              <p className="text-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Market Estimate */}
            {result.market_estimate && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total de Negócios", value: result.market_estimate.total_businesses },
                  { label: "Mercado Endereçável", value: result.market_estimate.addressable_market },
                  { label: "Taxa de Penetração", value: result.market_estimate.penetration_rate || "N/A" },
                  { label: "Potencial de Receita", value: result.market_estimate.revenue_potential || "N/A" },
                ].map((m, i) => (
                  <div key={i} className="archon-card p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{m.label}</p>
                    <p className="text-lg font-semibold font-mono text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Leads Table */}
            {result.leads?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Leads Descobertos ({result.leads.length})
                </h3>
                <div className="space-y-3">
                  {result.leads.map((lead: any, i: number) => (
                    <div key={i} className={`border rounded-lg p-4 ${scoreBg(lead.score)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-foreground font-medium text-sm">{lead.name}</h4>
                            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{lead.category || "Barbearia"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lead.location}</span>
                            <span className="flex items-center gap-1">📱 {lead.platform}</span>
                            {lead.estimated_employees && <span>{lead.estimated_employees} funcionários</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold font-mono ${scoreColor(lead.score)}`}>{lead.score}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Pontuação</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{lead.reason}</p>
                      {lead.contact_strategy && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs text-primary flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" /> {lead.contact_strategy}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discovery Channels */}
            {result.channels?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" /> Canais de Descoberta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.channels.map((ch: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">{ch.channel}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          ch.difficulty === "easy" ? "bg-primary/20 text-primary" :
                          ch.difficulty === "medium" ? "bg-accent/20 text-accent-foreground" :
                          "bg-destructive/20 text-destructive"
                        }`}>{ch.difficulty === "easy" ? "fácil" : ch.difficulty === "medium" ? "médio" : "difícil"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{ch.strategy}</p>
                      <span className="text-xs text-primary font-mono">~{ch.estimated_leads} leads</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approach Strategies */}
            {result.approach_strategies?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5" /> Modelos de Abordagem
                </h3>
                <div className="space-y-3">
                  {result.approach_strategies.map((s: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{s.persona}</span>
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{s.channel}</span>
                        <span className="text-xs text-muted-foreground">· {s.tone}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{s.message_template}</p>
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

export default LeadDiscovery;
