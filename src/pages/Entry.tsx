import { useNavigate } from "react-router-dom";

const Entry = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden noise-overlay">
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
          Decision Engine
        </p>

        {/* Tagline */}
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-12 animate-fade-in-slow animation-delay-400 leading-relaxed">
          Defina o objeto. O ARCHON fará o resto.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/object")}
          className="archon-button animate-fade-in-slow animation-delay-600"
        >
          Iniciar Sessão
        </button>
      </div>

      {/* Bottom indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-slow animation-delay-800">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-muted-foreground/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
      </div>
    </div>
  );
};

export default Entry;
