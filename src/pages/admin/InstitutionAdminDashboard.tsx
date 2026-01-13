
import { useState } from "react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    FileText,
    Calendar,
    Settings,
    Building2,
    Landmark,
    Scale,
    Megaphone
} from "lucide-react";

interface InstitutionAdminDashboardProps {
    type: "AN" | "Senat" | "Parlement";
}

const InstitutionAdminDashboard = ({ type }: InstitutionAdminDashboardProps) => {
    const [activeSection, setActiveSection] = useState("dashboard");

    const config = {
        AN: {
            title: "Administration Assemblée",
            role: "Administrateur AN",
            icon: Building2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            membersLabel: "Députés",
            stats: { members: 145, sessions: 12, docs: 450 }
        },
        Senat: {
            title: "Administration Sénat",
            role: "Administrateur Sénat",
            icon: Landmark,
            color: "text-amber-600",
            bg: "bg-amber-50",
            membersLabel: "Sénateurs",
            stats: { members: 102, sessions: 8, docs: 320 }
        },
        Parlement: {
            title: "Administration Parlement",
            role: "Administrateur Parlement",
            icon: Scale,
            color: "text-blue-600",
            bg: "bg-blue-50",
            membersLabel: "Parlementaires",
            stats: { members: 245, sessions: 4, docs: 1150 }
        }
    }[type];

    const userContext = {
        name: config.role,
        role: "Gestionnaire Institutionnel",
        avatar: undefined
    };

    const navItems = [
        { id: "dashboard", label: "Tableau de Bord", icon: config.icon },
        { id: "members", label: `Gestion ${config.membersLabel}`, icon: Users },
        { id: "sessions", label: "Sessions & Agenda", icon: Calendar },
        { id: "content", label: "Contenu & News", icon: Megaphone },
        { id: "documents", label: "Documents", icon: FileText },
        { id: "settings", label: "Paramètres Institution", icon: Settings },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className={`text-3xl font-bold tracking-tight ${config.color}`}>{config.title}</h1>
                            <Badge variant="outline" className="text-sm py-1 px-3">Mode Admin</Badge>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">{config.membersLabel} Actifs</span>
                                    <Users className={`h-4 w-4 ${config.color}`} />
                                </div>
                                <div className="text-3xl font-bold">{config.stats.members}</div>
                                <p className="text-xs text-muted-foreground">100% Sièges pourvus</p>
                            </Card>
                            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">Sessions en cours</span>
                                    <Calendar className={`h-4 w-4 ${config.color}`} />
                                </div>
                                <div className="text-3xl font-bold">{config.stats.sessions}</div>
                                <p className="text-xs text-muted-foreground">Cette semaine</p>
                            </Card>
                            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between pb-2">
                                    <span className="text-sm font-medium text-muted-foreground">Documents Traités</span>
                                    <FileText className={`h-4 w-4 ${config.color}`} />
                                </div>
                                <div className="text-3xl font-bold">{config.stats.docs}</div>
                                <p className="text-xs text-muted-foreground">+24 nouveaux aujourd'hui</p>
                            </Card>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="font-semibold mb-4">Tâches Prioritaires</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                                        <div className={`w-2 h-2 rounded-full ${config.bg.replace('bg-', 'bg-')}-500 bg-current opacity-80`}></div>
                                        <span className="text-sm">Valider l'ordre du jour de la prochaine plénière</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                                        <div className={`w-2 h-2 rounded-full ${config.bg.replace('bg-', 'bg-')}-500 bg-current opacity-80`}></div>
                                        <span className="text-sm">Mettre à jour les fiches des nouveaux élus</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                                        <div className={`w-2 h-2 rounded-full ${config.bg.replace('bg-', 'bg-')}-500 bg-current opacity-80`}></div>
                                        <span className="text-sm">Publication du compte-rendu de séance (J-1)</span>
                                    </li>
                                </ul>
                            </Card>

                            <Card className="p-6">
                                <h3 className="font-semibold mb-4">Activité Récente</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                                            <FileText className={`h-5 w-5 ${config.color}`} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Projet de loi #4092 déposé</div>
                                            <div className="text-xs text-muted-foreground">Il y a 2 heures par Service Législatif</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                                            <Users className={`h-5 w-5 ${config.color}`} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Commission des Finances réunie</div>
                                            <div className="text-xs text-muted-foreground">Il y a 4 heures - Salle 2B</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                );
            case "members":
                return <div className="p-10 text-center text-muted-foreground">Gestion des {config.membersLabel} - En construction</div>;
            default:
                return null;
        }
    }

    return (
        <AdminSpaceLayout
            title={config.title}
            userContext={userContext}
            navItems={navItems}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
        >
            {renderContent()}
        </AdminSpaceLayout>
    );
};

export default InstitutionAdminDashboard;
