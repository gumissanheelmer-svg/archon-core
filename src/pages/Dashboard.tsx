import { TrendingUp, AlertTriangle, Lightbulb, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import AppLayout from "@/components/layout/AppLayout";

const Dashboard = () => {
  // Sample data for the chart
  const chartData = [
    { day: "Seg", value: 2.1 },
    { day: "Ter", value: 2.4 },
    { day: "Qua", value: 2.2 },
    { day: "Qui", value: 2.8 },
    { day: "Sex", value: 3.1 },
    { day: "Sáb", value: 3.4 },
    { day: "Dom", value: 3.2 },
  ];

  const alerts = [
    {
      source: "ARCHON",
      icon: AlertTriangle,
      message: "Taxa de conversão abaixo do esperado. Ação recomendada.",
      type: "warning",
    },
    {
      source: "AKIRA",
      icon: Lightbulb,
      message: "Oportunidade identificada: horário das 19h tem 40% mais engajamento.",
      type: "info",
    },
    {
      source: "CHEN",
      icon: Activity,
      message: "Teste A/B concluído. Variante B venceu com 12% mais cliques.",
      type: "success",
    },
  ];

  const statusColor = "bg-yellow-500"; // 🟡 status

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Header with Status */}
          <div className="flex items-center justify-between mb-10 animate-fade-in-slow">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                Dashboard
              </p>
              <h1 className="text-2xl font-semibold text-foreground">
                Visão Geral
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Chart - Takes 2 columns */}
            <div className="md:col-span-2 archon-card-elevated p-6 animate-fade-in-slow animation-delay-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Taxa de Conversão</h3>
                  <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-mono">+18%</span>
                </div>
              </div>
              
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }}
                      domain={[0, 5]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(240, 8%, 10%)",
                        border: "1px solid hsl(240, 6%, 16%)",
                        borderRadius: "8px",
                        color: "hsl(220, 15%, 85%)",
                      }}
                      formatter={(value: number) => [`${value}%`, "Conversão"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(210, 100%, 55%)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: "hsl(210, 100%, 55%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats Card */}
            <div className="archon-card-elevated p-6 animate-fade-in-slow animation-delay-300">
              <h3 className="text-sm font-medium text-foreground mb-4">Métricas Chave</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-xs text-muted-foreground">CTR Stories</span>
                  <span className="text-sm font-mono text-foreground">4.2%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-xs text-muted-foreground">Leads/dia</span>
                  <span className="text-sm font-mono text-foreground">23</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-xs text-muted-foreground">Custo/Lead</span>
                  <span className="text-sm font-mono text-foreground">€2.40</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-muted-foreground">Conversão</span>
                  <span className="text-sm font-mono text-primary">3.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="mt-6 space-y-3">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              const iconColor = 
                alert.type === "warning" ? "text-yellow-400" :
                alert.type === "success" ? "text-green-400" : "text-primary";
              
              return (
                <div
                  key={index}
                  className="archon-card p-4 flex items-start gap-4 animate-fade-in-slow"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${iconColor}`} />
                  <div className="flex-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {alert.source}
                    </span>
                    <p className="text-sm text-foreground mt-1">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
