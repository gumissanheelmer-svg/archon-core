import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, X } from "lucide-react";
import ConversationList from "@/components/history/ConversationList";

const Entry = () => {
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden noise-overlay">
      {/* Conversation History Panel */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-80 bg-card border-r border-border
                    transition-transform duration-500 ease-out flex flex-col
                    ${historyOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:relative lg:translate-x-0 lg:z-0`}
      >
        <div className="h-14 px-5 flex items-center justify-between border-b border-border shrink-0">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Conversas
          </span>
          <button
            onClick={() => setHistoryOpen(false)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
          <ConversationList />
        </div>
        <div className="px-5 py-3 border-t border-border shrink-0">
          <button
            onClick={() => navigate("/history")}
            className="w-full text-xs text-muted-foreground/60 hover:text-primary transition-colors text-center py-1.5"
          >
            Ver todo o histórico →
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden
                    ${historyOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setHistoryOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* History toggle button (mobile) */}
        <button
          onClick={() => setHistoryOpen(true)}
          className="absolute top-5 left-5 p-2.5 rounded-lg bg-secondary/80 border border-border/50 
                     text-muted-foreground hover:text-foreground hover:border-primary/30 
                     transition-all duration-300 lg:hidden z-20"
        >
          <History className="w-4 h-4" />
        </button>

        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="relative z-10 text-center px-6">
          {/* Main title */}
          <h1 className="archon-title mb-4 animate-fade-in-slow">
            ARCHON
          </h1>
          
          {/* Subtitle */}
          <p className="archon-subtitle mb-16 animate-fade-in-slow animation-delay-200">
            O seu conselho estratégico de elite
          </p>

          {/* Tagline */}
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-12 animate-fade-in-slow animation-delay-400 leading-relaxed">
            Cada decisão certa começa com a pergunta certa. O ARCHON analisa, sintetiza e entrega clareza.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/object")}
            className="archon-button animate-fade-in-slow animation-delay-600"
          >
            Começar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Entry;
