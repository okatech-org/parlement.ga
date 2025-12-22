import { FileText, Users, Vote, Calendar, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";
import { useUser } from "@/contexts/UserContext";

export const SessionSecretaryDashboardSection = () => {
    const { user } = useUser();

    const stats = [
        { icon: FileText, value: "12", label: "Procès-Verbaux", subLabel: "Ce mois" },
        { icon: Users, value: "245", label: "Présents", subLabel: "Dernier quorum" },
        { icon: Vote, value: "8", label: "Scrutins", subLabel: "À dépouiller" },
        { icon: Calendar, value: "3", label: "Sessions", subLabel: "Planifiées" },
    ];

    const recentSessions = [
        { id: 1, title: "Session du Congrès - Révision Art. 47", date: "20 déc. 2024", quorum: "245/245", status: "completed" },
        { id: 2, title: "Réunion CMP - Loi de Finances", date: "18 déc. 2024", quorum: "14/14", status: "completed" },
        { id: 3, title: "Session Extraordinaire", date: "15 déc. 2024", quorum: "230/245", status: "completed" },
    ];

    return (
        <div className="space-y-8">
            <AnimatedDashboardCard delay={0}>
                <DashboardHeader
                    title={user?.bureauLabel || "Secrétaire de Séance"}
                    subtitle="Congrès du Parlement - Gestion des Sessions"
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

            {/* Recent Sessions */}
            <AnimatedDashboardCard delay={0.4}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Sessions Récentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentSessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{session.title}</p>
                                        <p className="text-xs text-muted-foreground">{session.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            <Users className="h-3 w-3 mr-1" />
                                            {session.quorum}
                                        </Badge>
                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Terminée
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </AnimatedDashboardCard>

            {/* Quick Actions */}
            <AnimatedDashboardCard delay={0.5}>
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Actions Rapides
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-4 bg-primary/5 rounded-lg text-center cursor-pointer hover:bg-primary/10 transition-colors">
                                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <p className="font-medium text-sm">Nouveau P-V</p>
                            </div>
                            <div className="p-4 bg-amber-500/5 rounded-lg text-center cursor-pointer hover:bg-amber-500/10 transition-colors">
                                <Users className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                                <p className="font-medium text-sm">Vérifier Quorum</p>
                            </div>
                            <div className="p-4 bg-green-500/5 rounded-lg text-center cursor-pointer hover:bg-green-500/10 transition-colors">
                                <Vote className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                <p className="font-medium text-sm">Dépouiller Vote</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </AnimatedDashboardCard>
        </div>
    );
};
