/**
 * Reasoning Engine — Motor de Raciocínio Avançado
 * 
 * Implementa o fluxo de raciocínio em 4 etapas:
 * 1. Analyst Mind → decomposição e inteligência
 * 2. Growth Mind + Sales Mind → processamento paralelo
 * 3. Execution Mind → plano automatizado
 * 4. Síntese via 5 especialistas
 * 
 * A lógica real de IA roda no edge function.
 * Este módulo define o framework de raciocínio.
 */

export interface ReasoningStep {
  step: number;
  mind: string;
  input: string;
  output: string;
  duration?: number;
}

export interface ReasoningChain {
  steps: ReasoningStep[];
  finalMode: string;
  totalDuration?: number;
}

/** Quality criteria for each specialist response */
export const QUALITY_CRITERIA = {
  archon: {
    minSentences: 4,
    maxSentences: 8,
    mustInclude: ["decisão clara", "visão integrada", "próximo movimento"],
    style: "C-level executive decision",
  },
  akira: {
    minSentences: 4,
    maxSentences: 8,
    mustInclude: ["roadmap", "metas numéricas", "funil"],
    style: "Strategic framework with numbers",
  },
  maya: {
    minSentences: 4,
    maxSentences: 8,
    mustInclude: ["conteúdo pronto", "hook", "CTA"],
    style: "Ready-to-publish creative content",
  },
  chen: {
    minSentences: 4,
    maxSentences: 8,
    mustInclude: ["KPIs", "benchmarks", "números"],
    style: "Data-driven analysis with targets",
  },
  yuki: {
    minSentences: 4,
    maxSentences: 8,
    mustInclude: ["script", "objeção", "técnica"],
    style: "Sales psychology with actionable scripts",
  },
};

/** Validate response quality (client-side check) */
export function validateResponseQuality(specialist: keyof typeof QUALITY_CRITERIA, text: string): {
  valid: boolean;
  issues: string[];
} {
  const criteria = QUALITY_CRITERIA[specialist];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const issues: string[] = [];

  if (sentences.length < criteria.minSentences) {
    issues.push(`Resposta curta demais (${sentences.length}/${criteria.minSentences} frases)`);
  }

  return { valid: issues.length === 0, issues };
}
