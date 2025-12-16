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
import { useLanguage } from "@/contexts/LanguageContext";

const ParliamentSpace = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { t } = useLanguage();

  const userContext = {
    name: "Hon. Jean-Pierre Oyiba",
    role: "Membre du Congrès - AN",
    avatar: undefined,
  };

  const navItems = [
    { id: "dashboard", label: t('congress.admin.nav.dashboard'), icon: LayoutDashboard },
    { id: "sessions", label: t('congress.admin.nav.sessions'), icon: Scale },
    { id: "cmp", label: t('congress.admin.nav.cmp'), icon: ArrowLeftRight, badge: "1" },
    { id: "vote", label: t('congress.admin.nav.vote'), icon: Vote },
    { id: "agenda", label: t('congress.admin.nav.agenda'), icon: Calendar },
    { id: "archives", label: t('congress.admin.nav.archives'), icon: BookOpen },
    { id: "membres", label: t('congress.admin.nav.members'), icon: Users },
    { id: "messagerie", label: t('congress.admin.nav.messaging'), icon: MessageSquare },
    { id: "documents", label: t('congress.admin.nav.documents'), icon: FolderOpen },
    { id: "parametres", label: t('congress.admin.nav.settings'), icon: Settings },
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
      title={t('congress.admin.title')}
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
