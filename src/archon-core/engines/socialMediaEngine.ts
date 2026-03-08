/**
 * Social Media Engine — Conteúdo Viral Automatizado
 * Gera posts, roteiros de vídeo, calendários e hooks virais.
 */

import type { Platform } from "../agents/growth";

export const VIRAL_HOOKS = [
  "Você ainda perde clientes por falta de organização?",
  "3 coisas que donos de negócio fazem ERRADO na agenda",
  "Como eu faturei R$X a mais só organizando minha agenda",
  "O erro que 90% dos profissionais cometem com agendamentos",
  "Antes vs Depois de usar um sistema de agendamento",
  "POV: seus clientes agendando sozinhos enquanto você dorme",
  "Se você tem mais de 10 clientes por semana, PRECISA ver isso",
  "A ferramenta que mudou meu negócio (não é o que você pensa)",
];

export const CONTENT_PILLARS = [
  "Produtividade e organização",
  "Gestão de clientes",
  "Automação de agendamentos",
  "Crescimento do negócio",
  "Depoimentos e cases",
  "Dicas rápidas",
  "Antes vs Depois",
  "Bastidores",
];

export class SocialMediaEngine {
  /** Gera calendário de conteúdo a partir de ideias */
  generateContentCalendar(ideas: string[]): Array<{ day: string; content: string }> {
    return ideas.map((idea, index) => ({
      day: `Dia ${index + 1}`,
      content: idea,
    }));
  }

  /** Retorna hooks virais disponíveis */
  getViralHooks(): string[] {
    return VIRAL_HOOKS;
  }

  /** Retorna pilares de conteúdo */
  getContentPillars(): string[] {
    return CONTENT_PILLARS;
  }
}
