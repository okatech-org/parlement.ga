import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
import IAstedAnalytics from "./pages/iasted/IAstedAnalytics";
import IAstedAdminFeedback from "./pages/iasted/IAstedAdminFeedback";
import ProtocolDemoPage from "./pages/iasted/ProtocolDemoPage";

// Secretary Space Imports
import LayoutSecretary from "./layouts/LayoutSecretary";
import DashboardSecretary from "./pages/secretary/DashboardSecretary";
import SecretaryAgenda from "./pages/secretary/SecretaryAgenda";
import SecretaryDocuments from "./pages/secretary/SecretaryDocuments";

const queryClient = new QueryClient();

import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { InstitutionProvider } from "@/contexts/InstitutionContext";
import IAstedFloatingButton from "@/components/iasted/IAstedFloatingButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Institution Layouts
import { AssemblyLayout, SenateLayout, ParliamentLayout } from "@/layouts/institutions";

// Institution Pages
import AssemblyHome from "@/pages/assembly/AssemblyHome";
import SenateHome from "@/pages/senate/SenateHome";
import ParliamentHome from "@/pages/parliament/ParliamentHome";
import CMPWorkspace from "@/pages/parliament/CMPWorkspace";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <UserProvider>
            <InstitutionProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/legislation" element={<Legislation />} />
                {/* <Route path="/vote" element={<Vote />} />  Removed in favor of Deputy Space */}
                <Route path="/territoire" element={<Territoire />} />
                <Route path="/deputy" element={<DeputySpace />} />
                <Route path="/admin" element={<AdminSpace />} />
                <Route path="/citizen" element={<CitizenSpace />} />

                {/* ========================================= */}
                {/* ROUTES INSTITUTIONNELLES - Parlement.ga  */}
                {/* ========================================= */}

                {/* Assemblée Nationale - Base: /an */}
                <Route path="/an" element={<AssemblyLayout />}>
                  <Route index element={<AssemblyHome />} />
                  <Route path="hemicycle" element={<AssemblyHome />} />
                  <Route path="deputes" element={<AssemblyHome />} />
                  <Route path="travaux" element={<AssemblyHome />} />
                  <Route path="agenda" element={<AssemblyHome />} />
                  <Route path="commissions" element={<AssemblyHome />} />
                  <Route path="votes" element={<AssemblyHome />} />
                  <Route path="textes/:textId" element={<AssemblyHome />} />
                </Route>

                {/* Sénat - Base: /senat */}
                <Route path="/senat" element={<SenateLayout />}>
                  <Route index element={<SenateHome />} />
                  <Route path="palais" element={<SenateHome />} />
                  <Route path="senateurs" element={<SenateHome />} />
                  <Route path="travaux" element={<SenateHome />} />
                  <Route path="agenda" element={<SenateHome />} />
                  <Route path="commissions" element={<SenateHome />} />
                  <Route path="collectivites" element={<SenateHome />} />
                  <Route path="textes/:textId" element={<SenateHome />} />
                </Route>

                {/* Congrès (Parlement réuni) - Base: /congres */}
                <Route path="/congres" element={<ParliamentLayout />}>
                  <Route index element={<ParliamentHome />} />
                  <Route path="cmp" element={<ParliamentHome />} />
                  <Route path="cmp/:cmpId" element={<CMPWorkspace />} />
                  <Route path="sessions" element={<ParliamentHome />} />
                  <Route path="archives" element={<ParliamentHome />} />
                  <Route path="textes" element={<ParliamentHome />} />
                  <Route path="navette" element={<ParliamentHome />} />
                  <Route path="decisions" element={<ParliamentHome />} />
                  <Route path="services" element={<ParliamentHome />} />
                  <Route path="constitution" element={<ParliamentHome />} />
                </Route>

                {/* ========================================= */}
                {/* ROUTES EXISTANTES (Legacy)               */}
                {/* ========================================= */}

                {/* User Space Routes - Protected */}
                <Route path="/user" element={<ProtectedRoute><UserSpaceLayout /></ProtectedRoute>}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* President Space Route - Protected */}
                <Route path="/president" element={<ProtectedRoute><LayoutPresident><DashboardView /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/bureau" element={<ProtectedRoute><LayoutPresident><Bureau /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/conference" element={<ProtectedRoute><LayoutPresident><Conference /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/commissions" element={<ProtectedRoute><LayoutPresident><Commissions /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/plenary" element={<ProtectedRoute><LayoutPresident><Plenary /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/agenda" element={<ProtectedRoute><LayoutPresident><Agenda /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/documents" element={<ProtectedRoute><LayoutPresident><Documents /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/mail" element={<ProtectedRoute><LayoutPresident><Mailbox /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/settings" element={<ProtectedRoute><LayoutPresident><PresidentSettings /></LayoutPresident></ProtectedRoute>} />

                {/* Deputy Space Routes - Protected */}
                <Route path="/vote" element={<ProtectedRoute><LayoutDeputy><DashboardDeputy /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/tools" element={<ProtectedRoute><LayoutDeputy><LegislativeTools /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/agenda" element={<ProtectedRoute><LayoutDeputy><ParliamentaryAgenda /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/mandate" element={<ProtectedRoute><LayoutDeputy><MandateManagement /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/mail" element={<ProtectedRoute><LayoutDeputy><Mailbox /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/documents" element={<ProtectedRoute><LayoutDeputy><SharedDocuments /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/settings" element={<ProtectedRoute><LayoutDeputy><PresidentSettings /></LayoutDeputy></ProtectedRoute>} />

                {/* Substitute Deputy Space Routes - Protected */}
                <Route path="/suppleant" element={<ProtectedRoute><LayoutSubstitute><DashboardSubstitute /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/tracking" element={<ProtectedRoute><LayoutSubstitute><LegislativeTracking /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/training" element={<ProtectedRoute><LayoutSubstitute><TrainingResources /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/agenda" element={<ProtectedRoute><LayoutSubstitute><TitularAgenda /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/mail" element={<ProtectedRoute><LayoutSubstitute><Mailbox /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/documents" element={<ProtectedRoute><LayoutSubstitute><SharedDocuments /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/settings" element={<ProtectedRoute><LayoutSubstitute><PresidentSettings /></LayoutSubstitute></ProtectedRoute>} />

                {/* 1st VP Space Routes - Protected */}
                <Route path="/vp" element={<ProtectedRoute><LayoutVP><DashboardVP /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/delegations" element={<ProtectedRoute><LayoutVP><DelegationManagement /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/interim" element={<ProtectedRoute><LayoutVP><InterimMode /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/agenda" element={<ProtectedRoute><LayoutVP><VPAgenda /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/mail" element={<ProtectedRoute><LayoutVP><Mailbox /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/documents" element={<ProtectedRoute><LayoutVP><SharedDocuments /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/settings" element={<ProtectedRoute><LayoutVP><PresidentSettings /></LayoutVP></ProtectedRoute>} />

                {/* Questeurs Space Routes - Protected */}
                <Route path="/questeurs" element={<ProtectedRoute><LayoutQuesteur><DashboardQuesteur /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/budget" element={<ProtectedRoute><LayoutQuesteur><BudgetManagement /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/ressources" element={<ProtectedRoute><LayoutQuesteur><MaterialResources /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/services" element={<ProtectedRoute><LayoutQuesteur><AdministrativeServices /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/mail" element={<ProtectedRoute><LayoutQuesteur><Mailbox /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/documents" element={<ProtectedRoute><LayoutQuesteur><SharedDocuments /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/settings" element={<ProtectedRoute><LayoutQuesteur><PresidentSettings /></LayoutQuesteur></ProtectedRoute>} />

                {/* Secretary Space Routes - Protected */}
                <Route path="/secretaires" element={<ProtectedRoute><LayoutSecretary><DashboardSecretary /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/secretaires/agenda" element={<ProtectedRoute><LayoutSecretary><SecretaryAgenda /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/secretaires/documents" element={<ProtectedRoute><LayoutSecretary><SecretaryDocuments /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/secretaires/mail" element={<ProtectedRoute><LayoutSecretary><Mailbox /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/secretaires/settings" element={<ProtectedRoute><LayoutSecretary><PresidentSettings /></LayoutSecretary></ProtectedRoute>} />

                {/* User Spaces Hub Portal - Protected */}
                <Route path="/portail" element={<ProtectedRoute><UserSpacesHub /></ProtectedRoute>} />

                {/* Resource Pages */}
                <Route path="/actualites" element={<Actualites />} />
                <Route path="/sensibilisation" element={<Sensibilisation />} />
                <Route path="/tutoriels" element={<Tutoriels />} />
                <Route path="/statistiques" element={<Statistiques />} />
                <Route path="/iasted/analytics" element={<ProtectedRoute><IAstedAnalytics /></ProtectedRoute>} />
                <Route path="/iasted/admin-feedback" element={<ProtectedRoute><IAstedAdminFeedback /></ProtectedRoute>} />
                <Route path="/iasted/protocol-demo" element={<ProtocolDemoPage />} />

                {/* Login */}
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<Auth />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Bouton flottant iAsted disponible sur toutes les pages */}
              <IAstedFloatingButton />
            </InstitutionProvider>
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider >
);

export default App;
