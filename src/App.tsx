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
import UserSpaceLayout from "./layouts/UserSpaceLayout";
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import Settings from "./pages/user/Settings";

import LayoutPresident from "./layouts/LayoutPresident";
import DashboardView from "./pages/president/DashboardView";
import Bureau from "./pages/president/Bureau";
import Conference from "./pages/president/Conference";
import Commissions from "./pages/president/Commissions";
import Plenary from "./pages/president/Plenary";
import Agenda from "./pages/president/Agenda";
import Documents from "./pages/president/Documents";
import PresidentSettings from "./pages/president/Settings";

// Deputy Space Imports
import LayoutDeputy from "./layouts/LayoutDeputy";
import DashboardDeputy from "./pages/deputy/DashboardDeputy";
import LegislativeTools from "./pages/deputy/LegislativeTools";
import ParliamentaryAgenda from "./pages/deputy/ParliamentaryAgenda";
import MandateManagement from "./pages/deputy/MandateManagement";

// Substitute Deputy Space Imports
import LayoutSubstitute from "./layouts/LayoutSubstitute";
import DashboardSubstitute from "./pages/substitute/DashboardSubstitute";
import LegislativeTracking from "./pages/substitute/LegislativeTracking";
import TrainingResources from "./pages/substitute/TrainingResources";
import TitularAgenda from "./pages/substitute/TitularAgenda";

// 1st VP Space Imports
import LayoutVP from "./layouts/LayoutVP";
import DashboardVP from "./pages/vp/DashboardVP";
import DelegationManagement from "./pages/vp/DelegationManagement";
import InterimMode from "./pages/vp/InterimMode";
import VPAgenda from "./pages/vp/VPAgenda";

// Questeur Space Imports
import LayoutQuesteur from "./layouts/LayoutQuesteur";
import DashboardQuesteur from "./pages/questeur/DashboardQuesteur";
import BudgetManagement from "./pages/questeur/BudgetManagement";
import MaterialResources from "./pages/questeur/MaterialResources";
import AdministrativeServices from "./pages/questeur/AdministrativeServices";
import Mailbox from "./pages/shared/Mailbox";
import SharedDocuments from "./pages/shared/Documents";
import UserSpacesHub from "./pages/UserSpacesHub";
import Actualites from "./pages/Actualites";
import Sensibilisation from "./pages/Sensibilisation";
import Tutoriels from "./pages/Tutoriels";
import Statistiques from "./pages/Statistiques";
import Login from "./pages/Login";

// Secretary Space Imports
import LayoutSecretary from "./layouts/LayoutSecretary";
import DashboardSecretary from "./pages/secretary/DashboardSecretary";
import SecretaryAgenda from "./pages/secretary/SecretaryAgenda";
import SecretaryDocuments from "./pages/secretary/SecretaryDocuments";

const queryClient = new QueryClient();

