

# Plano: Traduzir Interface para Português + Confirmar Backend

## Situação Atual

O sistema já tem **login funcional** com autenticação via backend (Lovable Cloud). A página de login (`/login`) já está em português. O `AuthGuard` protege todas as rotas.

O **backend está configurado** com:
- Autenticação com email/password
- Edge functions para growth intelligence, auth-validate
- Tabelas: sessions, plan_actions, campaign_results, memory_items, connections, objects
- RLS policies em todas as tabelas
- Segredos configurados (ARCHON_AUTHORIZED_EMAIL, etc.)

## O que precisa ser feito

Traduzir para português todos os textos em inglês que restam nas páginas. A maioria das páginas já tem partes em português, mas há muitos textos em inglês, especialmente:

### Ficheiros a alterar (tradução)

1. **`src/components/layout/Sidebar.tsx`** — Labels do menu: "Dashboard", "Lead Discovery", "Lead Intelligence", "Sales Assistant", "Sales Funnels", "Content Engine", "Website Audit", "Growth Experiments", "Growth Strategy", "Connections", "Automation", "Memory", "Insights" → traduzir para PT

2. **`src/components/layout/Header.tsx`** — "Growth" → "Crescimento"

3. **`src/pages/Dashboard.tsx`** — Métricas, títulos, recomendações AI, módulos grid — tudo em inglês → traduzir

4. **`src/pages/LeadDiscovery.tsx`** — Títulos, labels, placeholders em inglês → traduzir

5. **`src/pages/GrowthExperiments.tsx`** — Títulos, labels, placeholders, descrições em inglês → traduzir

6. **`src/pages/SalesConversion.tsx`** — Título "Sales Conversion Engine" → traduzir

7. **`src/pages/Automation.tsx`** — Título "Automation" → traduzir para "Automação"

8. **`src/pages/Insights.tsx`** — Título "Insights", subtítulo "Analytics" → manter ou traduzir

9. **`src/pages/ContentEngine.tsx`** — Subtítulo "Content" → traduzir

10. **`src/pages/GrowthStrategy.tsx`** — Subtítulo "Strategy" → traduzir

11. **`src/pages/LeadIntelligence.tsx`** — Subtítulo "Intelligence" → traduzir

12. **`src/pages/Connections.tsx`** — Labels e botões em inglês

## Sobre o Login e Backend

O login **já existe** e funciona. O backend **já está configurado** com Lovable Cloud. Não é necessário criar nada novo — apenas traduzir a interface.

## Escopo

- ~12 ficheiros com tradução de strings
- Nenhuma alteração de lógica ou backend
- Manter nomes técnicos como "ICE Score" sem traduzir

