
import { useState } from "react";
import { AdminSpaceLayout } from "@/components/layout/AdminSpaceLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Shield,
    Users,
    Server,
    Activity,
    Database,
    Lock,
    Settings,
    Terminal,
    Globe
} from "lucide-react";

const SystemAdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("overview");

    const userContext = {
        name: "Super Administrateur",
        role: "Accès Global Système",
        avatar: undefined
    };

    const navItems = [
        { id: "overview", label: "Vue Globale", icon: Activity },
        { id: "users", label: "Utilisateurs", icon: Users },
        { id: "security", label: "Sécurité", icon: Shield },
        { id: "infrastructure", label: "Infrastructure", icon: Server },
        { id: "logs", label: "Logs Système", icon: Terminal },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "overview":
                return (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold tracking-tight">État du Système</h1>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="p-6 bg-slate-900 text-white border-slate-800">
                                <div className="flex items-center justify-between pb-2">
                                    <span className="text-sm font-medium text-slate-400">Charge Serveur</span>
                                    <Server className="h-4 w-4 text-green-500" />
                                </div>
                                <div className="text-2xl font-bold">12%</div>
                                <p className="text-xs text-slate-400">Optimale - 48 Cores actifs</p>
                            </Card>
                            <Card className="p-6 bg-slate-900 text-white border-slate-800">
                                <div className="flex items-center justify-between pb-2">
                                    <span className="text-sm font-medium text-slate-400">Utilisateurs Actifs</span>
                                    <Users className="h-4 w-4 text-blue-500" />
                                </div>
                                <div className="text-2xl font-bold">1,245</div>
                                <p className="text-xs text-slate-400">+18% depuis hier</p>
                            </Card>
                            <Card className="p-6 bg-slate-900 text-white border-slate-800">
                                <div className="flex items-center justify-between pb-2">
                                    <span className="text-sm font-medium text-slate-400">Base de Données</span>
                                    <Database className="h-4 w-4 text-amber-500" />
                                </div>
                                <div className="text-2xl font-bold">2.4 TB</div>
                                <p className="text-xs text-slate-400">Réplication Sync OK</p>
                            </Card>
                            <Card className="p-6 bg-slate-900 text-white border-slate-800">
                                <div className="flex items-center justify-between pb-2">
                                    <span className="text-sm font-medium text-slate-400">Sécurité</span>
                                    <Shield className="h-4 w-4 text-emerald-500" />
                                </div>
                                <div className="text-2xl font-bold">100%</div>
                                <p className="text-xs text-slate-400">0 menaces détectées</p>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="p-6 border-slate-200 dark:border-slate-800">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-blue-600" />
                                    État des Environnements
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="font-medium">Assemblée Nationale</span>
                                        </div>
                                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-white dark:bg-transparent">En Ligne</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                            <span className="font-medium">Sénat de la République</span>
                                        </div>
                                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-white dark:bg-transparent">En Ligne</Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            <span className="font-medium">Congrès / Parlement</span>
                                        </div>
                                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-white dark:bg-transparent">En Ligne</Badge>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 border-slate-200 dark:border-slate-800">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-purple-600" />
                                    Activités Récentes (Logs)
                                </h3>
                                <div className="space-y-3 font-mono text-xs">
                                    <div className="flex gap-2">
                                        <span className="text-slate-400">[22:42:01]</span>
                                        <span className="text-blue-600">AUTH_SUCCESS</span>
                                        <span>User admin00 logged in from 192.168.1.1</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-400">[22:40:15]</span>
                                        <span className="text-green-600">DB_BACKUP</span>
                                        <span>Incremental backup completed (45ms)</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-400">[22:38:22]</span>
                                        <span className="text-amber-600">WARN_CPU</span>
                                        <span>Node-04 CPU usage spike (88%)</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-400">[22:35:10]</span>
                                        <span className="text-blue-600">API_REQ</span>
                                        <span>POST /api/vote/session_42 authorized</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                );
            case "users":
                return <div className="p-10 text-center text-muted-foreground">Module Gestion Utilisateurs - En construction</div>
            default:
                return null;
        }
    }

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
