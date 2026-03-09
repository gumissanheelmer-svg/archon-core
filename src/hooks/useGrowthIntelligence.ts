import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type EngineMode =
  | "website-audit"
  | "social-growth"
  | "funnel-generator"
  | "persuasion"
  | "sales-conversion"
  | "improvement-analysis"
  | "lead-discovery"
  | "growth-experiments";

export const useGrowthIntelligence = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async (
    mode: EngineMode,
    input: string,
    options?: { context?: string; platform?: string; leadInfo?: string }
  ) => {
    setLoading(true);
    setResult(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        toast({ title: "Sessão expirada", description: "Faça login novamente.", variant: "destructive" });
        setLoading(false);
        return null;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/growth-intelligence`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            mode,
            input,
            context: options?.context,
            platform: options?.platform,
            leadInfo: options?.leadInfo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast({ title: "Limite atingido", description: "Aguarde e tente novamente.", variant: "destructive" });
        } else if (response.status === 402) {
          toast({ title: "Créditos insuficientes", description: "Adicione créditos ao workspace.", variant: "destructive" });
        } else {
          toast({ title: "Erro", description: data.error || "Erro ao processar análise", variant: "destructive" });
        }
        setLoading(false);
        return null;
      }

      setResult(data);
      setLoading(false);
      return data;
    } catch (err) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro de conexão", variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

  return { analyze, loading, result, setResult };
};
