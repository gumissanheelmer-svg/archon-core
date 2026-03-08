/**
 * Analyst Mind — Inteligência Competitiva e Performance
 * Responsável por analisar concorrência, mercado, métricas de campanhas e oportunidades.
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

export type ProblemClassification = "acquisition" | "retention" | "conversion" | "positioning" | "execution";

export class AnalystMind {
  /** Analisa mercado e retorna oportunidades */
  analyzeMarket(data: any): MarketAnalysis {
    return {
      competitors: data.competitors || [],
      opportunities: data.opportunities || ["Mercado de agendamento em crescimento", "Baixa concorrência em nicho local"],
      threats: data.threats || ["Grandes players entrando no mercado"],
      trends: data.trends || ["Automação de atendimento", "Agendamento via WhatsApp"],
    };
  }

  /** Analisa resultados de campanhas anteriores */
  analyzeCampaigns(campaignData: any): string {
    return `Insights de campanhas: ${JSON.stringify(campaignData)}`;
  }

  /** Classifica o tipo de problema baseado em palavras-chave */
  classifyProblem(question: string): ProblemClassification {
    const q = question.toLowerCase();
    if (q.includes("lead") || q.includes("cliente") || q.includes("atrair")) return "acquisition";
    if (q.includes("reter") || q.includes("churn") || q.includes("fideliz")) return "retention";
    if (q.includes("converter") || q.includes("vend") || q.includes("fechar")) return "conversion";
    if (q.includes("posicion") || q.includes("marca") || q.includes("diferenc")) return "positioning";
    return "execution";
  }
}
