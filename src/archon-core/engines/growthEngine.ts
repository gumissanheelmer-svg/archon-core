/**
 * Growth Engine — Campanhas e Estratégias de Aquisição
 * 
 * Cria campanhas completas com objetivo, público, canal, copy e CTA.
 * Rankeia canais por ROI esperado.
 */

import type { Platform, GrowthStrategy } from "../agents/growth";

export interface Campaign {
  name: string;
  platform: Platform;
  objective: string;
  targetAudience: string;
  copy: string;
  cta: string;
  budget?: string;
  expectedROI: string;
  duration: string;
}

/** Channel ROI rankings for SaaS scheduling apps */
export const CHANNEL_ROI_RANKING: Record<Platform, number> = {
  tiktok: 9,      // High virality, low cost
  instagram: 8,   // Strong for B2C services
  youtube: 7,     // Long-term SEO value
  facebook: 6,    // Good for local services
  google: 5,      // Higher cost but intent-based
};

/** Get top channels sorted by ROI */
export function getTopChannels(limit = 3): Platform[] {
  return (Object.entries(CHANNEL_ROI_RANKING) as [Platform, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([platform]) => platform);
}
