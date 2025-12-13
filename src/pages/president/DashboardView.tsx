import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Gavel, FileText, Calendar, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

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
            color: "text-red-500"
        }
    ];

    const partyData = [
        { name: 'PDG', value: 98, color: '#22c55e' }, // Green
        { name: 'LD', value: 25, color: '#ef4444' },  // Red
        { name: 'Ind.', value: 20, color: '#eab308' }, // Yellow
    ];

    const lawStatusData = [
        { name: 'Adopted', value: 45 },
        { name: 'Review', value: 12 },
        { name: 'Rejected', value: 5 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl font-bold border border-border/50">
                    P
                </div>
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">{t('president.title')}</h1>
                    <p className="text-muted-foreground text-lg">{t('president.subtitle')}</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-300 border-none shadow-sm bg-white dark:bg-card">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-gray-100 dark:bg-muted">
                                    <metric.icon className="w-6 h-6 text-gray-600 dark:text-foreground" />
                                </div>
                                {index === 3 && (
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                )}
                            </div>
                            <div>
                                <h3 className={`text-4xl font-bold mb-1 ${metric.color}`}>{metric.value}</h3>
                                <p className="font-bold text-sm text-foreground">{metric.label}</p>
                                <p className="text-xs text-muted-foreground">{metric.subLabel}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Performance Card */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-none shadow-sm bg-white dark:bg-card">
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
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Party Distribution */}
                <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px]">
                    <h3 className="text-xl font-serif font-bold mb-8">{t('president.charts.partyDistribution')}</h3>
                    <div className="h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={partyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {partyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Law Status Distribution */}
                <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px]">
                    <h3 className="text-xl font-serif font-bold mb-8">{t('president.charts.lawStatus')}</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lawStatusData}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#888888' }}
                                />
                                <YAxis
                                    hide
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[4, 4, 0, 0]}
                                    barSize={60}
                                >
                                    {lawStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : '#aaaaaa'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardView;
