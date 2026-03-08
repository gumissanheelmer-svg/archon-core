/**
 * Sales Script Generator — Scripts de Vendas Adaptativos
 * 
 * Gera scripts completos por canal e persona, incluindo
 * abertura, qualificação, apresentação, objeções e fechamento.
 */

import type { LeadTemperature, SalesChannel } from "../agents/sales";
import { OBJECTION_BANK, DEFAULT_FOLLOWUP } from "../engines/salesEngine";

export interface GeneratedScript {
  persona: string;
  channel: SalesChannel;
  leadType: LeadTemperature;
  steps: {
    opening: string;
    qualification: string;
    presentation: string;
    objectionHandling: string;
    closing: string;
  };
  followUpSequence: typeof DEFAULT_FOLLOWUP;
}

/** Generate a base script structure */
export function getBaseScript(persona: string, channel: SalesChannel, leadType: LeadTemperature): GeneratedScript {
  return {
    persona,
    channel,
    leadType,
    steps: {
      opening: getOpening(channel, leadType),
      qualification: "Entender a dor principal: Como você gerencia seus agendamentos hoje? Quanto tempo gasta nisso por dia?",
      presentation: "Mostrar como o Agenda Smart resolve a dor específica identificada, com caso de uso similar.",
      objectionHandling: OBJECTION_BANK.map(o => `"${o.objection}" → ${o.response}`).join("\n"),
      closing: getClosing(leadType),
    },
    followUpSequence: DEFAULT_FOLLOWUP,
  };
}

function getOpening(channel: SalesChannel, leadType: LeadTemperature): string {
  if (leadType === "hot") return "Oi [nome]! Vi que você se interessou pelo Agenda Smart. Vamos configurar sua conta agora?";
  if (leadType === "warm") return "Oi [nome]! Lembra que conversamos sobre otimizar seus agendamentos? Tenho uma novidade que pode te ajudar.";
  return "Oi [nome]! Percebi que você trabalha com [área]. Profissionais como você estão economizando 2h/dia com agendamento automático. Posso te mostrar?";
}

function getClosing(leadType: LeadTemperature): string {
  if (leadType === "hot") return "Vamos ativar sua conta agora? Leva menos de 5 minutos e você já pode começar a receber agendamentos hoje.";
  if (leadType === "warm") return "Que tal testar grátis por 7 dias? Sem compromisso, cancela quando quiser.";
  return "Posso te enviar um vídeo de 2 minutos mostrando como funciona? Se fizer sentido, te dou 7 dias grátis.";
}
