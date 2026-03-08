import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useArchonContext } from "@/hooks/useArchonContext";
import { useObjects } from "@/hooks/useObjects";
import { useSessions } from "@/hooks/useSessions";
import { useMemory } from "@/hooks/useMemory";

const CouncilRoom = () => {
  const navigate = useNavigate();
  const { context, setResponse } = useArchonContext();
  const { activeObject } = useObjects();
  const { analyzeQuestion, analyzing } = useSessions(activeObject?.id);
  const { getMemoryBrief } = useMemory();
  
  const [query, setQuery] = useState("");

  const handleAnalyze = async () => {
    if (!query.trim() || !activeObject || !context) return;

    const memoryBrief = getMemoryBrief();

    const session = await analyzeQuestion(
      {
        object_id: activeObject.id,
        question: query.trim(),
        horizon: context.horizonte,
        memoryBrief: memoryBrief || undefined,
      },
      {
        name: activeObject.name,
        objective: activeObject.objective,
        context: activeObject.context,
      }
    );
    
    if (session && session.status === "completed") {
      setResponse({
        archon_sintese: session.archon_sintese || "",
        akira_estrategia: session.akira_estrategia || "",
        maya_conteudo: session.maya_conteudo || "",
        chen_dados: session.chen_dados || "",
        yuki_psicologia: session.yuki_psicologia || "",
        plano_de_acao: [],
      });
      
      setTimeout(() => {
        navigate(`/response?session=${session.id}`);
      }, 500);
    }
  };

  if (!context || !activeObject) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <p className="text-muted-foreground mb-4">Nenhum objeto definido.</p>
          <button
            onClick={() => navigate("/object")}
            className="archon-button"
          >
            Definir Objeto
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Status Message */}
        {analyzing && (
          <div className="mb-8 animate-fade-in-slow flex items-center gap-3">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
              O ARCHON está a processar…
            </p>
          </div>
        )}

        {/* Main Input Area */}
        <div className="w-full max-w-2xl mb-12 animate-fade-in-slow">
          <div className="archon-card-elevated p-6">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Qual a sua dúvida estratégica?"
              disabled={analyzing}
              className="archon-input-large min-h-[120px] resize-none w-full disabled:opacity-50"
              rows={3}
              maxLength={4000}
            />
            
            <button
              onClick={handleAnalyze}
              disabled={!query.trim() || analyzing}
              className="w-full mt-4 archon-button-solid disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A Analisar…
                </>
              ) : (
                "Analisar"
              )}
            </button>
          </div>
        </div>

        {/* Context indicator */}
        <div className="text-center animate-fade-in-slow">
          <p className="text-xs text-muted-foreground/40">
            {activeObject.name} · {context.horizonte}
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default CouncilRoom;
