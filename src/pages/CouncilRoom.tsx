import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import SpecialistCard, { SpecialistId, SpecialistStatus } from "@/components/specialists/SpecialistCard";
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
  const [specialistStatuses, setSpecialistStatuses] = useState<Record<SpecialistId, SpecialistStatus>>({
    akira: "idle",
    maya: "idle",
    chen: "idle",
    yuki: "idle",
  });

  const handleAnalyze = async () => {
    if (!query.trim() || !activeObject || !context) return;
    
    // Animate specialists thinking
    const specialists: SpecialistId[] = ["akira", "maya", "chen", "yuki"];
    specialists.forEach((specialist, index) => {
      setTimeout(() => {
        setSpecialistStatuses(prev => ({ ...prev, [specialist]: "thinking" }));
      }, index * 200);
    });

    // Get memory brief for context injection
    const memoryBrief = getMemoryBrief();

    // Call the real API with persistence and memory
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
      // Set all specialists to ready
      setSpecialistStatuses({
        akira: "ready",
        maya: "ready",
        chen: "ready",
        yuki: "ready",
      });
      
      // Set response in context for display
      setResponse({
        archon_sintese: session.archon_sintese || "",
        akira_estrategia: session.akira_estrategia || "",
        maya_conteudo: session.maya_conteudo || "",
        chen_dados: session.chen_dados || "",
        yuki_psicologia: session.yuki_psicologia || "",
        plano_de_acao: [], // Actions are now in the database
      });
      
      // Navigate to response with session ID
      setTimeout(() => {
        navigate(`/response?session=${session.id}`);
      }, 500);
    } else {
      // Reset on error
      setSpecialistStatuses({
        akira: "idle",
        maya: "idle",
        chen: "idle",
        yuki: "idle",
      });
    }
  };

  // Redirect if no context or active object
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
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pergunte ao ARCHON…"
                disabled={analyzing}
                className="archon-input-large min-h-[120px] resize-none pr-12 disabled:opacity-50"
                rows={3}
                maxLength={4000}
              />
              <Search className="absolute right-4 top-4 w-5 h-5 text-muted-foreground/50" />
            </div>
            
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

        {/* Specialists Grid */}
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["akira", "maya", "chen", "yuki"] as SpecialistId[]).map((specialist, index) => (
              <div
                key={specialist}
                className="animate-fade-in-slow"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <SpecialistCard id={specialist} status={specialistStatuses[specialist]} />
              </div>
            ))}
          </div>
        </div>

        {/* Context indicator */}
        <div className="mt-12 text-center animate-fade-in-slow animation-delay-600">
          <p className="text-xs text-muted-foreground/50 uppercase tracking-wider">
            Objeto: {activeObject.name}
          </p>
          <p className="text-xs text-muted-foreground/30 mt-1">
            Objetivo: {activeObject.objective || "Não definido"} • Horizonte: {context.horizonte}
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default CouncilRoom;
