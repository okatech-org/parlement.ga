import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Gavel, FileText, Calendar, TrendingUp } from "lucide-react";
import { AnimatedDashboardCard, AnimatedProgressBar } from "@/components/animations/DashboardAnimations";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";

const DashboardView = () => {
    const { t } = useLanguage();

    const metrics = [
        {
            label: t('president.metrics.deputies'),
            subLabel: t('president.metrics.groups'),
            value: "143",
            icon: Users,
            color: "text-foreground"
        },
        {
            label: t('president.metrics.bills'),
            subLabel: t('president.metrics.inProgress'),
            value: "12",
            icon: FileText,
            color: "text-foreground"
        },
        {
            label: t('president.metrics.commissions'),
            subLabel: t('president.metrics.plenarySessions'),
            value: "8",
            icon: Gavel,
            color: "text-foreground"
        },
        {
            label: t('president.metrics.plenarySessions'),
            subLabel: t('president.metrics.urgent'),
            value: "3",
            icon: Calendar,
            urgent: true
        }
    ];

    const partyData = [
        { label: 'PDG', value: 98, color: '#22c55e' }, // Green
        { label: 'LD', value: 25, color: '#ef4444' },  // Red
        { label: 'Ind.', value: 20, color: '#eab308' }, // Yellow
    ];

    const lawStatusData = [
        { name: 'Adoptés', value: 45, color: '#22c55e' },
        { name: 'En Examen', value: 12, color: '#3b82f6' },
        { name: 'Rejetés', value: 5, color: '#ef4444' },
    ];

    const totalLaws = lawStatusData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="space-y-8 animate-fade-in">
            <AnimatedDashboardCard delay={0}>
                <DashboardHeader
                    title={t('president.title')}
                    subtitle={t('president.subtitle')}
                    avatarInitial="P"
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
                            urgent={metric.urgent}
                        />
                    </AnimatedDashboardCard>
                ))}
            </div>

            {/* Performance Card (Attendance) */}
            <div className="grid md:grid-cols-3 gap-6">
                <AnimatedDashboardCard delay={0.25} className="h-full">
                    <Card className="h-full border-none shadow-sm bg-white dark:bg-card p-4">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 rounded-xl bg-gray-100 dark:bg-muted">
                                <TrendingUp className="w-6 h-6 text-gray-600 dark:text-foreground" />
                            </div>
                            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> {t('president.charts.increase')}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">{t('president.charts.attendance')}</p>
                            <h3 className="text-3xl font-bold">94%</h3>
                        </div>
                    </Card>
                </AnimatedDashboardCard>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Party Distribution */}
                <AnimatedDashboardCard delay={0.3}>
                    <Card className="h-full border-none shadow-sm bg-white dark:bg-card">
                        <CardHeader>
                            <CardTitle className="font-serif">{t('president.charts.partyDistribution')}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <InteractiveDonutChart
                                data={partyData}
                                size={220}
                                thickness={40}
                                centerLabel="Députés"
                                centerValue="143"
                            />
                        </CardContent>
                    </Card>
                </AnimatedDashboardCard>

                {/* Law Status Distribution */}
                <AnimatedDashboardCard delay={0.4}>
                    <Card className="h-full border-none shadow-sm bg-white dark:bg-card">
                        <CardHeader>
                            <CardTitle className="font-serif">{t('president.charts.lawStatus')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            {lawStatusData.map((item, index) => (
                                <AnimatedProgressBar
                                    key={index}
                                    label={item.name}
                                    value={item.value}
                                    max={totalLaws}
                                    color={`bg-[${item.color}]`}
                                    delay={0.5 + index * 0.1}
                                    showValue
                                />
                            ))}
                        </CardContent>
                    </Card>
                </AnimatedDashboardCard>
            </div>
        </div>
    );
};

export default DashboardView;
