import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import IBoitePage from "./pages/shared/IBoitePage";
import SharedDocumentsPage from "./pages/shared/SharedDocumentsPage";
import SharedAgendaPage from "./pages/shared/SharedAgendaPage";
import ICorrespondancePage from "./pages/shared/ICorrespondancePage";
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
import { InstitutionProvider } from "@/contexts/InstitutionContext";

import { ProtectedRoute } from "@/components/ProtectedRoute";

// Institution Layouts
import { AssemblyLayout, SenateLayout, ParliamentLayout } from "@/layouts/institutions";

// Institution Pages (Dashboard internes)
import AssemblyHome from "@/pages/assembly/AssemblyHome";
import AssemblyProcessPage from "@/pages/assembly/AssemblyProcessPage";
import AssemblyDemo from "@/pages/assembly/AssemblyDemo";
import SenateHome from "@/pages/senate/SenateHome";
import ParliamentHome from "@/pages/parliament/ParliamentHome";
import CMPWorkspace from "@/pages/parliament/CMPWorkspace";

// Public Pages (Pages d'accueil publiques)
import PortalRepublic from "@/pages/public/PortalRepublic";
import HomeAssembly from "@/pages/public/HomeAssembly";
import HomeSenate from "@/pages/public/HomeSenate";
import HomeParliament from "@/pages/public/HomeParliament";
import ResultatsElectoraux from "@/pages/public/ResultatsElectoraux";
import ProfilsElus from "@/pages/public/ProfilsElus";
import AnalyseStatistique from "@/pages/public/AnalyseStatistique";
import AnnuaireElus from "@/pages/public/AnnuaireElus";
import ProtocolHub from "@/pages/public/demo/ProtocolHub";

// Senate specific pages
import SenateDashboard from "@/pages/senate/senator/SenateDashboard";
import SenatorSpace from "@/pages/senate/senator/SenatorSpace";
import PresidentSenateSpace from "@/pages/senate/president/PresidentSenateSpace";
import VPSenateSpace from "@/pages/senate/vp/VPSenateSpace";
import QuesteurSenateSpace from "@/pages/senate/questeur/QuesteurSenateSpace";
import SenateDemo from "@/pages/senate/SenateDemo";
import GrievanceManagement from "@/pages/senate/GrievanceManagement";
import FieldVisitsPage from "@/pages/senate/FieldVisitsPage";
import SenateProcessPage from "@/pages/senate/SenateProcessPage";
import SenateActualites from "@/pages/senate/SenateActualites";
import SenateSensibilisation from "@/pages/senate/SenateSensibilisation";
import SenateTutoriels from "@/pages/senate/SenateTutoriels";

