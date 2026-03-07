import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ChevronRight, Calendar, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { SessionStatus } from "@/hooks/useSessions";
import type { TimeHorizon } from "@/hooks/useObjects";

interface SessionPreview {
  id: string;
  question: string;
  archon_sintese: string | null;
  status: SessionStatus;
  horizon: TimeHorizon;
  created_at: string;
  objects?: { name: string } | null;
}

const horizonLabels: Record<TimeHorizon, string> = {
  curto: "7d",
  medio: "30d",
  longo: "90d",
};

const ConversationList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("id, question, archon_sintese, status, horizon, created_at, objects(name)")
          .eq("status", "completed")
          .order("created_at", { ascending: false })
          .limit(15);

        if (error) throw error;
        setSessions((data || []) as SessionPreview[]);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-xs text-muted-foreground/60">
          Nenhuma conversa ainda.
        </p>
        <p className="text-xs text-muted-foreground/40 mt-1">
          Inicie uma sessão para ver o histórico aqui.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  return (
    <div className="space-y-1">
      {sessions.map((session, index) => (
        <button
          key={session.id}
          onClick={() => navigate(`/response?session=${session.id}`)}
          className="w-full group px-4 py-3 text-left rounded-lg transition-all duration-300 
                     hover:bg-secondary/80 border border-transparent hover:border-border/50
                     animate-fade-in-slow"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-muted-foreground/60 font-mono">
                  {formatDate(session.created_at)}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground/60 border border-border/30">
                  {horizonLabels[session.horizon]}
                </span>
              </div>
              <p className="text-xs font-medium text-foreground/90 truncate">
                {session.objects?.name || "Objeto removido"}
              </p>
              <p className="text-[11px] text-muted-foreground/60 truncate mt-0.5">
                {session.question}
              </p>
              {session.archon_sintese && (
                <p className="text-[10px] text-primary/50 mt-1.5 line-clamp-2 italic leading-relaxed">
                  {session.archon_sintese.substring(0, 120)}...
                </p>
              )}
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary/60 transition-colors mt-1 shrink-0" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default ConversationList;