import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import IAstedFloatingButton from "@/components/iasted/IAstedFloatingButton";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <UserProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/legislation" element={<Legislation />} />
              <Route path="/legislation" element={<Legislation />} />
              {/* <Route path="/vote" element={<Vote />} />  Removed in favor of Deputy Space */}
              <Route path="/territoire" element={<Territoire />} />
              <Route path="/territoire" element={<Territoire />} />
              <Route path="/deputy" element={<DeputySpace />} />
              <Route path="/admin" element={<AdminSpace />} />
              <Route path="/citizen" element={<CitizenSpace />} />

              {/* User Space Routes */}
              <Route path="/user" element={<UserSpaceLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* President Space Route */}
              <Route path="/president" element={<LayoutPresident><DashboardView /></LayoutPresident>} />
              <Route path="/president/bureau" element={<LayoutPresident><Bureau /></LayoutPresident>} />
              <Route path="/president/conference" element={<LayoutPresident><Conference /></LayoutPresident>} />
              <Route path="/president/commissions" element={<LayoutPresident><Commissions /></LayoutPresident>} />
              <Route path="/president/plenary" element={<LayoutPresident><Plenary /></LayoutPresident>} />
              <Route path="/president/agenda" element={<LayoutPresident><Agenda /></LayoutPresident>} />
              <Route path="/president/documents" element={<LayoutPresident><Documents /></LayoutPresident>} />
              <Route path="/president/mail" element={<LayoutPresident><Mailbox /></LayoutPresident>} />
              <Route path="/president/settings" element={<LayoutPresident><PresidentSettings /></LayoutPresident>} />

              {/* Deputy Space Routes */}
              <Route path="/vote" element={<LayoutDeputy><DashboardDeputy /></LayoutDeputy>} />
              <Route path="/vote/tools" element={<LayoutDeputy><LegislativeTools /></LayoutDeputy>} />
              <Route path="/vote/agenda" element={<LayoutDeputy><ParliamentaryAgenda /></LayoutDeputy>} />
              <Route path="/vote/mandate" element={<LayoutDeputy><MandateManagement /></LayoutDeputy>} />
              <Route path="/vote/mail" element={<LayoutDeputy><Mailbox /></LayoutDeputy>} />
              <Route path="/vote/documents" element={<LayoutDeputy><SharedDocuments /></LayoutDeputy>} />
              <Route path="/vote/settings" element={<LayoutDeputy><PresidentSettings /></LayoutDeputy>} /> {/* Reusing Settings for now */}

              {/* Substitute Deputy Space Routes */}
              <Route path="/suppleant" element={<LayoutSubstitute><DashboardSubstitute /></LayoutSubstitute>} />
              <Route path="/suppleant/tracking" element={<LayoutSubstitute><LegislativeTracking /></LayoutSubstitute>} />
              <Route path="/suppleant/training" element={<LayoutSubstitute><TrainingResources /></LayoutSubstitute>} />
              <Route path="/suppleant/agenda" element={<LayoutSubstitute><TitularAgenda /></LayoutSubstitute>} />
              <Route path="/suppleant/mail" element={<LayoutSubstitute><Mailbox /></LayoutSubstitute>} />
              <Route path="/suppleant/documents" element={<LayoutSubstitute><SharedDocuments /></LayoutSubstitute>} />
              <Route path="/suppleant/settings" element={<LayoutSubstitute><PresidentSettings /></LayoutSubstitute>} />

              {/* 1st VP Space Routes */}
              <Route path="/vp" element={<LayoutVP><DashboardVP /></LayoutVP>} />
              <Route path="/vp/delegations" element={<LayoutVP><DelegationManagement /></LayoutVP>} />
              <Route path="/vp/interim" element={<LayoutVP><InterimMode /></LayoutVP>} />
              <Route path="/vp/agenda" element={<LayoutVP><VPAgenda /></LayoutVP>} />
              <Route path="/vp/mail" element={<LayoutVP><Mailbox /></LayoutVP>} />
              <Route path="/vp/documents" element={<LayoutVP><SharedDocuments /></LayoutVP>} />
              <Route path="/vp/settings" element={<LayoutVP><PresidentSettings /></LayoutVP>} />

              {/* Questeurs Space Routes */}
              <Route path="/questeurs" element={<LayoutQuesteur><DashboardQuesteur /></LayoutQuesteur>} />
              <Route path="/questeurs/budget" element={<LayoutQuesteur><BudgetManagement /></LayoutQuesteur>} />
              <Route path="/questeurs/ressources" element={<LayoutQuesteur><MaterialResources /></LayoutQuesteur>} />
              <Route path="/questeurs/services" element={<LayoutQuesteur><AdministrativeServices /></LayoutQuesteur>} />
              <Route path="/questeurs/mail" element={<LayoutQuesteur><Mailbox /></LayoutQuesteur>} />
              <Route path="/questeurs/documents" element={<LayoutQuesteur><SharedDocuments /></LayoutQuesteur>} />
              <Route path="/questeurs/settings" element={<LayoutQuesteur><PresidentSettings /></LayoutQuesteur>} />
              {/* Secretary Space Routes */}
              <Route path="/secretaires" element={<LayoutSecretary><DashboardSecretary /></LayoutSecretary>} />
              <Route path="/secretaires/agenda" element={<LayoutSecretary><SecretaryAgenda /></LayoutSecretary>} />
              <Route path="/secretaires/documents" element={<LayoutSecretary><SecretaryDocuments /></LayoutSecretary>} />
              <Route path="/secretaires/mail" element={<LayoutSecretary><Mailbox /></LayoutSecretary>} />
              <Route path="/secretaires/settings" element={<LayoutSecretary><PresidentSettings /></LayoutSecretary>} />

              {/* User Spaces Hub Portal */}
              <Route path="/portail" element={<UserSpacesHub />} />

              {/* Resource Pages */}
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/sensibilisation" element={<Sensibilisation />} />
              <Route path="/tutoriels" element={<Tutoriels />} />
              <Route path="/statistiques" element={<Statistiques />} />

              {/* Login */}
              <Route path="/login" element={<Login />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Bouton flottant iAsted disponible sur toutes les pages */}
            <IAstedFloatingButton />
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider >
);

export default App;
