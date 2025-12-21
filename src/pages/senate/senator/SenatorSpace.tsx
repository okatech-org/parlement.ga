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
  Mail,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { useUser } from "@/contexts/UserContext";
import { SenatorDashboardSection } from "./components/SenatorDashboardSection";
import { SenatorNavetteSection } from "./components/SenatorNavetteSection";
import { SenatorTerritoireSection } from "./components/SenatorTerritoireSection";
import { SenatorDoleancesSection } from "./components/SenatorDoleancesSection";
import { SenatorAgendaSection } from "./components/SenatorAgendaSection";
import { SenatorCommissionsSection } from "./components/SenatorCommissionsSection";
import IBoitePage from "@/pages/shared/IBoitePage";
import SharedDocumentsPage from "@/pages/shared/SharedDocumentsPage";
import SharedAgendaPage from "@/pages/shared/SharedAgendaPage";
import ICorrespondancePage from "@/pages/shared/ICorrespondancePage";
import { SenatorParametresSection } from "./components/SenatorParametresSection";


const SenatorSpace = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { user } = useUser();

  const userContext = {
    name: user?.name || "Sénateur",
    role: user?.province ? `Sénateur de ${user.province}` : "Sénateur",
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "navette", label: "Navette Législative", icon: ArrowLeftRight },
    { id: "territoire", label: "Mon Territoire", icon: MapPin },
    { id: "doleances", label: "Doléances", icon: AlertTriangle, badge: "12" },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "commissions", label: "Commissions", icon: Users },
    { id: "messagerie", label: "iBoîte", icon: MessageSquare, badge: "5" },
    { id: "documents", label: "iDocuments", icon: FolderOpen },
    { id: "correspondance", label: "iCorrespondance", icon: Mail },
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
        return <SharedAgendaPage />;
      case "commissions":
        return <SenatorCommissionsSection />;
      case "messagerie":
        return <IBoitePage />;
      case "documents":
        return <SharedDocumentsPage />;
      case "correspondance":
        return <ICorrespondancePage />;
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
