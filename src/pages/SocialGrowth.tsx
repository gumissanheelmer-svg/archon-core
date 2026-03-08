import { useState } from "react";
import { Loader2, TrendingUp, Calendar, Lightbulb, Zap } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const SocialGrowth = () => {
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
        <div className="mb-12 animate-fade-in-slow">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            Social Growth Engine
          </h1>
          <p className="text-sm text-muted-foreground">Gere ideias virais, calendários e estratégias de crescimento.</p>
        </div>

        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Plataforma</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="archon-input" disabled={loading}>
                <option value="instagram">📸 Instagram</option>
                <option value="tiktok">🎵 TikTok</option>
                <option value="facebook">📘 Facebook</option>
                <option value="youtube">🎬 YouTube</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Informação da Conta</label>
              <textarea
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                placeholder="Descreva: seguidores atuais, tipo de conteúdo, nicho, métricas de engajamento, objetivos..."
                className="archon-input min-h-[120px] resize-none"
                disabled={loading}
                maxLength={4000}
              />
            </div>
            <button onClick={handleAnalyze} disabled={!accountInfo.trim() || loading} className="archon-button-solid w-full flex items-center justify-center gap-2 disabled:opacity-40">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> A Gerar…</> : "Gerar Plano de Crescimento"}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6 animate-fade-in-slow">
            <div className="archon-card p-6 border-l-2 border-l-primary">
              <h3 className="text-sm uppercase tracking-widest text-primary mb-3">Resumo</h3>
              <p className="text-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Viral Ideas */}
            {result.viral_ideas?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Ideias Virais</h3>
                <div className="space-y-3">
                  {result.viral_ideas.map((idea: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{idea.platform}</span>
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{idea.format}</span>
                      </div>
                      <p className="text-foreground font-medium mb-1">{idea.hook}</p>
                      <p className="text-sm text-muted-foreground">{idea.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar */}
            {result.weekly_calendar?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Calendário Semanal</h3>
                <div className="space-y-4">
                  {result.weekly_calendar.map((day: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-primary mb-2">{day.day}</h4>
                      <div className="space-y-2">
                        {day.posts?.map((post: any, j: number) => (
                          <div key={j} className="flex items-start gap-3 text-sm">
                            <span className="text-muted-foreground font-mono text-xs mt-0.5">{post.time}</span>
                            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">{post.platform}</span>
                            <span className="text-xs text-muted-foreground">{post.type}</span>
                            <span className="text-foreground flex-1">{post.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Growth & Engagement */}
            {result.growth_opportunities?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2"><Zap className="w-4 h-4" /> Oportunidades</h3>
                <ul className="space-y-2">
                  {result.growth_opportunities.map((opp: string, i: number) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{opp}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.engagement_improvements?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Melhorias de Engajamento</h3>
                <ul className="space-y-2">
                  {result.engagement_improvements.map((imp: string, i: number) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{imp}</li>
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

export default SocialGrowth;
