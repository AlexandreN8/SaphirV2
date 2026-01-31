import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { useTrafficTracker } from '@/hooks/useTrafficTracker'; 


// Pages Publiques
import Index from "./pages/Index";
import Tarifs from "./pages/Tarifs";
import Realisations from "./pages/Realisations";
import Reservation from "./pages/Reservation";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";
import MentionsLegales from "./pages/MentionsLegales";
import CGV from "@/pages/CGV";

// Composants Admin & Auth
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import Dashboard from "@/pages/admin/Dashboard";
import Login from "@/pages/admin/Login";

const queryClient = new QueryClient();

// --- LE COMPOSANT MOUCHARD ---
const TrafficObserver = () => {
  useTrafficTracker();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TrafficObserver />
          <ScrollToTop />
          
          <Routes>
            {/* --- ZONE PUBLIQUE (SITE VITRINE) --- */}
            <Route element={<Layout />}>
               <Route path="/" element={<Index />} />
               <Route path="/tarifs" element={<Tarifs />} />
               <Route path="/realisations" element={<Realisations />} />
               <Route path="/reservation" element={<Reservation />} />
               <Route path="/contact" element={<Contact />} />
               <Route path="mentions-legales" element={<MentionsLegales />} />
                <Route path="cgv" element={<CGV />} />
            </Route>

            {/* --- ZONE ADMIN (LOGIN) --- */}
            <Route path="/admin/login" element={<Login />} />

            {/* --- ZONE ADMIN SÉCURISÉE (DASHBOARD) --- */}
            <Route element={<ProtectedRoute />}>
               <Route path="/admin/dashboard" element={<Dashboard />} />
            </Route>

            {/* --- 404 --- */}
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;