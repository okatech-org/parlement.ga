import { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    FileText,
    MessageSquare,
    FolderOpen,
    Mail,
    ClipboardList,
    Vote,
    Users,
    CheckSquare,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { useUser } from "@/contexts/UserContext";
import IBoitePage from "@/pages/shared/IBoitePage";
import SharedDocumentsPage from "@/pages/shared/SharedDocumentsPage";
import SharedAgendaPage from "@/pages/shared/SharedAgendaPage";
import ICorrespondancePage from "@/pages/shared/ICorrespondancePage";
import { SessionSecretaryDashboardSection } from "./components/SessionSecretaryDashboardSection";

/**
 * Espace Secrétaire de Séance du Congrès
 * Gestion des procès-verbaux, quorum et dépouillement des votes
 */
const SessionSecretarySpace = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const { user } = useUser();

    const userContext = {
        name: user?.name || "Secrétaire de Séance",
        role: user?.bureauLabel || "Secrétaire de Séance du Congrès",
        avatar: undefined,
    };

    const navItems = [
        { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { id: "proces-verbaux", label: "Procès-Verbaux", icon: ClipboardList },
        { id: "quorum", label: "Vérification Quorum", icon: Users },
        { id: "depouillement", label: "Dépouillement Votes", icon: CheckSquare },
        { id: "votes", label: "Résultats de Votes", icon: Vote },
        { id: "agenda", label: "Agenda Sessions", icon: Calendar },
        { id: "messagerie", label: "iBoîte", icon: MessageSquare },
        { id: "documents", label: "iDocuments", icon: FolderOpen },
        { id: "correspondance", label: "iCorrespondance", icon: Mail },
    ];

    const quickAccessItems = [
        { id: "proces-verbaux", label: "P-V", icon: ClipboardList },
        { id: "quorum", label: "Quorum", icon: Users },
        { id: "depouillement", label: "Votes", icon: CheckSquare },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <SessionSecretaryDashboardSection />;
            case "proces-verbaux":
                return <SessionSecretaryDashboardSection />;
            case "quorum":
                return <SessionSecretaryDashboardSection />;
            case "depouillement":
                return <SessionSecretaryDashboardSection />;
            case "votes":
                return <SessionSecretaryDashboardSection />;
            case "agenda":
                return <SharedAgendaPage />;
            case "messagerie":
                return <IBoitePage />;
            case "documents":
                return <SharedDocumentsPage />;
            case "correspondance":
                return <ICorrespondancePage />;
            default:
                return null;
        }
    };

    return (
        <AdminSpaceLayout
            title="Secrétariat de Séance"
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

export default SessionSecretarySpace;
