import { Zap, Clock, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const Automation = () => {
  const workflows = [
    {
      name: "Lead Follow-up Automático",
      description: "Envia mensagem de follow-up 24h após primeiro contacto sem resposta.",
      status: "active",
      lastRun: "Há 2 horas",
      runs: 47,
    },
    {
      name: "Relatório Semanal de Growth",
      description: "Gera relatório com métricas de conversão, leads e engagement toda segunda-feira.",
      status: "active",
      lastRun: "Há 3 dias",
      runs: 12,
    },
    {
      name: "Website Score Check",
      description: "Auditoria automática do site Agenda Smart a cada 7 dias.",
      status: "paused",
      lastRun: "Há 14 dias",
      runs: 6,
    },
    {
      name: "Gerador de Calendário de Conteúdo",
      description: "Gera calendário de conteúdo semanal baseado nas métricas de engagement.",
      status: "active",
      lastRun: "Há 1 dia",
      runs: 8,
    },
    {
      name: "Lead Scoring Update",
      description: "Atualiza a pontuação de leads com base nas interações recentes.",
      status: "active",
      lastRun: "Há 6 horas",
      runs: 156,
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
        <div className="mb-10 animate-fade-in-slow">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Automação</p>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            Automação
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Workflows automatizados que executam tarefas de crescimento em segundo plano.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-slow animation-delay-200">
          <div className="archon-card-elevated p-4 text-center">
            <p className="text-2xl font-semibold font-mono text-foreground">4</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Ativos</p>
          </div>
          <div className="archon-card-elevated p-4 text-center">
            <p className="text-2xl font-semibold font-mono text-foreground">229</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Execuções</p>
          </div>
          <div className="archon-card-elevated p-4 text-center">
            <p className="text-2xl font-semibold font-mono text-primary">98%</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Sucesso</p>
          </div>
        </div>

        {/* Workflows */}
        <div className="space-y-3 animate-fade-in-slow animation-delay-300">
          {workflows.map((wf, i) => (
            <div key={i} className="archon-card p-5 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${wf.status === "active" ? "bg-primary" : "bg-muted-foreground/40"}`} />
                  <h3 className="text-sm font-medium text-foreground">{wf.name}</h3>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  wf.status === "active" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  {wf.status === "active" ? "Ativo" : "Pausado"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 ml-5">{wf.description}</p>
              <div className="flex items-center gap-4 ml-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {wf.lastRun}</span>
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {wf.runs} execuções</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 archon-card p-6 text-center animate-fade-in-slow animation-delay-400">
          <Zap className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-1">Mais automações em breve.</p>
          <p className="text-xs text-muted-foreground/60">O ARCHON aprende com cada ciclo e sugere novas automações.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Automation;
