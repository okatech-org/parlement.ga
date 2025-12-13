import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Briefcase, Crown, Calendar, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const DashboardVP = () => {
    const { t } = useLanguage();

    const metrics = [
        {
            label: "Dossiers Délégués",
            subLabel: "En cours de traitement",
            value: "5",
            icon: Briefcase,
            color: "text-indigo-600"
        },
        {
            label: "Statut Intérim",
            subLabel: "Présidence",
            value: "Inactif",
            icon: Crown,
            color: "text-gray-500"
        },
        {
            label: "Représentations",
            subLabel: "Cette semaine",
            value: "3",
            icon: Calendar,
            color: "text-blue-600"
        },
        {
            label: "Commissions",
            subLabel: "Sous supervision",
            value: "2",
            icon: CheckCircle,
            color: "text-emerald-600"
        }
    ];

    const activityData = [
        { name: 'Délégations', value: 12 },
        { name: 'Intérims', value: 2 },
        { name: 'Audiences', value: 25 },
        { name: 'Séances', value: 18 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-3xl font-bold border border-indigo-500/20 text-indigo-600">
                    VP
                </div>
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Espace 1er Vice-Président</h1>
                    <p className="text-muted-foreground text-lg">Supervision des délégations et continuité de la Présidence.</p>
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

            {/* Charts & Info */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px]">
                    <h3 className="text-xl font-serif font-bold mb-8">Activités Institutionnelles</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#888888' }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[4, 4, 0, 0]}
                                    barSize={60}
                                    fill="#4f46e5"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px] overflow-y-auto">
                    <h3 className="text-xl font-serif font-bold mb-6">Alertes & Priorités</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
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
                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
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
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardVP;
