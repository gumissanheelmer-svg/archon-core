import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireAuth } from "../_shared/auth.ts";
import {
  runSecurityChecks,
  validatePayload,
  auditLog,
  getSecurityHeaders,
} from "../_shared/security.ts";

const RATE_LIMIT_CONFIG = { maxRequests: 20, windowMs: 10 * 60 * 1000 };
const MAX_FIELD_LENGTH = 8000;

type EngineMode =
  | "website-audit"
  | "social-growth"
  | "funnel-generator"
  | "persuasion"
  | "sales-conversion"
  | "improvement-analysis"
  | "lead-discovery"
  | "growth-experiments";

interface GrowthRequest {
  mode: EngineMode;
  input: string;
  context?: string;
  platform?: string;
  leadInfo?: string;
}

const ENGINE_PROMPTS: Record<EngineMode, { system: string; toolName: string; toolDesc: string; schema: Record<string, any> }> = {
  "lead-discovery": {
    system: `Você é o ARCHON Lead Discovery Engine — motor autônomo de descoberta de leads para o Agenda Smart.

Sua missão: identificar barbearias e negócios de beleza que podem ser clientes do Agenda Smart.

Com base na localização/contexto fornecido, gere:
1. **Leads Descobertos** — lista de barbearias/negócios potenciais com nome, localização, plataforma onde foi encontrado, score de potencial (0-100), e motivo do score
2. **Estratégia de Abordagem** — como abordar cada tipo de lead
3. **Canais de Descoberta** — onde procurar mais leads (Google Maps, Instagram hashtags, grupos Facebook, TikTok)
4. **Estimativa de Mercado** — tamanho estimado do mercado na região

Gere dados REALISTAS e ESPECÍFICOS para a região indicada.
Use **negrito** para conceitos-chave.`,
    toolName: "lead_discovery_result",
    toolDesc: "Leads descobertos com scores e estratégias de abordagem",
    schema: {
      type: "object",
      properties: {
        leads: { type: "array", items: { type: "object", properties: { name: { type: "string" }, location: { type: "string" }, platform: { type: "string" }, score: { type: "number" }, reason: { type: "string" }, category: { type: "string" }, estimated_employees: { type: "number" }, contact_strategy: { type: "string" } }, required: ["name", "location", "platform", "score", "reason", "category"] } },
        channels: { type: "array", items: { type: "object", properties: { channel: { type: "string" }, strategy: { type: "string" }, estimated_leads: { type: "string" }, difficulty: { type: "string" } }, required: ["channel", "strategy", "estimated_leads", "difficulty"] } },
        approach_strategies: { type: "array", items: { type: "object", properties: { persona: { type: "string" }, channel: { type: "string" }, message_template: { type: "string" }, tone: { type: "string" } }, required: ["persona", "channel", "message_template", "tone"] } },
        market_estimate: { type: "object", properties: { total_businesses: { type: "string" }, addressable_market: { type: "string" }, penetration_rate: { type: "string" }, revenue_potential: { type: "string" } }, required: ["total_businesses", "addressable_market"] },
        summary: { type: "string" }
      },
      required: ["leads", "channels", "approach_strategies", "market_estimate", "summary"]
    }
  },
  "growth-experiments": {
    system: `Você é o ARCHON Growth Experiments Engine — motor de experimentação de crescimento para o Agenda Smart.

Com base no contexto e objetivos fornecidos, gere:
1. **Experimentos de Marketing** — hipóteses testáveis com métricas claras
2. **Priorização ICE** — Impact, Confidence, Ease score para cada experimento
3. **Plano de Execução** — passos concretos para cada experimento
4. **Métricas de Sucesso** — KPIs para medir resultados
5. **Timeline** — cronograma de execução

Cada experimento deve ser CONCRETO e EXECUTÁVEL em 1-2 semanas.
Use **negrito** para conceitos-chave.`,
    toolName: "growth_experiments_result",
    toolDesc: "Experimentos de crescimento com priorização e planos de execução",
    schema: {
      type: "object",
      properties: {
        experiments: { type: "array", items: { type: "object", properties: { name: { type: "string" }, hypothesis: { type: "string" }, channel: { type: "string" }, ice_score: { type: "object", properties: { impact: { type: "number" }, confidence: { type: "number" }, ease: { type: "number" }, total: { type: "number" } }, required: ["impact", "confidence", "ease", "total"] }, steps: { type: "array", items: { type: "string" } }, success_metrics: { type: "array", items: { type: "string" } }, timeline: { type: "string" }, budget: { type: "string" }, expected_result: { type: "string" } }, required: ["name", "hypothesis", "channel", "ice_score", "steps", "success_metrics", "timeline"] } },
        recommended_order: { type: "array", items: { type: "string" } },
        summary: { type: "string" }
      },
      required: ["experiments", "recommended_order", "summary"]
    }
  },
  "website-audit": {
    system: `Você é o ARCHON Website Audit Engine — analisador autônomo de websites para o Agenda Smart.

Analise o website/landing page descrito e detecte:
1. **CTAs fracos** — botões sem urgência, textos genéricos, posicionamento ruim
2. **Explicação do produto confusa** — visitante não entende o que faz em 5 segundos
3. **Pontos de conversão fracos** — formulários longos, sem incentivos, sem prova social acima do fold
4. **Prova social ausente** — sem depoimentos, números, logos de clientes, cases

Para cada problema, gere uma sugestão de melhoria CONCRETA e executável.
Use **negrito** para conceitos-chave. Seja direto e prático.`,
    toolName: "website_audit_result",
    toolDesc: "Resultado da auditoria do website com problemas e sugestões",
    schema: {
      type: "object",
      properties: {
        score: { type: "number" },
        cta_issues: { type: "array", items: { type: "object", properties: { problem: { type: "string" }, suggestion: { type: "string" }, priority: { type: "string", enum: ["alta", "media", "baixa"] } }, required: ["problem", "suggestion", "priority"] } },
        clarity_issues: { type: "array", items: { type: "object", properties: { problem: { type: "string" }, suggestion: { type: "string" }, priority: { type: "string", enum: ["alta", "media", "baixa"] } }, required: ["problem", "suggestion", "priority"] } },
        conversion_issues: { type: "array", items: { type: "object", properties: { problem: { type: "string" }, suggestion: { type: "string" }, priority: { type: "string", enum: ["alta", "media", "baixa"] } }, required: ["problem", "suggestion", "priority"] } },
        social_proof_issues: { type: "array", items: { type: "object", properties: { problem: { type: "string" }, suggestion: { type: "string" }, priority: { type: "string", enum: ["alta", "media", "baixa"] } }, required: ["problem", "suggestion", "priority"] } },
        summary: { type: "string" }
      },
      required: ["score", "cta_issues", "clarity_issues", "conversion_issues", "social_proof_issues", "summary"]
    }
  },
  "social-growth": {
    system: `Você é o ARCHON Social Growth Engine — motor de crescimento em redes sociais para o Agenda Smart.

Com base nas informações da conta/plataforma fornecida, gere:
1. **Ideias de conteúdo viral** — 5 ideias com hook, formato e plataforma
2. **Calendário de postagens** — 7 dias com horários otimizados
3. **Oportunidades de crescimento** — nichos, hashtags, trends aproveitáveis
4. **Melhorias de engajamento** — o que mudar para mais likes, shares, saves

Use **negrito**. Conteúdo PRONTO para usar.`,
    toolName: "social_growth_result",
    toolDesc: "Plano de crescimento social com ideias, calendário e oportunidades",
    schema: {
      type: "object",
      properties: {
        viral_ideas: { type: "array", items: { type: "object", properties: { hook: { type: "string" }, format: { type: "string" }, platform: { type: "string" }, description: { type: "string" } }, required: ["hook", "format", "platform", "description"] } },
        weekly_calendar: { type: "array", items: { type: "object", properties: { day: { type: "string" }, posts: { type: "array", items: { type: "object", properties: { time: { type: "string" }, platform: { type: "string" }, type: { type: "string" }, content: { type: "string" } }, required: ["time", "platform", "type", "content"] } } }, required: ["day", "posts"] } },
        growth_opportunities: { type: "array", items: { type: "string" } },
        engagement_improvements: { type: "array", items: { type: "string" } },
        summary: { type: "string" }
      },
      required: ["viral_ideas", "weekly_calendar", "growth_opportunities", "engagement_improvements", "summary"]
    }
  },
  "funnel-generator": {
    system: `Você é o ARCHON Funnel Engine — gerador de funis de vendas para aquisição de barbearias e negócios para o Agenda Smart.

Gere funis de vendas COMPLETOS e prontos para implementar:
- **Instagram Funnel**: post viral → DM automática → demonstração → fechamento
- **TikTok Funnel**: vídeo hook → bio link → landing page → trial
- **Google Maps Funnel**: busca local → review → contato direto → onboarding
- **WhatsApp Funnel**: lista broadcast → conteúdo valor → oferta → conversão

Cada funil com etapas detalhadas, copy pronta, e métricas esperadas.
Use **negrito**.`,
    toolName: "funnel_result",
    toolDesc: "Funis de vendas completos por plataforma",
    schema: {
      type: "object",
      properties: {
        funnels: { type: "array", items: { type: "object", properties: { platform: { type: "string" }, name: { type: "string" }, steps: { type: "array", items: { type: "object", properties: { step: { type: "number" }, action: { type: "string" }, copy: { type: "string" }, expected_conversion: { type: "string" } }, required: ["step", "action", "copy", "expected_conversion"] } }, estimated_roi: { type: "string" } }, required: ["platform", "name", "steps", "estimated_roi"] } },
        recommended_funnel: { type: "string" },
        summary: { type: "string" }
      },
      required: ["funnels", "recommended_funnel", "summary"]
    }
  },
  "persuasion": {
    system: `Você é o ARCHON Persuasion Engine — gerador de respostas altamente persuasivas para potenciais clientes do Agenda Smart.

Aplique os 4 princípios de persuasão:
1. **Urgência** — criar senso de escassez e timing
2. **Prova Social** — números, depoimentos, cases de sucesso
3. **Simplicidade** — eliminar complexidade, mostrar facilidade
4. **Curiosidade** — gerar interesse e desejo de saber mais

Gere respostas persuasivas prontas para usar em diferentes contextos de venda.
Use **negrito**.`,
    toolName: "persuasion_result",
    toolDesc: "Respostas persuasivas com princípios aplicados",
    schema: {
      type: "object",
      properties: {
        responses: { type: "array", items: { type: "object", properties: { context: { type: "string" }, message: { type: "string" }, principles_used: { type: "array", items: { type: "string" } }, tone: { type: "string" } }, required: ["context", "message", "principles_used", "tone"] } },
        objection_handlers: { type: "array", items: { type: "object", properties: { objection: { type: "string" }, response: { type: "string" }, technique: { type: "string" } }, required: ["objection", "response", "technique"] } },
        summary: { type: "string" }
      },
      required: ["responses", "objection_handlers", "summary"]
    }
  },
  "sales-conversion": {
    system: `Você é o ARCHON Sales Conversion Engine — assistente de fechamento de vendas em tempo real para o Agenda Smart.

O usuário está numa conversa com um lead. Com base no contexto fornecido:
1. Gere a PRÓXIMA resposta ideal para avançar a venda
2. Identifique sinais de compra ou objeções ocultas
3. Sugira técnicas de fechamento adequadas ao momento
4. Forneça variantes da resposta (formal, casual, urgente)

Foque em FECHAR a venda. Seja direto e prático.
Use **negrito**.`,
    toolName: "sales_conversion_result",
    toolDesc: "Resposta de vendas e estratégia de fechamento",
    schema: {
      type: "object",
      properties: {
        recommended_response: { type: "string" },
        variants: { type: "array", items: { type: "object", properties: { tone: { type: "string" }, message: { type: "string" } }, required: ["tone", "message"] } },
        buying_signals: { type: "array", items: { type: "string" } },
        hidden_objections: { type: "array", items: { type: "string" } },
        closing_technique: { type: "string" },
        next_steps: { type: "array", items: { type: "string" } },
        summary: { type: "string" }
      },
      required: ["recommended_response", "variants", "closing_technique", "next_steps", "summary"]
    }
  },
  "improvement-analysis": {
    system: `Você é o ARCHON Continuous Improvement Engine — motor de aprendizado contínuo para o Agenda Smart.

Analise os resultados de campanhas e conversões fornecidos:
1. Identifique PADRÕES de sucesso e falha
2. Gere insights acionáveis para melhorar performance
3. Sugira ajustes específicos em estratégia, copy, targeting
4. Projete metas realistas para o próximo ciclo
5. Identifique o que PARAR de fazer e o que DOBRAR

Use **negrito**. Dados concretos.`,
    toolName: "improvement_result",
    toolDesc: "Análise de melhoria contínua com insights e recomendações",
    schema: {
      type: "object",
      properties: {
        success_patterns: { type: "array", items: { type: "string" } },
        failure_patterns: { type: "array", items: { type: "string" } },
        actionable_insights: { type: "array", items: { type: "object", properties: { insight: { type: "string" }, action: { type: "string" }, expected_impact: { type: "string" } }, required: ["insight", "action", "expected_impact"] } },
        stop_doing: { type: "array", items: { type: "string" } },
        double_down: { type: "array", items: { type: "string" } },
        next_cycle_goals: { type: "array", items: { type: "object", properties: { metric: { type: "string" }, target: { type: "string" }, timeframe: { type: "string" } }, required: ["metric", "target", "timeframe"] } },
        summary: { type: "string" }
      },
      required: ["success_patterns", "failure_patterns", "actionable_insights", "stop_doing", "double_down", "next_cycle_goals", "summary"]
    }
  }
};

