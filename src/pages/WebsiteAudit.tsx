import { useState } from "react";
import { Loader2, Globe, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const priorityColors: Record<string, string> = {
  alta: "text-destructive",
  media: "text-primary",
  baixa: "text-muted-foreground",
};

const WebsiteAudit = () => {
  const { analyze, loading, result } = useGrowthIntelligence();
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleAnalyze = () => {
    if (!url.trim()) return;
    analyze("website-audit", `URL do site: ${url}\n\nDescrição/observações: ${description || "Analisar automaticamente"}`);
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
        <div className="mb-12 animate-fade-in-slow">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 flex items-center gap-3">
            <Globe className="w-6 h-6 text-primary" />
            Website Audit Engine
          </h1>
          <p className="text-sm text-muted-foreground">Analise o seu site e descubra problemas de conversão, CTAs e prova social.</p>
        </div>

        {/* Input */}
        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">URL do Website</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://agendasmart.com"
                className="archon-input"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Descrição adicional (opcional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que o site faz, qual o público-alvo, ou cole o conteúdo da landing page..."
                className="archon-input min-h-[100px] resize-none"
                disabled={loading}
                maxLength={4000}
              />
            </div>
            <button onClick={handleAnalyze} disabled={!url.trim() || loading} className="archon-button-solid w-full flex items-center justify-center gap-2 disabled:opacity-40">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> A Analisar…</> : "Auditar Website"}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in-slow">
            {/* Score */}
            <div className="archon-card-elevated p-6 text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{result.score}/100</div>
              <p className="text-sm text-muted-foreground">Score de Conversão</p>
            </div>

            {/* Summary */}
            <div className="archon-card p-6 border-l-2 border-l-primary">
              <h3 className="text-sm uppercase tracking-widest text-primary mb-3">Resumo Executivo</h3>
              <p className="text-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Issue Categories */}
            {[
              { key: "cta_issues", title: "Problemas de CTA", icon: AlertTriangle },
              { key: "clarity_issues", title: "Clareza do Produto", icon: AlertTriangle },
              { key: "conversion_issues", title: "Pontos de Conversão", icon: AlertTriangle },
              { key: "social_proof_issues", title: "Prova Social", icon: AlertTriangle },
            ].map(({ key, title }) => (
              result[key]?.length > 0 && (
                <div key={key} className="archon-card p-6">
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">{title}</h3>
                  <div className="space-y-4">
                    {result[key].map((issue: any, i: number) => (
                      <div key={i} className="border border-border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <AlertTriangle className={`w-4 h-4 mt-0.5 ${priorityColors[issue.priority]}`} />
                          <div className="flex-1">
                            <p className="text-foreground font-medium">{issue.problem}</p>
                            <span className={`text-xs uppercase tracking-wider ${priorityColors[issue.priority]}`}>{issue.priority}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 mt-3 ml-7">
                          <ArrowRight className="w-4 h-4 mt-0.5 text-primary" />
                          <p className="text-sm text-muted-foreground">{issue.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default WebsiteAudit;
