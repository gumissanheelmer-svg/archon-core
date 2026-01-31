import { Volume2 } from "lucide-react";
import { SpecialistId, specialists } from "./SpecialistCard";

interface ResponseBlockProps {
  type: "archon" | SpecialistId;
  content: string;
  details?: { label: string; value: string }[];
}

const ResponseBlock = ({ type, content, details }: ResponseBlockProps) => {
  const isArchon = type === "archon";
  const specialist = !isArchon ? specialists[type as SpecialistId] : null;
  const Icon = specialist?.icon;

  const blockClass = isArchon 
    ? "response-block-archon" 
    : `response-block response-block-${type}`;

  return (
    <div className={`${blockClass} animate-fade-in-slow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {isArchon ? (
            <div className="text-lg">🔱</div>
          ) : Icon ? (
            <Icon className="w-4 h-4 text-muted-foreground" />
          ) : null}
          <div>
            <span className="text-sm font-semibold tracking-wide">
              {isArchon ? "ARCHON" : specialist?.name}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              — {isArchon ? "Síntese" : specialist?.specialty}
            </span>
          </div>
        </div>
        
        {!isArchon && (
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-300">
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-foreground/90 leading-relaxed mb-4">
        {content}
      </p>

      {details && details.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-border">
          {details.map((detail, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider min-w-[80px]">
                {detail.label}:
              </span>
              <span className="text-sm text-foreground/80">
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponseBlock;
