import { Menu, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="h-full px-6 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-foreground font-medium">
            ARCHON
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
            Growth
          </span>
        </div>
        
        <button
          onClick={() => navigate("/settings")}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
