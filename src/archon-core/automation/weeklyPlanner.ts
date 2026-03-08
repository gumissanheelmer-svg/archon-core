/**
 * Weekly Planner — Planos Semanais Automatizados
 */

import type { DayOfWeek, DailyTask } from "../agents/executor";
import { DEFAULT_WEEKLY_STRUCTURE } from "../agents/executor";

export interface WeeklyPlan {
  weekOf: string;
  goals: string[];
  dailyPlans: Array<{ day: DayOfWeek; tasks: DailyTask[] }>;
  weeklyKPIs: Record<string, string>;
}

/** Generate a default weekly plan template */
export function generateWeeklyTemplate(weekOf: string): WeeklyPlan {
  const dailyPlans = (Object.entries(DEFAULT_WEEKLY_STRUCTURE) as [DayOfWeek, string[]][]).map(
    ([day, tasks]) => ({
      day,
      tasks: tasks.map((task, i) => ({
        time: `${8 + i * 2}:00`,
        task,
        howTo: `Executar ${task.toLowerCase()} conforme estratégia definida`,
        expectedResult: `${task} concluído com qualidade`,
        kpi: "Tarefa completada no prazo",
        priority: (i === 0 ? "alta" : i === 1 ? "media" : "baixa") as DailyTask["priority"],
      })),
    })
  );

  return {
    weekOf,
    goals: [
      "Publicar 5+ conteúdos nas redes sociais",
      "Contactar 20+ leads qualificados",
      "Fechar 3+ novos clientes",
      "Analisar métricas e ajustar estratégia",
    ],
    dailyPlans,
    weeklyKPIs: {
      posts_publicados: "5+",
      leads_contactados: "20+",
      demos_agendadas: "5+",
      clientes_fechados: "3+",
      engagement_rate: ">3%",
    },
  };
}
