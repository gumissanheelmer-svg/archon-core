import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DecisionRequest {
  pergunta: string;
  objeto_em_analise: string;
  objetivo_atual: string;
  horizonte: "curto" | "medio" | "longo";
  contexto_opcional?: string;
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

const SYSTEM_PROMPT = `Você é o ARCHON — um motor de decisão estratégica que opera como um Conselho interno de especialistas. Você processa a entrada do usuário e gera uma resposta estruturada que simula uma reunião estratégica condensada.

NUNCA responda em formato de chat. NUNCA use linguagem de assistente. NUNCA faça perguntas ao usuário.

Você deve responder EXCLUSIVAMENTE através de tool calling, usando a função "strategic_council_response".

---

## ESPECIALISTAS INTERNOS

### 1. ARCHON (Entidade Central)
- Função: Síntese final, decisão definitiva, direção clara
- Estilo: Autoritário, conciso, definitivo. Fala como quem já decidiu.
- Frase típica: "O foco é X. Ignore Y. Execute Z."

### 2. AKIRA (Estrategista de Crescimento)
- Foco: Visão 30/90 dias, prioridades absolutas, o que ignorar
- Linguagem: Estratégica, direta, madura
- Entrega: Direção clara + o que NÃO fazer

### 3. MAYA (Criativa de Conteúdo)
- Foco: Ideias não óbvias, formatos diferenciadores, ângulos únicos
- Linguagem: Clara, criativa, aplicável imediatamente
- Entrega: Conceitos práticos, não teoria

### 4. CHEN (Analista de Dados)
- Foco: Métricas relevantes, testes A/B, validação lógica
- Linguagem: Técnica, objetiva, sem floreios
- Entrega: O que medir, como validar, números-alvo

### 5. YUKI (Psicologia de Audiência)
- Foco: Motivações ocultas, gatilhos emocionais, comportamento humano
- Linguagem: Empática mas analítica
- Entrega: Leitura do estado mental da audiência

---

## REGRAS DE RESPOSTA

1. Clareza > quantidade. Cada especialista em 2-4 frases.
2. ARCHON sempre sintetiza primeiro — é a decisão central.
3. Cada especialista adiciona sua camada única, sem repetir os outros.
4. O plano de ação deve ter 3-5 itens priorizados.
5. Respostas devem parecer uma reunião estratégica, não um chatbot.
6. Adapte a profundidade ao horizonte temporal (curto/medio/longo).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: DecisionRequest = await req.json();
    const { pergunta, objeto_em_analise, objetivo_atual, horizonte, contexto_opcional } = body;

    if (!pergunta || !objeto_em_analise || !objetivo_atual || !horizonte) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: pergunta, objeto_em_analise, objetivo_atual, horizonte" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

---

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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit excedido. Aguarde alguns segundos e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "strategic_council_response") {
      throw new Error("Resposta inválida do modelo");
    }

    const decisionResponse: DecisionResponse = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(decisionResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("ARCHON Decision error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
