import { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    FileText,
    MessageSquare,
    FolderOpen,
    Mail,
    Vote,
    GitMerge,
    FileEdit,
    Crown,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { useUser } from "@/contexts/UserContext";
import IBoitePage from "@/pages/shared/IBoitePage";
import SharedDocumentsPage from "@/pages/shared/SharedDocumentsPage";
import SharedAgendaPage from "@/pages/shared/SharedAgendaPage";
import ICorrespondancePage from "@/pages/shared/ICorrespondancePage";
import { CMPMemberDashboardSection } from "./components/CMPMemberDashboardSection";
import { CMPNegotiationSection } from "./components/CMPNegotiationSection";
import { CMPAmendmentsSection } from "./components/CMPAmendmentsSection";
import { CMPVoteSection } from "./components/CMPVoteSection";

/**
 * Espace Membre CMP (Commission Mixte Paritaire)
 * Négociation textes, amendements, vote compromis
 */
const CMPMemberSpace = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const { user } = useUser();

    // Determine if user is a Co-President based on bureauLabel
    const isCoPresident = user?.bureauLabel?.includes('Coprésident') || false;

    // Determine chamber based on roles
    const isFromAN = user?.roles.includes('deputy');
    const chamberLabel = isFromAN ? "AN" : "Sénat";
    const chamberColor = isFromAN ? "#3A87FD" : "#D19C00";

    const userContext = {
        name: user?.name || "Commissaire CMP",
        role: user?.bureauLabel || `Commissaire CMP (${chamberLabel})`,
        avatar: undefined,
    };

    const navItems = [
        { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { id: "negociation", label: "Négociation Textes", icon: FileText },
        { id: "amendements", label: "Amendements CMP", icon: FileEdit },
        { id: "votes", label: "Vote Compromis", icon: Vote },
        ...(isCoPresident ? [{ id: "presidence", label: "Présidence CMP", icon: Crown }] : []),
        { id: "agenda", label: "Agenda CMP", icon: Calendar },
        { id: "messagerie", label: "iBoîte", icon: MessageSquare },
        { id: "documents", label: "iDocuments", icon: FolderOpen },
        { id: "correspondance", label: "iCorrespondance", icon: Mail },
    ];

    const quickAccessItems = [
        { id: "negociation", label: "Textes", icon: FileText },
        { id: "amendements", label: "Amendts", icon: FileEdit },
        { id: "votes", label: "Votes", icon: Vote },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <CMPMemberDashboardSection chamberLabel={chamberLabel} chamberColor={chamberColor} isCoPresident={isCoPresident} />;
            case "negociation":
                return <CMPNegotiationSection />;
            case "amendements":
                return <CMPAmendmentsSection />;
            case "votes":
                return <CMPVoteSection />;
            case "presidence":
                return <CMPMemberDashboardSection chamberLabel={chamberLabel} chamberColor={chamberColor} isCoPresident={isCoPresident} />;
            case "agenda":
                return <SharedAgendaPage context="cmp" contextLabel="Commission Mixte Paritaire" />;
            case "messagerie":
                return <IBoitePage context="cmp" contextLabel="CMP" />;
            case "documents":
                return <SharedDocumentsPage context="cmp" contextLabel="CMP" />;
            case "correspondance":
                return <ICorrespondancePage />;
            default:
                return null;
        }
    };

    return (
        <AdminSpaceLayout
            title={isCoPresident ? "Coprésidence CMP" : "Commission Mixte Paritaire"}
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

export default CMPMemberSpace;
