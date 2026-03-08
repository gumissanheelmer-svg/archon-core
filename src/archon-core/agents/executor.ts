/**
 * Execution Mind — Automação e Planeamento Semanal
 * 
 * Transforma estratégias em planos executáveis com tarefas diárias,
 * checklists e KPIs mensuráveis.
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

export interface DailyPlan {
  day: DayOfWeek;
  tasks: DailyTask[];
}

export interface WeeklyPlan {
  weekOf: string;
  goals: string[];
  dailyPlans: DailyPlan[];
  weeklyKPIs: Record<string, string>;
}

/** Default weekly structure for Agenda Smart growth */
export const DEFAULT_WEEKLY_STRUCTURE: Record<DayOfWeek, string[]> = {
  segunda: ["Planejamento semanal", "Criação de conteúdo", "Prospecção de leads"],
  terca: ["Publicação de conteúdo", "Follow-up de leads", "Análise de métricas"],
  quarta: ["Conteúdo viral", "Scripts de vendas", "Engajamento"],
  quinta: ["Publicação", "Outreach", "Otimização de campanhas"],
  sexta: ["Conteúdo", "Fechamento de vendas", "Revisão semanal"],
  sabado: ["Conteúdo programado", "Community building"],
  domingo: ["Análise de resultados", "Planejamento da próxima semana"],
};
