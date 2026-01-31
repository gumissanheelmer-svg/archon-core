import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Routes>
          <Route path="/" element={<Entry />} />
          <Route path="/object" element={<ObjectAnalysis />} />
          <Route path="/council" element={<CouncilRoom />} />
          <Route path="/response" element={<ArchonResponse />} />
          <Route path="/actions" element={<ActionPlan />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
