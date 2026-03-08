import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  runSecurityChecks,
  validatePayload,
  auditLog,
  getSecurityHeaders,
  sanitizeOutput,
} from "../_shared/security.ts";
import { requireAuth } from "../_shared/auth.ts";

// Rate limit config: 30 requests per 10 minutes
const RATE_LIMIT_CONFIG = {
  maxRequests: 30,
  windowMs: 10 * 60 * 1000, // 10 minutes
};

// Max field length for user inputs
const MAX_FIELD_LENGTH = 4000;

interface DecisionRequest {
  pergunta: string;
  objeto_em_analise: string;
  objetivo_atual: string;
  horizonte: "curto" | "medio" | "longo";
  contexto_opcional?: string;
  memoria_estrategica?: string; // Memory brief injected from frontend
}

interface ActionItem {
  acao: string;
  prioridade: "alta" | "media" | "baixa";
}

interface DecisionResponse {
  archon_sintese: string;
  akira_estrategia: string;
  maya_conteudo: string;
  chen_dados: string;
  yuki_psicologia: string;
  plano_de_acao: ActionItem[];
}

const SYSTEM_PROMPT = `Você é o ARCHON — um motor de decisão estratégica de nível profissional que opera como um Conselho interno de especialistas com raciocínio avançado. Cada resposta deve demonstrar profundidade analítica, visão estratégica e aplicabilidade imediata.

NUNCA responda em formato de chat. NUNCA use linguagem de assistente. NUNCA faça perguntas ao usuário.
Você deve responder EXCLUSIVAMENTE através de tool calling, usando a função "strategic_council_response".

---

## FRAMEWORK DE RACIOCÍNIO (OBRIGATÓRIO PARA CADA ESPECIALISTA)

Cada especialista DEVE seguir esta cadeia de raciocínio antes de responder:

1. **COMPREENSÃO** — Reformular o problema na perspectiva do especialista
2. **ANÁLISE** — Aplicar lógica, dados ou frameworks relevantes
3. **SOLUÇÃO** — Apresentar uma resposta concreta e executável
4. **RECOMENDAÇÃO** — Indicar o próximo passo estratégico mais importante

A resposta final de cada especialista deve integrar estes 4 passos num texto fluido e profissional — NÃO como lista de passos, mas como uma análise coesa.

---

## DETECÇÃO AUTOMÁTICA DE MODO

Analise a pergunta e adapte automaticamente:

**Se a pergunta envolve código, tecnologia, arquitetura, APIs, bugs ou desenvolvimento:**
- ARCHON foca em decisão técnica e trade-offs
- AKIRA foca em roadmap técnico e priorização de features
- MAYA foca em developer experience e documentação
- CHEN foca em performance, métricas técnicas e testes
- YUKI foca em experiência do utilizador final e adoção

**Se a pergunta envolve negócios, monetização, marketing, vendas ou crescimento:**
- ARCHON foca em decisão de mercado e posicionamento
- AKIRA foca em estratégia de crescimento e funis
- MAYA foca em conteúdo, branding e comunicação
- CHEN foca em métricas de negócio, CAC, LTV, conversão
- YUKI foca em psicologia de compra e gatilhos de decisão

**Para perguntas gerais ou híbridas:** Use o equilíbrio padrão.

---

## ESPECIALISTAS INTERNOS

### 1. ARCHON (Entidade Central — Síntese e Decisão)
- Função: Síntese final após considerar todas as perspectivas, decisão definitiva, direção inequívoca
- Estilo: Autoritário, conciso, definitivo. Fala como quem já analisou tudo e decidiu.
- Profundidade: Identifica o verdadeiro problema subjacente (não apenas o superficial), apresenta a decisão com justificação estratégica
- Frase típica: "Após análise, o problema real é X. A decisão é Y porque Z. Execute assim."

### 2. AKIRA (Estrategista de Crescimento)
- Foco: Visão 30/90 dias, prioridades absolutas, sequenciamento estratégico, o que ignorar e porquê
- Linguagem: Estratégica, direta, madura, com frameworks claros
- Profundidade: Não apenas diz "faça X" — explica a lógica competitiva, o timing e os riscos de não agir
- Entrega: Roadmap priorizado com justificação + armadilhas a evitar

### 3. MAYA (Criativa Estratégica)
- Foco: Ideias não óbvias, ângulos diferenciadores, formatos inovadores, narrativas que convertem
- Linguagem: Clara, criativa, aplicável imediatamente, com exemplos concretos
- Profundidade: Cada ideia vem com contexto de "porquê funciona" e "como executar"
- Entrega: Conceitos práticos com framework de implementação, não teoria abstrata

### 4. CHEN (Analista de Dados e Validação)
- Foco: Métricas relevantes, benchmarks, testes de validação, análise de risco quantitativo
- Linguagem: Técnica, objetiva, com números-alvo específicos
- Profundidade: Define KPIs exatos, thresholds de decisão, e critérios de sucesso/falha
- Entrega: Framework de medição com metas concretas e timeline de validação

### 5. YUKI (Psicologia e Comportamento)
- Foco: Motivações ocultas, vieses cognitivos em jogo, gatilhos emocionais, dinâmicas de decisão
- Linguagem: Empática mas analítica, com referências a padrões comportamentais
- Profundidade: Explica o "porquê psicológico" por trás das ações recomendadas
- Entrega: Mapa de motivações e barreiras psicológicas com estratégias de activação

---

## MEMÓRIA ESTRATÉGICA

Se memória estratégica for fornecida, TODOS os especialistas devem:
- Referenciar insights relevantes da memória nas suas análises
- Manter consistência com decisões anteriores (ou justificar mudança de direção)
- Adaptar recomendações ao contexto acumulado do projeto

---

## REGRAS DE QUALIDADE

1. **Profundidade > superficialidade.** Cada especialista em 3-6 frases substantivas. Zero fluff.
2. **ARCHON sintetiza primeiro** — é a decisão central baseada na análise conjunta.
3. **Cada especialista adiciona uma camada única** de valor, sem repetir os outros.
4. **O plano de ação deve ter 3-7 itens** priorizados com ações específicas (não genéricas).
5. **Respostas devem parecer um conselho executivo** de alto nível, não um chatbot.
6. **Adapte a profundidade ao horizonte:** curto (ações imediatas e táticas), medio (estratégia e posicionamento), longo (visão, moats e escala).
7. **Use markdown para estruturar:** negrito para conceitos-chave, sem headers dentro de cada resposta.
8. **Sempre priorize soluções práticas** sobre análise teórica.
9. **Respostas completas** — nunca diga "depende" sem dar a recomendação concreta.`;

