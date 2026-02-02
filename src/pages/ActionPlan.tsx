import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Circle, AlertCircle, Loader2, SkipForward, Play } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useArchonContext } from "@/hooks/useArchonContext";
import { useSessions, PlanAction, ActionStatus } from "@/hooks/useSessions";
import { useObjects } from "@/hooks/useObjects";

const ActionPlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  
  const { response, context } = useArchonContext();
  const { activeObject } = useObjects();
  const { 
    loadSession, 
    currentSession, 
    actions, 
    fetchActions, 
    updateActionStatus 
  } = useSessions(activeObject?.id);
  
  const [loading, setLoading] = useState(false);

  // Load session and actions from URL if provided
  useEffect(() => {
    const loadData = async () => {
      if (sessionId) {
        setLoading(true);
        await loadSession(sessionId);
        setLoading(false);
      }
    };
    loadData();
  }, [sessionId]);

  const displayContext = context || (activeObject ? {
    objeto_em_analise: activeObject.name,
    objetivo_atual: activeObject.objective || "Não definido",
    horizonte: activeObject.horizon,
  } : null);

  const handleStatusChange = async (actionId: string, newStatus: ActionStatus) => {
    await updateActionStatus(actionId, newStatus);
  };

  const priorityStyles = {
    alta: "bg-red-500/10 text-red-400 border-red-500/30",
    media: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    baixa: "bg-muted text-muted-foreground border-border",
  };

  const priorityLabels = {
    alta: "Alta",
    media: "Média",
    baixa: "Baixa",
  };

  const statusStyles: Record<ActionStatus, string> = {
    pending: "border-muted-foreground/30 hover:border-primary",
    in_progress: "border-blue-500 bg-blue-500/20",
    done: "bg-primary border-primary",
    skipped: "border-muted-foreground/50 bg-muted/50",
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Redirect if no data
  if (actions.length === 0 && !currentSession && !response) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <AlertCircle className="w-8 h-8 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum plano disponível.</p>
          <button
            onClick={() => navigate("/council")}
            className="archon-button"
          >
            Iniciar Análise
          </button>
        </div>
      </AppLayout>
    );
  }

  const completedCount = actions.filter(a => a.status === "done").length;
  const progress = actions.length > 0 ? (completedCount / actions.length) * 100 : 0;

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-in-slow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Plano de Ação
            </p>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {displayContext?.objeto_em_analise || "Sem objeto"}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {displayContext?.objetivo_atual || "Sem objetivo"}
            </p>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                {completedCount}/{actions.length}
              </span>
            </div>
          </div>

          {/* Actions List */}
          <div className="space-y-3">
            {actions.map((action, index) => (
              <div
                key={action.id}
                className={`archon-card p-4 flex items-start gap-4 transition-all duration-300 animate-fade-in-slow ${
                  action.status === "done" || action.status === "skipped" ? "opacity-50" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Status Toggle */}
                <div className="flex flex-col gap-1 mt-0.5">
                  <button
                    onClick={() => handleStatusChange(
                      action.id, 
                      action.status === "done" ? "pending" : "done"
                    )}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${
                      statusStyles[action.status]
                    }`}
                    title={action.status === "done" ? "Marcar como pendente" : "Marcar como concluído"}
                  >
                    {action.status === "done" ? (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    ) : action.status === "in_progress" ? (
                      <Play className="w-2.5 h-2.5 text-blue-400 fill-blue-400" />
                    ) : action.status === "skipped" ? (
                      <SkipForward className="w-2.5 h-2.5 text-muted-foreground" />
                    ) : (
                      <Circle className="w-3 h-3 text-transparent" />
                    )}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-foreground ${
                    action.status === "done" ? "line-through" : ""
                  } ${action.status === "skipped" ? "line-through text-muted-foreground" : ""}`}>
                    {action.action_text}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded border ${priorityStyles[action.priority]}`}>
                      {priorityLabels[action.priority]}
                    </span>
                    
                    {/* Quick status buttons */}
                    {action.status !== "done" && action.status !== "skipped" && (
                      <>
                        {action.status !== "in_progress" && (
                          <button
                            onClick={() => handleStatusChange(action.id, "in_progress")}
                            className="text-xs px-2 py-0.5 rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
                          >
                            Iniciar
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(action.id, "skipped")}
                          className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground hover:bg-muted/30 transition-colors"
                        >
                          Ignorar
                        </button>
                      </>
                    )}
                    
                    {(action.status === "skipped") && (
                      <button
                        onClick={() => handleStatusChange(action.id, "pending")}
                        className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground hover:bg-muted/30 transition-colors"
                      >
                        Restaurar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back button */}
          <div className="mt-12 flex justify-center gap-4 animate-fade-in-slow animation-delay-800">
            <button
              onClick={() => navigate(sessionId ? `/response?session=${sessionId}` : "/response")}
              className="archon-button"
            >
              Ver Análise
            </button>
            <button
              onClick={() => navigate("/council")}
              className="archon-button-solid"
            >
              Nova Consulta
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ActionPlan;
