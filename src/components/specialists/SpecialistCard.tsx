import { Brain, Palette, BarChart3, Heart } from "lucide-react";

export type SpecialistId = "akira" | "maya" | "chen" | "yuki";
export type SpecialistStatus = "idle" | "thinking" | "ready";

interface SpecialistCardProps {
  id: SpecialistId;
  status?: SpecialistStatus;
  compact?: boolean;
}

const specialists = {
  akira: {
    name: "AKIRA",
    specialty: "Estratégia",
    icon: Brain,
    colorClass: "specialist-akira",
  },
  maya: {
    name: "MAYA",
    specialty: "Conteúdo",
    icon: Palette,
    colorClass: "specialist-maya",
  },
  chen: {
    name: "CHEN",
    specialty: "Dados",
    icon: BarChart3,
    colorClass: "specialist-chen",
  },
  yuki: {
    name: "YUKI",
    specialty: "Psicologia",
    icon: Heart,
    colorClass: "specialist-yuki",
  },
};

const SpecialistCard = ({ id, status = "idle", compact = false }: SpecialistCardProps) => {
  const specialist = specialists[id];
  const Icon = specialist.icon;

  const statusClass = status === "thinking" ? "status-thinking" : status === "ready" ? "status-ready" : "status-idle";

  if (compact) {
    return (
      <div
        className={`specialist-card ${specialist.colorClass} flex items-center gap-3`}
        data-status={status}
      >
        <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium text-foreground">{specialist.name}</div>
          <div className="text-xs text-muted-foreground">{specialist.specialty}</div>
        </div>
        <div className={`status-dot ${statusClass}`} />
      </div>
    );
  }

  return (
    <div
      className={`specialist-card ${specialist.colorClass}`}
      data-status={status}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className={`status-dot ${statusClass}`} />
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-semibold tracking-wide text-foreground">
          {specialist.name}
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          {specialist.specialty}
        </div>
      </div>
    </div>
  );
};

export default SpecialistCard;
export { specialists };
