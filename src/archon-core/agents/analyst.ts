/**
 * Analyst Mind — Inteligência Competitiva e Performance
 * 
 * Responsável por analisar concorrência, mercado, métricas de campanhas,
 * oportunidades e resultados anteriores. Executa primeiro no fluxo.
 * 
 * A lógica real roda no edge function. Este módulo define tipos e helpers.
 */

export interface MarketAnalysis {
  competitors: string[];
  opportunities: string[];
  threats: string[];
  trends: string[];
}

export interface CampaignMetrics {
  engagementRate: number;
  ctr: number;
  conversionRate: number;
  reach: number;
  impressions: number;
}

export interface AnalystOutput {
  problemDecomposition: string[];
  marketIntelligence: MarketAnalysis;
  performanceInsights: string[];
  classification: "acquisition" | "retention" | "conversion" | "positioning" | "execution";
}

/** Classify the type of problem based on keywords */
export function classifyProblem(question: string): AnalystOutput["classification"] {
  const q = question.toLowerCase();
  if (q.includes("lead") || q.includes("cliente") || q.includes("atrair")) return "acquisition";
  if (q.includes("reter") || q.includes("churn") || q.includes("fideliz")) return "retention";
  if (q.includes("converter") || q.includes("vend") || q.includes("fechar")) return "conversion";
  if (q.includes("posicion") || q.includes("marca") || q.includes("diferenc")) return "positioning";
  return "execution";
}
