/**
 * Post Generator — Geração Automática de Conteúdo
 * 
 * Gera posts completos prontos para publicar com caption,
 * hashtags, horário e formato otimizado por plataforma.
 */

import type { Platform } from "../agents/growth";
import { VIRAL_HOOKS, CONTENT_PILLARS } from "../engines/socialMediaEngine";

export interface GeneratedPost {
  platform: Platform;
  type: "reel" | "post" | "story" | "carousel";
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[];
  bestTime: string;
  dayOfWeek: string;
}

/** Get a random hook from the viral hooks bank */
export function getRandomHook(): string {
  return VIRAL_HOOKS[Math.floor(Math.random() * VIRAL_HOOKS.length)];
}

/** Get a random content pillar */
export function getRandomPillar(): string {
  return CONTENT_PILLARS[Math.floor(Math.random() * CONTENT_PILLARS.length)];
}

/** Default hashtag sets by platform for Agenda Smart */
export const HASHTAG_SETS: Record<Platform, string[]> = {
  tiktok: ["#agendamento", "#produtividade", "#empreendedor", "#organização", "#negócio", "#dica", "#fyp", "#viral"],
  instagram: ["#agendaonline", "#gestãodeclientes", "#empreendedorismo", "#produtividade", "#agenda", "#negócios"],
  facebook: ["#agendamento", "#organização", "#negócios", "#empreendedor"],
  youtube: ["agendamento online", "produtividade", "gestão de clientes", "agenda smart"],
  google: [],
};
