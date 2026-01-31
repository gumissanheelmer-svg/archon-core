import { useState, ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

const AppLayout = ({ children, showHeader = true }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative noise-overlay">
      {showHeader && <Header onMenuClick={() => setSidebarOpen(true)} />}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className={showHeader ? "pt-16" : ""}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
