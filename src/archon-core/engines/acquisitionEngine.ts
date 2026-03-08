/**
 * Acquisition Engine — Identificação e Segmentação de Leads
 * 
 * Define ICP, segmenta públicos, sugere campanhas de tráfego
 * e implementa lead scoring automatizado.
 */

import type { LeadTemperature } from "../agents/sales";

export interface ICP {
  persona: string;
  industry: string;
  painPoints: string[];
  budget: string;
  decisionCriteria: string[];
  whereToFind: string[];
}

export interface LeadScore {
  temperature: LeadTemperature;
  score: number; // 0-100
  signals: string[];
  nextAction: string;
}

/** Ideal Customer Profiles for Agenda Smart */
export const AGENDA_SMART_ICPS: ICP[] = [
  {
    persona: "Dono de Salão de Beleza",
    industry: "Beleza e Estética",
    painPoints: ["Agenda bagunçada", "Clientes faltam sem avisar", "Perde tempo no WhatsApp"],
    budget: "R$50-200/mês",
    decisionCriteria: ["Facilidade de uso", "Preço acessível", "Lembrete automático"],
    whereToFind: ["Grupos FB de salões", "Hashtags #salãodebeleza", "Eventos do setor"],
  },
  {
    persona: "Personal Trainer",
    industry: "Fitness",
    painPoints: ["Alunos cancelam em cima da hora", "Gestão manual", "Cobrança difícil"],
    budget: "R$30-150/mês",
    decisionCriteria: ["App mobile", "Integração pagamento", "Simplicidade"],
    whereToFind: ["Instagram fitness", "Grupos de personal", "Academias parceiras"],
  },
  {
    persona: "Clínica / Consultório",
    industry: "Saúde",
    painPoints: ["Recepcionista sobrecarregada", "No-shows", "Confirmação manual"],
    budget: "R$100-500/mês",
    decisionCriteria: ["Profissionalismo", "Multi-profissional", "Lembrete SMS/WhatsApp"],
    whereToFind: ["LinkedIn saúde", "Grupos médicos", "Eventos de saúde"],
  },
  {
    persona: "Freelancer / Consultor",
    industry: "Serviços",
    painPoints: ["Perde tempo agendando", "Não parece profissional", "Sem controle financeiro"],
    budget: "R$20-100/mês",
    decisionCriteria: ["Link de agendamento", "Pagamento antecipado", "Simplicidade"],
    whereToFind: ["Comunidades de freelancers", "Twitter/X", "Grupos de empreendedores"],
  },
];
