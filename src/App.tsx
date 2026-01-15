import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { NotFound } from "@/pages/NotFound";
import { ProfilePage } from "@/pages/Profile";
import { ServicesPage } from "@/pages/Services";
import { FacilitiesPage } from "@/pages/Facilities";
import { CityAlertsPage } from "@/pages/CityAlerts";
import { JoinSquadPage } from "@/pages/JoinSquad";

const queryClient = new QueryClient();

import { ErrorBoundary } from "@/components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/complaints" element={<Index />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/city-alerts" element={<CityAlertsPage />} />
            <Route path="/join-squad" element={<JoinSquadPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
