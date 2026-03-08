/**
 * Growth Mind — Crescimento Automatizado e Viralidade
 * 
 * Cria estratégias de crescimento orgânico/pago multi-canal,
 * campanhas virais e calendários de conteúdo automatizados.
 */

export type Platform = "tiktok" | "instagram" | "facebook" | "youtube" | "google";

export interface GrowthStrategy {
  channel: Platform;
  type: "organic" | "paid";
  objective: string;
  targetAudience: string;
  estimatedROI: string;
}

export interface ContentIdea {
  platform: Platform;
  format: "reel" | "post" | "story" | "short" | "carousel" | "live";
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  bestTime: string;
}

export interface WeeklyCalendar {
  day: string;
  posts: ContentIdea[];
}

/** Optimal posting times by platform (UTC-3 / Brazil) */
export const OPTIMAL_TIMES: Record<Platform, string[]> = {
  tiktok: ["12:00", "18:00", "21:00"],
  instagram: ["08:00", "12:00", "19:00"],
  facebook: ["09:00", "13:00", "16:00"],
  youtube: ["14:00", "17:00"],
  google: [],
};
