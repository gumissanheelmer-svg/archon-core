

# Plano: Corrigir Erro de Token Expirado

## Problema Identificado
O código atual em `useSessions.ts` usa o token de autenticação do estado React (`authSession.access_token`), que pode estar desatualizado ou expirado. Isso causa o erro "Failed to fetch" ou 401 Unauthorized.

## Solução
Buscar uma sessão fresca diretamente do Supabase antes de cada chamada à API, garantindo que o token seja válido e atualizado automaticamente.

## Alteração Necessária

**Arquivo:** `src/hooks/useSessions.ts`

**De (código atual):**
```typescript
const analyzeQuestion = async (...) => {
  if (!user || !authSession) return null;
  // ...
  Authorization: `Bearer ${authSession.access_token}`,
```

**Para (código corrigido):**
```typescript
const analyzeQuestion = async (...) => {
  if (!user) return null;

  // Buscar sessão fresca para garantir token válido
  const { data: { session: freshSession } } = await supabase.auth.getSession();
  if (!freshSession) {
    toast({
      title: "Sessão expirada",
      description: "Por favor, faça login novamente.",
      variant: "destructive",
    });
    return null;
  }
  // ...
  Authorization: `Bearer ${freshSession.access_token}`,
```

## Benefícios
- Token sempre atualizado automaticamente pelo Supabase
- Mensagem clara quando a sessão expira
- Elimina erros de "Failed to fetch" causados por tokens inválidos

