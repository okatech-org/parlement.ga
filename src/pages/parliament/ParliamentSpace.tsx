import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Scale,
  Calendar,
  ArrowLeftRight,
  Vote,
  BookOpen,
  Users,
  MessageSquare,
  FolderOpen,
  Settings,
  Crown,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { ParliamentDashboardSection } from "./components/ParliamentDashboardSection";
import { ParliamentSessionsSection } from "./components/ParliamentSessionsSection";
import { ParliamentCMPSection } from "./components/ParliamentCMPSection";
import { ParliamentVoteSection } from "./components/ParliamentVoteSection";
import { ParliamentAgendaSection } from "./components/ParliamentAgendaSection";
import { ParliamentArchivesSection } from "./components/ParliamentArchivesSection";
import { ParliamentMembersSection } from "./components/ParliamentMembersSection";
import { ParliamentMessagerieSection } from "./components/ParliamentMessagerieSection";
import { ParliamentDocumentsSection } from "./components/ParliamentDocumentsSection";
import { ParliamentParametresSection } from "./components/ParliamentParametresSection";

const ParliamentSpace = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const userContext = {
    name: "Hon. Jean-Pierre Oyiba",
    role: "Membre du Congrès - AN",
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "sessions", label: "Sessions du Congrès", icon: Scale },
    { id: "cmp", label: "Commissions Mixtes", icon: ArrowLeftRight, badge: "1" },
    { id: "vote", label: "Vote Solennel", icon: Vote },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "archives", label: "Archives Nationales", icon: BookOpen },
    { id: "membres", label: "Membres", icon: Users },
    { id: "messagerie", label: "Messagerie", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "parametres", label: "Paramètres", icon: Settings },
  ];

  const quickAccessItems = [
    { id: "sessions", label: "Sessions", icon: Scale },
    { id: "cmp", label: "CMP", icon: ArrowLeftRight },
    { id: "vote", label: "Vote", icon: Vote },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <ParliamentDashboardSection />;
      case "sessions":
        return <ParliamentSessionsSection />;
      case "cmp":
        return <ParliamentCMPSection />;
      case "vote":
        return <ParliamentVoteSection />;
      case "agenda":
        return <ParliamentAgendaSection />;
      case "archives":
        return <ParliamentArchivesSection />;
      case "membres":
        return <ParliamentMembersSection />;
      case "messagerie":
        return <ParliamentMessagerieSection />;
      case "documents":
        return <ParliamentDocumentsSection />;
      case "parametres":
        return <ParliamentParametresSection />;
      default:
        return null;
    }
  };

  return (
    <AdminSpaceLayout
      title="Espace Congrès"
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

export default ParliamentSpace;
