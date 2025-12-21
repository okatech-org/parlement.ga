import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  Package,
  Banknote,
  Building,
  FileText,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { QuesteurSenateDashboardSection } from "./components/QuesteurSenateDashboardSection";
import { QuesteurSenateBudgetSection } from "./components/QuesteurSenateBudgetSection";
import { QuesteurSenateMaterielSection } from "./components/QuesteurSenateMaterielSection";
import { QuesteurSenateIndemnitesSection } from "./components/QuesteurSenateIndemnitesSection";
import { QuesteurSenateServicesSection } from "./components/QuesteurSenateServicesSection";
import IBoitePage from "@/pages/shared/IBoitePage";
import { QuesteurSenateParametresSection } from "./components/QuesteurSenateParametresSection";

const QuesteurSenateSpace = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const userContext = {
    name: "Hon. Jean Massard",
    role: "Questeur du Sénat",
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "budget", label: "Budget du Sénat", icon: Wallet },
    { id: "materiel", label: "Gestion Matériel", icon: Package },
    { id: "indemnites", label: "Indemnités", icon: Banknote },
    { id: "services", label: "Services Admin", icon: Building },
    { id: "messagerie", label: "Messagerie", icon: MessageSquare },
  ];

  const quickAccessItems = [
    { id: "budget", label: "Budget", icon: Wallet },
    { id: "indemnites", label: "Indemnités", icon: Banknote },
    { id: "materiel", label: "Matériel", icon: Package },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <QuesteurSenateDashboardSection />;
      case "budget":
        return <QuesteurSenateBudgetSection />;
      case "materiel":
        return <QuesteurSenateMaterielSection />;
      case "indemnites":
        return <QuesteurSenateIndemnitesSection />;
      case "services":
        return <QuesteurSenateServicesSection />;
      case "messagerie":
        return <IBoitePage />;
      case "parametres":
        return <QuesteurSenateParametresSection />;
      default:
        return null;
    }
  };

  return (
    <AdminSpaceLayout
      title="Questure du Sénat"
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

export default QuesteurSenateSpace;
