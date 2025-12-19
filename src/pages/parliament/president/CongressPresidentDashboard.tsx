import { useState } from "react";
import {
    LayoutDashboard,
    Crown,
    Calendar,
    Users,
    Gavel,
    FileText,
    MessageSquare,
    Landmark,
} from "lucide-react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { CongressPresidentDashboardSection } from "./components/CongressPresidentDashboardSection";
import { CongressSessionsSection } from "./components/CongressSessionsSection";
import { CongressCMPSupervisionSection } from "./components/CongressCMPSupervisionSection";
import { CongressAgendaSection } from "./components/CongressAgendaSection";
import { useNavigate } from "react-router-dom";

const CongressPresidentDashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("dashboard");

    // Check if user also has president_senate or president_an role (dual role)
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const userRoles = userData.roles || [];
    const hasSenateDualRole = userRoles.includes('president_senate');
    const hasANDualRole = userRoles.includes('president');

    const userContext = {
        name: userData.name || "Président du Congrès",
        role: "Président du Congrès",
        avatar: undefined,
    };

    const navItems = [
        { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { id: "sessions", label: "Convocations Sessions", icon: Gavel, badge: "2" },
        { id: "cmp", label: "Supervision CMP", icon: Users, badge: "3" },
        { id: "agenda", label: "Ordre du Jour", icon: Calendar },
        { id: "messagerie", label: "Messagerie", icon: MessageSquare },
    ];

    // Add dual role navigation if applicable
    const dualRoleItems = [];
    if (hasSenateDualRole) {
        dualRoleItems.push({
            id: "senat_space",
            label: "Espace Sénat",
            icon: Landmark,
        });
    }
    if (hasANDualRole) {
        dualRoleItems.push({
            id: "an_space",
            label: "Espace AN",
            icon: Landmark,
        });
    }

    const quickAccessItems = [
        { id: "sessions", label: "Sessions", icon: Gavel },
        { id: "cmp", label: "CMP", icon: Users },
        { id: "agenda", label: "Agenda", icon: Calendar },
    ];

    const handleSectionChange = (section: string) => {
        // Handle dual role navigation
        if (section === "senat_space") {
            navigate("/senat/espace/president");
            return;
        }
        if (section === "an_space") {
            navigate("/an/espace/president");
            return;
        }
        setActiveSection(section);
    };

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <CongressPresidentDashboardSection onNavigateToSection={setActiveSection} />;
            case "sessions":
                return <CongressSessionsSection />;
            case "cmp":
                return <CongressCMPSupervisionSection />;
            case "agenda":
                return <CongressAgendaSection />;
            case "messagerie":
                return (
                    <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-muted rounded-lg">
                        <div className="text-center text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>Module de Messagerie</p>
                            <p className="text-sm">Interface iBoîte intégrée</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const allNavItems = [...navItems, ...dualRoleItems];

    return (
        <AdminSpaceLayout
            title="Présidence du Congrès"
            userContext={userContext}
            navItems={allNavItems}
            activeSection={activeSection}
            setActiveSection={handleSectionChange}
            quickAccessItems={quickAccessItems}
        >
            {renderContent()}
        </AdminSpaceLayout>
    );
};

export default CongressPresidentDashboard;
