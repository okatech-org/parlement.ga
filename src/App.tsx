import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Legislation from "./pages/Legislation";
import Vote from "./pages/Vote";
import Territoire from "./pages/Territoire";
import DeputySpace from "./pages/deputy/DeputySpace";
import AdminSpace from "./pages/admin/AdminSpace";
import CitizenSpace from "./pages/citizen/CitizenSpace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/legislation" element={<Legislation />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/territoire" element={<Territoire />} />
          <Route path="/deputy" element={<DeputySpace />} />
          <Route path="/admin" element={<AdminSpace />} />
          <Route path="/citizen" element={<CitizenSpace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