serve(async (req) => {
  const headers = getSecurityHeaders(req.headers.get('origin') || undefined);

  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), { status: 405, headers });
  }

  const startTime = Date.now();

  try {
    const securityCheck = await runSecurityChecks(req, 'api/growth-intelligence', RATE_LIMIT_CONFIG);
    if (!securityCheck.passed) return securityCheck.response!;

    const authResult = await requireAuth(req, headers, {
      authorizedEmail: Deno.env.get("ARCHON_AUTHORIZED_EMAIL") || undefined,
    });
    if (!authResult.ok) {
      auditLog('growth_unauthorized', { ip: securityCheck.ip.substring(0, 8) + '***', reason: authResult.reason });
      return authResult.response;
    }

    let body: GrowthRequest;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: "Payload inválido" }), { status: 400, headers });
    }

    const payloadCheck = validatePayload(body, MAX_FIELD_LENGTH);
    if (!payloadCheck.allowed) {
      return new Response(JSON.stringify({ error: payloadCheck.reason }), { status: 400, headers });
    }

    const { mode, input, context, platform, leadInfo } = body;

    if (!mode || !input) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios: mode, input" }), { status: 400, headers });
    }

    const engineConfig = ENGINE_PROMPTS[mode];
    if (!engineConfig) {
      return new Response(JSON.stringify({ error: "Modo inválido" }), { status: 400, headers });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    let userPrompt = `## INPUT\n\n${input}`;
    if (context) userPrompt += `\n\n## CONTEXTO ADICIONAL\n\n${context}`;
    if (platform) userPrompt += `\n\n## PLATAFORMA: ${platform}`;
    if (leadInfo) userPrompt += `\n\n## INFORMAÇÃO DO LEAD\n\n${leadInfo}`;
    userPrompt += `\n\nResponda EXCLUSIVAMENTE via tool calling usando a função "${engineConfig.toolName}".`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: engineConfig.system },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: engineConfig.toolName,
            description: engineConfig.toolDesc,
            parameters: engineConfig.schema,
          },
        }],
        tool_choice: { type: "function", function: { name: engineConfig.toolName } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido." }), { status: 429, headers });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), { status: 402, headers });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== engineConfig.toolName) {
      throw new Error("Resposta inválida do modelo");
    }

    const result = JSON.parse(toolCall.function.arguments);

    const duration = Date.now() - startTime;
    auditLog('growth_success', { mode, duration_ms: duration, ip: securityCheck.ip.substring(0, 8) + '***' });

    return new Response(JSON.stringify(result), { headers });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("Growth Intelligence error:", error);
    auditLog('growth_error', { error: error instanceof Error ? error.message : 'unknown', duration_ms: duration });
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno" }),
      { status: 500, headers }
    );
  }
});
