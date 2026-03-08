/**
 * Growth Mind — Crescimento Automatizado e Viralidade
 * Cria estratégias de crescimento orgânico/pago multi-canal e conteúdo viral.
 */

export type Platform = "tiktok" | "instagram" | "facebook" | "youtube" | "google";

export interface ContentIdea {
  platform: Platform;
  format: "reel" | "post" | "story" | "short" | "carousel" | "live";
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  bestTime: string;
}

export const OPTIMAL_TIMES: Record<Platform, string[]> = {
  tiktok: ["12:00", "18:00", "21:00"],
  instagram: ["08:00", "12:00", "19:00"],
  facebook: ["09:00", "13:00", "16:00"],
  youtube: ["14:00", "17:00"],
  google: [],
};

export class GrowthMind {
  /** Sugere estratégia de crescimento geral */
  suggestGrowthStrategy(): string {
    return "Sugestão de estratégia de crescimento: postagens virais + anúncios segmentados + funil de conteúdo educativo.";
  }

  /** Gera ideias de conteúdo para redes sociais */
  suggestContentIdeas(): string[] {
    return [
      "Vídeo demonstrando Agenda Smart em ação",
      "Storytelling de usuário satisfeito",
      "Dicas rápidas de produtividade",
      "Antes vs Depois de usar agendamento automático",
      "POV: seus clientes agendando sozinhos enquanto você dorme",
      "3 erros que donos de negócio cometem com agendamentos",
      "Como faturar mais organizando sua agenda",
    ];
  }

  /** Retorna horários ideais para uma plataforma */
  getOptimalTimes(platform: Platform): string[] {
    return OPTIMAL_TIMES[platform] || [];
  }
}
