import { useNavigate, useLocation } from "react-router-dom";
import { X, LayoutDashboard, Rocket, Filter, Users, PenTool, Globe, Link2, Zap, Brain, BarChart3, Search, Beaker, MessageCircle } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { path: "/lead-discovery", label: "Descoberta de Leads", icon: Search },
  { path: "/lead-intelligence", label: "Inteligência de Leads", icon: Users },
  { path: "/sales-conversion", label: "Assistente de Vendas", icon: MessageCircle },
  { path: "/funnels", label: "Funis de Vendas", icon: Filter },
  { path: "/content-engine", label: "Motor de Conteúdo", icon: PenTool },
  { path: "/website-audit", label: "Auditoria de Website", icon: Globe },
  { path: "/growth-experiments", label: "Experiências de Crescimento", icon: Beaker },
  { path: "/growth-strategy", label: "Estratégia de Crescimento", icon: Rocket },
  { path: "/connections", label: "Conexões", icon: Link2 },
  { path: "/automation", label: "Automação", icon: Zap },
  { path: "/memory", label: "Memória", icon: Brain },
  { path: "/insights", label: "Insights", icon: BarChart3 },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border 
                    transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground font-medium">
              ARCHON — Diretor de Crescimento
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="py-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 8rem)" }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full menu-item ${isActive ? "menu-item-active" : ""}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="text-xs text-muted-foreground/40 uppercase tracking-wider">
            Growth Director AI v4.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
