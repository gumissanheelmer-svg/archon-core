/**
 * Growth Engine — Campanhas e Estratégias de Aquisição
 * Cria campanhas completas e rankeia canais por ROI esperado.
 */

import type { Platform } from "../agents/growth";

export const CHANNEL_ROI_RANKING: Record<Platform, number> = {
  tiktok: 9,
  instagram: 8,
  youtube: 7,
  facebook: 6,
  google: 5,
};

export class GrowthEngine {
  /** Executa estratégia de crescimento */
  executeGrowthStrategy(): string {
    return "Executando estratégia de crescimento: conteúdos virais + anúncios segmentados + funil de viralização.";
  }

  /** Retorna os melhores canais por ROI */
  getTopChannels(limit = 3): Platform[] {
    return (Object.entries(CHANNEL_ROI_RANKING) as [Platform, number][])
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([platform]) => platform);
  }
}
