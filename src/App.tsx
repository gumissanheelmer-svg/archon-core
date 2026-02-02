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
import ObjectAnalysis from "./pages/ObjectAnalysis";
import CouncilRoom from "./pages/CouncilRoom";
import ArchonResponse from "./pages/ArchonResponse";
import ActionPlan from "./pages/ActionPlan";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Profiles from "./pages/Profiles";
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
              {/* Public route - Login */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route path="/" element={<AuthGuard><Entry /></AuthGuard>} />
              <Route path="/object" element={<AuthGuard><ObjectAnalysis /></AuthGuard>} />
              <Route path="/council" element={<AuthGuard><CouncilRoom /></AuthGuard>} />
              <Route path="/response" element={<AuthGuard><ArchonResponse /></AuthGuard>} />
              <Route path="/actions" element={<AuthGuard><ActionPlan /></AuthGuard>} />
              <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
              <Route path="/history" element={<AuthGuard><History /></AuthGuard>} />
              <Route path="/profiles" element={<AuthGuard><Profiles /></AuthGuard>} />
              <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ArchonProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
