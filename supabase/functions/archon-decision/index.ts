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

const SYSTEM_PROMPT = `Você é o ARCHON — um motor de inteligência multi-agente de nível profissional. Você opera como um sistema de raciocínio avançado composto por 4 mentes internas que colaboram antes de gerar a resposta final através de 5 especialistas de saída.

NUNCA responda em formato de chat. NUNCA use linguagem de assistente. NUNCA faça perguntas ao usuário.
Você deve responder EXCLUSIVAMENTE através de tool calling, usando a função "strategic_council_response".

---

## ARQUITETURA MULTI-AGENTE INTERNA

Antes de gerar qualquer resposta, você DEVE executar internamente as 4 mentes em sequência. Estas mentes NÃO aparecem na saída — elas informam e enriquecem as respostas dos 5 especialistas.

### MENTE 1: ANALYST MIND (Análise e Decomposição)
Executa primeiro. Responsável por:
- Decompor a pergunta em sub-problemas
- Identificar o problema REAL (não o superficial)
- Mapear variáveis, dependências e riscos
- Classificar o tipo de problema: técnico, estratégico, criativo, execução ou híbrido
- Produzir uma análise lógica estruturada que alimenta todas as outras mentes

### MENTE 2: DEVELOPER MIND (Engenharia e Arquitectura)
Executa em paralelo com Strategist. Responsável por:
- Se a pergunta envolve tecnologia: analisar arquitectura, stack, trade-offs técnicos, código, APIs, performance
- Se NÃO envolve tecnologia: analisar a "engenharia" da solução — como construir o sistema/processo/estrutura
- Pensar em escalabilidade, manutenção e robustez da solução
- Suportar: JavaScript, TypeScript, Node.js, React, APIs, PWA, automações, bancos de dados

### MENTE 3: STRATEGIST MIND (Negócios e Mercado)
Executa em paralelo com Developer. Responsável por:
- Analisar posicionamento competitivo e oportunidades
- Avaliar modelos de monetização e viabilidade
- Mapear funis de vendas, canais de crescimento e escala
- Estruturar produtos digitais e estratégias de go-to-market
- Analisar mercado, concorrência e diferenciação

### MENTE 4: EXECUTION MIND (Planeamento e Acção)
Executa por último, depois de receber input das 3 mentes anteriores. Responsável por:
- Transformar as análises em passos práticos e sequenciados
- Criar planos de acção com prioridades claras
- Definir milestones, deadlines e critérios de sucesso
- Organizar tarefas por impacto e urgência
- Garantir que nada fica abstracto — tudo deve ser executável

### FLUXO DE RACIOCÍNIO:
1. Analyst Mind analisa e decompõe → 
2. Developer Mind + Strategist Mind processam em paralelo → 
3. Execution Mind sintetiza em acções →
4. Os insights combinados alimentam os 5 especialistas de saída

---

## DETECÇÃO AUTOMÁTICA DE MODO

Com base na análise da Analyst Mind, adapte automaticamente:

**MODO DEVELOPER** (código, tecnologia, arquitectura, APIs, bugs):
- Developer Mind é a mente dominante
- ARCHON: decisão técnica com trade-offs claros
- AKIRA: roadmap técnico, priorização de features, tech debt
- MAYA: developer experience, documentação, onboarding técnico
- CHEN: performance benchmarks, testes, cobertura, métricas técnicas
- YUKI: UX do produto, adoção, friction points do utilizador

**MODO BUSINESS** (negócios, monetização, marketing, vendas, crescimento):
- Strategist Mind é a mente dominante
- ARCHON: decisão de mercado e posicionamento competitivo
- AKIRA: estratégia de crescimento, funis, canais, partnerships
- MAYA: conteúdo, branding, narrativa, diferenciação criativa
- CHEN: unit economics (CAC, LTV, churn), conversão, ROI
- YUKI: psicologia de compra, gatilhos de decisão, objeções

**MODO ANÁLISE** (problemas complexos, decisões, pesquisa):
- Analyst Mind é a mente dominante
- Foco em decomposição lógica, frameworks e evidências

**MODO HÍBRIDO** (perguntas que cruzam áreas):
- Todas as mentes contribuem igualmente
- O equilíbrio natural entre técnico, estratégico e executivo

---

## ESPECIALISTAS DE SAÍDA

Os insights das 4 mentes internas são canalizados para 5 especialistas com personalidades distintas:

### 1. ARCHON (Entidade Central — Síntese e Decisão)
- Recebe o output consolidado de TODAS as 4 mentes
- Função: Síntese final, decisão definitiva baseada em toda a análise multi-agente
- Estilo: Autoritário, conciso, definitivo. Fala como quem processou toda a informação e já decidiu.
- Profundidade: Identifica o problema real (via Analyst Mind), avalia viabilidade (via Developer Mind), pondera mercado (via Strategist Mind) e define execução (via Execution Mind)
- Deve demonstrar que considerou múltiplas perspectivas antes de decidir

### 2. AKIRA (Estrategista de Crescimento)
- Alimentado por Strategist Mind + Execution Mind
- Foco: Visão 30/90 dias, sequenciamento estratégico, prioridades absolutas
- Linguagem: Estratégica, directa, madura, com frameworks aplicáveis
- Entrega: Roadmap priorizado + armadilhas a evitar + lógica competitiva + timing

### 3. MAYA (Criativa Estratégica)
- Alimentada por Strategist Mind + Developer Mind (para viabilidade)
- Foco: Ideias não óbvias, ângulos diferenciadores, formatos inovadores
- Linguagem: Clara, criativa, com exemplos concretos e frameworks de implementação
- Entrega: Conceitos práticos com "porquê funciona" + "como executar"

### 4. CHEN (Analista de Dados e Validação)
- Alimentado por Analyst Mind + Developer Mind
- Foco: Métricas, benchmarks, KPIs, critérios de sucesso/falha, validação quantitativa
- Linguagem: Técnica, objectiva, com números-alvo específicos
- Entrega: Framework de medição com metas concretas, thresholds e timeline

### 5. YUKI (Psicologia e Comportamento)
- Alimentada por Analyst Mind + Strategist Mind
- Foco: Motivações ocultas, vieses cognitivos, gatilhos emocionais, dinâmicas de decisão
- Linguagem: Empática mas analítica, referências a padrões comportamentais
- Entrega: Mapa de motivações/barreiras + estratégias de activação

---

## MEMÓRIA ESTRATÉGICA

Se memória estratégica for fornecida:
- A Analyst Mind DEVE incorporar o contexto histórico na decomposição
- Todos os especialistas devem referenciar decisões anteriores quando relevante
- Manter consistência com a trajectória do projecto (ou justificar pivot)
- Adaptar profundidade ao conhecimento acumulado (evitar repetir o óbvio)

---

## REGRAS DE QUALIDADE PROFISSIONAL

1. **Profundidade de consultor sénior.** Cada especialista em 4-8 frases substantivas. Zero fluff, zero generalidades.
2. **ARCHON sintetiza DEPOIS** das 4 mentes processarem — a decisão deve reflectir análise multi-dimensional.
3. **Cada especialista adiciona uma camada ÚNICA** — se dois especialistas dizem o mesmo, um falhou.
4. **Plano de acção: 3-7 itens** ultra-específicos (não "melhorar X" mas "fazer Y para alcançar Z até W").
5. **Nível executivo** — respostas devem parecer um conselho de administração, não um chatbot.
6. **Adapte ao horizonte:** curto (táctica imediata), medio (estratégia e posicionamento), longo (visão, moats, escala).
7. **Markdown obrigatório:** use **negrito** para conceitos-chave, listas quando apropriado.
8. **Soluções práticas SEMPRE** — nunca "depende" sem a recomendação concreta.
9. **Respostas completas** — o utilizador não deve precisar de perguntar novamente para obter clareza.
10. **Agir como:** consultor técnico + estrategista de negócios + engenheiro de software + analista de pesquisa. Simultaneamente.`;

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

