/**
 * Execution Mind — Automação e Planeamento Semanal
 * Transforma estratégias em planos executáveis com tarefas diárias e KPIs.
 */

export type DayOfWeek = "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | "domingo";
export type TaskPriority = "alta" | "media" | "baixa";

export interface DailyTask {
  time: string;
  task: string;
  howTo: string;
  expectedResult: string;
  kpi: string;
  priority: TaskPriority;
}

export const DEFAULT_WEEKLY_STRUCTURE: Record<DayOfWeek, string[]> = {
  segunda: ["Planejamento semanal", "Criação de conteúdo", "Prospecção de leads"],
  terca: ["Publicação de conteúdo", "Follow-up de leads", "Análise de métricas"],
  quarta: ["Conteúdo viral", "Scripts de vendas", "Engajamento"],
  quinta: ["Publicação", "Outreach", "Otimização de campanhas"],
  sexta: ["Conteúdo", "Fechamento de vendas", "Revisão semanal"],
  sabado: ["Conteúdo programado", "Community building"],
  domingo: ["Análise de resultados", "Planejamento da próxima semana"],
};

export class ExecutionMind {
  /** Cria plano passo a passo a partir de uma estratégia */
  createPlan(strategy: string): string[] {
    return [
      `Passo 1: Analisar contexto e dados disponíveis`,
      `Passo 2: Implementar ${strategy}`,
      "Passo 3: Medir resultados com KPIs definidos",
      "Passo 4: Ajustar estratégias com base nos dados",
    ];
  }

  /** Divide plano em tarefas semanais */
  createWeeklyTasks(plan: string[]): string[] {
    return plan.map((step, index) => `Tarefa ${index + 1}: ${step}`);
  }

  /** Gera estrutura semanal padrão */
  getDefaultWeeklyStructure(): Record<DayOfWeek, string[]> {
    return { ...DEFAULT_WEEKLY_STRUCTURE };
  }
}
