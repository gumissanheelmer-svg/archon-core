import { useArchonContext, ArchonResponse } from "./useArchonContext";
import { useToast } from "@/hooks/use-toast";

interface DecisionRequest {
  pergunta: string;
  objeto_em_analise: string;
  objetivo_atual: string;
  horizonte: "curto" | "medio" | "longo";
  contexto_opcional?: string;
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

    setIsLoading(true);
    setError(null);

    try {
      const requestBody: DecisionRequest = {
        pergunta,
        objeto_em_analise: context.objeto_em_analise,
        objetivo_atual: context.objetivo_atual,
        horizonte: context.horizonte,
        contexto_opcional,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/archon-decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Erro ao processar análise";
        
        if (response.status === 429) {
          toast({
            title: "Limite atingido",
            description: "Aguarde alguns segundos e tente novamente.",
            variant: "destructive",
          });
        } else if (response.status === 402) {
          toast({
            title: "Créditos insuficientes",
            description: "Adicione créditos ao workspace para continuar.",
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
