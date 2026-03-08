/**
 * Memory Manager — Memória Estratégica e Aprendizado Contínuo
 * Gerencia armazenamento e recuperação de dados para aprendizado contínuo.
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

export const MEMORY_CATEGORIES = {
  identity: "Identidade do Agenda Smart — missão, visão, diferenciação",
  rules: "Regras de execução — o que sempre fazer e nunca fazer",
  learnings: "Aprendizados de campanhas — o que funcionou e falhou",
  preferences: "Preferências de tom, estilo e abordagem",
  context: "Contexto atual — métricas, fase do negócio, metas",
} as const;

export class MemoryManager {
  private memory: Record<string, any> = {};

  /** Salva um item na memória */
  save(key: string, value: any): void {
    this.memory[key] = value;
  }

  /** Recupera um item da memória */
  get(key: string): any {
    return this.memory[key];
  }

  /** Retorna toda a memória */
  getAll(): Record<string, any> {
    return { ...this.memory };
  }

  /** Formata itens de memória para injeção no prompt do ARCHON */
  static formatMemoryBrief(items: Array<{ category: string; content: string }>): string {
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
}
