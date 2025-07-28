import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoramaHome from "./pages/DoramaHome";
import DoramaView from "./pages/DoramaView";
import PlanoPagamento from "./pages/PlanoPagamento";
import Auth from "./pages/Auth";
import DoramaAdmin from "./pages/DoramaAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DoramaHome />} />
          <Route path="/dorama/:encodedId" element={<DoramaView />} />
          <Route path="/plano" element={<PlanoPagamento />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<DoramaAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
