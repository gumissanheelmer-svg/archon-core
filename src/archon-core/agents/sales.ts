/**
 * Sales Mind — Vendas Automatizadas e Conversão
 * Gera funis de conversão, scripts de vendas e estratégias de fechamento.
 */

export type LeadTemperature = "cold" | "warm" | "hot";
export type SalesChannel = "dm" | "whatsapp" | "email" | "call" | "meeting";

export const COMMON_OBJECTIONS = [
  "É caro demais",
  "Já uso outra ferramenta",
  "Não tenho tempo de configurar",
  "Meus clientes não vão usar",
  "Preciso pensar mais",
  "Funciona para meu tipo de negócio?",
];

const OBJECTION_RESPONSES: Record<string, string> = {
  "É caro demais": "Na verdade, quanto você perde por mês com clientes que esquecem ou cancelam? O Agenda Smart se paga no primeiro mês.",
  "Já uso outra ferramenta": "O que diferencia o Agenda Smart é a automação completa — lembretes, confirmação e reagendamento sem você precisar fazer nada.",
  "Não tenho tempo de configurar": "A configuração leva menos de 10 minutos. E nossa equipe configura tudo pra você se preferir.",
  "Meus clientes não vão usar": "95% dos clientes preferem agendar online. É mais prático pra eles e pra você.",
  "Preciso pensar mais": "Claro! Enquanto isso, posso te dar acesso gratuito por 7 dias pra você testar sem compromisso?",
  "Funciona para meu tipo de negócio?": "Funciona pra qualquer negócio baseado em agendamentos — salões, consultórios, personal trainers, clínicas e muito mais.",
};

export class SalesMind {
  /** Gera script de vendas por tipo de lead */
  generateSalesScript(leadType: LeadTemperature): string {
    if (leadType === "cold") return "Apresentação curta + valor principal + prova social + CTA para teste grátis";
    if (leadType === "warm") return "Demonstração personalizada + benefícios claros + resolução de objeções + oferta com urgência";
    return "Recap de benefícios + oferta exclusiva + fechamento rápido com garantia";
  }

  /** Retorna resposta estratégica para objeções */
  handleObjections(objection: string): string {
    return OBJECTION_RESPONSES[objection] || `Resposta estratégica para: "${objection}" — vou analisar o contexto e propor a melhor abordagem.`;
  }

  /** Retorna todas as objeções conhecidas */
  getCommonObjections(): string[] {
    return COMMON_OBJECTIONS;
  }
}
