/**
 * Social Media Engine — Conteúdo Viral Automatizado
 * 
 * Gera posts, roteiros de vídeo, calendários e hooks virais
 * otimizados para cada plataforma.
 */

import type { Platform, ContentIdea } from "../agents/growth";

export interface VideoScript {
  platform: Platform;
  duration: string;
  hook: string;          // First 3 seconds
  development: string;   // Main content
  cta: string;           // Call to action
  transitions: string[]; // Visual transitions
  music: string;         // Suggested audio/trend
  hashtags: string[];
}

export interface PostTemplate {
  platform: Platform;
  type: "educational" | "promotional" | "viral" | "testimonial" | "behind-scenes";
  caption: string;
  hashtags: string[];
  bestTime: string;
  format: string;
}

/** Viral hook templates for scheduling/productivity niche */
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

/** Content pillars for Agenda Smart */
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
