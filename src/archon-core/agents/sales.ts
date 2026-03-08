/**
 * Sales Mind — Vendas Automatizadas e Conversão
 * 
 * Gera funis de conversão, scripts de vendas, respostas a objeções
 * e estratégias de fechamento por tipo de lead.
 */

export type LeadTemperature = "cold" | "warm" | "hot";
export type SalesChannel = "dm" | "whatsapp" | "email" | "call" | "meeting";

export interface LeadProfile {
  persona: string;
  temperature: LeadTemperature;
  painPoints: string[];
  objections: string[];
  bestChannel: SalesChannel;
}

export interface SalesScript {
  channel: SalesChannel;
  leadType: LeadTemperature;
  opening: string;
  qualification: string;
  presentation: string;
  objectionHandling: Record<string, string>;
  closing: string;
  followUp: string[];
}

export interface SalesFunnel {
  stage: "awareness" | "interest" | "decision" | "action" | "retention";
  actions: string[];
  metrics: string[];
  automation: string[];
}

/** Common objections for SaaS scheduling apps */
export const COMMON_OBJECTIONS = [
  "É caro demais",
  "Já uso outra ferramenta",
  "Não tenho tempo de configurar",
  "Meus clientes não vão usar",
  "Preciso pensar mais",
  "Funciona para meu tipo de negócio?",
];