serve(async (req) => {
  const headers = getSecurityHeaders(req.headers.get('origin') || undefined);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Método não permitido" }),
      { status: 405, headers }
    );
  }

  const startTime = Date.now();

  try {
    // Run security checks (IP allowlist + rate limiting)
    const securityCheck = await runSecurityChecks(req, 'api/archon-decision', RATE_LIMIT_CONFIG);
    if (!securityCheck.passed) {
      return securityCheck.response!;
    }

    // Verify authentication (validate JWT explicitly)
    const authResult = await requireAuth(req, headers, {
      authorizedEmail: Deno.env.get("ARCHON_AUTHORIZED_EMAIL") || undefined,
    });
    if (!authResult.ok) {
      auditLog('analyze_unauthorized', {
        ip: securityCheck.ip.substring(0, 8) + '***',
        reason: authResult.reason,
      });
      return authResult.response;
    }

    // Parse and validate body
    let body: DecisionRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Payload inválido" }),
        { status: 400, headers }
      );
    }

    // Validate payload structure and size
    const payloadCheck = validatePayload(body, MAX_FIELD_LENGTH);
    if (!payloadCheck.allowed) {
      auditLog('analyze_rejected', { 
        reason: 'payload_validation',
        ip: securityCheck.ip.substring(0, 8) + '***'
      });
      return new Response(
        JSON.stringify({ error: payloadCheck.reason }),
        { status: 400, headers }
      );
    }

    const { pergunta, objeto_em_analise, objetivo_atual, horizonte, contexto_opcional, memoria_estrategica } = body;

    // Validate required fields
    if (!pergunta || !objeto_em_analise || !objetivo_atual || !horizonte) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: pergunta, objeto_em_analise, objetivo_atual, horizonte" }),
        { status: 400, headers }
      );
    }

    // Validate horizonte enum
    if (!['curto', 'medio', 'longo'].includes(horizonte)) {
      return new Response(
        JSON.stringify({ error: "Horizonte deve ser: curto, medio ou longo" }),
        { status: 400, headers }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const userPrompt = `## ENTRADA PARA ANÁLISE

**Pergunta:** ${pergunta}

**Objeto em Análise:** ${objeto_em_analise}

**Objetivo Atual:** ${objetivo_atual}

**Horizonte Temporal:** ${horizonte === "curto" ? "Curto prazo (7-14 dias)" : horizonte === "medio" ? "Médio prazo (30-60 dias)" : "Longo prazo (90+ dias)"}

${contexto_opcional ? `**Contexto Adicional:** ${contexto_opcional}` : ""}

${memoria_estrategica ? `---

## MEMÓRIA ESTRATÉGICA DO PROJETO

Use este contexto acumulado para informar suas análises e recomendações:

${memoria_estrategica}

---` : ""}

Processe esta entrada e retorne a análise do Conselho Estratégico.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.2",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "strategic_council_response",
              description: "Retorna a análise estruturada do Conselho Estratégico ARCHON",
              parameters: {
                type: "object",
                properties: {
                  archon_sintese: {
                    type: "string",
                    description: "Síntese central e decisão definitiva do ARCHON. Curta, clara, autoritária."
                  },
                  akira_estrategia: {
                    type: "string",
                    description: "Direção estratégica, prioridades e o que ignorar. Visão 30-90 dias."
                  },
                  maya_conteudo: {
                    type: "string",
                    description: "Ideias criativas, formatos e ângulos práticos para execução."
                  },
                  chen_dados: {
                    type: "string",
                    description: "Métricas a medir, testes a executar, validação lógica."
                  },
                  yuki_psicologia: {
                    type: "string",
                    description: "Leitura emocional da audiência, gatilhos e motivações."
                  },
                  plano_de_acao: {
                    type: "array",
                    description: "3-5 ações priorizadas para execução imediata",
                    items: {
                      type: "object",
                      properties: {
                        acao: { type: "string", description: "Descrição da ação" },
                        prioridade: { type: "string", enum: ["alta", "media", "baixa"] }
                      },
                      required: ["acao", "prioridade"]
                    }
                  }
                },
                required: ["archon_sintese", "akira_estrategia", "maya_conteudo", "chen_dados", "yuki_psicologia", "plano_de_acao"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "strategic_council_response" } }
      }),
    });

    if (!response.ok) {
      const duration = Date.now() - startTime;
      
      if (response.status === 429) {
        auditLog('analyze_rate_limited', { duration_ms: duration, ip: securityCheck.ip.substring(0, 8) + '***' });
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Aguarde alguns segundos e tente novamente." }),
          { status: 429, headers }
        );
      }
      if (response.status === 402) {
        auditLog('analyze_payment_required', { duration_ms: duration, ip: securityCheck.ip.substring(0, 8) + '***' });
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }),
          { status: 402, headers }
        );
      }
      
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      auditLog('analyze_error', { status: response.status, duration_ms: duration });
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "strategic_council_response") {
      throw new Error("Resposta inválida do modelo");
    }

    const decisionResponse: DecisionResponse = JSON.parse(toolCall.function.arguments);

    // Sanitize all output fields to prevent XSS
    const sanitizedResponse: DecisionResponse = {
      archon_sintese: sanitizeOutput(decisionResponse.archon_sintese),
      akira_estrategia: sanitizeOutput(decisionResponse.akira_estrategia),
      maya_conteudo: sanitizeOutput(decisionResponse.maya_conteudo),
      chen_dados: sanitizeOutput(decisionResponse.chen_dados),
      yuki_psicologia: sanitizeOutput(decisionResponse.yuki_psicologia),
      plano_de_acao: decisionResponse.plano_de_acao.map(item => ({
        acao: sanitizeOutput(item.acao),
        prioridade: item.prioridade,
      })),
    };

    const duration = Date.now() - startTime;
    auditLog('analyze_success', { 
      duration_ms: duration, 
      ip: securityCheck.ip.substring(0, 8) + '***',
      horizonte,
      actions_count: sanitizedResponse.plano_de_acao.length
    });

    return new Response(JSON.stringify(sanitizedResponse), { headers });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("ARCHON Decision error:", error);
    auditLog('analyze_error', { 
      error: error instanceof Error ? error.message : 'unknown',
      duration_ms: duration
    });
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno do servidor" }),
      { status: 500, headers }
    );
  }
});
