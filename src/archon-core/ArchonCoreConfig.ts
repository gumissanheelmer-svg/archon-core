/**
 * ARCHON Core — Configuração Central v3.0
 * Máquina autônoma de crescimento, vendas e marketing para o Agenda Smart.
 * A lógica de IA roda no Edge Function (archon-decision). Este ficheiro serve como referência.
 */

// ─── Agent Definitions ───────────────────────────────────────
export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  enabled: boolean;
  priority: number;
}

export const AGENTS: AgentConfig[] = [
  { id: "analyst", name: "Analyst Mind", role: "Inteligência competitiva, métricas e performance de campanhas", enabled: true, priority: 1 },
  { id: "growth", name: "Growth Mind", role: "Crescimento automatizado, viralidade e marketing multi-canal", enabled: true, priority: 2 },
  { id: "sales", name: "Sales Mind", role: "Vendas automatizadas, funis, scripts e conversão de leads", enabled: true, priority: 2 },
  { id: "executor", name: "Execution Mind", role: "Planos semanais, automação de tarefas e checklists diárias", enabled: true, priority: 3 },
];

// ─── Engine Definitions ──────────────────────────────────────
export interface EngineConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggeredBy: string[];
}

export const ENGINES: EngineConfig[] = [
  { id: "growth-engine", name: "Growth Engine", description: "Campanhas, canais de aquisição e estratégias de engajamento", enabled: true, triggeredBy: ["growth"] },
  { id: "social-media-engine", name: "Social Media Engine", description: "Posts, roteiros de vídeo, calendário e hooks virais automatizados", enabled: true, triggeredBy: ["growth"] },
  { id: "acquisition-engine", name: "Acquisition Engine", description: "Lead scoring, segmentação de públicos e anúncios", enabled: true, triggeredBy: ["growth", "sales"] },
  { id: "sales-engine", name: "Sales Engine", description: "Scripts de vendas, objeções e estratégias de fechamento", enabled: true, triggeredBy: ["sales"] },
];

// ─── Automation Modules ──────────────────────────────────────
export interface AutomationConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggeredBy: string[];
}

export const AUTOMATIONS: AutomationConfig[] = [
  { id: "post-generator", name: "Post Generator", description: "Gera posts completos prontos para publicar com caption, hashtags e horário", enabled: true, triggeredBy: ["growth"] },
  { id: "lead-hunter", name: "Lead Hunter", description: "Encontra leads qualificados e define estratégias de abordagem", enabled: true, triggeredBy: ["sales"] },
  { id: "sales-script-generator", name: "Sales Script Generator", description: "Gera scripts de vendas adaptativos por canal e persona", enabled: true, triggeredBy: ["sales"] },
  { id: "weekly-planner", name: "Weekly Planner", description: "Transforma estratégias em plano semanal com tarefas diárias", enabled: true, triggeredBy: ["executor"] },
];

// ─── Reasoning Config ────────────────────────────────────────
export type ReasoningMode = "growth" | "sales" | "execution" | "analysis" | "full-automation" | "hybrid";

export const REASONING_CONFIG = {
  defaultMode: "full-automation" as ReasoningMode,
  autoDetect: true,
  depth: "maximum" as const,
  chainOfThought: true,
};

// ─── Memory Config ───────────────────────────────────────────
export const MEMORY_CONFIG = {
  enabled: true,
  maxItemsPerCategory: 5,
  autoLearn: true,
  trackCampaigns: true,
  trackConversions: true,
  categories: ["identity", "rules", "learnings", "preferences", "context"],
};

// ─── Specialists ─────────────────────────────────────────────
export const SPECIALISTS = [
  { id: "archon", name: "ARCHON", emoji: "👁️", focus: "Growth Director — decisão e automação", feedSources: ["analyst", "growth", "sales", "executor"] },
  { id: "akira", name: "AKIRA", emoji: "⚡", focus: "Estratégia de crescimento e funis automatizados", feedSources: ["growth", "sales", "executor"] },
  { id: "maya", name: "MAYA", emoji: "🎨", focus: "Conteúdo viral automatizado e copy", feedSources: ["growth"] },
  { id: "chen", name: "CHEN", emoji: "📊", focus: "Métricas, KPIs e performance", feedSources: ["analyst"] },
  { id: "yuki", name: "YUKI", emoji: "🧠", focus: "Psicologia de vendas e scripts de persuasão", feedSources: ["sales", "analyst"] },
];

// ─── Full Config ─────────────────────────────────────────────
export const ARCHON_CORE_CONFIG = {
  version: "3.0.0",
  agents: AGENTS,
  engines: ENGINES,
  automations: AUTOMATIONS,
  reasoning: REASONING_CONFIG,
  memory: MEMORY_CONFIG,
  specialists: SPECIALISTS,
  model: "google/gemini-3-flash-preview",
} as const;
