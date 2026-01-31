import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="h-full px-6 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
            ARCHON
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </div>
        
        <div className="w-9" /> {/* Spacer for balance */}
      </div>
    </header>
  );
};

export default Header;
