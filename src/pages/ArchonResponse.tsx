import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import ResponseBlock from "@/components/specialists/ResponseBlock";
import { useArchonContext } from "@/hooks/useArchonContext";

const ArchonResponse = () => {
  const navigate = useNavigate();
  const { response, context } = useArchonContext();

  // Redirect if no response
  if (!response || !context) {
    return (
      <AppLayout>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <AlertCircle className="w-8 h-8 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhuma análise disponível.</p>
          <button
            onClick={() => navigate("/council")}
            className="archon-button"
          >
            Iniciar Análise
          </button>
        </div>
      </AppLayout>
    );
  }

  const responses = [
    {
      type: "archon" as const,
      content: response.archon_sintese,
    },
    {
      type: "akira" as const,
      content: response.akira_estrategia,
    },
    {
      type: "maya" as const,
      content: response.maya_conteudo,
    },
    {
      type: "chen" as const,
      content: response.chen_dados,
    },
    {
      type: "yuki" as const,
      content: response.yuki_psicologia,
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-slow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Análise Completa
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Resposta do ARCHON
            </h1>
            <p className="text-xs text-muted-foreground/50 mt-2">
              {context.objeto_em_analise} • {context.objetivo_atual}
            </p>
          </div>

          <div className="space-y-6">
            {responses.map((resp, index) => (
              <div
                key={index}
                className="animate-fade-in-slow"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ResponseBlock
                  id={`response-${index}`}
                  type={resp.type}
                  content={resp.content}
                />
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-12 text-center animate-fade-in-slow animation-delay-800">
            <button
              onClick={() => navigate("/actions")}
              className="archon-button-solid"
            >
              Converter em Plano
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ArchonResponse;
