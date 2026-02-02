import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import ResponseBlock from "@/components/specialists/ResponseBlock";
import { useArchonContext } from "@/hooks/useArchonContext";
import { useSessions, Session } from "@/hooks/useSessions";
import { useObjects } from "@/hooks/useObjects";

const ArchonResponse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  
  const { response, context } = useArchonContext();
  const { activeObject } = useObjects();
  const { loadSession, currentSession } = useSessions(activeObject?.id);
  const [loading, setLoading] = useState(false);
  
  // Load session from URL if provided
  useEffect(() => {
    if (sessionId && !currentSession) {
      setLoading(true);
      loadSession(sessionId).finally(() => setLoading(false));
    }
  }, [sessionId, currentSession, loadSession]);

  // Use session data if available, otherwise fall back to context
  const sessionData = currentSession || (response ? {
    archon_sintese: response.archon_sintese,
    akira_estrategia: response.akira_estrategia,
    maya_conteudo: response.maya_conteudo,
    chen_dados: response.chen_dados,
    yuki_psicologia: response.yuki_psicologia,
  } : null);

  const displayContext = context || (activeObject ? {
    objeto_em_analise: activeObject.name,
    objetivo_atual: activeObject.objective || "Não definido",
    horizonte: activeObject.horizon,
  } : null);

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
  if (!sessionData || !displayContext) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <AlertCircle className="w-8 h-8 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhuma análise disponível.</p>
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

  const responses = [
    {
      type: "archon" as const,
      content: sessionData.archon_sintese || "",
    },
    {
      type: "akira" as const,
      content: sessionData.akira_estrategia || "",
    },
    {
      type: "maya" as const,
      content: sessionData.maya_conteudo || "",
    },
    {
      type: "chen" as const,
      content: sessionData.chen_dados || "",
    },
    {
      type: "yuki" as const,
      content: sessionData.yuki_psicologia || "",
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-slow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Análise Completa
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Resposta do ARCHON
            </h1>
            <p className="text-xs text-muted-foreground/50 mt-2">
              {displayContext.objeto_em_analise} • {displayContext.objetivo_atual}
            </p>
            {currentSession && (
              <p className="text-xs text-muted-foreground/30 mt-1">
                {new Date(currentSession.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {responses.map((resp, index) => (
              <div
                key={index}
                className="animate-fade-in-slow"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ResponseBlock
                  id={`response-${index}`}
                  type={resp.type}
                  content={resp.content}
                />
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-12 text-center animate-fade-in-slow animation-delay-800">
            <button
              onClick={() => navigate(sessionId ? `/actions?session=${sessionId}` : "/actions")}
              className="archon-button-solid"
            >
              Converter em Plano
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ArchonResponse;
