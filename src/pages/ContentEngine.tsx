import { useState } from "react";
import { Loader2, PenTool, Calendar, Lightbulb, Zap } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const ContentEngine = () => {
  const { analyze, loading, result } = useGrowthIntelligence();
  const [platform, setPlatform] = useState("instagram");
  const [accountInfo, setAccountInfo] = useState("");

  const handleAnalyze = () => {
    if (!accountInfo.trim()) return;
    analyze("social-growth", accountInfo, { platform });
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
        <div className="mb-10 animate-fade-in-slow">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Conteúdo</p>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <PenTool className="w-6 h-6 text-primary" />
            Motor de Conteúdo
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Gere ideias virais, scripts e calendários de conteúdo para redes sociais.
          </p>
        </div>

        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow animation-delay-200">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Plataforma</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="archon-input" disabled={loading}>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Contexto da Conta</label>
              <textarea
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                placeholder="Descreva: seguidores, nicho, tipo de conteúdo, objetivos, métricas de engajamento..."
                className="archon-input min-h-[120px] resize-none"
                disabled={loading}
                maxLength={4000}
              />
            </div>
            <button onClick={handleAnalyze} disabled={!accountInfo.trim() || loading} className="archon-button-solid w-full flex items-center justify-center gap-2 disabled:opacity-40">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> A Gerar…</> : "Gerar Plano de Conteúdo"}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6 animate-fade-in-slow">
            <div className="archon-card-elevated p-6 border-l-2 border-l-primary">
              <h3 className="text-xs uppercase tracking-widest text-primary mb-3">Resumo</h3>
              <p className="text-foreground leading-relaxed">{result.summary}</p>
            </div>

            {result.viral_ideas?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5" /> Ideias Virais
                </h3>
                <div className="space-y-3">
                  {result.viral_ideas.map((idea: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{idea.platform}</span>
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{idea.format}</span>
                      </div>
                      <p className="text-foreground font-medium mb-1">{idea.hook}</p>
                      <p className="text-sm text-muted-foreground">{idea.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.weekly_calendar?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Calendário Semanal
                </h3>
                <div className="space-y-4">
                  {result.weekly_calendar.map((day: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-primary mb-2">{day.day}</h4>
                      <div className="space-y-2">
                        {day.posts?.map((post: any, j: number) => (
                          <div key={j} className="flex items-start gap-3 text-sm">
                            <span className="text-muted-foreground font-mono text-xs mt-0.5">{post.time}</span>
                            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">{post.type}</span>
                            <span className="text-foreground flex-1">{post.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.growth_opportunities?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> Oportunidades de Crescimento
                </h3>
                <ul className="space-y-2">
                  {result.growth_opportunities.map((opp: string, i: number) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2"><span className="text-primary">•</span>{opp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ContentEngine;
