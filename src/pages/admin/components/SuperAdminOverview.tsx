import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Activity,
    Users,
    Server,
    Shield,
    Database,
    Globe,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Clock
} from "lucide-react";

const SuperAdminOverview = () => {
    const systemMetrics = [
        { label: "Charge CPU", value: "12%", status: "optimal", icon: Server, color: "text-green-500" },
        { label: "Utilisateurs Actifs", value: "1,247", status: "normal", icon: Users, color: "text-blue-500" },
        { label: "Base de Données", value: "2.4 TB", status: "normal", icon: Database, color: "text-amber-500" },
        { label: "Niveau Sécurité", value: "100%", status: "optimal", icon: Shield, color: "text-emerald-500" },
    ];

    const environments = [
        { name: "Assemblée Nationale", status: "online", users: 156, sessions: 12, color: "bg-emerald-500" },
        { name: "Sénat", status: "online", users: 108, sessions: 8, color: "bg-amber-500" },
        { name: "Congrès", status: "online", users: 45, sessions: 2, color: "bg-blue-500" },
    ];

    const recentAlerts = [
        { type: "info", message: "Backup quotidien complété avec succès", time: "Il y a 2 min" },
        { type: "warning", message: "Pic de connexions détecté (AN)", time: "Il y a 15 min" },
        { type: "success", message: "Mise à jour sécurité appliquée", time: "Il y a 1h" },
    ];

    const activityLogs = [
        { action: "AUTH_SUCCESS", user: "admin00", ip: "192.168.1.1", time: "23:03:12" },
        { action: "USER_CREATE", user: "admin01", ip: "192.168.1.2", time: "22:58:45" },
        { action: "CONFIG_UPDATE", user: "admin00", ip: "192.168.1.1", time: "22:45:30" },
        { action: "SESSION_START", user: "deputy_042", ip: "10.0.0.15", time: "22:30:00" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Centre de Commandement</h1>
                    <p className="text-muted-foreground">Vue d'ensemble système - Mode Super Administrateur</p>
                </div>
                <Badge variant="destructive" className="text-sm py-1 px-3 animate-pulse">
                    <Shield className="h-3 w-3 mr-1" />
                    GOD MODE ACTIF
                </Badge>
            </div>

            {/* System Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {systemMetrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                        <Card key={idx} className="p-6 bg-slate-900 text-white border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between pb-2">
                                <span className="text-sm font-medium text-slate-400">{metric.label}</span>
                                <Icon className={`h-4 w-4 ${metric.color}`} />
                            </div>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-400">{metric.status}</span>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Environments Status + Alerts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6 border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        État des Environnements
                    </h3>
                    <div className="space-y-4">
                        {environments.map((env, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${env.color} animate-pulse`}></div>
                                    <div>
                                        <span className="font-medium">{env.name}</span>
                                        <div className="text-xs text-muted-foreground">{env.users} utilisateurs • {env.sessions} sessions</div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20">
                                    En Ligne
                                </Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        Alertes Récentes
                    </h3>
                    <div className="space-y-3">
                        {recentAlerts.map((alert, idx) => (
                            <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg ${alert.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20' :
                                    alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                                        'bg-blue-50 dark:bg-blue-900/20'
                                }`}>
                                {alert.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" /> :
                                    alert.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" /> :
                                        <Activity className="h-4 w-4 text-blue-500 mt-0.5" />}
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{alert.message}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3" /> {alert.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Activity Feed */}
            <Card className="p-6 border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Flux d'Activité en Temps Réel
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b dark:border-slate-800">
                                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Heure</th>
                                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Action</th>
                                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Utilisateur</th>
                                <th className="text-left py-2 px-3 text-muted-foreground font-medium">IP</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-xs">
                            {activityLogs.map((log, idx) => (
                                <tr key={idx} className="border-b dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                                    <td className="py-2 px-3 text-slate-500">{log.time}</td>
                                    <td className="py-2 px-3">
                                        <Badge variant="outline" className={
                                            log.action.includes('AUTH') ? 'text-blue-600 border-blue-200' :
                                                log.action.includes('CREATE') ? 'text-green-600 border-green-200' :
                                                    log.action.includes('CONFIG') ? 'text-amber-600 border-amber-200' :
                                                        'text-purple-600 border-purple-200'
                                        }>{log.action}</Badge>
                                    </td>
                                    <td className="py-2 px-3">{log.user}</td>
                                    <td className="py-2 px-3 text-slate-500">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
                            <p className="text-3xl font-bold text-emerald-600">3,892</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-emerald-500 opacity-50" />
                    </div>
                    <p className="text-xs text-emerald-600 mt-2">+12% ce mois</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Sessions Actives</p>
                            <p className="text-3xl font-bold text-blue-600">245</p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-500 opacity-50" />
                    </div>
                    <p className="text-xs text-blue-600 mt-2">Pic: 412 (hier 14h)</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Uptime Système</p>
                            <p className="text-3xl font-bold text-purple-600">99.98%</p>
                        </div>
                        <Server className="h-8 w-8 text-purple-500 opacity-50" />
                    </div>
                    <p className="text-xs text-purple-600 mt-2">Dernier incident: il y a 45j</p>
                </Card>
            </div>
        </div>
    );
};

export default SuperAdminOverview;
