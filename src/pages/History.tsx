import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Calendar, Loader2, AlertCircle, Check, Clock, X } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Session, SessionStatus } from "@/hooks/useSessions";
import type { TimeHorizon } from "@/hooks/useObjects";

interface SessionWithObject extends Session {
  objects?: {
    name: string;
  };
}

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionWithObject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("sessions")
          .select(`
            *,
            objects (name)
          `)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        setSessions((data || []) as SessionWithObject[]);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case "completed":
        return <Check className="w-3 h-3 text-green-400" />;
      case "processing":
        return <Clock className="w-3 h-3 text-yellow-400 animate-pulse" />;
      case "failed":
        return <X className="w-3 h-3 text-red-400" />;
      default:
        return <Clock className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const horizonLabels: Record<TimeHorizon, string> = {
    curto: "7 dias",
    medio: "30 dias",
    longo: "90 dias",
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
            <p className="text-sm text-muted-foreground mt-2">
              {sessions.length} {sessions.length === 1 ? "sessão" : "sessões"} registadas
            </p>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-20 animate-fade-in-slow">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Nenhuma sessão registada.</p>
              <button
                onClick={() => navigate("/council")}
                className="archon-button-solid"
              >
                Iniciar Primeira Análise
              </button>
            </div>
          ) : (
            <>
              {/* Sessions List */}
              <div className="space-y-3">
                {sessions.map((session, index) => (
                  <button
                    key={session.id}
                    onClick={() => navigate(`/response?session=${session.id}`)}
                    disabled={session.status !== "completed"}
                    className="w-full archon-card p-5 text-left group transition-all duration-300 hover:border-primary/30 animate-fade-in-slow disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-mono">
                              {new Date(session.created_at).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground">
                            {horizonLabels[session.horizon]}
                          </span>
                          {getStatusIcon(session.status)}
                        </div>
                        <h3 className="text-sm font-medium text-foreground mb-1 truncate">
                          {session.objects?.name || "Objeto removido"}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {session.question}
                        </p>
                        {session.archon_sintese && (
                          <p className="text-xs text-primary/70 mt-2 line-clamp-1 italic">
                            "{session.archon_sintese.substring(0, 100)}..."
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300 mt-1" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer hint */}
              <p className="text-center text-xs text-muted-foreground/50 mt-10 animate-fade-in-slow animation-delay-600">
                Clique numa sessão para rever a análise completa.
              </p>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default History;
