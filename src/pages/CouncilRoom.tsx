import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import SpecialistCard, { SpecialistId, SpecialistStatus } from "@/components/specialists/SpecialistCard";

const CouncilRoom = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [specialistStatuses, setSpecialistStatuses] = useState<Record<SpecialistId, SpecialistStatus>>({
    akira: "idle",
    maya: "idle",
    chen: "idle",
    yuki: "idle",
  });

  const handleAnalyze = () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate sequential specialist activation
    const specialists: SpecialistId[] = ["akira", "maya", "chen", "yuki"];
    
    specialists.forEach((specialist, index) => {
      setTimeout(() => {
        setSpecialistStatuses(prev => ({ ...prev, [specialist]: "thinking" }));
      }, index * 800);
    });

    // Navigate to response after all specialists are activated
    setTimeout(() => {
      navigate("/response");
    }, specialists.length * 800 + 1500);
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Status Message */}
        {isAnalyzing && (
          <div className="mb-8 animate-fade-in-slow">
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
                disabled={isAnalyzing}
                className="archon-input-large min-h-[120px] resize-none pr-12 disabled:opacity-50"
                rows={3}
              />
              <Search className="absolute right-4 top-4 w-5 h-5 text-muted-foreground/50" />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={!query.trim() || isAnalyzing}
              className="w-full mt-4 archon-button-solid disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? "A Analisar…" : "Analisar"}
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
            Objeto Atual: Agenda Smart – Instagram
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default CouncilRoom;
