/**
 * Lead Hunter — Identificação Automática de Leads
 * 
 * Define onde encontrar leads qualificados,
 * estratégias de abordagem e templates de primeira mensagem.
 */

import type { LeadTemperature } from "../agents/sales";
import { AGENDA_SMART_ICPS, type ICP } from "../engines/acquisitionEngine";

export interface LeadSource {
  platform: string;
  location: string; // Group name, hashtag, community, etc.
  estimatedLeads: string;
  difficulty: "easy" | "medium" | "hard";
  strategy: string;
}

export interface FirstMessage {
  persona: string;
  channel: string;
  message: string;
  tone: "casual" | "professional" | "direct";
}

/** Pre-built lead sources for Agenda Smart */
export const LEAD_SOURCES: LeadSource[] = [
  { platform: "Facebook", location: "Grupos de salões de beleza", estimatedLeads: "500+/grupo", difficulty: "easy", strategy: "Postar conteúdo de valor e responder dúvidas" },
  { platform: "Instagram", location: "Hashtags #salaodebeleza #agendamento", estimatedLeads: "50+/dia", difficulty: "medium", strategy: "Comentar em posts relevantes e enviar DM personalizada" },
  { platform: "WhatsApp", location: "Grupos de empreendedores locais", estimatedLeads: "30-100/grupo", difficulty: "easy", strategy: "Compartilhar cases e oferecer teste grátis" },
  { platform: "LinkedIn", location: "Profissionais de saúde e bem-estar", estimatedLeads: "20+/pesquisa", difficulty: "hard", strategy: "Conexão + mensagem de valor" },
  { platform: "Google Maps", location: "Negócios locais sem site de agendamento", estimatedLeads: "100+/cidade", difficulty: "medium", strategy: "Ligar ou enviar email com proposta" },
];

/** Template de primeira mensagem por persona */
export const FIRST_MESSAGES: FirstMessage[] = [
  {
    persona: "Dono de Salão",
    channel: "WhatsApp/DM",
    message: "Oi [nome]! Vi que você tem um salão incrível 💇‍♀️ Queria te mostrar como outros salões estão reduzindo cancelamentos em 40% com agendamento automático. Posso te mandar um vídeo de 1 minuto mostrando?",
    tone: "casual",
  },
  {
    persona: "Personal Trainer",
    channel: "Instagram DM",
    message: "E aí [nome]! Parabéns pelo trabalho 💪 Percebi que você agenda alunos pelo WhatsApp. Já pensou em ter um link onde eles agendam sozinhos? Outros personais que usam economizam 2h/dia. Quer testar grátis?",
    tone: "casual",
  },
  {
    persona: "Clínica",
    channel: "Email",
    message: "Prezado(a) [nome], identificamos que sua clínica pode estar perdendo receita com no-shows. O Agenda Smart reduz faltas em até 50% com lembretes automáticos. Gostaria de uma demonstração de 15 minutos?",
    tone: "professional",
  },
];

/** Get ICPs from acquisition engine */
export function getICPs(): ICP[] {
  return AGENDA_SMART_ICPS;
}
