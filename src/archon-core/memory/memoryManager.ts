/**
 * Memory Manager — Memória Estratégica e Aprendizado Contínuo
 * 
 * Gerencia o armazenamento e recuperação de dados de campanhas,
 * estratégias aplicadas e resultados para aprendizado contínuo.
 * 
 * Integra com o hook useMemory.ts para persistência no banco.
 */

export interface CampaignRecord {
  name: string;
  platform: string;
  strategy: string;
  result: "success" | "partial" | "failure";
  metrics: Record<string, number>;
  learnings: string[];
  date: string;
}

export interface StrategyInsight {
  category: "growth" | "sales" | "content" | "conversion";
  insight: string;
  confidence: "high" | "medium" | "low";
  source: string;
  appliedCount: number;
}

/** Categories for strategic memory */
export const MEMORY_CATEGORIES = {
  identity: "Identidade do Agenda Smart — missão, visão, diferenciação",
  rules: "Regras de execução — o que sempre fazer e nunca fazer",
  learnings: "Aprendizados de campanhas — o que funcionou e falhou",
  preferences: "Preferências de tom, estilo e abordagem",
  context: "Contexto atual — métricas, fase do negócio, metas",
} as const;

/** Format memory items for injection in ARCHON prompt */
export function formatMemoryBrief(items: Array<{ category: string; content: string }>): string {
  if (!items.length) return "";

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item.content);
    return acc;
  }, {} as Record<string, string[]>);

  const lines: string[] = [];
  const order = ["identity", "rules", "learnings", "preferences", "context"];

  for (const cat of order) {
    const label = MEMORY_CATEGORIES[cat as keyof typeof MEMORY_CATEGORIES];
    if (grouped[cat]?.length) {
      lines.push(`## ${label}`);
      grouped[cat].forEach(c => lines.push(`- ${c}`));
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}
