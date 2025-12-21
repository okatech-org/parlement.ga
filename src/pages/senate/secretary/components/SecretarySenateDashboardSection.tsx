import { ClipboardList, Vote, Calendar, FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";

export const SecretarySenateDashboardSection = () => {
    const { user } = useUser();

    const stats = [
        { icon: ClipboardList, value: "24", label: "Procès-Verbaux", subLabel: "Cette session" },
        { icon: Vote, value: "18", label: "Votes Enregistrés", subLabel: "Complets" },
        { icon: FileText, value: "5", label: "Documents en Attente", subLabel: "À valider", urgent: true },
        { icon: Calendar, value: "3", label: "Séances Prévues", subLabel: "Cette semaine" },
    ];

    const recentPV = [
        { id: "PV-2024-089", title: "Séance Plénière du 15 Décembre", status: "validé", date: "15/12/2024" },
        { id: "PV-2024-088", title: "Commission des Lois", status: "en attente", date: "12/12/2024" },
        { id: "PV-2024-087", title: "Séance Plénière du 10 Décembre", status: "validé", date: "10/12/2024" },
    ];

    return (
        <div className="space-y-8">
            <AnimatedDashboardCard delay={0}>
                <DashboardHeader
                    title={user?.bureauLabel ? `${user.bureauLabel} du Sénat` : "Secrétariat du Sénat"}
                    subtitle="République Gabonaise - Gestion des Procès-Verbaux et Votes"
                    avatarInitial="S"
                />
            </AnimatedDashboardCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <AnimatedDashboardCard key={index} delay={0.15 + index * 0.05}>
                        <DashboardStatsCard {...stat} />
                    </AnimatedDashboardCard>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatedDashboardCard delay={0.35}>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-primary" />
                                Procès-Verbaux Récents
                            </CardTitle>
                            <CardDescription>Derniers documents traités</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentPV.map((pv) => (
                                <div key={pv.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-xs">{pv.id}</Badge>
                                            <Badge
                                                className={
                                                    pv.status === 'validé'
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }
                                                variant="outline"
                                            >
                                                {pv.status}
                                            </Badge>
                                        </div>
                                        <p className="font-medium text-sm truncate">{pv.title}</p>
                                        <p className="text-xs text-muted-foreground">{pv.date}</p>
                                    </div>
                                    <Button size="sm" variant="secondary" className="ml-2 shrink-0">Voir</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </AnimatedDashboardCard>

                <AnimatedDashboardCard delay={0.4}>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Vote className="h-5 w-5 text-primary" />
                                Actions Requises
                            </CardTitle>
                            <CardDescription>Tâches en attente</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { title: "Valider PV Commission Finances", type: "PV", due: "Aujourd'hui", urgent: true },
                                { title: "Enregistrer résultats vote Loi Budget", type: "Vote", due: "Demain", urgent: false },
                                { title: "Préparer ordre du jour séance plénière", type: "Admin", due: "18 Déc", urgent: false },
                            ].map((task, i) => (
                                <div key={i} className="flex flex-col p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors cursor-pointer border-l-2 border-transparent hover:border-primary">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.urgent ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                            {task.type}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{task.due}</span>
                                    </div>
                                    <span className="font-medium text-sm line-clamp-2">{task.title}</span>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs mt-2">Voir toutes les tâches</Button>
                        </CardContent>
                    </Card>
                </AnimatedDashboardCard>
            </div>
        </div>
    );
};
