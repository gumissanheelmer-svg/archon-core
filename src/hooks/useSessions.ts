import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import type { TimeHorizon } from "./useObjects";

export type SessionStatus = "created" | "processing" | "completed" | "failed";
export type ActionPriority = "alta" | "media" | "baixa";
export type ActionStatus = "pending" | "in_progress" | "done" | "skipped";

export interface Session {
  id: string;
  object_id: string;
  question: string;
  horizon: TimeHorizon;
  status: SessionStatus;
  archon_sintese: string | null;
  akira_estrategia: string | null;
  maya_conteudo: string | null;
  chen_dados: string | null;
  yuki_psicologia: string | null;
  processing_time_ms: number | null;
  model_used: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanAction {
  id: string;
  session_id: string;
  action_text: string;
  priority: ActionPriority;
  status: ActionStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSessionInput {
  object_id: string;
  question: string;
  horizon: TimeHorizon;
}

export interface SessionResponse {
  archon_sintese: string;
  akira_estrategia: string;
  maya_conteudo: string;
  chen_dados: string;
  yuki_psicologia: string;
  plano_de_acao: Array<{ acao: string; prioridade: ActionPriority }>;
}

export const useSessions = (objectId?: string) => {
  const { user, session: authSession } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [actions, setActions] = useState<PlanAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Fetch sessions for an object
  const fetchSessions = useCallback(async (objId?: string) => {
    if (!user) return;
    
    const targetObjectId = objId || objectId;
    if (!targetObjectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("object_id", targetObjectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSessions((data || []) as Session[]);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  }, [user, objectId]);

  // Fetch actions for a session
  const fetchActions = useCallback(async (sessionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("plan_actions")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setActions((data || []) as PlanAction[]);
    } catch (error) {
      console.error("Error fetching actions:", error);
    }
  }, [user]);

  useEffect(() => {
    if (objectId) {
      fetchSessions(objectId);
    }
  }, [objectId, fetchSessions]);

  // Create a session and analyze
  const analyzeQuestion = async (
    input: CreateSessionInput,
    objectContext: { name: string; objective: string | null; context: string | null }
  ): Promise<Session | null> => {
    if (!user || !authSession) return null;

    setAnalyzing(true);
    let sessionId: string | null = null;

    try {
      // 1. Create session in "processing" state
      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          user_id: user.id,
          object_id: input.object_id,
          question: input.question,
          horizon: input.horizon,
          status: "processing" as SessionStatus,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      
      const newSession = sessionData as Session;
      sessionId = newSession.id;
      setCurrentSession(newSession);

      // 2. Call ARCHON API
      const startTime = Date.now();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/archon-decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authSession.access_token}`,
          },
          body: JSON.stringify({
            pergunta: input.question,
            objeto_em_analise: objectContext.name,
            objetivo_atual: objectContext.objective || "Não definido",
            horizonte: input.horizon,
            contexto_opcional: objectContext.context || undefined,
          }),
        }
      );

      const processingTime = Date.now() - startTime;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Erro ${response.status}`;
        
        // Update session as failed
        await supabase
          .from("sessions")
          .update({
            status: "failed" as SessionStatus,
            error_message: errorMessage,
            processing_time_ms: processingTime,
          })
          .eq("id", sessionId);

        // Handle specific errors
        if (response.status === 429) {
          toast({
            title: "Limite excedido",
            description: "Aguarde alguns minutos antes de tentar novamente.",
            variant: "destructive",
          });
        } else if (response.status === 402) {
          toast({
            title: "Créditos insuficientes",
            description: "Adicione créditos ao workspace.",
            variant: "destructive",
          });
        } else if (response.status === 403) {
          toast({
            title: "Acesso negado",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro na análise",
            description: errorMessage,
            variant: "destructive",
          });
        }

        return null;
      }

      const result: SessionResponse = await response.json();

      // 3. Update session with response
      const { data: updatedSession, error: updateError } = await supabase
        .from("sessions")
        .update({
          status: "completed" as SessionStatus,
          archon_sintese: result.archon_sintese,
          akira_estrategia: result.akira_estrategia,
          maya_conteudo: result.maya_conteudo,
          chen_dados: result.chen_dados,
          yuki_psicologia: result.yuki_psicologia,
          processing_time_ms: processingTime,
          model_used: "openai/gpt-5.2",
        })
        .eq("id", sessionId)
        .select()
        .single();

      if (updateError) throw updateError;

      // 4. Create plan actions
      if (result.plano_de_acao && result.plano_de_acao.length > 0) {
        const actionsToInsert = result.plano_de_acao.map((action) => ({
          user_id: user.id,
          session_id: sessionId!,
          action_text: action.acao,
          priority: action.prioridade,
          status: "pending" as ActionStatus,
        }));

        const { error: actionsError } = await supabase
          .from("plan_actions")
          .insert(actionsToInsert);

        if (actionsError) {
          console.error("Error creating actions:", actionsError);
        }
      }

      const completedSession = updatedSession as Session;
      setCurrentSession(completedSession);
      await fetchSessions(input.object_id);
      await fetchActions(sessionId);

      return completedSession;
    } catch (error) {
      console.error("Analysis error:", error);
      
      // Update session as failed if we have an ID
      if (sessionId) {
        await supabase
          .from("sessions")
          .update({
            status: "failed" as SessionStatus,
            error_message: error instanceof Error ? error.message : "Erro desconhecido",
          })
          .eq("id", sessionId);
      }

      toast({
        title: "Erro",
        description: "Não foi possível completar a análise.",
        variant: "destructive",
      });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  // Update action status
  const updateActionStatus = async (
    actionId: string,
    status: ActionStatus
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const updateData: Partial<PlanAction> = { status };
      if (status === "done") {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("plan_actions")
        .update(updateData)
        .eq("id", actionId);

      if (error) throw error;

      // Refresh actions
      if (currentSession) {
        await fetchActions(currentSession.id);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating action:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a ação.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Load a specific session
  const loadSession = async (sessionId: string): Promise<Session | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;

      const session = data as Session;
      setCurrentSession(session);
      await fetchActions(sessionId);
      return session;
    } catch (error) {
      console.error("Error loading session:", error);
      return null;
    }
  };

  return {
    sessions,
    currentSession,
    actions,
    loading,
    analyzing,
    analyzeQuestion,
    updateActionStatus,
    loadSession,
    fetchSessions,
    fetchActions,
    setCurrentSession,
  };
};
