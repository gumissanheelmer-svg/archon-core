/**
 * ARCHON Core — Configuração Central v3.0
 * Máquina autônoma de crescimento, vendas e marketing para o Agenda Smart.
 */

export const ArchonCoreConfig = {
  agents: {
    analyst: true,
    growth: true,
    sales: true,
    executor: true,
  },
  modes: {
    reasoning: "advanced",
    memory: true,
    socialMediaIntegration: true,
  },
  growthParameters: {
    contentFrequencyPerWeek: 7,
    leadAcquisitionTarget: 100,
    salesConversionGoal: 0.2,
  },
  logging: true,
};

// ─── Types ───────────────────────────────────────────────────
export type ReasoningMode = "growth" | "sales" | "execution" | "analysis" | "full-automation" | "hybrid";

export const SPECIALISTS = [
  { id: "archon", name: "ARCHON", emoji: "👁️", focus: "Growth Director — decisão e automação", feedSources: ["analyst", "growth", "sales", "executor"] },
  { id: "akira", name: "AKIRA", emoji: "⚡", focus: "Estratégia de crescimento e funis automatizados", feedSources: ["growth", "sales", "executor"] },
  { id: "maya", name: "MAYA", emoji: "🎨", focus: "Conteúdo viral automatizado e copy", feedSources: ["growth"] },
  { id: "chen", name: "CHEN", emoji: "📊", focus: "Métricas, KPIs e performance", feedSources: ["analyst"] },
  { id: "yuki", name: "YUKI", emoji: "🧠", focus: "Psicologia de vendas e scripts de persuasão", feedSources: ["sales", "analyst"] },
];

export const ARCHON_CORE_CONFIG = {
  version: "3.0.0",
  ...ArchonCoreConfig,
  specialists: SPECIALISTS,
  model: "google/gemini-3-flash-preview",
} as const;
