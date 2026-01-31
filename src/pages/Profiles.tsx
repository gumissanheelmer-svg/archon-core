import AppLayout from "@/components/layout/AppLayout";
import SpecialistCard from "@/components/specialists/SpecialistCard";

const Profiles = () => {
  const specialists = [
    {
      id: "akira" as const,
      fullDescription: "AKIRA é o estrategista-chefe. Analisa padrões macro, define prioridades e identifica o que deve ser ignorado. Foco em direção clara e simplicidade tática.",
    },
    {
      id: "maya" as const,
      fullDescription: "MAYA domina a criação de conteúdo. Sugere formatos, ângulos e ideias que convertem. Especialista em transformar estratégia em peças comunicativas.",
    },
    {
      id: "chen" as const,
      fullDescription: "CHEN trabalha com dados. Define o que medir, sugere testes e interpreta resultados. Transforma números em decisões.",
    },
    {
      id: "yuki" as const,
      fullDescription: "YUKI entende a psicologia do público. Identifica gatilhos emocionais, linguagem adequada e o estado mental do target.",
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-in-slow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Perfis
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Os Especialistas
            </h1>
          </div>

          {/* Specialists Grid */}
          <div className="space-y-4">
            {specialists.map((specialist, index) => (
              <div
                key={specialist.id}
                className="archon-card p-6 animate-fade-in-slow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-full md:w-48 flex-shrink-0">
                    <SpecialistCard id={specialist.id} status="ready" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {specialist.fullDescription}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profiles;
