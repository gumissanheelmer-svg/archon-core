import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ArchonProvider } from "@/hooks/useArchonContext";
import AuthGuard from "@/components/auth/AuthGuard";
import Login from "./pages/Login";
import Entry from "./pages/Entry";
import Dashboard from "./pages/Dashboard";
import GrowthStrategy from "./pages/GrowthStrategy";
import Funnels from "./pages/Funnels";
import LeadIntelligence from "./pages/LeadIntelligence";
import ContentEngine from "./pages/ContentEngine";
import WebsiteAudit from "./pages/WebsiteAudit";
import Connections from "./pages/Connections";
import Automation from "./pages/Automation";
import Memory from "./pages/Memory";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ArchonProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={<AuthGuard><Entry /></AuthGuard>} />
              <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
              <Route path="/growth-strategy" element={<AuthGuard><GrowthStrategy /></AuthGuard>} />
              <Route path="/funnels" element={<AuthGuard><Funnels /></AuthGuard>} />
              <Route path="/lead-intelligence" element={<AuthGuard><LeadIntelligence /></AuthGuard>} />
              <Route path="/content-engine" element={<AuthGuard><ContentEngine /></AuthGuard>} />
              <Route path="/website-audit" element={<AuthGuard><WebsiteAudit /></AuthGuard>} />
              <Route path="/connections" element={<AuthGuard><Connections /></AuthGuard>} />
              <Route path="/automation" element={<AuthGuard><Automation /></AuthGuard>} />
              <Route path="/memory" element={<AuthGuard><Memory /></AuthGuard>} />
              <Route path="/insights" element={<AuthGuard><Insights /></AuthGuard>} />
              <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ArchonProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