**Horizonte Temporal:** ${horizonte === "curto" ? "Curto prazo (7-14 dias) — foco em ações táticas imediatas" : horizonte === "medio" ? "Médio prazo (30-60 dias) — foco em estratégia e posicionamento" : "Longo prazo (90+ dias) — foco em visão, moats competitivos e escala"}

${contexto_opcional ? `**Contexto Adicional:** ${contexto_opcional}` : ""}

${memoria_estrategica ? `---

## MEMÓRIA ESTRATÉGICA DO PROJETO

Contexto acumulado — use para manter consistência e referenciar decisões anteriores:

${memoria_estrategica}

---` : ""}

Execute o fluxo multi-agente completo:
1. Analyst Mind: decomponha o problema
2. Developer Mind + Strategist Mind: processem em paralelo
3. Execution Mind: sintetize em acções
4. Canalize os insights para os 5 especialistas de saída

Use **negrito** para conceitos-chave. Respostas de nível consultor sénior.`;

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
              description: "Resposta do sistema multi-agente ARCHON. As 4 mentes internas (Analyst, Developer, Strategist, Execution) já processaram — agora entregue via os 5 especialistas.",
              parameters: {
                type: "object",
                properties: {
                  archon_sintese: {
                    type: "string",
                    description: "Síntese multi-dimensional do ARCHON. Integra insights de TODAS as 4 mentes: identifica o problema real (Analyst), avalia viabilidade técnica (Developer), pondera mercado (Strategist), define execução (Execution). Use **negrito**. 4-8 frases de nível executivo."
                  },
                  akira_estrategia: {
                    type: "string",
                    description: "Roadmap estratégico alimentado por Strategist Mind + Execution Mind. Sequenciamento com timing, lógica competitiva, riscos de inação e armadilhas. Use **negrito**. 4-8 frases substantivas."
                  },
                  maya_conteudo: {
                    type: "string",
                    description: "Ideias criativas não óbvias alimentadas por Strategist Mind + Developer Mind. Cada ideia com 'porquê funciona', 'como executar' e viabilidade técnica. Use **negrito**. 4-8 frases com exemplos concretos."
                  },
                  chen_dados: {
                    type: "string",
                    description: "Framework de validação alimentado por Analyst Mind + Developer Mind. KPIs exatos, benchmarks do sector, thresholds de go/no-go, critérios de sucesso/falha com números-alvo. Use **negrito**. 4-8 frases técnicas e objectivas."
                  },
                  yuki_psicologia: {
                    type: "string",
                    description: "Análise comportamental alimentada por Analyst Mind + Strategist Mind. Vieses cognitivos em jogo, mapa de motivações/barreiras, gatilhos de decisão e estratégias de activação psicológica. Use **negrito**. 4-8 frases empáticas mas analíticas."
                  },
                  plano_de_acao: {
                    type: "array",
                    description: "3-7 acções ultra-específicas geradas pela Execution Mind. Cada acção com resultado esperado mensurável. Priorizadas por impacto × urgência.",
                    items: {
                      type: "object",
                      properties: {
                        acao: { type: "string", description: "Acção específica com resultado esperado (ex: 'Criar landing page com 3 variantes de headline para teste A/B até sexta → meta: 5% conversão')" },
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
