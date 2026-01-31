import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ResponseBlock from "@/components/specialists/ResponseBlock";

const ArchonResponse = () => {
  const navigate = useNavigate();

  const responses = [
    {
      type: "archon" as const,
      content: "O foco deve ser aquisição direta. Ignore crescimento vazio. Concentre energia em conversões reais, não em métricas de vaidade.",
    },
    {
      type: "akira" as const,
      content: "A estratégia atual dispersa recursos. Recomendo foco absoluto em um único canal de aquisição durante os próximos 30 dias.",
      details: [
        { label: "Direção", value: "Canal único de alta conversão" },
        { label: "Prioridade", value: "Stories com CTA direto" },
        { label: "Ignorar", value: "Crescimento orgânico passivo" },
      ],
    },
    {
      type: "maya" as const,
      content: "O conteúdo precisa de urgência controlada. Menos posts educativos, mais prova social e escassez real.",
      details: [
        { label: "Ideias", value: "Cases de sucesso em vídeo curto" },
        { label: "Formato", value: "Stories sequenciais com swipe-up" },
        { label: "Ângulo", value: "Transformação antes/depois" },
      ],
    },
    {
      type: "chen" as const,
      content: "Os dados mostram taxa de conversão de 2.3%. Meta: 4.5% em 30 dias. Isso requer otimização do funil de entrada.",
      details: [
        { label: "Medir", value: "CTR dos stories, tempo no link" },
        { label: "Teste", value: "A/B em CTAs: urgência vs. benefício" },
      ],
    },
    {
      type: "yuki" as const,
      content: "O público está em estado de comparação. Precisam sentir que estão a perder algo, não a ganhar algo.",
      details: [
        { label: "Gatilho", value: "FOMO + prova social" },
        { label: "Linguagem", value: "Direta, sem jargão" },
        { label: "Emoção", value: "Urgência controlada" },
      ],
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
          </div>

          {/* Response Blocks */}
          <div className="space-y-6">
            {responses.map((response, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ResponseBlock
                  type={response.type}
                  content={response.content}
                  details={response.details}
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
