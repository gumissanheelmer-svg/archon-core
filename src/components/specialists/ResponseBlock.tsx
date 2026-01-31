import { Volume2, Loader2, Square } from "lucide-react";
import { SpecialistId, specialists } from "./SpecialistCard";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface ResponseBlockProps {
  id: string;
  type: "archon" | SpecialistId;
  content: string;
  details?: { label: string; value: string }[];
}

const ResponseBlock = ({ id, type, content, details }: ResponseBlockProps) => {
  const { speak, isPlaying, isLoading } = useTextToSpeech();
  
  const isArchon = type === "archon";
  const specialist = !isArchon ? specialists[type as SpecialistId] : null;
  const Icon = specialist?.icon;

  const blockClass = isArchon 
    ? "response-block-archon" 
    : `response-block response-block-${type}`;

  const handleSpeak = () => {
    const fullText = details 
      ? `${content}. ${details.map(d => `${d.label}: ${d.value}`).join(". ")}`
      : content;
    speak(fullText, type, id);
  };

  const isCurrentlyPlaying = isPlaying === id;
  const isCurrentlyLoading = isLoading === id;

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
        
        <button 
          onClick={handleSpeak}
          disabled={isCurrentlyLoading}
          className={`p-2 transition-colors duration-300 ${
            isCurrentlyPlaying 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          } ${isCurrentlyLoading ? "opacity-50 cursor-wait" : ""}`}
        >
          {isCurrentlyLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isCurrentlyPlaying ? (
            <Square className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
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
