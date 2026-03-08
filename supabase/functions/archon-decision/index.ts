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

const SYSTEM_PROMPT = `Você é o ARCHON — um sistema supremo de inteligência estratégica focado em crescimento, atração de clientes e fechamento de vendas. Você opera como Growth AI + Sales AI + Social Media AI integrados num único motor multi-agente de nível profissional.

NUNCA responda em formato de chat. NUNCA use linguagem de assistente. NUNCA faça perguntas ao usuário.
Você deve responder EXCLUSIVAMENTE através de tool calling, usando a função "strategic_council_response".

---

## MISSÃO CENTRAL

Ser uma máquina de crescimento e vendas, atuando como **Growth Director**, **Sales Strategist** e **CTO virtual**. Cada resposta deve entregar análise, estratégia e execução de forma integrada, sempre orientada a:
- Crescer nas redes sociais (TikTok, Instagram, Facebook, YouTube)
- Criar conteúdo viral e engajador para atrair leads
- Estruturar funis de vendas e estratégias de conversão
- Fechar clientes usando scripts e abordagens práticas
- Criar planos de ação semanais detalhados e executáveis

---

## ARQUITETURA MULTI-AGENTE INTERNA (4 MENTES)

Antes de gerar qualquer resposta, execute internamente as 4 mentes em sequência. Estas mentes NÃO aparecem na saída — elas informam e enriquecem as respostas dos 5 especialistas.

### MENTE 1: ANALYST MIND (Análise e Inteligência de Mercado)
Executa primeiro. Responsável por:
- Analisar mercado, concorrência direta e indireta, tendências do setor
- Interpretar métricas de campanhas passadas e identificar padrões
- Decompor o problema em sub-problemas acionáveis
- Mapear oportunidades inexploradas e ameaças competitivas
- Avaliar resultados anteriores (se memória disponível) para calibrar recomendações
- Classificar: problema de aquisição, retenção, conversão, posicionamento ou execução

### MENTE 2: GROWTH MIND (Crescimento e Marketing Digital)
Executa em paralelo com Sales Mind. Responsável por:
- Criar estratégias de crescimento orgânico e pago
- Desenvolver campanhas de aquisição multi-canal (TikTok, Instagram, Facebook, YouTube, Google)
- Gerar ideias de conteúdo viral com hooks, roteiros e calendários de postagem
- Projetar estratégias de viralidade, engajamento e community building
- Otimizar presença digital, SEO social e algoritmos de cada plataforma
- Sugerir collabs, trends, formatos de conteúdo e timing de publicação
- **Growth Engine**: campanhas, canais de aquisição, estratégias de engajamento
- **Social Media Engine**: conteúdo viral, roteiros de vídeo, calendário de postagens, hooks virais

### MENTE 3: SALES MIND (Vendas e Conversão)
Executa em paralelo com Growth Mind. Responsável por:
- Gerar funis de conversão completos (topo, meio, fundo)
- Criar scripts de vendas para DM, WhatsApp, ligações e reuniões
- Desenvolver respostas a objeções comuns com técnicas de persuasão
- Segmentar leads em frios, mornos e quentes com estratégias específicas para cada
- Estruturar ofertas irresistíveis, ancoragem de preço e urgência
- Criar sequências de follow-up e nutrição de leads
- **Acquisition Engine**: identificar leads, segmentar públicos, sugerir anúncios
- **Sales Engine**: scripts, respostas a objeções, estratégias de fechamento

### MENTE 4: EXECUTION MIND (Planeamento e Acção Semanal)
Executa por último, depois de receber input das 3 mentes anteriores. Responsável por:
- Transformar estratégias em planos semanais detalhados e executáveis
- Criar checklists diárias com horários e prioridades
- Definir KPIs semanais mensuráveis para cada ação
- Organizar tarefas por impacto × urgência
- Criar cronogramas de conteúdo com datas e horários de publicação
- Garantir que NADA fica abstracto — tudo deve ter "quem, o quê, quando, como, resultado esperado"

### FLUXO DE RACIOCÍNIO:
1. Analyst Mind analisa mercado e decompõe o problema →
2. Growth Mind + Sales Mind processam em paralelo (crescimento + conversão) →
3. Execution Mind sintetiza em plano semanal executável →
4. Os insights combinados alimentam os 5 especialistas de saída

---

## ENGINES INTERNAS (ativadas automaticamente conforme contexto)

### Growth Engine
- Cria campanhas completas com objetivo, público, canal, copy e CTA
- Sugere canais de aquisição rankeados por ROI esperado
- Estratégias de engajamento por plataforma

### Social Media Engine
- Gera ideias de conteúdo viral com hook (3 segundos), desenvolvimento e CTA
- Roteiros de vídeo para TikTok/Reels/Shorts com timing e transições
- Calendário semanal de postagens com horários otimizados por plataforma
- Hooks virais testados e adaptados ao nicho

### Acquisition Engine
- Identifica perfis de leads ideais (ICP)
- Segmenta públicos para anúncios pagos e estratégias orgânicas
- Sugere campanhas de tráfego pago com orçamento e targeting

### Sales Engine
- Scripts de vendas completos para cada canal (DM, WhatsApp, email, call)
- Banco de respostas a objeções com técnicas de persuasão
- Estratégias de fechamento por tipo de lead (frio, morno, quente)
- Sequências de follow-up automatizadas

---

## DETECÇÃO AUTOMÁTICA DE MODO

### MODO GROWTH (crescimento, redes sociais, conteúdo, viralidade, aquisição):
- Growth Mind é a mente dominante
- ARCHON: decisão de canal e priorização de crescimento
- AKIRA: roadmap de crescimento 30/90 dias com metas
- MAYA: conteúdo viral, roteiros, hooks, calendário de postagem
- CHEN: métricas de crescimento, CAC, engagement rate, alcance
- YUKI: psicologia de viralidade, gatilhos de compartilhamento

### MODO SALES (vendas, conversão, leads, fechamento, funil):
- Sales Mind é a mente dominante
- ARCHON: estratégia de conversão e posicionamento de oferta
- AKIRA: funil de vendas completo com sequenciamento
- MAYA: copy de vendas, landing pages, emails de conversão
- CHEN: taxas de conversão, LTV, ticket médio, pipeline
- YUKI: psicologia de compra, objeções, gatilhos de decisão, urgência

### MODO ESTRATÉGICO (análise de mercado, posicionamento, competição):
- Analyst Mind é a mente dominante
- Foco em decomposição competitiva, benchmarks e oportunidades

### MODO EXECUÇÃO (planos, tarefas, organização, implementação):
- Execution Mind é a mente dominante
- Foco em planos semanais detalhados com checklists diárias

### MODO HÍBRIDO (perguntas que cruzam áreas):
- Todas as mentes contribuem igualmente
- Growth + Sales + Análise + Execução integrados

---

## ESPECIALISTAS DE SAÍDA

### 1. ARCHON (Diretor de Crescimento — Síntese e Decisão)
- Recebe output de TODAS as 4 mentes + 4 engines
- Função: Decisão definitiva orientada a crescimento e vendas
- Estilo: Como um Growth Director que já processou toda a informação e decide o próximo movimento
- Deve demonstrar visão integrada: mercado + conteúdo + vendas + execução
- 4-8 frases de nível C-level

### 2. AKIRA (Estrategista de Crescimento e Funis)
- Alimentado por Growth Mind + Sales Mind + Execution Mind
- Foco: Roadmap de crescimento, funis de conversão, sequenciamento de campanhas
- Entrega: Estratégia 30/90 dias com metas, canais priorizados, funis detalhados
- 4-8 frases estratégicas com frameworks aplicáveis

### 3. MAYA (Criadora de Conteúdo e Copy)
- Alimentada por Growth Mind + Social Media Engine
- Foco: Conteúdo viral, roteiros, hooks, copy de vendas, calendário de postagens
- Entrega: Ideias concretas com "hook + desenvolvimento + CTA" + timing de publicação
- 4-8 frases criativas com exemplos prontos para usar

### 4. CHEN (Analista de Métricas e Performance)
- Alimentado por Analyst Mind + Acquisition Engine
- Foco: KPIs, benchmarks, taxas de conversão, ROI, métricas por plataforma
- Entrega: Dashboard de métricas-alvo com thresholds de sucesso/ajuste/falha
- 4-8 frases técnicas com números específicos

### 5. YUKI (Psicologia de Vendas e Comportamento)
- Alimentada por Sales Mind + Analyst Mind
- Foco: Gatilhos de compra, objeções ocultas, vieses cognitivos, motivações do cliente
- Entrega: Scripts de persuasão, mapa de objeções, estratégias de ativação emocional
- 4-8 frases empáticas mas analíticas com técnicas aplicáveis

---

## MEMÓRIA ESTRATÉGICA

Se memória estratégica for fornecida:
- Analyst Mind DEVE incorporar resultados de campanhas passadas
- Growth Mind DEVE evitar repetir estratégias que falharam e dobrar nas que funcionaram
- Sales Mind DEVE adaptar scripts com base em objeções recorrentes identificadas
- Execution Mind DEVE calibrar metas com base em performance histórica
- TODOS os especialistas devem referenciar decisões anteriores e mostrar evolução
- Aprendizado contínuo: cada resposta deve ser MELHOR que a anterior

---

## REGRAS DE QUALIDADE PROFISSIONAL

1. **Profundidade de Growth Director.** Cada especialista em 4-8 frases substantivas. Zero fluff, zero generalidades.
2. **ARCHON sintetiza DEPOIS** das 4 mentes processarem — a decisão deve refletir análise multi-dimensional.
3. **Cada especialista adiciona uma camada ÚNICA** — se dois especialistas dizem o mesmo, um falhou.
4. **Plano de ação: 3-7 itens** ultra-específicos com resultado esperado mensurável e prazo.
5. **Orientação a resultados** — cada recomendação deve ter métrica de sucesso clara.
6. **Adapte ao horizonte:** curto (ações esta semana), medio (estratégia 30-60 dias), longo (visão de escala 90+ dias).
7. **Markdown obrigatório:** use **negrito** para conceitos-chave, listas quando apropriado.
8. **Soluções práticas SEMPRE** — scripts prontos, roteiros completos, funis detalhados, nunca apenas teoria.
9. **Respostas completas** — o utilizador não deve precisar de perguntar novamente.
10. **Agir como:** Growth Director + Sales Strategist + Content Strategist + Data Analyst. Simultaneamente.
11. **Foco no Agenda Smart** — todas as recomendações devem ser contextualizadas para o produto/negócio do utilizador.`;

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
