import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Circle, AlertCircle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useArchonContext, ActionItem as ArchonAction } from "@/hooks/useArchonContext";

interface ActionItem {
  id: string;
  task: string;
  priority: "alta" | "media" | "baixa";
  completed: boolean;
}

const ActionPlan = () => {
  const navigate = useNavigate();
  const { response, context } = useArchonContext();
  const [actions, setActions] = useState<ActionItem[]>([]);

  useEffect(() => {
    if (response?.plano_de_acao) {
      const mappedActions: ActionItem[] = response.plano_de_acao.map((action, index) => ({
        id: String(index + 1),
        task: action.acao,
        priority: action.prioridade,
        completed: false,
      }));
      setActions(mappedActions);
    }
  }, [response]);

  const toggleAction = (id: string) => {
    setActions(prev =>
      prev.map(action =>
        action.id === id ? { ...action, completed: !action.completed } : action
      )
    );
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

  // Redirect if no response
  if (!response || !context) {
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

  const completedCount = actions.filter(a => a.completed).length;
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
              {context.objeto_em_analise}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {context.objetivo_atual}
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
                  action.completed ? "opacity-50" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleAction(action.id)}
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${
                    action.completed
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30 hover:border-primary"
                  }`}
                >
                  {action.completed ? (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  ) : (
                    <Circle className="w-3 h-3 text-transparent" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-foreground ${action.completed ? "line-through" : ""}`}>
                    {action.task}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${priorityStyles[action.priority]}`}>
                      {priorityLabels[action.priority]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back button */}
          <div className="mt-12 text-center animate-fade-in-slow animation-delay-800">
            <button
              onClick={() => navigate("/response")}
              className="archon-button"
            >
              Ver Análise Completa
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ActionPlan;
