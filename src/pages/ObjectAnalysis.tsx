import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Plus, Settings, Check, Archive } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useObjects, AnalysisObject, TimeHorizon } from "@/hooks/useObjects";
import { useArchonContext } from "@/hooks/useArchonContext";

type Horizon = "7days" | "30days" | "90days";

const horizonMap: Record<Horizon, TimeHorizon> = {
  "7days": "curto",
  "30days": "medio",
  "90days": "longo",
};

const horizonReverseMap: Record<TimeHorizon, Horizon> = {
  "curto": "7days",
  "medio": "30days",
  "longo": "90days",
};

const ObjectAnalysis = () => {
  const navigate = useNavigate();
  const { setContext } = useArchonContext();
  const { objects, activeObject, loading, createObject, setObjectActive, updateObject } = useObjects();
  
  // Form state
  const [mode, setMode] = useState<"select" | "create">("select");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [context, setContextField] = useState("");
  const [objective, setObjective] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("30days");
  
  // Selected object for editing
  const [selectedObject, setSelectedObject] = useState<AnalysisObject | null>(null);

  // Initialize form with active object if exists
  useEffect(() => {
    if (activeObject && !selectedObject) {
      setSelectedObject(activeObject);
      setObjective(activeObject.objective || "");
      setContextField(activeObject.context || "");
      setHorizon(horizonReverseMap[activeObject.horizon]);
    }
  }, [activeObject, selectedObject]);

  // Handle object selection
  const handleSelectObject = (obj: AnalysisObject) => {
    setSelectedObject(obj);
    setObjective(obj.objective || "");
    setContextField(obj.context || "");
    setHorizon(horizonReverseMap[obj.horizon]);
    setMode("select");
  };

  // Create new object
  const handleCreateObject = async () => {
    if (!name.trim()) return;

    const newObject = await createObject({
      name: name.trim(),
      description: description.trim() || undefined,
      context: context.trim() || undefined,
      objective: objective.trim() || undefined,
      horizon: horizonMap[horizon],
      status: "active", // New objects become active immediately
    });

    if (newObject) {
      setSelectedObject(newObject);
      setMode("select");
      setName("");
      setDescription("");
    }
  };

  // Activate and proceed
  const handleProceed = async () => {
    if (!selectedObject) return;

    // Update object with current form values
    const updated = await updateObject(selectedObject.id, {
      objective: objective.trim() || undefined,
      context: context.trim() || undefined,
      horizon: horizonMap[horizon],
      status: "active",
    });

    if (updated) {
      // Set context for ARCHON
      setContext({
        objeto_em_analise: updated.name,
        objetivo_atual: updated.objective || "Não definido",
        horizonte: updated.horizon,
      });
      navigate("/council");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg animate-fade-in-slow">
          {/* Main Card */}
          <div className="archon-card-elevated p-8 md:p-10">
            {mode === "select" ? (
              <>
                {/* Object Selection / Active Object */}
                {selectedObject ? (
                  <>
                    {/* Selected Object Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center border border-pink-500/30">
                          <Instagram className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">{selectedObject.name}</h2>
                          {selectedObject.description && (
                            <p className="text-sm text-muted-foreground">{selectedObject.description}</p>
                          )}
                        </div>
                      </div>
                      {selectedObject.status === "active" && (
                        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30">
                          Ativo
                        </span>
                      )}
                    </div>

                    {/* Context Input */}
                    <div className="space-y-3 mb-6">
                      <label className="text-xs uppercase tracking-wider text-muted-foreground">
                        Contexto Atual
                      </label>
                      <textarea
                        value={context}
                        onChange={(e) => setContextField(e.target.value)}
                        placeholder="O que está a acontecer agora? (opcional)"
                        className="archon-input min-h-[80px] resize-none"
                        maxLength={2000}
                      />
                    </div>

                    {/* Objective Input */}
                    <div className="space-y-3 mb-6">
                      <label className="text-xs uppercase tracking-wider text-muted-foreground">
                        Objetivo Principal
                      </label>
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        placeholder="Ex: Aumentar vendas em 30%"
                        className="archon-input"
                        maxLength={500}
                      />
                    </div>

                    {/* Horizon Selection */}
                    <div className="space-y-3 mb-8">
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

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedObject(null)}
                        className="flex-1 archon-button flex items-center justify-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Trocar
                      </button>
                      <button
                        onClick={handleProceed}
                        className="flex-1 archon-button-solid flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Continuar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* No object selected - show list */}
                    <h2 className="text-lg font-semibold text-foreground mb-6">
                      Selecionar Objeto
                    </h2>

                    {objects.length > 0 ? (
                      <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                        {objects.filter(o => o.status !== "archived").map((obj) => (
                          <button
                            key={obj.id}
                            onClick={() => handleSelectObject(obj)}
                            className="w-full p-4 rounded-lg border border-border bg-secondary/30 hover:border-primary/50 transition-all text-left flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <Instagram className="w-5 h-5 text-pink-400" />
                              <div>
                                <p className="font-medium text-foreground">{obj.name}</p>
                                {obj.objective && (
                                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                    {obj.objective}
                                  </p>
                                )}
                              </div>
                            </div>
                            {obj.status === "active" && (
                              <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                                Ativo
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-6">
                        Nenhum objeto criado. Crie o primeiro.
                      </p>
                    )}

                    <button
                      onClick={() => setMode("create")}
                      className="w-full archon-button-solid flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Criar Novo Objeto
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Create Mode */}
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Novo Objeto de Análise
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Agenda Smart"
                      className="archon-input"
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: Instagram para barbearias"
                      className="archon-input"
                      maxLength={200}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Objetivo Inicial
                    </label>
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="Ex: Aumentar seguidores em 50%"
                      className="archon-input"
                      maxLength={500}
                    />
                  </div>
                </div>

                {/* Horizon Selection */}
                <div className="space-y-3 mb-8">
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

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setMode("select")}
                    className="flex-1 archon-button"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateObject}
                    disabled={!name.trim()}
                    className="flex-1 archon-button-solid disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Criar e Ativar
                  </button>
                </div>
              </>
            )}
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
