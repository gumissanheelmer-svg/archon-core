import { useState } from "react";
import { Plus, Trash2, ExternalLink, Loader2, BarChart3 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useConnections, PLATFORM_INFO, type PlatformType } from "@/hooks/useConnections";
import { useGrowthIntelligence } from "@/hooks/useGrowthIntelligence";

const Connections = () => {
  const { connections, campaigns, loading, addConnection, removeConnection, addCampaignResult } = useConnections();
  const { analyze, loading: analyzing, result: improvementResult } = useGrowthIntelligence();

  const [showAdd, setShowAdd] = useState(false);
  const [showCampaign, setShowCampaign] = useState(false);
  const [newPlatform, setNewPlatform] = useState<PlatformType>("instagram");
  const [newName, setNewName] = useState("");
  const [newIdentifier, setNewIdentifier] = useState("");

  const [campaignName, setCampaignName] = useState("");
  const [campaignPlatform, setCampaignPlatform] = useState("instagram");
  const [campaignResult, setCampaignResult] = useState("success");
  const [campaignMetrics, setCampaignMetrics] = useState("");
  const [campaignLearnings, setCampaignLearnings] = useState("");

  const handleAdd = async () => {
    if (!newName.trim() || !newIdentifier.trim()) return;
    await addConnection(newPlatform, newName, newIdentifier);
    setShowAdd(false);
    setNewName("");
    setNewIdentifier("");
  };

  const handleAddCampaign = async () => {
    if (!campaignName.trim()) return;
    let metrics = {};
    try { metrics = JSON.parse(campaignMetrics || "{}"); } catch { metrics = { raw: campaignMetrics }; }
    await addCampaignResult(
      campaignName, campaignPlatform, metrics, campaignResult,
      campaignLearnings.split("\n").filter(Boolean)
    );
    setShowCampaign(false);
    setCampaignName("");
    setCampaignMetrics("");
    setCampaignLearnings("");
  };

  const handleImprove = () => {
    const campaignsSummary = campaigns.map(c =>
      `Campanha: ${c.campaign_name} | Plataforma: ${c.platform} | Resultado: ${c.result} | Métricas: ${JSON.stringify(c.metrics)} | Aprendizados: ${(c.learnings || []).join(", ")}`
    ).join("\n");
    analyze("improvement-analysis", campaignsSummary || "Sem dados de campanhas ainda. Sugira uma estratégia inicial.");
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
        <div className="mb-12 animate-fade-in-slow">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 flex items-center gap-3">
            <ExternalLink className="w-6 h-6 text-primary" />
            Conexões & Melhoria Contínua
          </h1>
          <p className="text-sm text-muted-foreground">Conecte plataformas, registe resultados e deixe o ARCHON aprender.</p>
        </div>

        {/* Connections Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Plataformas Conectadas</h2>
            <button onClick={() => setShowAdd(!showAdd)} className="archon-button text-xs py-2 px-4">
              <Plus className="w-3 h-3 inline mr-1" /> Adicionar
            </button>
          </div>

          {showAdd && (
            <div className="archon-card-elevated p-6 mb-4 animate-fade-in-slow">
              <div className="space-y-3">
                <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value as PlatformType)} className="archon-input">
                  {Object.entries(PLATFORM_INFO).map(([key, info]) => (
                    <option key={key} value={key}>{info.emoji} {info.label}</option>
                  ))}
                </select>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome (ex: Agenda Smart IG)" className="archon-input" />
                <input value={newIdentifier} onChange={(e) => setNewIdentifier(e.target.value)} placeholder={PLATFORM_INFO[newPlatform].placeholder} className="archon-input" />
                <button onClick={handleAdd} disabled={!newName.trim() || !newIdentifier.trim()} className="archon-button-solid w-full disabled:opacity-40">Conectar</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : connections.length === 0 ? (
            <div className="archon-card p-8 text-center text-muted-foreground text-sm">Nenhuma plataforma conectada.</div>
          ) : (
            <div className="space-y-3">
              {connections.map((conn) => (
                <div key={conn.id} className="archon-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{PLATFORM_INFO[conn.platform]?.emoji || "📱"}</span>
                    <div>
                      <p className="text-foreground font-medium text-sm">{conn.display_name}</p>
                      <p className="text-xs text-muted-foreground">{conn.identifier}</p>
                    </div>
                  </div>
                  <button onClick={() => removeConnection(conn.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campaign Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Resultados de Campanhas</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowCampaign(!showCampaign)} className="archon-button text-xs py-2 px-4">
                <Plus className="w-3 h-3 inline mr-1" /> Registar
              </button>
              <button onClick={handleImprove} disabled={analyzing} className="archon-button-solid text-xs py-2 px-4 flex items-center gap-1">
                {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <BarChart3 className="w-3 h-3" />} Analisar
              </button>
            </div>
          </div>

          {showCampaign && (
            <div className="archon-card-elevated p-6 mb-4 animate-fade-in-slow">
              <div className="space-y-3">
                <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="Nome da campanha" className="archon-input" />
                <select value={campaignPlatform} onChange={(e) => setCampaignPlatform(e.target.value)} className="archon-input">
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="google">Google</option>
                </select>
                <select value={campaignResult} onChange={(e) => setCampaignResult(e.target.value)} className="archon-input">
                  <option value="success">✅ Sucesso</option>
                  <option value="partial">⚠️ Parcial</option>
                  <option value="failure">❌ Falhou</option>
                </select>
                <input value={campaignMetrics} onChange={(e) => setCampaignMetrics(e.target.value)} placeholder='Métricas (ex: {"leads": 50, "conversoes": 10})' className="archon-input" />
                <textarea value={campaignLearnings} onChange={(e) => setCampaignLearnings(e.target.value)} placeholder="Aprendizados (um por linha)" className="archon-input min-h-[80px] resize-none" />
                <button onClick={handleAddCampaign} disabled={!campaignName.trim()} className="archon-button-solid w-full disabled:opacity-40">Registar Resultado</button>
              </div>
            </div>
          )}

          {campaigns.length > 0 && (
            <div className="space-y-3">
              {campaigns.slice(0, 10).map((c) => (
                <div key={c.id} className="archon-card p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-foreground text-sm font-medium">{c.campaign_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${c.result === "success" ? "bg-primary/20 text-primary" : c.result === "failure" ? "bg-destructive/20 text-destructive" : "bg-secondary text-secondary-foreground"}`}>
                      {c.result}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.platform} · {new Date(c.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Improvement Results */}
        {improvementResult && (
          <div className="space-y-6 animate-fade-in-slow">
            <div className="archon-card p-6 border-l-2 border-l-primary">
              <h3 className="text-sm uppercase tracking-widest text-primary mb-3">Análise de Melhoria Contínua</h3>
              <p className="text-foreground leading-relaxed">{improvementResult.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvementResult.double_down?.length > 0 && (
                <div className="archon-card p-4">
                  <h4 className="text-xs uppercase tracking-widest text-primary mb-3">✅ Dobrar Nisto</h4>
                  <ul className="space-y-1">{improvementResult.double_down.map((d: string, i: number) => <li key={i} className="text-sm text-foreground">• {d}</li>)}</ul>
                </div>
              )}
              {improvementResult.stop_doing?.length > 0 && (
                <div className="archon-card p-4">
                  <h4 className="text-xs uppercase tracking-widest text-destructive mb-3">🛑 Parar de Fazer</h4>
                  <ul className="space-y-1">{improvementResult.stop_doing.map((s: string, i: number) => <li key={i} className="text-sm text-foreground">• {s}</li>)}</ul>
                </div>
              )}
            </div>

            {improvementResult.actionable_insights?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Insights Acionáveis</h3>
                <div className="space-y-3">
                  {improvementResult.actionable_insights.map((insight: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <p className="text-foreground font-medium mb-1">{insight.insight}</p>
                      <p className="text-sm text-muted-foreground mb-1">Ação: {insight.action}</p>
                      <span className="text-xs text-primary">Impacto: {insight.expected_impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {improvementResult.next_cycle_goals?.length > 0 && (
              <div className="archon-card p-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Metas do Próximo Ciclo</h3>
                <div className="space-y-2">
                  {improvementResult.next_cycle_goals.map((g: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 text-sm">
                      <span className="text-primary font-mono">{g.target}</span>
                      <span className="text-foreground">{g.metric}</span>
                      <span className="text-muted-foreground text-xs">{g.timeframe}</span>
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

export default Connections;
