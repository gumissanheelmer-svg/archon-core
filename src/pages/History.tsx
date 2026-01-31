import { useNavigate } from "react-router-dom";
import { ChevronRight, Calendar } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

interface Session {
  id: string;
  date: string;
  object: string;
  summary: string;
}

const History = () => {
  const navigate = useNavigate();

  const sessions: Session[] = [
    {
      id: "1",
      date: "30 Jan 2026",
      object: "Agenda Smart – Instagram",
      summary: "Foco em aquisição direta. Teste A/B em CTAs iniciado.",
    },
    {
      id: "2",
      date: "28 Jan 2026",
      object: "Agenda Smart – Instagram",
      summary: "Análise de conteúdo. Redução de posts educativos recomendada.",
    },
    {
      id: "3",
      date: "25 Jan 2026",
      object: "Lançamento Produto X",
      summary: "Estratégia de pré-lançamento definida. 3 fases identificadas.",
    },
    {
      id: "4",
      date: "22 Jan 2026",
      object: "Agenda Smart – Instagram",
      summary: "Revisão de métricas. Taxa de conversão baseline estabelecida.",
    },
    {
      id: "5",
      date: "18 Jan 2026",
      object: "Newsletter Growth",
      summary: "Análise de churn. Melhorias na sequência de onboarding.",
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-in-slow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Histórico
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Sessões Anteriores
            </h1>
          </div>

          {/* Sessions List */}
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <button
                key={session.id}
                onClick={() => navigate("/response")}
                className="w-full archon-card p-5 text-left group transition-all duration-300 hover:border-primary/30 animate-fade-in-slow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-mono">
                        {session.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-1 truncate">
                      {session.object}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {session.summary}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300 mt-1" />
                </div>
              </button>
            ))}
          </div>

          {/* Empty state hint */}
          <p className="text-center text-xs text-muted-foreground/50 mt-10 animate-fade-in-slow animation-delay-600">
            Clique numa sessão para rever a análise completa.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default History;
