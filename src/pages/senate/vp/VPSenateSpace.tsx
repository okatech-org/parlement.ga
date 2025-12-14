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
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { VPSenateDashboardSection } from "./components/VPSenateDashboardSection";
import { VPSenateSuppleanceSection } from "./components/VPSenateSuppleanceSection";
import { VPSenateCommissionsSection } from "./components/VPSenateCommissionsSection";
import { VPSenateDelegationsSection } from "./components/VPSenateDelegationsSection";
import { VPSenateAgendaSection } from "./components/VPSenateAgendaSection";
import { VPSenateMessagerieSection } from "./components/VPSenateMessagerieSection";
import { VPSenateParametresSection } from "./components/VPSenateParametresSection";

const VPSenateSpace = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const userContext = {
    name: "Hon. Pierre Nzoghe",
    role: "1er Vice-Président du Sénat",
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "suppleance", label: "Suppléance Présidence", icon: Crown },
    { id: "commissions", label: "Gestion Commissions", icon: Users },
    { id: "delegations", label: "Délégations", icon: Shield },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "messagerie", label: "Messagerie", icon: MessageSquare },
    { id: "parametres", label: "Paramètres", icon: Settings },
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
        return <VPSenateAgendaSection />;
      case "messagerie":
        return <VPSenateMessagerieSection />;
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
