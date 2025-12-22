import { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    FileText,
    MessageSquare,
    FolderOpen,
    Mail,
    Vote,
    Users,
    HelpCircle,
    GitMerge,
    Scale,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { useUser } from "@/contexts/UserContext";
import IBoitePage from "@/pages/shared/IBoitePage";
import SharedDocumentsPage from "@/pages/shared/SharedDocumentsPage";
import SharedAgendaPage from "@/pages/shared/SharedAgendaPage";
import ICorrespondancePage from "@/pages/shared/ICorrespondancePage";
import { CongressMemberDashboardSection } from "./components/CongressMemberDashboardSection";
import DepotTexte from "@/pages/parliament/DepotTexte";

/**
 * Espace Membre du Congrès (Député ou Sénateur participant au Congrès)
 * Participations aux révisions constitutionnelles, débats CMP, questions
 */
const CongressMemberSpace = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const { user, currentRole } = useUser();

    // Determine if user is a Deputy or Senator
    const isDeputy = currentRole === 'deputy_congress' || user?.roles.includes('deputy');
    const chamberLabel = isDeputy ? "Député" : "Sénateur";
    const chamberColor = isDeputy ? "#3A87FD" : "#D19C00";

    const userContext = {
        name: user?.name || `${chamberLabel} du Congrès`,
        role: user?.bureauLabel || `${chamberLabel} (Congrès)`,
        avatar: undefined,
    };

    const navItems = [
        { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { id: "revision-const", label: "Révision Constitutionnelle", icon: Scale },
        { id: "debats-cmp", label: "Débats CMP", icon: GitMerge },
        { id: "votes", label: "Votes du Congrès", icon: Vote },
        { id: "questions", label: "Questions", icon: HelpCircle },
        { id: "agenda", label: "Agenda Sessions", icon: Calendar },
        { id: "messagerie", label: "iBoîte", icon: MessageSquare },

        { id: "documents", label: "iDocuments", icon: FolderOpen },
        { id: "depot", label: "Dépôt (Beta)", icon: FileText },
        { id: "correspondance", label: "iCorrespondance", icon: Mail },
    ];

    const quickAccessItems = [
        { id: "revision-const", label: "Révision", icon: Scale },
        { id: "votes", label: "Votes", icon: Vote },
        { id: "debats-cmp", label: "CMP", icon: GitMerge },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <CongressMemberDashboardSection chamberLabel={chamberLabel} chamberColor={chamberColor} />;
            case "revision-const":
                return <CongressMemberDashboardSection chamberLabel={chamberLabel} chamberColor={chamberColor} />;
            case "debats-cmp":
                return <CongressMemberDashboardSection chamberLabel={chamberLabel} chamberColor={chamberColor} />;
            case "votes":
                return <CongressMemberDashboardSection chamberLabel={chamberLabel} chamberColor={chamberColor} />;
            case "questions":
                return <IBoitePage context="an" contextLabel="AN (Questions)" />;
            case "agenda":
                return <SharedAgendaPage context="congress" contextLabel="Congrès" />;
            case "messagerie":
                return <IBoitePage context="congress" contextLabel="Congrès" />;
            case "documents":
                return <SharedDocumentsPage context="congress" contextLabel="Congrès" />;
            case "depot":
                return <DepotTexte />;
            case "correspondance":
                return <ICorrespondancePage />; // TODO: Implement context in ICorrespondancePage if needed
            default:
                return null;
        }
    };

    return (
        <AdminSpaceLayout
            title={`Espace ${chamberLabel} (Congrès)`}
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

export default CongressMemberSpace;
