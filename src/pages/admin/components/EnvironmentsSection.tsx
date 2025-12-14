import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    Landmark,
    Scale,
    Users,
    FileText,
    Calendar,
    Vote,
    TrendingUp,
    TrendingDown,
    Activity
} from "lucide-react";

const EnvironmentsSection = () => {
    const environments = [
        {
            id: "an",
            name: "Assemblée Nationale",
            icon: Building2,
            color: "emerald",
            status: "online",
            stats: {
                members: 143,
                activeSessions: 12,
                pendingBills: 45,
                votesToday: 3,
                citizenPetitions: 28,
                attendance: 92
            },
            trend: "+5%",
            trendUp: true
        },
        {
            id: "senat",
            name: "Sénat de la République",
            icon: Landmark,
            color: "amber",
            status: "online",
            stats: {
                members: 102,
                activeSessions: 8,
                pendingBills: 32,
                votesToday: 2,
                citizenPetitions: 15,
                attendance: 88
            },
            trend: "+2%",
            trendUp: true
        },
        {
            id: "congres",
            name: "Congrès du Parlement",
            icon: Scale,
            color: "blue",
            status: "online",
            stats: {
                members: 245,
                activeSessions: 2,
                pendingBills: 8,
                votesToday: 1,
                citizenPetitions: 5,
                attendance: 95
            },
            trend: "-1%",
            trendUp: false
        }
    ];

    const getColorClasses = (color: string) => ({
        bg: `bg-${color}-50 dark:bg-${color}-900/20`,
        border: `border-${color}-200 dark:border-${color}-800`,
        text: `text-${color}-600`,
        badge: `bg-${color}-100 text-${color}-700 border-${color}-200`,
        gradient: `from-${color}-500/10 to-${color}-600/5`
    });

    const globalStats = {
        totalMembers: environments.reduce((acc, e) => acc + e.stats.members, 0),
        totalSessions: environments.reduce((acc, e) => acc + e.stats.activeSessions, 0),
        totalBills: environments.reduce((acc, e) => acc + e.stats.pendingBills, 0),
        totalPetitions: environments.reduce((acc, e) => acc + e.stats.citizenPetitions, 0),
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Vue Multi-Environnements</h1>
                <p className="text-muted-foreground">Statistiques consolidées des 3 structures parlementaires</p>
            </div>

            {/* Global Summary */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-4 bg-gradient-to-br from-slate-500/10 to-slate-600/5">
                    <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-slate-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Total Parlementaires</p>
                            <p className="text-2xl font-bold">{globalStats.totalMembers}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Sessions Actives</p>
                            <p className="text-2xl font-bold">{globalStats.totalSessions}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-purple-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Textes en Cours</p>
                            <p className="text-2xl font-bold">{globalStats.totalBills}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-pink-500/10 to-pink-600/5">
                    <div className="flex items-center gap-3">
                        <Activity className="h-8 w-8 text-pink-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Pétitions Citoyennes</p>
                            <p className="text-2xl font-bold">{globalStats.totalPetitions}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Environment Cards */}
            <div className="grid gap-6 lg:grid-cols-3">
                {environments.map((env) => {
                    const Icon = env.icon;
                    const colorClasses = {
                        emerald: {
                            bg: "bg-emerald-50 dark:bg-emerald-900/20",
                            border: "border-emerald-200 dark:border-emerald-800",
                            text: "text-emerald-600",
                            iconBg: "bg-emerald-100 dark:bg-emerald-900/50"
                        },
                        amber: {
                            bg: "bg-amber-50 dark:bg-amber-900/20",
                            border: "border-amber-200 dark:border-amber-800",
                            text: "text-amber-600",
                            iconBg: "bg-amber-100 dark:bg-amber-900/50"
                        },
                        blue: {
                            bg: "bg-blue-50 dark:bg-blue-900/20",
                            border: "border-blue-200 dark:border-blue-800",
                            text: "text-blue-600",
                            iconBg: "bg-blue-100 dark:bg-blue-900/50"
                        }
                    }[env.color];

                    return (
                        <Card key={env.id} className={`p-6 ${colorClasses?.border} hover:shadow-lg transition-shadow`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${colorClasses?.iconBg}`}>
                                        <Icon className={`h-6 w-6 ${colorClasses?.text}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{env.name}</h3>
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs">
                                            En Ligne
                                        </Badge>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 text-sm ${env.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {env.trendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                    {env.trend}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-3 rounded-lg ${colorClasses?.bg}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className={`h-4 w-4 ${colorClasses?.text}`} />
                                        <span className="text-xs text-muted-foreground">Membres</span>
                                    </div>
                                    <p className="text-xl font-bold">{env.stats.members}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${colorClasses?.bg}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className={`h-4 w-4 ${colorClasses?.text}`} />
                                        <span className="text-xs text-muted-foreground">Sessions</span>
                                    </div>
                                    <p className="text-xl font-bold">{env.stats.activeSessions}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${colorClasses?.bg}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FileText className={`h-4 w-4 ${colorClasses?.text}`} />
                                        <span className="text-xs text-muted-foreground">Textes</span>
                                    </div>
                                    <p className="text-xl font-bold">{env.stats.pendingBills}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${colorClasses?.bg}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Vote className={`h-4 w-4 ${colorClasses?.text}`} />
                                        <span className="text-xs text-muted-foreground">Présence</span>
                                    </div>
                                    <p className="text-xl font-bold">{env.stats.attendance}%</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t dark:border-slate-800">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Votes aujourd'hui</span>
                                    <span className="font-medium">{env.stats.votesToday}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span className="text-muted-foreground">Pétitions citoyennes</span>
                                    <span className="font-medium">{env.stats.citizenPetitions}</span>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Comparative Chart Placeholder */}
            <Card className="p-6">
                <h3 className="font-semibold mb-4">Comparatif d'Activité (30 derniers jours)</h3>
                <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="text-muted-foreground">Graphique comparatif - Intégration Chart.js à venir</p>
                </div>
            </Card>
        </div>
    );
};

export default EnvironmentsSection;
