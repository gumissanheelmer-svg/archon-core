import { BarChart3, TrendingUp, TrendingDown, Target, Lightbulb } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import AppLayout from "@/components/layout/AppLayout";

const Insights = () => {
  const channelData = [
    { name: "Instagram", leads: 52, conversion: 3.8 },
    { name: "TikTok", leads: 38, conversion: 2.1 },
    { name: "WhatsApp", leads: 28, conversion: 8.2 },
    { name: "Google", leads: 18, conversion: 5.4 },
    { name: "Facebook", leads: 6, conversion: 1.2 },
  ];

  const funnelData = [
    { name: "Visitas", value: 4200 },
    { name: "Leads", value: 142 },
    { name: "Qualificados", value: 68 },
    { name: "Propostas", value: 32 },
    { name: "Clientes", value: 14 },
  ];

  const pieData = [
    { name: "Instagram", value: 37, color: "hsl(210, 100%, 55%)" },
    { name: "TikTok", value: 27, color: "hsl(320, 80%, 50%)" },
    { name: "WhatsApp", value: 20, color: "hsl(160, 70%, 45%)" },
    { name: "Google", value: 12, color: "hsl(280, 70%, 55%)" },
    { name: "Facebook", value: 4, color: "hsl(220, 10%, 40%)" },
  ];

  const insights = [
    { type: "positive", text: "WhatsApp tem a maior taxa de conversão (8.2%). Invista mais neste canal." },
    { type: "positive", text: "Horário das 19h gera 40% mais engagement no Instagram." },
    { type: "negative", text: "Facebook tem ROI negativo. Considere pausar ou realocar orçamento." },
    { type: "positive", text: "Conteúdo em formato carrossel tem 3x mais saves que posts simples." },
    { type: "negative", text: "Taxa de resposta a leads caiu 15% esta semana. Verifique o follow-up." },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20 max-w-5xl mx-auto">
        <div className="mb-10 animate-fade-in-slow">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Analytics</p>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary" />
            Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Análise de performance por canal, funil e padrões de crescimento.
          </p>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="archon-card-elevated p-6 animate-fade-in-slow animation-delay-200">
            <h3 className="text-sm font-medium text-foreground mb-1">Leads por Canal</h3>
            <p className="text-xs text-muted-foreground mb-4">Últimos 30 dias</p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(240, 8%, 10%)", border: "1px solid hsl(240, 6%, 16%)", borderRadius: "8px", color: "hsl(220, 15%, 85%)" }}
                  />
                  <Bar dataKey="leads" fill="hsl(210, 100%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="archon-card-elevated p-6 animate-fade-in-slow animation-delay-300">
            <h3 className="text-sm font-medium text-foreground mb-1">Distribuição de Leads</h3>
            <p className="text-xs text-muted-foreground mb-4">Por fonte</p>
            <div className="h-[220px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(240, 8%, 10%)", border: "1px solid hsl(240, 6%, 16%)", borderRadius: "8px", color: "hsl(220, 15%, 85%)" }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel */}
        <div className="archon-card-elevated p-6 mb-8 animate-fade-in-slow animation-delay-400">
          <h3 className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Funil de Conversão
          </h3>
          <p className="text-xs text-muted-foreground mb-6">Pipeline atual</p>
          <div className="flex items-end justify-between gap-2">
            {funnelData.map((stage, i) => {
              const maxVal = funnelData[0].value;
              const height = Math.max(20, (stage.value / maxVal) * 140);
              return (
                <div key={i} className="flex-1 text-center">
                  <p className="text-sm font-mono text-foreground mb-2">{stage.value.toLocaleString()}</p>
                  <div
                    className="mx-auto rounded-t-md bg-primary/20 border border-primary/30 transition-all duration-500"
                    style={{ height: `${height}px`, width: "100%", maxWidth: "80px" }}
                  />
                  <p className="text-xs text-muted-foreground mt-2">{stage.name}</p>
                  {i < funnelData.length - 1 && (
                    <p className="text-[10px] text-primary font-mono mt-1">
                      {((funnelData[i + 1].value / stage.value) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="animate-fade-in-slow animation-delay-500">
          <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-primary" /> AI Insights
          </h3>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className="archon-card p-4 flex items-start gap-3">
                {ins.type === "positive" ? (
                  <TrendingUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-foreground">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Insights;
