import { Bell, Volume2, Moon, Globe } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const Settings = () => {
  const settings = [
    {
      icon: Bell,
      label: "Notificações",
      description: "Alertas do ARCHON",
      enabled: true,
    },
    {
      icon: Volume2,
      label: "Áudio",
      description: "Respostas em voz",
      enabled: false,
    },
    {
      icon: Moon,
      label: "Modo Escuro",
      description: "Sempre ativo",
      enabled: true,
      locked: true,
    },
    {
      icon: Globe,
      label: "Idioma",
      description: "Português",
      type: "select",
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-in-slow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Configurações
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Preferências
            </h1>
          </div>

          {/* Settings List */}
          <div className="space-y-3">
            {settings.map((setting, index) => {
              const Icon = setting.icon;
              
              return (
                <div
                  key={setting.label}
                  className="archon-card p-4 flex items-center justify-between animate-fade-in-slow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{setting.label}</h3>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>

                  {setting.type === "select" ? (
                    <button className="text-xs text-primary uppercase tracking-wider">
                      Alterar
                    </button>
                  ) : (
                    <button
                      className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${
                        setting.enabled ? "bg-primary" : "bg-secondary"
                      } ${setting.locked ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={setting.locked}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                          setting.enabled ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Version */}
          <div className="mt-12 text-center animate-fade-in-slow animation-delay-500">
            <p className="text-xs text-muted-foreground/50">
              ARCHON Decision Engine v1.0.0
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
