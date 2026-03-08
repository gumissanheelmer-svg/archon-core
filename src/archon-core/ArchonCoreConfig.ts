/**
 * ARCHON Core — Configuração Central
 * 
 * Define a ativação dos agentes, engines, modos de raciocínio,
 * memória estratégica e níveis de profundidade.
 * 
 * A lógica real de IA roda no Edge Function (archon-decision).
 * Este ficheiro serve como referência de configuração e tipos.
 */

// ─── Agent Definitions ───────────────────────────────────────
export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  enabled: boolean;
  priority: number; // Execution order (lower = first)
}

export const AGENTS: AgentConfig[] = [
  {
    id: "analyst",
    name: "Analyst Mind",
    role: "Análise de mercado, concorrência, métricas e decomposição de problemas",
    enabled: true,
    priority: 1,
  },
  {
    id: "growth",
    name: "Growth Mind",
    role: "Crescimento, marketing digital, viralidade e aquisição multi-canal",
    enabled: true,
    priority: 2,
  },
  {
    id: "sales",
    name: "Sales Mind",
    role: "Funis de conversão, scripts de vendas, fechamento e nutrição de leads",
    enabled: true,
    priority: 2, // Parallel with Growth
  },
  {
    id: "executor",
    name: "Execution Mind",
    role: "Planos semanais executáveis, checklists, KPIs e cronogramas",
    enabled: true,
    priority: 3,
  },
];

// ─── Engine Definitions ──────────────────────────────────────
export interface EngineConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggeredBy: string[]; // Which agent IDs activate this engine
}

export const ENGINES: EngineConfig[] = [
  {
    id: "growth-engine",
    name: "Growth Engine",
    description: "Campanhas, canais de aquisição e estratégias de engajamento",
    enabled: true,
    triggeredBy: ["growth"],
  },
  {
    id: "social-media-engine",
    name: "Social Media Engine",
    description: "Conteúdo viral, roteiros de vídeo, calendário de postagens e hooks",
    enabled: true,
    triggeredBy: ["growth"],
  },
  {
    id: "acquisition-engine",
    name: "Acquisition Engine",
    description: "Identificação de leads, segmentação de públicos e anúncios",
    enabled: true,
    triggeredBy: ["growth", "sales"],
  },
  {
    id: "sales-engine",
    name: "Sales Engine",
    description: "Scripts de vendas, respostas a objeções e estratégias de fechamento",
    enabled: true,
    triggeredBy: ["sales"],
  },
];

// ─── Reasoning Mode ──────────────────────────────────────────
export type ReasoningMode = "growth" | "sales" | "strategic" | "execution" | "hybrid";

export interface ReasoningConfig {
  defaultMode: ReasoningMode;
  autoDetect: boolean; // Auto-detect mode from query
  depth: "standard" | "deep" | "maximum";
  chainOfThought: boolean;
}

export const REASONING_CONFIG: ReasoningConfig = {
  defaultMode: "hybrid",
  autoDetect: true,
  depth: "maximum",
  chainOfThought: true,
};

// ─── Memory Config ───────────────────────────────────────────
export interface MemoryConfig {
  enabled: boolean;
  maxItemsPerCategory: number;
  autoLearn: boolean; // Auto-generate memory items from responses
  categories: string[];
}

export const MEMORY_CONFIG: MemoryConfig = {
  enabled: true,
  maxItemsPerCategory: 5,
  autoLearn: true,
  categories: ["identity", "rules", "learnings", "preferences", "context"],
};

// ─── Output Specialists ──────────────────────────────────────
export interface SpecialistConfig {
  id: string;
  name: string;
  emoji: string;
  focus: string;
  feedSources: string[]; // Which agent IDs feed this specialist
}

export const SPECIALISTS: SpecialistConfig[] = [
  {
    id: "archon",
    name: "ARCHON",
    emoji: "👁️",
    focus: "Síntese e decisão de Growth Director",
    feedSources: ["analyst", "growth", "sales", "executor"],
  },
  {
    id: "akira",
    name: "AKIRA",
    emoji: "⚡",
    focus: "Estratégia de crescimento e funis",
    feedSources: ["growth", "sales", "executor"],
  },
  {
    id: "maya",
    name: "MAYA",
    emoji: "🎨",
    focus: "Conteúdo viral, copy e calendário",
    feedSources: ["growth"],
  },
  {
    id: "chen",
    name: "CHEN",
    emoji: "📊",
    focus: "Métricas, KPIs e performance",
    feedSources: ["analyst"],
  },
  {
    id: "yuki",
    name: "YUKI",
    emoji: "🧠",
    focus: "Psicologia de vendas e comportamento",
    feedSources: ["sales", "analyst"],
  },
];

// ─── Full Config Export ──────────────────────────────────────
export const ARCHON_CORE_CONFIG = {
  version: "2.0.0",
  agents: AGENTS,
  engines: ENGINES,
  reasoning: REASONING_CONFIG,
  memory: MEMORY_CONFIG,
  specialists: SPECIALISTS,
  model: "openai/gpt-5.2",
} as const;
