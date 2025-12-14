import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Briefcase, Crown, Calendar, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";

const DashboardVP = () => {
    const { t } = useLanguage(); // Kept for consistency if needed later

    const metrics = [
        { label: "Dossiers Délégués", subLabel: "En traitement", value: "5", icon: Briefcase, color: "text-indigo-600" },
        { label: "Statut Intérim", subLabel: "Présidence", value: "Inactif", icon: Crown, color: "text-gray-500" },
        { label: "Représentations", subLabel: "Cette semaine", value: "3", icon: Calendar, color: "text-blue-600" },
        { label: "Commissions", subLabel: "Sous supervision", value: "2", icon: CheckCircle, color: "text-emerald-600" }
    ];

    const activityData = [
        { label: 'Délégations', value: 12, color: '#4f46e5' },
        { label: 'Intérims', value: 2, color: '#8b5cf6' },
        { label: 'Audiences', value: 25, color: '#ec4899' },
        { label: 'Séances', value: 18, color: '#f43f5e' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <AnimatedDashboardCard delay={0}>
                <DashboardHeader
                    title="Espace 1er Vice-Président"
                    subtitle="Supervision des délégations et continuité de la Présidence."
                    avatarInitial="VP"
                />
            </AnimatedDashboardCard>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <AnimatedDashboardCard key={index} delay={0.1 + index * 0.05}>
                        <DashboardStatsCard
                            icon={metric.icon}
                            value={metric.value}
                            label={metric.label}
                            subLabel={metric.subLabel}
                        />
                    </AnimatedDashboardCard>
                ))}
            </div>

            {/* Charts & Info */}
            <div className="grid md:grid-cols-2 gap-6">
                <AnimatedDashboardCard delay={0.3}>
                    <Card className="h-full border-none shadow-sm bg-white dark:bg-card">
                        <CardHeader>
                            <CardTitle>Activités Institutionnelles</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <InteractiveDonutChart
                                data={activityData}
                                size={220}
                                thickness={40}
                                centerLabel="Total"
                                centerValue="57"
                            />
                        </CardContent>
                    </Card>
                </AnimatedDashboardCard>

                <AnimatedDashboardCard delay={0.4}>
                    <Card className="h-full border-none shadow-sm bg-white dark:bg-card overflow-y-auto p-4">
                        <CardHeader className="pt-2">
                            <CardTitle>Alertes & Priorités</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/15 transition-colors cursor-pointer">
                                <div className="flex gap-3">
                                    <Briefcase className="w-5 h-5 text-indigo-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-indigo-800 dark:text-indigo-500">Dossier "Réforme Fiscale"</h4>
                                        <p className="text-sm text-indigo-700/80 dark:text-indigo-500/80 mt-1">
                                            Délégué par le Président. À valider avant le 15/12.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors cursor-pointer">
                                <div className="flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-amber-800 dark:text-amber-500">Préparation Intérim</h4>
                                        <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mt-1">
                                            Le Président sera en déplacement du 20 au 25 Décembre.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </AnimatedDashboardCard>
            </div>
        </div>
    );
};

export default DashboardVP;
