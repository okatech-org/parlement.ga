import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  MapPin,
  MessageSquare,
  FolderOpen,
  Settings,
  Calendar,
  ArrowLeftRight,
  AlertTriangle,
  Users,
  Scale,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { SenatorDashboardSection } from "./components/SenatorDashboardSection";
import { SenatorNavetteSection } from "./components/SenatorNavetteSection";
import { SenatorTerritoireSection } from "./components/SenatorTerritoireSection";
import { SenatorDoleancesSection } from "./components/SenatorDoleancesSection";
import { SenatorAgendaSection } from "./components/SenatorAgendaSection";
import { SenatorCommissionsSection } from "./components/SenatorCommissionsSection";
import { SenatorMessagerieSection } from "./components/SenatorMessagerieSection";
import { SenatorDocumentsSection } from "./components/SenatorDocumentsSection";
import { SenatorParametresSection } from "./components/SenatorParametresSection";

const SenatorSpace = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const userContext = {
    name: "Hon. Marie Ndong",
    role: "Sénateur - Woleu-Ntem",
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "navette", label: "Navette Législative", icon: ArrowLeftRight },
    { id: "territoire", label: "Mon Territoire", icon: MapPin },
    { id: "doleances", label: "Doléances", icon: AlertTriangle, badge: "12" },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "commissions", label: "Commissions", icon: Users },
    { id: "messagerie", label: "Messagerie", icon: MessageSquare, badge: "5" },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "parametres", label: "Paramètres", icon: Settings },
  ];

  const quickAccessItems = [
    { id: "navette", label: "Navette", icon: ArrowLeftRight },
    { id: "doleances", label: "Doléances", icon: AlertTriangle },
    { id: "agenda", label: "Agenda", icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <SenatorDashboardSection />;
      case "navette":
        return <SenatorNavetteSection />;
      case "territoire":
        return <SenatorTerritoireSection />;
      case "doleances":
        return <SenatorDoleancesSection />;
      case "agenda":
        return <SenatorAgendaSection />;
      case "commissions":
        return <SenatorCommissionsSection />;
      case "messagerie":
        return <SenatorMessagerieSection />;
      case "documents":
        return <SenatorDocumentsSection />;
      case "parametres":
        return <SenatorParametresSection />;
      default:
        return null;
    }
  };

  return (
    <AdminSpaceLayout
      title="Espace Sénateur"
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

export default SenatorSpace;
