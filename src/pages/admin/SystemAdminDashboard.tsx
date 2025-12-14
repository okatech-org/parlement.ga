import { useState } from "react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import {
    Activity,
    Users,
    Globe,
    Shield,
    Server
} from "lucide-react";

// Import Section Components
import SuperAdminOverview from "./components/SuperAdminOverview";
import UserManagementSection from "./components/UserManagementSection";
import EnvironmentsSection from "./components/EnvironmentsSection";
import SecurityLogsSection from "./components/SecurityLogsSection";
import SystemMaintenanceSection from "./components/SystemMaintenanceSection";

const SystemAdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("overview");

    const userContext = {
        name: "Super Administrateur",
        role: "Accès Global Système",
        avatar: undefined
    };

    const navItems = [
        { id: "overview", label: "Centre de Commande", icon: Activity },
        { id: "users", label: "Gestion Utilisateurs", icon: Users },
        { id: "environments", label: "Environnements", icon: Globe },
        { id: "security", label: "Sécurité & Logs", icon: Shield },
        { id: "maintenance", label: "Maintenance", icon: Server },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "overview":
                return <SuperAdminOverview />;
            case "users":
                return <UserManagementSection />;
            case "environments":
                return <EnvironmentsSection />;
            case "security":
                return <SecurityLogsSection />;
            case "maintenance":
                return <SystemMaintenanceSection />;
            default:
                return <SuperAdminOverview />;
        }
    };

    return (
        <AdminSpaceLayout
            title="Administration Système"
            userContext={userContext}
            navItems={navItems}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
        >
            {renderContent()}
        </AdminSpaceLayout>
    );
};

export default SystemAdminDashboard;
