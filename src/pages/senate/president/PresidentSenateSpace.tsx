import { useState } from "react";
import {
  LayoutDashboard,
  Crown,
  ArrowLeftRight,
  Calendar,
  Users,
  BarChart3,
  Gavel,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  Landmark,
  FolderOpen,
  Mail,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { PresidentSenateDashboardSection } from "./components/PresidentSenateDashboardSection";
import { PresidentSenateNavetteSection } from "./components/PresidentSenateNavetteSection";
import { PresidentSenateCMPSection } from "./components/PresidentSenateCMPSection";
import { PresidentSenateAgendaSection } from "./components/PresidentSenateAgendaSection";
import { PresidentSenateStatsSection } from "./components/PresidentSenateStatsSection";
import IBoitePage from "@/pages/shared/IBoitePage";
import SharedDocumentsPage from "@/pages/shared/SharedDocumentsPage";
import SharedAgendaPage from "@/pages/shared/SharedAgendaPage";
import ICorrespondancePage from "@/pages/shared/ICorrespondancePage";
import { PresidentSenateParametresSection } from "./components/PresidentSenateParametresSection";
import { useNavigate } from "react-router-dom";

const PresidentSenateSpace = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  // Check if user also has president_congress role (dual role)
  const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
  const userRoles = userData.roles || [];
  const hasCongressRole = userRoles.includes('president_congress');

  const userContext = {
    name: userData.name || "Hon. Paulette Missambo",
    role: "Président du Sénat",
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "navette", label: "Validation Navette", icon: ArrowLeftRight, badge: "2" },
    { id: "cmp", label: "Convocation CMP", icon: Gavel },
    { id: "agenda", label: "Ordre du Jour", icon: Calendar },
    { id: "stats", label: "Statistiques", icon: BarChart3 },
    { id: "messagerie", label: "iBoîte", icon: MessageSquare, badge: "3" },
    { id: "documents", label: "iDocuments", icon: FolderOpen },
    { id: "correspondance", label: "iCorrespondance", icon: Mail },
  ];

  // Add Congress link if user has dual role
  if (hasCongressRole) {
    navItems.push({
      id: "congres_space",
      label: "Espace Congrès",
      icon: Landmark,
    });
  }

  const quickAccessItems = [
    { id: "navette", label: "Navette", icon: ArrowLeftRight },
    { id: "cmp", label: "CMP", icon: Gavel },
    { id: "agenda", label: "Agenda", icon: Calendar },
  ];

  const handleSectionChange = (section: string) => {
    // Handle Congress space navigation
    if (section === "congres_space") {
      navigate("/congres/espace/president");
      return;
    }
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <PresidentSenateDashboardSection />;
      case "navette":
        return <PresidentSenateNavetteSection />;
      case "cmp":
        return <PresidentSenateCMPSection />;
      case "agenda":
        return <PresidentSenateAgendaSection />;
      case "stats":
        return <PresidentSenateStatsSection />;
      case "messagerie":
        return <IBoitePage />;
      case "documents":
        return <SharedDocumentsPage />;
      case "correspondance":
        return <ICorrespondancePage />;
      case "parametres":
        return <PresidentSenateParametresSection />;
      default:
        return null;
    }
  };

  return (
    <AdminSpaceLayout
      title="Présidence du Sénat"
      userContext={userContext}
      navItems={navItems}
      activeSection={activeSection}
      setActiveSection={handleSectionChange}
      quickAccessItems={quickAccessItems}
    >
      {renderContent()}
    </AdminSpaceLayout>
  );
};

export default PresidentSenateSpace;

