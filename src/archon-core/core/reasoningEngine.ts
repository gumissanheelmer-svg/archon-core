/**
 * Reasoning Engine — Motor de Raciocínio Avançado
 * Combina insights de todas as mentes para gerar resposta final integrada.
 */

export interface ReasoningStep {
  step: number;
  mind: string;
  input: string;
  output: string;
  duration?: number;
}

export const QUALITY_CRITERIA = {
  archon: { minSentences: 4, maxSentences: 8, mustInclude: ["decisão clara", "visão integrada", "próximo movimento"], style: "C-level executive decision" },
  akira: { minSentences: 4, maxSentences: 8, mustInclude: ["roadmap", "metas numéricas", "funil"], style: "Strategic framework with numbers" },
  maya: { minSentences: 4, maxSentences: 8, mustInclude: ["conteúdo pronto", "hook", "CTA"], style: "Ready-to-publish creative content" },
  chen: { minSentences: 4, maxSentences: 8, mustInclude: ["KPIs", "benchmarks", "números"], style: "Data-driven analysis with targets" },
  yuki: { minSentences: 4, maxSentences: 8, mustInclude: ["script", "objeção", "técnica"], style: "Sales psychology with actionable scripts" },
};

export class ReasoningEngine {
  /** Combina resultados de todas as mentes para gerar resposta final */
  combineInsights(insights: any) {
    return {
      summary: "Resumo estratégico do Archon Core",
      details: insights,
    };
  }

  /** Valida qualidade da resposta de um especialista */
  validateResponseQuality(specialist: keyof typeof QUALITY_CRITERIA, text: string): { valid: boolean; issues: string[] } {
    const criteria = QUALITY_CRITERIA[specialist];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const issues: string[] = [];

    if (sentences.length < criteria.minSentences) {
      issues.push(`Resposta curta demais (${sentences.length}/${criteria.minSentences} frases)`);
    }

    return { valid: issues.length === 0, issues };
  }
}
