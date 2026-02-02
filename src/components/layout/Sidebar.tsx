import { useNavigate, useLocation } from "react-router-dom";
import { X, Users, Target, LayoutDashboard, ListChecks, History, UserCircle, Settings, Brain } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: "/council", label: "Sala do Conselho", icon: Users },
  { path: "/object", label: "Objeto em Análise", icon: Target },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/actions", label: "Planos & Ações", icon: ListChecks },
  { path: "/history", label: "Histórico", icon: History },
  { path: "/memory", label: "Memória Estratégica", icon: Brain },
  { path: "/profiles", label: "Perfis", icon: UserCircle },
  { path: "/settings", label: "Configurações", icon: Settings },
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
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border 
                    transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-sidebar-border">
          <span className="text-sm uppercase tracking-[0.2em] text-sidebar-foreground font-medium">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="py-4">
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
          <div className="text-xs text-muted-foreground/50 uppercase tracking-wider">
            Decision Engine v1.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
