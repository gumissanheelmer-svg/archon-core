import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useArchonContext, ArchonContext } from "@/hooks/useArchonContext";

type Horizon = "7days" | "30days" | "90days";

const horizonMap: Record<Horizon, "curto" | "medio" | "longo"> = {
  "7days": "curto",
  "30days": "medio",
  "90days": "longo",
};

const ObjectAnalysis = () => {
  const navigate = useNavigate();
  const { setContext } = useArchonContext();
  const [objective, setObjective] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("30days");

  const handleSubmit = () => {
    if (objective.trim()) {
      const ctx: ArchonContext = {
        objeto_em_analise: "Agenda Smart – Instagram",
        objetivo_atual: objective.trim(),
        horizonte: horizonMap[horizon],
      };
      setContext(ctx);
      navigate("/council");
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg animate-fade-in-slow">
          {/* Main Card */}
          <div className="archon-card-elevated p-8 md:p-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center border border-pink-500/30">
                <Instagram className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Agenda Smart</h2>
                <p className="text-sm text-muted-foreground">Instagram</p>
              </div>
            </div>

            {/* Objective Input */}
            <div className="space-y-3 mb-8">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">
                Objetivo Principal
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Ex: Aumentar vendas em 30%"
                className="archon-input"
              />
            </div>

            {/* Horizon Selection */}
            <div className="space-y-3 mb-10">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">
                Horizonte
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "7days", label: "7 dias" },
                  { value: "30days", label: "30 dias" },
                  { value: "90days", label: "90 dias" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setHorizon(option.value as Horizon)}
                    className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all duration-300 ${
                      horizon === option.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!objective.trim()}
              className="w-full archon-button-solid disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Fixar Objeto
            </button>
          </div>

          {/* Helper text */}
          <p className="text-center text-xs text-muted-foreground/60 mt-6 animate-fade-in-slow animation-delay-400">
            Todos os especialistas irão focar neste objeto.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ObjectAnalysis;
