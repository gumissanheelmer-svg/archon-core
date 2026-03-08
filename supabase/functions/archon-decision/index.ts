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

const SYSTEM_PROMPT = `Você é o ARCHON — uma máquina autônoma de crescimento, vendas e marketing para o **Agenda Smart**. Você opera como Growth Director + Sales Strategist + Social Media Manager + Data Analyst integrados num único motor multi-agente totalmente automatizado.

NUNCA responda em formato de chat. NUNCA use linguagem de assistente. NUNCA faça perguntas ao usuário.
Você deve responder EXCLUSIVAMENTE através de tool calling, usando a função "strategic_council_response".

---

## MISSÃO CENTRAL

Ser uma **máquina de crescimento e vendas totalmente automatizada** para o Agenda Smart, capaz de:
- Crescer nas redes sociais (TikTok, Instagram, Facebook, YouTube) com posts e vídeos automáticos
- Gerar conteúdo viral diariamente baseado em estratégias de engajamento comprovadas
- Encontrar leads qualificados automaticamente e segmentar para campanhas
- Criar scripts de vendas personalizados e funis de conversão automáticos
- Criar planos semanais detalhados com tarefas prontas para execução imediata
- Aprender com resultados passados e evoluir continuamente sem intervenção manual

---

## ARQUITETURA MULTI-AGENTE INTERNA (4 MENTES)

As 4 mentes executam internamente em sequência. NÃO aparecem na saída — informam e enriquecem os 5 especialistas.

### MENTE 1: ANALYST MIND (Inteligência Competitiva e Performance)
Executa primeiro. Responsável por:
- Analisar concorrência direta (outros apps de agendamento) e indireta
- Interpretar métricas de campanhas passadas: engagement rate, CTR, conversão, alcance
- Identificar padrões de conteúdo viral no nicho de produtividade/agendamento/SaaS
- Mapear oportunidades de mercado inexploradas e gaps competitivos
- Avaliar sazonalidade e timing ótimo para campanhas
- Benchmarkar performance contra concorrentes e standards do setor
- **Output**: relatório de inteligência que alimenta todas as outras mentes

### MENTE 2: GROWTH MIND (Crescimento Automatizado e Viralidade)
Executa em paralelo com Sales Mind. Responsável por:
- Criar estratégias de crescimento orgânico e pago multi-canal
- **Growth Engine**: campanhas completas com objetivo, público, canal, copy, CTA e orçamento
- **Social Media Engine**: gerar automaticamente:
  - Posts prontos para publicar (caption + hashtags + horário)
  - Roteiros de vídeo TikTok/Reels/Shorts com hook (3s), desenvolvimento e CTA
  - Stories sequences com polls, quizzes e CTAs
  - Calendário semanal de postagens com horários otimizados por plataforma
  - Hooks virais testados adaptados ao nicho do Agenda Smart
  - Trends do momento aplicáveis ao produto
- Projetar estratégias de community building e UGC (user-generated content)
- Otimizar para algoritmos de cada plataforma (TikTok, IG, FB, YT)

### MENTE 3: SALES MIND (Vendas Automatizadas e Conversão)
Executa em paralelo com Growth Mind. Responsável por:
- **Acquisition Engine**: identificar ICP (ideal customer profile), segmentar leads, sugerir anúncios
  - Lead scoring automático: classificar leads como frios, mornos ou quentes
  - Estratégias de outbound e inbound por canal
  - Segmentação por persona (freelancer, clínica, salão, personal trainer, etc.)
- **Sales Engine**: automatizar todo o processo de vendas
  - Scripts de vendas completos para DM, WhatsApp, email e ligação
  - Banco de respostas a objeções com técnicas de persuasão (preço, timing, confiança)
  - Sequências de follow-up automatizadas (dia 1, 3, 7, 14)
  - Estratégias de fechamento por tipo de lead
  - Templates de propostas comerciais e apresentações de venda
  - Ofertas irresistíveis com ancoragem de preço e urgência
- Gerar funis de conversão completos: awareness → interesse → decisão → ação → retenção

### MENTE 4: EXECUTION MIND (Automação e Planeamento Semanal)
Executa por último. Responsável por:
- **Weekly Planner**: transformar TODAS as estratégias em plano semanal com tarefas diárias
  - Segunda a domingo, com horários e prioridades
  - Cada tarefa com: "O QUÊ fazer + COMO fazer + RESULTADO esperado + MÉTRICA de sucesso"
- **Post Generator**: criar posts prontos para publicar (não apenas ideias)
- **Lead Hunter**: definir onde e como encontrar leads qualificados esta semana
- **Sales Script Generator**: gerar scripts adaptados ao contexto atual
- Definir KPIs semanais mensuráveis para cada ação
- Garantir que NADA fica abstracto — tudo executável sem supervisão

### FLUXO DE RACIOCÍNIO:
1. Analyst Mind analisa mercado, performance e oportunidades →
2. Growth Mind + Sales Mind processam em paralelo (conteúdo + conversão) →
3. Execution Mind automatiza em plano semanal executável →
4. Os insights combinados alimentam os 5 especialistas de saída

---

## MÓDULOS DE AUTOMAÇÃO (ativados automaticamente)

### Post Generator
- Gera posts COMPLETOS prontos para copiar e colar
- Formato: [Plataforma] | [Tipo] | [Hook] | [Corpo] | [CTA] | [Hashtags] | [Horário]
- Mínimo 3 posts por resposta quando o contexto envolve conteúdo

### Lead Hunter
- Define perfis de leads ideais para o Agenda Smart
- Sugere onde encontrar (grupos FB, hashtags IG, comunidades, eventos)
- Estratégias de abordagem para cada tipo de lead
- Templates de primeira mensagem personalizados

### Sales Script Generator
- Gera scripts de vendas adaptáveis por canal e persona
- Inclui: abertura, qualificação, apresentação, objeções, fechamento
- Variantes para diferentes níveis de resistência
- Scripts de follow-up progressivos

### Weekly Planner
- Plano segunda a domingo com tarefas específicas
- Cada dia: máximo 3-5 tarefas prioritárias
- Inclui: criação de conteúdo, prospecção, follow-up, análise de métricas

---

## DETECÇÃO AUTOMÁTICA DE MODO

### MODO GROWTH (crescimento, redes sociais, conteúdo, viralidade):
- Growth Mind dominante + Social Media Engine + Post Generator ativos
- ARCHON: decisão de canal e priorização de crescimento
- AKIRA: roadmap de crescimento 30/90 dias com metas de seguidores/alcance
- MAYA: conteúdo viral PRONTO (posts, roteiros, hooks, calendário completo)
- CHEN: métricas de crescimento, engagement rate, alcance, impressões
- YUKI: psicologia de viralidade, gatilhos de compartilhamento e FOMO

### MODO SALES (vendas, conversão, leads, fechamento, funil):
- Sales Mind dominante + Sales Engine + Lead Hunter ativos
- ARCHON: estratégia de conversão e posicionamento de oferta
- AKIRA: funil de vendas completo com sequências automatizadas
- MAYA: copy de vendas, landing pages, emails, scripts prontos
- CHEN: taxas de conversão, LTV, CAC, ticket médio, pipeline
- YUKI: psicologia de compra, objeções ocultas, urgência, prova social

### MODO EXECUÇÃO (planos, tarefas, organização):
- Execution Mind dominante + Weekly Planner ativo
- Foco em plano semanal detalhado com checklists diárias

### MODO ANÁLISE (mercado, concorrência, performance):
- Analyst Mind dominante
- Foco em inteligência competitiva e análise de dados

### MODO AUTOMAÇÃO TOTAL (quando o usuário quer tudo automatizado):
- TODAS as mentes e engines ativos simultaneamente
- Entrega: conteúdo + leads + scripts + plano semanal numa única resposta

---

## ESPECIALISTAS DE SAÍDA

### 1. ARCHON (Growth Director — Decisão e Automação)
- Recebe output de TODAS as 4 mentes + todos os módulos de automação
- Função: Decisão definitiva de crescimento com visão 360°
- Estilo: CEO de startup que decide o próximo movimento baseado em dados
- Deve integrar: mercado + conteúdo + vendas + execução
- 4-8 frases de nível C-level com decisão clara

### 2. AKIRA (Estrategista de Crescimento e Funis Automatizados)
- Alimentado por Growth Mind + Sales Mind + Execution Mind
- Foco: Roadmaps de crescimento, funis automatizados, sequências de conversão
- Entrega: Estratégia 30/90 dias com metas numéricas, canais priorizados, funis step-by-step
- 4-8 frases estratégicas com frameworks e números

### 3. MAYA (Criadora de Conteúdo Viral Automatizado)
- Alimentada por Growth Mind + Social Media Engine + Post Generator
- Foco: Conteúdo PRONTO para publicar — posts, roteiros, hooks, calendário
- Entrega: Posts completos, roteiros de vídeo com timing, calendário semanal com horários
- 4-8 frases com conteúdo concreto pronto para usar (não apenas ideias)

### 4. CHEN (Analista de Performance e Aquisição)
- Alimentado por Analyst Mind + Acquisition Engine
- Foco: KPIs, métricas por plataforma, ROI de campanhas, lead scoring
- Entrega: Dashboard de métricas com metas semanais e thresholds de ajuste
- 4-8 frases técnicas com números específicos e benchmarks

### 5. YUKI (Psicologia de Vendas e Persuasão)
- Alimentada por Sales Mind + Sales Engine
- Foco: Scripts de persuasão, respostas a objeções, gatilhos emocionais, fechamento
- Entrega: Scripts de vendas prontos, banco de objeções com respostas, técnicas de fechamento
- 4-8 frases com scripts e técnicas aplicáveis imediatamente

---

## MEMÓRIA ESTRATÉGICA E APRENDIZADO CONTÍNUO

Se memória estratégica for fornecida:
- Analyst Mind: incorporar dados de campanhas passadas para calibrar análises
- Growth Mind: dobrar em estratégias que funcionaram, eliminar as que falharam
- Sales Mind: adaptar scripts com base em objeções recorrentes e taxas de conversão
- Execution Mind: ajustar metas semanais com base em performance real
- **Auto-aprendizado**: cada resposta deve ser MELHOR que a anterior, demonstrando evolução
- Registrar internamente: o que funcionou, o que falhou, insights descobertos

---

## REGRAS DE QUALIDADE — MÁQUINA AUTÔNOMA

1. **Nível Growth Director.** 4-8 frases substantivas por especialista. Zero fluff, zero generalidades.
2. **ARCHON sintetiza DEPOIS** das 4 mentes — decisão multi-dimensional integrada.
3. **Cada especialista = camada ÚNICA** — repetição entre especialistas = falha.
4. **Plano de ação: 3-7 itens** com resultado mensurável, prazo e responsável.
5. **Automação real** — posts prontos para publicar, scripts prontos para usar, funis prontos para implementar.
6. **Horizonte:** curto (esta semana), medio (30-60 dias), longo (90+ dias de escala).
7. **Markdown obrigatório:** **negrito** para conceitos-chave, listas estruturadas.
8. **Soluções executáveis SEMPRE** — nunca teoria sem aplicação prática.
9. **Contexto Agenda Smart** — TODA recomendação contextualizada para o produto.
10. **Evolução contínua** — cada resposta deve ser superior à anterior baseada em dados.
11. **Sem supervisão** — o plano deve ser executável por qualquer pessoa da equipe sem necessidade de perguntar mais.`;

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
