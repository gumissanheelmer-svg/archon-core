import { useState } from "react";
import { Check, Circle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

interface ActionItem {
  id: string;
  task: string;
  priority: "alta" | "média" | "baixa";
  deadline: string;
  completed: boolean;
}

const ActionPlan = () => {
  const [actions, setActions] = useState<ActionItem[]>([
    { id: "1", task: "Criar 3 stories com casos de sucesso", priority: "alta", deadline: "Hoje", completed: false },
    { id: "2", task: "Configurar A/B test de CTAs", priority: "alta", deadline: "Amanhã", completed: false },
    { id: "3", task: "Gravar vídeo antes/depois de cliente", priority: "média", deadline: "3 dias", completed: false },
    { id: "4", task: "Revisar copy de urgência nos links", priority: "média", deadline: "3 dias", completed: false },
    { id: "5", task: "Desativar posts educativos agendados", priority: "baixa", deadline: "Esta semana", completed: false },
    { id: "6", task: "Setup de tracking para CTR", priority: "alta", deadline: "Hoje", completed: true },
  ]);

  const toggleAction = (id: string) => {
    setActions(prev =>
      prev.map(action =>
        action.id === id ? { ...action, completed: !action.completed } : action
      )
    );
  };

  const priorityStyles = {
    alta: "bg-red-500/10 text-red-400 border-red-500/30",
    média: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    baixa: "bg-muted text-muted-foreground border-border",
  };

  const completedCount = actions.filter(a => a.completed).length;
  const progress = (completedCount / actions.length) * 100;

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-in-slow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Plano de Ação
            </p>
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              Agenda Smart – Instagram
            </h1>
            
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
                      {action.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {action.deadline}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ActionPlan;
