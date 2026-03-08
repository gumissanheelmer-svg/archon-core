/**
 * Sales Engine — Scripts de Vendas e Estratégias de Fechamento
 */

import type { LeadTemperature, SalesChannel } from "../agents/sales";

export interface ObjectionResponse {
  objection: string;
  technique: string;
  response: string;
}

export interface FollowUpSequence {
  day: number;
  channel: SalesChannel;
  message: string;
  objective: string;
}

export const OBJECTION_BANK: ObjectionResponse[] = [
  { objection: "É caro demais", technique: "Ancoragem + ROI", response: "Quanto você perde por mês com clientes que não aparecem? Com o Agenda Smart, seus clientes recebem lembretes automáticos. Se evitar apenas 2 no-shows por mês, o sistema já se paga." },
  { objection: "Já uso outra ferramenta", technique: "Comparação + Migração fácil", response: "Entendo! O que especificamente você sente falta na ferramenta atual? O Agenda Smart foi desenhado para resolver [dor específica]. E a migração leva menos de 10 minutos." },
  { objection: "Preciso pensar mais", technique: "Urgência + Prova social", response: "Claro, é uma decisão importante. Profissionais similares reduziram 40% dos cancelamentos no primeiro mês. Posso te dar 7 dias grátis para testar sem compromisso?" },
  { objection: "Meus clientes não vão usar", technique: "Inversão + Demonstração", response: "Na verdade, quem agenda é o CLIENTE — ele recebe um link, escolhe o horário e pronto. É mais fácil que mandar WhatsApp." },
];

export const DEFAULT_FOLLOWUP: FollowUpSequence[] = [
  { day: 0, channel: "whatsapp", message: "Apresentação + valor", objective: "Abrir conversa" },
  { day: 1, channel: "whatsapp", message: "Case de sucesso similar", objective: "Prova social" },
  { day: 3, channel: "email", message: "Conteúdo educativo", objective: "Nutrir interesse" },
  { day: 7, channel: "whatsapp", message: "Oferta especial com prazo", objective: "Criar urgência" },
  { day: 14, channel: "whatsapp", message: "Última chamada + depoimento", objective: "Fechamento final" },
];
