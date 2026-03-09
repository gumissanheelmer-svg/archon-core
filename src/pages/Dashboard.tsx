import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, Filter, Globe, Zap, ArrowRight, Target, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import AppLayout from "@/components/layout/AppLayout";

const Dashboard = () => {
  const navigate = useNavigate();

  const conversionData = [
    { day: "Seg", value: 2.1 },
    { day: "Ter", value: 2.4 },
    { day: "Qua", value: 2.2 },
    { day: "Qui", value: 2.8 },
    { day: "Sex", value: 3.1 },
    { day: "Sáb", value: 3.4 },
    { day: "Dom", value: 3.2 },
  ];

  const leadsData = [
    { day: "Seg", value: 12 },
    { day: "Ter", value: 18 },
    { day: "Qua", value: 15 },
    { day: "Qui", value: 22 },
    { day: "Sex", value: 28 },
    { day: "Sáb", value: 25 },
    { day: "Dom", value: 20 },
  ];

  const metrics = [
    { label: "Leads Este Mês", value: "142", change: "+23%", up: true },
    { label: "Taxa de Conversão", value: "3.2%", change: "+18%", up: true },
    { label: "Custo por Lead", value: "€2.40", change: "-12%", up: true },
    { label: "Revenue Pipeline", value: "€6.8K", change: "+31%", up: true },
  ];

  const aiRecommendations = [
    {
      module: "GROWTH",
      message: "Horário das 19h tem 40% mais engajamento no Instagram. Agende posts para esse horário.",
      action: "Content Engine",
      path: "/content-engine",
    },
    {
      module: "FUNNELS",
      message: "O funil WhatsApp tem a maior taxa de conversão (8.2%). Duplique o investimento.",
      action: "Sales Funnels",
      path: "/funnels",
    },
    {
      module: "AUDIT",
      message: "CTA principal do site está abaixo da fold. Mova para o topo para +25% conversão.",
      action: "Website Audit",
      path: "/website-audit",
    },
    {
      module: "LEADS",
      message: "3 leads quentes não receberam follow-up há 48h. Feche antes que esfriem.",
      action: "Lead Intelligence",
      path: "/lead-intelligence",
    },
  ];

  const quickActions = [
    { label: "Growth Strategy", icon: TrendingUp, path: "/growth-strategy" },
    { label: "Sales Funnels", icon: Filter, path: "/funnels" },
    { label: "Lead Intelligence", icon: Users, path: "/lead-intelligence" },
    { label: "Website Audit", icon: Globe, path: "/website-audit" },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-in-slow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Command Center
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Growth Dashboard
            </h1>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="archon-card-elevated p-5 animate-fade-in-slow"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{m.label}</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-semibold font-mono text-foreground">{m.value}</span>
                  <span className={`text-xs font-mono ${m.up ? "text-primary" : "text-destructive"}`}>
                    {m.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="archon-card-elevated p-6 animate-fade-in-slow animation-delay-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Taxa de Conversão</h3>
                  <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-mono">+18%</span>
                </div>
              </div>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conversionData}>
                    <defs>
                      <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(210, 100%, 55%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(210, 100%, 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 11 }} domain={[0, 5]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(240, 8%, 10%)", border: "1px solid hsl(240, 6%, 16%)", borderRadius: "8px", color: "hsl(220, 15%, 85%)" }}
                      formatter={(value: number) => [`${value}%`, "Conversão"]}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(210, 100%, 55%)" strokeWidth={2} fill="url(#convGrad)" dot={false} activeDot={{ r: 4, fill: "hsl(210, 100%, 55%)" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="archon-card-elevated p-6 animate-fade-in-slow animation-delay-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Leads Capturados</h3>
                  <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-mono">140</span>
                </div>
              </div>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={leadsData}>
                    <defs>
                      <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(240, 8%, 10%)", border: "1px solid hsl(240, 6%, 16%)", borderRadius: "8px", color: "hsl(220, 15%, 85%)" }}
                      formatter={(value: number) => [value, "Leads"]}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(160, 70%, 45%)" strokeWidth={2} fill="url(#leadGrad)" dot={false} activeDot={{ r: 4, fill: "hsl(160, 70%, 45%)" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="mb-8 animate-fade-in-slow animation-delay-400">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              AI Recommendations
            </h2>
            <div className="space-y-3">
              {aiRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="archon-card p-4 flex items-start gap-4 group cursor-pointer hover:border-primary/30 transition-all duration-300"
                  onClick={() => navigate(rec.path)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                      {rec.module}
                    </span>
                  </div>
                  <p className="text-sm text-foreground flex-1 leading-relaxed">{rec.message}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="animate-fade-in-slow animation-delay-500">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((qa, i) => {
                const Icon = qa.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(qa.path)}
                    className="archon-card p-4 text-left hover:border-primary/30 hover:bg-secondary/30 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                    <span className="text-sm text-foreground">{qa.label}</span>
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
