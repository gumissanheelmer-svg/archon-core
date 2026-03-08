

# Plano: Limpar UI - Tornar Persuasivo e Simples

## O que muda

### 1. Entry Page (`src/pages/Entry.tsx`)
- Remover o indicador de fundo (linha vertical + ponto no bottom)
- Tornar o copy mais persuasivo e estrategico:
  - Subtitle: "Decision Engine" -> "O seu conselho estrategico de elite"
  - Tagline: mais impactante, tipo "Cada decisao certa comeca com a pergunta certa. O ARCHON analisa, sintetiza e entrega clareza."
  - CTA: "Iniciar Sessao" -> "Comecar Agora"

### 2. ConversationList (`src/components/history/ConversationList.tsx`)
- Remover icone Sparkles de cada item
- Remover badge de horizonte (7d/30d/90d)
- Remover ChevronRight
- Simplificar: mostrar apenas data, nome do objeto e pergunta de forma limpa
- Remover texto italico da sintese (muito visual noise)

### 3. Sala do Conselho (`src/pages/CouncilRoom.tsx`)
- Remover icone Search do textarea
- Remover grid de SpecialistCards (os 4 cards idle sao ruido visual)
- Manter apenas o textarea + botao de Analisar, limpo e centrado
- Manter indicador de contexto (objeto/horizonte) mas mais discreto
- Durante analise, mostrar apenas o loader com mensagem, sem cards

### 4. SpecialistCard nao e removido do projeto (usado noutros sitios), apenas deixa de aparecer na CouncilRoom

## Resultado
Interface limpa, sem simbolos/icones desnecessarios, foco total na acao. O utilizador ve apenas o essencial: pergunta, botao, resultado.

