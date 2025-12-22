import { FileText, Users, Vote, GitMerge, FileEdit, Crown, ArrowRight, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";
import { useUser } from "@/contexts/UserContext";

interface CMPMemberDashboardSectionProps {
    chamberLabel: string;
    chamberColor: string;
    isCoPresident: boolean;
}

export const CMPMemberDashboardSection = ({ chamberLabel, chamberColor, isCoPresident }: CMPMemberDashboardSectionProps) => {
    const { user } = useUser();

    const stats = [
        { icon: FileText, value: "3", label: "Textes en cours", subLabel: "Négociations" },
        { icon: FileEdit, value: "12", label: "Amendements", subLabel: "Proposés" },
        { icon: Vote, value: "2", label: "Votes prévus", subLabel: "Compromis" },
        { icon: GitMerge, value: "5", label: "CMP Actives", subLabel: "En cours" },
    ];

    const activeCMPs = [
        { id: 1, title: "Loi de Finances 2025", status: "négociation", dueDate: "23 déc. 2024", progress: 60 },
        { id: 2, title: "Réforme Collectivités Territoriales", status: "amendements", dueDate: "28 déc. 2024", progress: 40 },
        { id: 3, title: "Code de l'Environnement", status: "vote", dueDate: "30 déc. 2024", progress: 85 },
    ];

    return (
        <div className="space-y-8">
            <AnimatedDashboardCard delay={0}>
                <DashboardHeader
                    title={user?.bureauLabel || `Commissaire CMP (${chamberLabel})`}
                    subtitle="Commission Mixte Paritaire - Négociation des Textes"
                    avatarInitial={user?.name?.charAt(0) || "C"}
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

            {/* Co-President Banner (if applicable) */}
            {isCoPresident && (
                <AnimatedDashboardCard delay={0.35}>
                    <Card className="overflow-hidden border-2 border-purple-500/30">
                        <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                            <div className="flex items-center gap-3">
                                <Crown className="h-8 w-8" />
                                <div>
                                    <h3 className="font-bold text-lg">Coprésident CMP</h3>
                                    <p className="text-sm opacity-90">
                                        Présidence alternée avec le {chamberLabel === "AN" ? "Sénat" : "l'Assemblée Nationale"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </AnimatedDashboardCard>
            )}

            {/* Chamber Badge */}
            <AnimatedDashboardCard delay={0.4}>
                <Card className="overflow-hidden">
                    <div className="p-4 text-white" style={{ backgroundColor: chamberColor }}>
                        <div className="flex items-center gap-3">
                            <Scale className="h-8 w-8" />
                            <div>
                                <h3 className="font-bold text-lg">Commissaire désigné par {chamberLabel === "AN" ? "l'Assemblée Nationale" : "le Sénat"}</h3>
                                <p className="text-sm opacity-90">
                                    {user?.circonscription || user?.province || chamberLabel}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </AnimatedDashboardCard>

            {/* Active CMPs */}
            <AnimatedDashboardCard delay={0.45}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GitMerge className="h-5 w-5 text-purple-500" />
                            CMP en Cours
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activeCMPs.map((cmp) => (
                                <div key={cmp.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{cmp.title}</p>
                                        <p className="text-xs text-muted-foreground">Échéance: {cmp.dueDate}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={
                                                cmp.status === 'vote' ? 'border-green-500 text-green-500' :
                                                    cmp.status === 'amendements' ? 'border-amber-500 text-amber-500' :
                                                        'border-purple-500 text-purple-500'
                                            }
                                        >
                                            {cmp.status === 'vote' ? 'Vote' : cmp.status === 'amendements' ? 'Amendements' : 'Négociation'}
                                        </Badge>
                                        <div className="w-16 bg-muted rounded-full h-2">
                                            <div
                                                className="bg-purple-500 h-2 rounded-full"
                                                style={{ width: `${cmp.progress}%` }}
                                            />
                                        </div>
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
                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5 text-purple-500" />
                            Actions CMP
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-4 bg-purple-500/5 rounded-lg text-center cursor-pointer hover:bg-purple-500/10 transition-colors">
                                <FileText className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                                <p className="font-medium text-sm">Négocier Texte</p>
                            </div>
                            <div className="p-4 bg-amber-500/5 rounded-lg text-center cursor-pointer hover:bg-amber-500/10 transition-colors">
                                <FileEdit className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                                <p className="font-medium text-sm">Proposer Amendement</p>
                            </div>
                            <div className="p-4 bg-green-500/5 rounded-lg text-center cursor-pointer hover:bg-green-500/10 transition-colors">
                                <Vote className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                <p className="font-medium text-sm">Voter Compromis</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </AnimatedDashboardCard>
        </div>
    );
};
