import { useArchonContext, ArchonResponse } from "./useArchonContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DecisionRequest {
  pergunta: string;
  objeto_em_analise: string;
  objetivo_atual: string;
  horizonte: "curto" | "medio" | "longo";
  contexto_opcional?: string;
}

// Input validation constants
const MAX_FIELD_LENGTH = 4000;
const MAX_SHORT_FIELD_LENGTH = 500;

// Validate and sanitize input
function validateInput(value: string, maxLength: number): { valid: boolean; sanitized: string; error?: string } {
  if (!value || typeof value !== 'string') {
    return { valid: false, sanitized: '', error: 'Campo obrigatório' };
  }
  
  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, sanitized: '', error: 'Campo não pode estar vazio' };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, sanitized: '', error: `Texto excede o limite de ${maxLength} caracteres` };
  }
  
  // Basic sanitization - remove potential script tags
  const sanitized = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '');
  
  return { valid: true, sanitized };
}

export const useArchonDecision = () => {
  const { context, setResponse, setIsLoading, setError, isLoading, error } = useArchonContext();
  const { toast } = useToast();

  const analyze = async (pergunta: string, contexto_opcional?: string): Promise<ArchonResponse | null> => {
    if (!context) {
      setError("Contexto não definido. Defina o objeto em análise primeiro.");
      toast({
        title: "Erro",
        description: "Defina o objeto em análise primeiro.",
        variant: "destructive",
      });
      return null;
    }

    // Validate inputs
    const perguntaCheck = validateInput(pergunta, MAX_FIELD_LENGTH);
    if (!perguntaCheck.valid) {
      toast({
        title: "Erro de validação",
        description: perguntaCheck.error,
        variant: "destructive",
      });
      return null;
    }

    if (contexto_opcional) {
      const contextoCheck = validateInput(contexto_opcional, MAX_FIELD_LENGTH);
      if (!contextoCheck.valid) {
        toast({
          title: "Erro de validação",
          description: contextoCheck.error,
          variant: "destructive",
        });
        return null;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current session for auth header
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        toast({
          title: "Sessão expirada",
          description: "Faça login novamente.",
          variant: "destructive",
        });
        setIsLoading(false);
        return null;
      }

      const requestBody: DecisionRequest = {
        pergunta: perguntaCheck.sanitized,
        objeto_em_analise: context.objeto_em_analise,
        objetivo_atual: context.objetivo_atual,
        horizonte: context.horizonte,
        contexto_opcional: contexto_opcional?.trim(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/archon-decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = data.error || "Erro ao processar análise";
        
        if (response.status === 429) {
          toast({
            title: "Limite atingido",
            description: "Aguarde alguns minutos e tente novamente.",
            variant: "destructive",
          });
        } else if (response.status === 402) {
          toast({
            title: "Créditos insuficientes",
            description: "Adicione créditos ao workspace para continuar.",
            variant: "destructive",
          });
        } else if (response.status === 403) {
          toast({
            title: "Acesso bloqueado",
            description: "IP não autorizado. Atualize allowlist nas configurações do servidor.",
            variant: "destructive",
          });
          errorMsg = "IP não autorizado";
        } else if (response.status === 401) {
          toast({
            title: "Não autenticado",
            description: "Faça login novamente.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro",
            description: errorMsg,
            variant: "destructive",
          });
        }
        
        setError(errorMsg);
        setIsLoading(false);
        return null;
      }

      const archonResponse: ArchonResponse = data;
      setResponse(archonResponse);
      setIsLoading(false);
      return archonResponse;

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro de conexão";
      setError(errorMsg);
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
      setIsLoading(false);
      return null;
    }
  };

  return {
    analyze,
    isLoading,
    error,
  };
};
