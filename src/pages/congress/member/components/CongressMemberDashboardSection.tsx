import { FileText, Users, Vote, Calendar, Scale, GitMerge, HelpCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";
import { useUser } from "@/contexts/UserContext";

interface CongressMemberDashboardSectionProps {
    chamberLabel: string;
    chamberColor: string;
}

export const CongressMemberDashboardSection = ({ chamberLabel, chamberColor }: CongressMemberDashboardSectionProps) => {
    const { user } = useUser();

    const stats = [
        { icon: Scale, value: "2", label: "Révisions en cours", subLabel: "Constitutionnelles" },
        { icon: GitMerge, value: "4", label: "CMP Actives", subLabel: "Négociations" },
        { icon: Vote, value: "3", label: "Votes prévus", subLabel: "Cette session" },
        { icon: HelpCircle, value: "5", label: "Questions", subLabel: "Déposées" },
    ];

    const upcomingVotes = [
        { id: 1, title: "Révision Art. 47 - Collectivités Territoriales", date: "23 déc. 2024", type: "révision", majority: "3/5" },
        { id: 2, title: "Loi de Finances 2025 - Texte CMP", date: "22 déc. 2024", type: "cmp", majority: "Simple" },
        { id: 3, title: "Révision Art. 12 - Droits Fondamentaux", date: "28 déc. 2024", type: "révision", majority: "3/5" },
    ];

    return (
        <div className="space-y-8">
            <AnimatedDashboardCard delay={0}>
                <DashboardHeader
                    title={user?.bureauLabel || `${chamberLabel} (Congrès)`}
                    subtitle="Congrès du Parlement - Sessions Conjointes"
                    avatarInitial={chamberLabel.charAt(0)}
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

            {/* Chamber Badge */}
            <AnimatedDashboardCard delay={0.35}>
                <Card className="overflow-hidden">
                    <div className="p-4 text-white" style={{ backgroundColor: chamberColor }}>
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8" />
                            <div>
                                <h3 className="font-bold text-lg">Membre du Congrès</h3>
                                <p className="text-sm opacity-90">
                                    Siège au titre de {chamberLabel} - {user?.circonscription || user?.province || "Parlement"}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </AnimatedDashboardCard>

            {/* Upcoming Votes */}
            <AnimatedDashboardCard delay={0.4}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Vote className="h-5 w-5 text-primary" />
                            Prochains Votes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingVotes.map((vote) => (
                                <div key={vote.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{vote.title}</p>
                                        <p className="text-xs text-muted-foreground">{vote.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={vote.type === 'révision' ? 'border-amber-500 text-amber-500' : 'border-purple-500 text-purple-500'}
                                        >
                                            {vote.type === 'révision' ? 'Révision' : 'CMP'}
                                        </Badge>
                                        <Badge variant="secondary">
                                            {vote.majority}
                                        </Badge>
                                        <Button size="sm" variant="ghost">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </AnimatedDashboardCard>

            {/* Quick Actions */}
            <AnimatedDashboardCard delay={0.5}>
                <Card className="border-l-4" style={{ borderLeftColor: chamberColor }}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" style={{ color: chamberColor }} />
                            Actions du Congrès
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-4 bg-amber-500/5 rounded-lg text-center cursor-pointer hover:bg-amber-500/10 transition-colors">
                                <Scale className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                                <p className="font-medium text-sm">Révision Const.</p>
                            </div>
                            <div className="p-4 bg-purple-500/5 rounded-lg text-center cursor-pointer hover:bg-purple-500/10 transition-colors">
                                <GitMerge className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                                <p className="font-medium text-sm">Débats CMP</p>
                            </div>
                            <div className="p-4 bg-green-500/5 rounded-lg text-center cursor-pointer hover:bg-green-500/10 transition-colors">
                                <HelpCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                <p className="font-medium text-sm">Poser Question</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </AnimatedDashboardCard>
        </div>
    );
};