// Parliament/Congress specific pages
import CongressDashboard from "@/pages/parliament/CongressDashboard";
import ParliamentSpace from "@/pages/parliament/ParliamentSpace";
import ParliamentDemo from "@/pages/parliament/ParliamentDemo";
import CongressVote from "@/pages/parliament/CongressVote";
import NationalArchives from "@/pages/public/NationalArchives";
import ProcessComparison from "@/pages/parliament/ProcessComparison";
import CitizenPage from "@/pages/public/CitizenPage";
import LegislativeQuiz from "@/pages/public/LegislativeQuiz";
import SystemAdminLogin from "@/pages/admin/SystemAdminLogin";
import SystemAdminDashboard from "@/pages/admin/SystemAdminDashboard";
import InstitutionAdminDashboard from "@/pages/admin/InstitutionAdminDashboard";
import CongressPresidentDashboard from "@/pages/parliament/president/CongressPresidentDashboard";
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import LayoutCitizen from "@/layouts/LayoutCitizen";

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
                {/* ========================================= */}
                {/* PARLEMENT - HUB CENTRAL (/)               */}
                {/* Point d'entrée et navigation vers AN/Sénat */}
                {/* ========================================= */}
                <Route path="/" element={<HomeParliament />} />
                <Route path="/parlement" element={<HomeParliament />} />
                <Route path="/cmp" element={<HomeParliament />} />
                <Route path="/archives" element={<NationalArchives />} />
                <Route path="/processus-comparaison" element={<ProcessComparison />} />

                {/* Pages publiques interactives */}
                <Route path="/citoyen" element={<CitizenPage />} />
                <Route path="/quiz" element={<LegislativeQuiz />} />
                <Route path="/parlement/citoyen" element={<CitizenPage />} />
                <Route path="/parlement/quiz" element={<LegislativeQuiz />} />

                {/* ========================================= */}
                {/* ASSEMBLÉE NATIONALE - /an/*              */}
                {/* Thème VERT - Design existant intégré     */}
                {/* ========================================= */}

                {/* Page d'accueil AN - Utilise Index.tsx existant (design parfait) */}
                <Route path="/an" element={<Index />} />

                {/* Pages publiques AN */}
                <Route path="/an/actualites" element={<Actualites />} />
                <Route path="/an/sensibilisation" element={<Sensibilisation />} />
                <Route path="/an/tutoriels" element={<Tutoriels />} />
                <Route path="/an/statistiques" element={<Statistiques />} />
                <Route path="/an/legislation" element={<Legislation />} />
                <Route path="/an/territoire" element={<Territoire />} />
                <Route path="/an/vote" element={<Vote />} />
                <Route path="/an/demo" element={<AssemblyDemo />} />
                <Route path="/an/processus" element={<AssemblyProcessPage />} />
                <Route path="/an/login" element={<Login />} />

                {/* ========================================= */}
                {/* PAGES PUBLIQUES ÉLECTORALES               */}
                {/* Accessibles depuis tous les environnements */}
                {/* ========================================= */}
                <Route path="/elections/resultats" element={<ResultatsElectoraux />} />
                <Route path="/elections/profils" element={<ProfilsElus />} />
                <Route path="/elections/statistiques" element={<AnalyseStatistique />} />
                <Route path="/annuaire" element={<AnnuaireElus />} />
                <Route path="/parlement/annuaire" element={<AnnuaireElus />} />



                {/* Portail des espaces utilisateurs AN */}
                <Route path="/an/portail" element={<ProtectedRoute><UserSpacesHub /></ProtectedRoute>} />

                {/* ========================================= */}
                {/* ESPACES PROTÉGÉS AN - Président          */}
                {/* ========================================= */}
                <Route path="/an/espace/president" element={<ProtectedRoute><LayoutPresident><DashboardView /></LayoutPresident></ProtectedRoute>} />
                <Route path="/an/espace/president/bureau" element={<ProtectedRoute><LayoutPresident><Bureau /></LayoutPresident></ProtectedRoute>} />
                <Route path="/an/espace/president/conference" element={<ProtectedRoute><LayoutPresident><Conference /></LayoutPresident></ProtectedRoute>} />
                <Route path="/an/espace/president/commissions" element={<ProtectedRoute><LayoutPresident><Commissions /></LayoutPresident></ProtectedRoute>} />
                <Route path="/an/espace/president/plenary" element={<ProtectedRoute><LayoutPresident><Plenary /></LayoutPresident></ProtectedRoute>} />
                <Route path="/an/espace/president/agenda" element={<ProtectedRoute><LayoutPresident><Agenda /></LayoutPresident></ProtectedRoute>} />
                <Route path="/an/espace/president/documents" element={<ProtectedRoute><LayoutPresident><Documents /></LayoutPresident></ProtectedRoute>} />
                <Route path="/an/espace/president/mail" element={<ProtectedRoute><LayoutPresident><IBoitePage /></LayoutPresident></ProtectedRoute>} />
                <Route path="/an/espace/president/correspondance" element={<ProtectedRoute><LayoutPresident><ICorrespondancePage /></LayoutPresident></ProtectedRoute>} />
                <Route path="/an/espace/president/settings" element={<ProtectedRoute><LayoutPresident><PresidentSettings /></LayoutPresident></ProtectedRoute>} />

                {/* ========================================= */}
                {/* ESPACES PROTÉGÉS AN - Députés            */}
                {/* ========================================= */}
                <Route path="/an/espace/deputes" element={<ProtectedRoute><LayoutDeputy><DashboardDeputy /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/an/espace/deputes/tools" element={<ProtectedRoute><LayoutDeputy><LegislativeTools /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/an/espace/deputes/agenda" element={<ProtectedRoute><LayoutDeputy><ParliamentaryAgenda /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/an/espace/deputes/mandate" element={<ProtectedRoute><LayoutDeputy><MandateManagement /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/an/espace/deputes/mail" element={<ProtectedRoute><LayoutDeputy><IBoitePage /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/an/espace/deputes/documents" element={<ProtectedRoute><LayoutDeputy><SharedDocumentsPage /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/an/espace/deputes/correspondance" element={<ProtectedRoute><LayoutDeputy><ICorrespondancePage /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/an/espace/deputes/settings" element={<ProtectedRoute><LayoutDeputy><PresidentSettings /></LayoutDeputy></ProtectedRoute>} />

                {/* ========================================= */}
                {/* ESPACES PROTÉGÉS AN - Vice-Présidents    */}
                {/* ========================================= */}
                <Route path="/an/espace/vp" element={<ProtectedRoute><LayoutVP><DashboardVP /></LayoutVP></ProtectedRoute>} />
                <Route path="/an/espace/vp/delegations" element={<ProtectedRoute><LayoutVP><DelegationManagement /></LayoutVP></ProtectedRoute>} />
                <Route path="/an/espace/vp/interim" element={<ProtectedRoute><LayoutVP><InterimMode /></LayoutVP></ProtectedRoute>} />
                <Route path="/an/espace/vp/agenda" element={<ProtectedRoute><LayoutVP><VPAgenda /></LayoutVP></ProtectedRoute>} />
                <Route path="/an/espace/vp/mail" element={<ProtectedRoute><LayoutVP><IBoitePage /></LayoutVP></ProtectedRoute>} />
                <Route path="/an/espace/vp/documents" element={<ProtectedRoute><LayoutVP><SharedDocumentsPage /></LayoutVP></ProtectedRoute>} />
                <Route path="/an/espace/vp/correspondance" element={<ProtectedRoute><LayoutVP><ICorrespondancePage /></LayoutVP></ProtectedRoute>} />
                <Route path="/an/espace/vp/settings" element={<ProtectedRoute><LayoutVP><PresidentSettings /></LayoutVP></ProtectedRoute>} />

                {/* ========================================= */}
                {/* ESPACES PROTÉGÉS AN - Questeurs          */}
                {/* ========================================= */}
                <Route path="/an/espace/questeurs" element={<ProtectedRoute><LayoutQuesteur><DashboardQuesteur /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/an/espace/questeurs/budget" element={<ProtectedRoute><LayoutQuesteur><BudgetManagement /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/an/espace/questeurs/ressources" element={<ProtectedRoute><LayoutQuesteur><MaterialResources /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/an/espace/questeurs/services" element={<ProtectedRoute><LayoutQuesteur><AdministrativeServices /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/an/espace/questeurs/mail" element={<ProtectedRoute><LayoutQuesteur><IBoitePage /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/an/espace/questeurs/documents" element={<ProtectedRoute><LayoutQuesteur><SharedDocumentsPage /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/an/espace/questeurs/correspondance" element={<ProtectedRoute><LayoutQuesteur><ICorrespondancePage /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/an/espace/questeurs/settings" element={<ProtectedRoute><LayoutQuesteur><PresidentSettings /></LayoutQuesteur></ProtectedRoute>} />

                {/* ========================================= */}
                {/* ESPACES PROTÉGÉS AN - Secrétaires        */}
                {/* ========================================= */}
                <Route path="/an/espace/secretaires" element={<ProtectedRoute><LayoutSecretary><DashboardSecretary /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/an/espace/secretaires/agenda" element={<ProtectedRoute><LayoutSecretary><SecretaryAgenda /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/an/espace/secretaires/documents" element={<ProtectedRoute><LayoutSecretary><SecretaryDocuments /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/an/espace/secretaires/mail" element={<ProtectedRoute><LayoutSecretary><IBoitePage /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/an/espace/secretaires/correspondance" element={<ProtectedRoute><LayoutSecretary><ICorrespondancePage /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/an/espace/secretaires/settings" element={<ProtectedRoute><LayoutSecretary><PresidentSettings /></LayoutSecretary></ProtectedRoute>} />

                {/* ========================================= */}
                {/* ESPACES PROTÉGÉS AN - Suppléants         */}
                {/* ========================================= */}
                <Route path="/an/espace/suppleants" element={<ProtectedRoute><LayoutSubstitute><DashboardSubstitute /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/an/espace/suppleants/tracking" element={<ProtectedRoute><LayoutSubstitute><LegislativeTracking /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/an/espace/suppleants/training" element={<ProtectedRoute><LayoutSubstitute><TrainingResources /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/an/espace/suppleants/agenda" element={<ProtectedRoute><LayoutSubstitute><TitularAgenda /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/an/espace/suppleants/mail" element={<ProtectedRoute><LayoutSubstitute><Mailbox /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/an/espace/suppleants/documents" element={<ProtectedRoute><LayoutSubstitute><SharedDocumentsPage /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/an/espace/suppleants/correspondance" element={<ProtectedRoute><LayoutSubstitute><ICorrespondancePage /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/an/espace/suppleants/settings" element={<ProtectedRoute><LayoutSubstitute><PresidentSettings /></LayoutSubstitute></ProtectedRoute>} />

                {/* ========================================= */}
                {/* ESPACES PROTÉGÉS AN - User               */}
                {/* ========================================= */}
                <Route path="/an/espace/user" element={<ProtectedRoute><UserSpaceLayout /></ProtectedRoute>}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* ========================================= */}
                {/* ESPACE CITOYEN UNIVERSEL                 */}
                {/* Même espace accessible depuis toutes les institutions */}
                {/* ========================================= */}
                <Route path="/espace/citoyen" element={<ProtectedRoute><LayoutCitizen><CitizenDashboard /></LayoutCitizen></ProtectedRoute>} />
                <Route path="/espace/citoyen/*" element={<ProtectedRoute><LayoutCitizen><CitizenDashboard /></LayoutCitizen></ProtectedRoute>} />
                {/* Alias pour accès depuis AN */}
                <Route path="/an/espace/citoyen" element={<ProtectedRoute><LayoutCitizen><CitizenDashboard /></LayoutCitizen></ProtectedRoute>} />
                <Route path="/an/espace/citoyen/*" element={<ProtectedRoute><LayoutCitizen><CitizenDashboard /></LayoutCitizen></ProtectedRoute>} />

                {/* ========================================= */}
                {/* SÉNAT - /senat/*                         */}
                {/* Représentation des collectivités locales */}
                {/* ========================================= */}

                {/* Page d'accueil publique Sénat */}
                <Route path="/senat" element={<HomeSenate />} />
                <Route path="/senat/actualites" element={<SenateActualites />} />
                <Route path="/senat/sensibilisation" element={<SenateSensibilisation />} />
                <Route path="/senat/tutoriels" element={<SenateTutoriels />} />
                <Route path="/senat/demo" element={<SenateDemo />} />
                <Route path="/senat/processus" element={<SenateProcessPage />} />
                <Route path="/senat/login" element={<Login />} />

                {/* Espace Sénateur (avec menu latéral comme AN) */}
                <Route path="/senat/espace" element={<SenatorSpace />} />
                <Route path="/senat/espace/senateur" element={<SenatorSpace />} />

                {/* Espace Président du Sénat */}
                <Route path="/senat/espace/president" element={<PresidentSenateSpace />} />

                {/* Espace Vice-Président du Sénat */}
                <Route path="/senat/espace/vp" element={<VPSenateSpace />} />

                {/* Espace Questeur du Sénat */}
                <Route path="/senat/espace/questeur" element={<QuesteurSenateSpace />} />

                {/* Autres pages Sénat */}
                <Route path="/senat/senateurs" element={<HomeSenate />} />
                <Route path="/senat/travaux" element={<HomeSenate />} />
                <Route path="/senat/collectivites" element={<HomeSenate />} />
                <Route path="/senat/provinces" element={<HomeSenate />} />

                {/* Alias Espace Citoyen depuis Sénat */}
                <Route path="/senat/espace/citoyen" element={<ProtectedRoute><LayoutCitizen><CitizenDashboard /></LayoutCitizen></ProtectedRoute>} />
                <Route path="/senat/espace/citoyen/*" element={<ProtectedRoute><LayoutCitizen><CitizenDashboard /></LayoutCitizen></ProtectedRoute>} />

                {/* ========================================= */}
                {/* CONGRÈS / PARLEMENT - Espace Souverain   */}
                {/* Instance de convergence bicamérale       */}
                {/* ========================================= */}

                {/* Routes publiques du Parlement */}
                <Route path="/congres" element={<HomeParliament />} />
                <Route path="/parlement/archives" element={<NationalArchives />} />
                <Route path="/congres/archives" element={<NationalArchives />} />
                <Route path="/congres/demo" element={<ParliamentDemo />} />
                <Route path="/parlement/demo" element={<ParliamentDemo />} />
                <Route path="/congres/login" element={<Login />} />

                {/* Espace Congrès (avec menu latéral comme AN) */}
                <Route path="/parlement/espace" element={<ParliamentSpace />} />
                <Route path="/congres/espace" element={<ParliamentSpace />} />
                <Route path="/parlement/dashboard" element={<ParliamentSpace />} />
                <Route path="/congres/dashboard" element={<ParliamentSpace />} />

                {/* Espace Président du Congrès */}
                <Route path="/congres/espace/president" element={<ProtectedRoute><CongressPresidentDashboard /></ProtectedRoute>} />

                {/* CMP - War Room */}
                <Route path="/parlement/cmp" element={<ParliamentSpace />} />
                <Route path="/parlement/cmp/:cmpId" element={<CMPWorkspace />} />
                <Route path="/congres/cmp/:cmpId" element={<CMPWorkspace />} />

                {/* Vote du Congrès */}
                <Route path="/parlement/vote" element={<CongressVote />} />
                <Route path="/parlement/vote/:sessionId" element={<CongressVote />} />
                <Route path="/congres/vote/:sessionId" element={<CongressVote />} />

                {/* Sessions et historique */}
                <Route path="/parlement/sessions" element={<ParliamentSpace />} />
                <Route path="/congres/sessions" element={<ParliamentSpace />} />

                {/* ========================================= */}
                {/* ROUTES LEGACY (rétrocompatibilité)       */}
                {/* Redirection vers nouvelles routes AN     */}
                {/* ========================================= */}

                {/* President Space Legacy - Redirect to AN */}
                <Route path="/president" element={<ProtectedRoute><LayoutPresident><DashboardView /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/bureau" element={<ProtectedRoute><LayoutPresident><Bureau /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/conference" element={<ProtectedRoute><LayoutPresident><Conference /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/commissions" element={<ProtectedRoute><LayoutPresident><Commissions /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/plenary" element={<ProtectedRoute><LayoutPresident><Plenary /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/agenda" element={<ProtectedRoute><LayoutPresident><Agenda /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/documents" element={<ProtectedRoute><LayoutPresident><Documents /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/mail" element={<ProtectedRoute><LayoutPresident><Mailbox /></LayoutPresident></ProtectedRoute>} />
                <Route path="/president/settings" element={<ProtectedRoute><LayoutPresident><PresidentSettings /></LayoutPresident></ProtectedRoute>} />

                {/* Deputy Space Legacy */}
                <Route path="/vote" element={<ProtectedRoute><LayoutDeputy><DashboardDeputy /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/tools" element={<ProtectedRoute><LayoutDeputy><LegislativeTools /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/agenda" element={<ProtectedRoute><LayoutDeputy><ParliamentaryAgenda /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/mandate" element={<ProtectedRoute><LayoutDeputy><MandateManagement /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/mail" element={<ProtectedRoute><LayoutDeputy><Mailbox /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/documents" element={<ProtectedRoute><LayoutDeputy><SharedDocumentsPage /></LayoutDeputy></ProtectedRoute>} />
                <Route path="/vote/settings" element={<ProtectedRoute><LayoutDeputy><PresidentSettings /></LayoutDeputy></ProtectedRoute>} />

                {/* Substitute Legacy */}
                <Route path="/suppleant" element={<ProtectedRoute><LayoutSubstitute><DashboardSubstitute /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/tracking" element={<ProtectedRoute><LayoutSubstitute><LegislativeTracking /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/training" element={<ProtectedRoute><LayoutSubstitute><TrainingResources /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/agenda" element={<ProtectedRoute><LayoutSubstitute><TitularAgenda /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/mail" element={<ProtectedRoute><LayoutSubstitute><Mailbox /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/documents" element={<ProtectedRoute><LayoutSubstitute><SharedDocumentsPage /></LayoutSubstitute></ProtectedRoute>} />
                <Route path="/suppleant/settings" element={<ProtectedRoute><LayoutSubstitute><PresidentSettings /></LayoutSubstitute></ProtectedRoute>} />

                {/* VP Legacy */}
                <Route path="/vp" element={<ProtectedRoute><LayoutVP><DashboardVP /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/delegations" element={<ProtectedRoute><LayoutVP><DelegationManagement /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/interim" element={<ProtectedRoute><LayoutVP><InterimMode /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/agenda" element={<ProtectedRoute><LayoutVP><VPAgenda /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/mail" element={<ProtectedRoute><LayoutVP><Mailbox /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/documents" element={<ProtectedRoute><LayoutVP><SharedDocumentsPage /></LayoutVP></ProtectedRoute>} />
                <Route path="/vp/settings" element={<ProtectedRoute><LayoutVP><PresidentSettings /></LayoutVP></ProtectedRoute>} />

                {/* Questeurs Legacy */}
                <Route path="/questeurs" element={<ProtectedRoute><LayoutQuesteur><DashboardQuesteur /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/budget" element={<ProtectedRoute><LayoutQuesteur><BudgetManagement /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/ressources" element={<ProtectedRoute><LayoutQuesteur><MaterialResources /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/services" element={<ProtectedRoute><LayoutQuesteur><AdministrativeServices /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/mail" element={<ProtectedRoute><LayoutQuesteur><Mailbox /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/documents" element={<ProtectedRoute><LayoutQuesteur><SharedDocumentsPage /></LayoutQuesteur></ProtectedRoute>} />
                <Route path="/questeurs/settings" element={<ProtectedRoute><LayoutQuesteur><PresidentSettings /></LayoutQuesteur></ProtectedRoute>} />

                {/* Secretaires Legacy */}
                <Route path="/secretaires" element={<ProtectedRoute><LayoutSecretary><DashboardSecretary /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/secretaires/agenda" element={<ProtectedRoute><LayoutSecretary><SecretaryAgenda /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/secretaires/documents" element={<ProtectedRoute><LayoutSecretary><SecretaryDocuments /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/secretaires/mail" element={<ProtectedRoute><LayoutSecretary><Mailbox /></LayoutSecretary></ProtectedRoute>} />
                <Route path="/secretaires/settings" element={<ProtectedRoute><LayoutSecretary><PresidentSettings /></LayoutSecretary></ProtectedRoute>} />

                {/* User Space Legacy */}
                <Route path="/user" element={<ProtectedRoute><UserSpaceLayout /></ProtectedRoute>}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Other Legacy Routes */}
                <Route path="/portail" element={<ProtectedRoute><UserSpacesHub /></ProtectedRoute>} />
                <Route path="/deputy" element={<DeputySpace />} />

                <Route path="/citizen" element={<CitizenSpace />} />
                <Route path="/actualites" element={<Actualites />} />
                <Route path="/sensibilisation" element={<Sensibilisation />} />
                <Route path="/tutoriels" element={<Tutoriels />} />
                <Route path="/statistiques" element={<Statistiques />} />
                <Route path="/legislation" element={<Legislation />} />
                <Route path="/territoire" element={<Territoire />} />


                {/* Login & Auth */}
                <Route path="/parlement/login" element={<Login />} />

                {/* Redirect legacy /login to /parlement/login */}
                <Route path="/login" element={<Navigate to="/parlement/login" replace />} />
                <Route path="/auth" element={<Navigate to="/parlement/login" replace />} />

                {/* System Admin Portal (Login) */}
                <Route path="/admin" element={<SystemAdminLogin />} />

                {/* Admin Dashboards */}
                <Route path="/admin/dashboard" element={<SystemAdminDashboard />} />
                <Route path="/an/admin" element={<InstitutionAdminDashboard type="AN" />} />
                <Route path="/senat/admin" element={<InstitutionAdminDashboard type="Senat" />} />
                <Route path="/parlement/admin" element={<InstitutionAdminDashboard type="Parlement" />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>


            </InstitutionProvider>
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider >
);

export default App;
