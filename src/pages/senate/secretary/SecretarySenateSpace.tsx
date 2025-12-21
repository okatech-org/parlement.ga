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
    Settings,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { useUser } from "@/contexts/UserContext";
import { SecretarySenateDashboardSection } from "./components/SecretarySenateDashboardSection";
import IBoitePage from "@/pages/shared/IBoitePage";
import SharedDocumentsPage from "@/pages/shared/SharedDocumentsPage";
import SharedAgendaPage from "@/pages/shared/SharedAgendaPage";
import ICorrespondancePage from "@/pages/shared/ICorrespondancePage";

const SecretarySenateSpace = () => {
    const [activeSection, setActiveSection] = useState("dashboard");

    const { user } = useUser();

    const userContext = {
        name: user?.name || "Secrétaire du Sénat",
        role: user?.bureauLabel || "Secrétaire du Sénat",
        avatar: undefined,
    };

    const navItems = [
        { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { id: "proces-verbaux", label: "Procès-Verbaux", icon: ClipboardList },
        { id: "votes", label: "Résultats de Votes", icon: Vote },
        { id: "agenda", label: "Agenda", icon: Calendar },
        { id: "messagerie", label: "iBoîte", icon: MessageSquare },
        { id: "documents", label: "iDocuments", icon: FolderOpen },
        { id: "correspondance", label: "iCorrespondance", icon: Mail },
    ];

    const quickAccessItems = [
        { id: "proces-verbaux", label: "P-V", icon: ClipboardList },
        { id: "votes", label: "Votes", icon: Vote },
        { id: "agenda", label: "Agenda", icon: Calendar },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <SecretarySenateDashboardSection />;
            case "proces-verbaux":
                return <SecretarySenateDashboardSection />; // TODO: Create dedicated PV section
            case "votes":
                return <SecretarySenateDashboardSection />; // TODO: Create dedicated votes section
            case "agenda":
                return <SharedAgendaPage />;
            case "messagerie":
                return <IBoitePage />;
            case "documents":
                return <SharedDocumentsPage />;
            case "correspondance":
                return <ICorrespondancePage />;
            case "parametres":
                return <SecretarySenateDashboardSection />; // TODO: Create settings section
            default:
                return null;
        }
    };

    return (
        <AdminSpaceLayout
            title="Secrétariat du Sénat"
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

export default SecretarySenateSpace;
