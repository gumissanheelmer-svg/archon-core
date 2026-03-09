import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, Filter, Globe, Zap, ArrowRight, Target, Search, Beaker, PenTool, Link2, Brain, BarChart3, MessageCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import AppLayout from "@/components/layout/AppLayout";

const Dashboard = () => {
  const navigate = useNavigate();

  const conversionData = [
    { day: "Seg", leads: 12, conversions: 2 },
    { day: "Ter", leads: 18, conversions: 3 },
    { day: "Qua", leads: 15, conversions: 2 },
    { day: "Qui", leads: 22, conversions: 4 },
    { day: "Sex", leads: 28, conversions: 5 },
    { day: "Sáb", leads: 25, conversions: 4 },
    { day: "Dom", leads: 20, conversions: 3 },
  ];

  const channelData = [
    { name: "Google Maps", value: 35, color: "hsl(210, 100%, 55%)" },
    { name: "Instagram", value: 28, color: "hsl(320, 80%, 50%)" },
    { name: "TikTok", value: 20, color: "hsl(160, 70%, 45%)" },
    { name: "Facebook", value: 12, color: "hsl(280, 70%, 55%)" },
    { name: "WhatsApp", value: 5, color: "hsl(40, 90%, 50%)" },
  ];

  const metrics = [
    { label: "Barbearias Descobertas", value: "347", change: "+42", icon: Search },
    { label: "Leads Ativos", value: "89", change: "+18", icon: Users },
    { label: "Taxa de Conversão", value: "4.2%", change: "+0.8%", icon: Target },
    { label: "Pipeline de Receita", value: "€12.4K", change: "+31%", icon: TrendingUp },
  ];

  const aiRecommendations = [
    {
      module: "DESCOBERTA",
      priority: "high",
      message: "23 barbearias no Porto sem agendamento online detetadas. Lançar campanha de outreach no Google Maps.",
      action: "Descobrir Leads",
      path: "/lead-discovery",
    },
    {
      module: "VENDAS",
      priority: "high",
      message: "5 leads quentes não receberam follow-up em 48h. Use o Assistente de Vendas para criar mensagens de fecho.",
      action: "Assistente de Vendas",
      path: "/sales-conversion",
    },
    {
      module: "CONTEÚDO",
      priority: "medium",
      message: "Conteúdo de barbearias no TikTok está em tendência. Gerar scripts virais focados em transformações.",
      action: "Motor de Conteúdo",
      path: "/content-engine",
    },
    {
      module: "EXPERIÊNCIA",
      priority: "medium",
      message: "Funil WhatsApp tem 8.2% de conversão. Executar experiência dobrando a frequência de broadcast.",
      action: "Experiências",
      path: "/growth-experiments",
    },
    {
      module: "AUDITORIA",
      priority: "low",
      message: "CTA do site Agenda Smart está abaixo do fold. Movê-lo para cima para estimativa de +25% conversão.",
      action: "Auditoria de Website",
      path: "/website-audit",
    },
  ];

  const modules = [
    { label: "Descoberta de Leads", icon: Search, path: "/lead-discovery", desc: "Procurar barbearias" },
    { label: "Assistente de Vendas", icon: MessageCircle, path: "/sales-conversion", desc: "Fechar negócios" },
    { label: "Motor de Conteúdo", icon: PenTool, path: "/content-engine", desc: "Ideias de conteúdo viral" },
    { label: "Funis de Vendas", icon: Filter, path: "/funnels", desc: "Funis multi-plataforma" },
    { label: "Auditoria de Website", icon: Globe, path: "/website-audit", desc: "Análise de conversão" },
    { label: "Experiências", icon: Beaker, path: "/growth-experiments", desc: "Testar & aprender" },
    { label: "Conexões", icon: Link2, path: "/connections", desc: "Ligações de plataformas" },
    { label: "Insights", icon: BarChart3, path: "/insights", desc: "Dados de performance" },
  ];

  const priorityColors: Record<string, string> = {
    high: "bg-destructive/20 text-destructive",
    medium: "bg-primary/20 text-primary",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-in-slow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Diretor de Crescimento IA
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Agenda Smart — Centro de Comando
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Motor de crescimento autónomo para aquisição de clientes barbearias
            </p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className="archon-card-elevated p-5 animate-fade-in-slow"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-semibold font-mono text-foreground">{m.value}</span>
                    <span className="text-xs font-mono text-primary">{m.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 archon-card-elevated p-6 animate-fade-in-slow animation-delay-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Pipeline de Aquisição de Leads</h3>
                  <p className="text-xs text-muted-foreground">Leads descobertos vs convertidos — 7 dias</p>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conversionData}>
                    <defs>
                      <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(210, 100%, 55%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(210, 100%, 55%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(240, 8%, 10%)", border: "1px solid hsl(240, 6%, 16%)", borderRadius: "8px", color: "hsl(220, 15%, 85%)" }} />
                    <Area type="monotone" dataKey="leads" stroke="hsl(210, 100%, 55%)" strokeWidth={2} fill="url(#leadGrad)" dot={false} name="Leads" />
                    <Area type="monotone" dataKey="conversions" stroke="hsl(160, 70%, 45%)" strokeWidth={2} fill="url(#convGrad)" dot={false} name="Conversões" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="archon-card-elevated p-6 animate-fade-in-slow animation-delay-300">
              <h3 className="text-sm font-medium text-foreground mb-1">Canais de Descoberta</h3>
              <p className="text-xs text-muted-foreground mb-4">Distribuição de fontes de leads</p>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={channelData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                      {channelData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {channelData.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-muted-foreground">{c.name}</span>
                    </div>
                    <span className="font-mono text-foreground">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="mb-8 animate-fade-in-slow animation-delay-400">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Recomendações Estratégicas da IA
            </h2>
            <div className="space-y-3">
              {aiRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="archon-card p-4 flex items-start gap-4 group cursor-pointer hover:border-primary/30 transition-all duration-300"
                  onClick={() => navigate(rec.path)}
                >
                  <div className="flex-shrink-0 mt-0.5 flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded ${priorityColors[rec.priority]}`}>
                      {rec.module}
                    </span>
                  </div>
                  <p className="text-sm text-foreground flex-1 leading-relaxed">{rec.message}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Modules Grid */}
          <div className="animate-fade-in-slow animation-delay-500">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Módulos de Crescimento
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modules.map((m, i) => {
                const Icon = m.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(m.path)}
                    className="archon-card p-4 text-left hover:border-primary/30 hover:bg-secondary/30 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                    <span className="text-sm text-foreground block">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
