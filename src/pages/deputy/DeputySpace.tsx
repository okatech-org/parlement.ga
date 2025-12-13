import { useState } from "react";
import {
  Vote,
  FileText,
  Map,
  MessageSquare,
  FolderOpen,
  Wallet,
  Settings,
  Calendar,
  Mic2,
  LayoutDashboard,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { DashboardSection } from "./components/DashboardSection";
import { HemicycleSection } from "./components/HemicycleSection";
import { BureauVirtuelSection } from "./components/BureauVirtuelSection";
import { QuestionsSection } from "./components/QuestionsSection";
import { AgendaSection } from "./components/AgendaSection";
import { TerrainCitoyensSection } from "./components/TerrainCitoyensSection";
import { MessagerieSection } from "./components/MessagerieSection";
import { DocumentsSection } from "./components/DocumentsSection";
import { GestionSection } from "./components/GestionSection";
import { ParametresSection } from "./components/ParametresSection";

const DeputySpace = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const userContext = {
    name: "Hon. Jean Dupont",
    role: "Député - Circonscription Est",
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "hemicycle", label: "E-Hémicycle", icon: Vote },
    { id: "bureau", label: "Bureau Virtuel", icon: FileText },
    { id: "questions", label: "Questions au Gouv.", icon: Mic2 },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "circonscription", label: "Terrain & Citoyens", icon: Map, badge: "20" },
    { id: "messagerie", label: "Messagerie", icon: MessageSquare, badge: "3" },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "gestion", label: "Ma Gestion", icon: Wallet },
    { id: "parametres", label: "Paramètres", icon: Settings },
  ];

  const quickAccessItems = [
    { id: "hemicycle", label: "Vote", icon: Vote },
    { id: "questions", label: "Questions", icon: Mic2 },
    { id: "agenda", label: "Agenda", icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "hemicycle":
        return <HemicycleSection />;
      case "bureau":
        return <BureauVirtuelSection />;
      case "questions":
        return <QuestionsSection />;
      case "agenda":
        return <AgendaSection />;
      case "circonscription":
        return <TerrainCitoyensSection />;
      case "messagerie":
        return <MessagerieSection />;
      case "documents":
        return <DocumentsSection />;
      case "gestion":
        return <GestionSection />;
      case "parametres":
        return <ParametresSection />;
      default:
        return null;
    }
  };

  return (
    <AdminSpaceLayout
      title="Espace Député"
      userContext={userContext}
      navItems={navItems}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      quickAccessItems={quickAccessItems}
    >
      {renderContent()}
    </AdminSpaceLayout>
  );
};

export default DeputySpace;
