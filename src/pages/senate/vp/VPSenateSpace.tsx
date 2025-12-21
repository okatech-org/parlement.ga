import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Crown,
  Calendar,
  ArrowLeftRight,
  FileText,
  MessageSquare,
  Settings,
  Shield,
  FolderOpen,
  Mail,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { useUser } from "@/contexts/UserContext";
import { VPSenateDashboardSection } from "./components/VPSenateDashboardSection";
import { VPSenateSuppleanceSection } from "./components/VPSenateSuppleanceSection";
import { VPSenateCommissionsSection } from "./components/VPSenateCommissionsSection";
import { VPSenateDelegationsSection } from "./components/VPSenateDelegationsSection";
import { VPSenateAgendaSection } from "./components/VPSenateAgendaSection";
import IBoitePage from "@/pages/shared/IBoitePage";
import SharedDocumentsPage from "@/pages/shared/SharedDocumentsPage";
import SharedAgendaPage from "@/pages/shared/SharedAgendaPage";
import ICorrespondancePage from "@/pages/shared/ICorrespondancePage";
import { VPSenateParametresSection } from "./components/VPSenateParametresSection";

const VPSenateSpace = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const { user } = useUser();
  const defaultUser = {
    name: "Huguette Yvonne NYANA EKOUME Ep. AWORI",
    role: "Présidente du Sénat",
  };

  const userContext = {
    name: user?.name || defaultUser.name,
    role: user?.bureauLabel || "Vice-Président du Sénat", // Use dynamic label or fallback
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "suppleance", label: "Suppléance Présidence", icon: Crown },
    { id: "commissions", label: "Gestion Commissions", icon: Users },
    { id: "delegations", label: "Délégations", icon: Shield },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "messagerie", label: "iBoîte", icon: MessageSquare },
    { id: "documents", label: "iDocuments", icon: FolderOpen },
    { id: "correspondance", label: "iCorrespondance", icon: Mail },
  ];

  const quickAccessItems = [
    { id: "suppleance", label: "Suppléance", icon: Crown },
    { id: "commissions", label: "Commissions", icon: Users },
    { id: "agenda", label: "Agenda", icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <VPSenateDashboardSection />;
      case "suppleance":
        return <VPSenateSuppleanceSection />;
      case "commissions":
        return <VPSenateCommissionsSection />;
      case "delegations":
        return <VPSenateDelegationsSection />;
      case "agenda":
        return <SharedAgendaPage />;
      case "messagerie":
        return <IBoitePage />;
      case "documents":
        return <SharedDocumentsPage />;
      case "correspondance":
        return <ICorrespondancePage />;
      case "parametres":
        return <VPSenateParametresSection />;
      default:
        return null;
    }
  };

  return (
    <AdminSpaceLayout
      title="Vice-Présidence du Sénat"
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

export default VPSenateSpace;
