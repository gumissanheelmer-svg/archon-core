/**
 * Orchestrator — Coordenação dos Agentes e Engines
 * Recebe a pergunta do usuário e coordena todas as mentes.
 */

import { AnalystMind } from "../agents/analyst";
import { GrowthMind } from "../agents/growth";
import { SalesMind } from "../agents/sales";
import { ExecutionMind } from "../agents/executor";
import type { ReasoningMode } from "../ArchonCoreConfig";

export interface ModeDetection {
  mode: ReasoningMode;
  confidence: number;
  activeEngines: string[];
  activeAutomations: string[];
}

export class Orchestrator {
  analyst = new AnalystMind();
  growth = new GrowthMind();
  sales = new SalesMind();
  executor = new ExecutionMind();

  /** Processa request completo com colaboração entre mentes */
  async processRequest(request: string) {
    const marketAnalysis = this.analyst.analyzeMarket({ request });
    const growthIdeas = this.growth.suggestContentIdeas();
    const salesScript = this.sales.generateSalesScript("warm");
    const plan = this.executor.createPlan(growthIdeas[0]);

    return {
      marketAnalysis,
      growthIdeas,
      salesScript,
      plan,
    };
  }

  /** Detecta modo de operação a partir da pergunta */
  detectMode(question: string): ModeDetection {
    const q = question.toLowerCase();

    const growthKeywords = ["crescer", "seguidor", "viral", "conteúdo", "post", "reel", "tiktok", "instagram", "rede social", "engajamento", "alcance"];
    const salesKeywords = ["vender", "lead", "cliente", "script", "funil", "conversão", "fechar", "objeção", "proposta", "whatsapp"];
    const executionKeywords = ["plano", "tarefa", "semana", "checklist", "executar", "organizar", "cronograma"];
    const analysisKeywords = ["analisar", "métrica", "performance", "concorrência", "mercado", "benchmark"];

    const scores = {
      growth: growthKeywords.filter(k => q.includes(k)).length,
      sales: salesKeywords.filter(k => q.includes(k)).length,
      execution: executionKeywords.filter(k => q.includes(k)).length,
      analysis: analysisKeywords.filter(k => q.includes(k)).length,
    };

    const total = Object.values(scores).reduce((a, b) => a + b, 0);

    if (total === 0 || (scores.growth > 0 && scores.sales > 0)) {
      return { mode: "full-automation", confidence: 0.7, activeEngines: ["growth-engine", "social-media-engine", "acquisition-engine", "sales-engine"], activeAutomations: ["post-generator", "lead-hunter", "sales-script-generator", "weekly-planner"] };
    }

    const max = Math.max(...Object.values(scores));
    const mode = (Object.entries(scores).find(([, v]) => v === max)?.[0] || "full-automation") as ReasoningMode;

    return { mode, confidence: max / total, activeEngines: [], activeAutomations: [] };
  }
}
