/**
 * Orchestrator — Coordenação dos Agentes e Engines
 * 
 * Recebe a pergunta do usuário, determina o modo de operação,
 * ativa os agentes e engines relevantes, e coordena a geração
 * da resposta final unificada.
 * 
 * A orquestração real acontece no edge function via prompt engineering.
 * Este módulo define a lógica de detecção de modo e roteamento.
 */

import type { ReasoningMode } from "../ArchonCoreConfig";

export interface OrchestratorInput {
  question: string;
  objectName: string;
  objective: string;
  horizon: "curto" | "medio" | "longo";
  context?: string;
  memoryBrief?: string;
}

export interface ModeDetection {
  mode: ReasoningMode;
  confidence: number;
  activeEngines: string[];
  activeAutomations: string[];
}

/** Detect the operating mode from the user's question */
export function detectMode(question: string): ModeDetection {
  const q = question.toLowerCase();

  const growthKeywords = ["crescer", "seguidor", "viral", "conteúdo", "post", "reel", "tiktok", "instagram", "rede social", "engajamento", "alcance"];
  const salesKeywords = ["vender", "lead", "cliente", "script", "funil", "conversão", "fechar", "objeção", "proposta", "whatsapp"];
  const executionKeywords = ["plano", "tarefa", "semana", "checklist", "executar", "organizar", "cronograma"];
  const analysisKeywords = ["analisar", "métrica", "performance", "concorrência", "mercado", "benchmark"];

  const growthScore = growthKeywords.filter(k => q.includes(k)).length;
  const salesScore = salesKeywords.filter(k => q.includes(k)).length;
  const executionScore = executionKeywords.filter(k => q.includes(k)).length;
  const analysisScore = analysisKeywords.filter(k => q.includes(k)).length;

  const total = growthScore + salesScore + executionScore + analysisScore;

  if (total === 0 || (growthScore > 0 && salesScore > 0)) {
    return {
      mode: "full-automation",
      confidence: 0.7,
      activeEngines: ["growth-engine", "social-media-engine", "acquisition-engine", "sales-engine"],
      activeAutomations: ["post-generator", "lead-hunter", "sales-script-generator", "weekly-planner"],
    };
  }

  if (growthScore >= salesScore && growthScore >= executionScore && growthScore >= analysisScore) {
    return {
      mode: "growth",
      confidence: growthScore / total,
      activeEngines: ["growth-engine", "social-media-engine"],
      activeAutomations: ["post-generator"],
    };
  }

  if (salesScore >= executionScore && salesScore >= analysisScore) {
    return {
      mode: "sales",
      confidence: salesScore / total,
      activeEngines: ["acquisition-engine", "sales-engine"],
      activeAutomations: ["lead-hunter", "sales-script-generator"],
    };
  }

  if (executionScore >= analysisScore) {
    return {
      mode: "execution",
      confidence: executionScore / total,
      activeEngines: [],
      activeAutomations: ["weekly-planner"],
    };
  }

  return {
    mode: "analysis",
    confidence: analysisScore / total,
    activeEngines: ["acquisition-engine"],
    activeAutomations: [],
  };
}
