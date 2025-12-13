import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Eye, Calendar, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const DashboardSubstitute = () => {
    const { t } = useLanguage();

    const metrics = [
        {
            label: "Préparation",
            subLabel: "Modules validés",
            value: "85%",
            icon: BookOpen,
            color: "text-teal-600"
        },
        {
            label: "Dossiers Suivis",
            subLabel: "Lois en cours",
            value: "8",
            icon: Eye,
            color: "text-blue-600"
        },
        {
            label: "Présence Titulaire",
            subLabel: "Taux de participation",
            value: "92%",
            icon: CheckCircle,
            color: "text-emerald-600"
        },
        {
            label: "Prochaine Alerte",
            subLabel: "Suppléance possible",
            value: "Aucune",
            icon: AlertCircle,
            color: "text-gray-500"
        }
    ];

    const readinessData = [
        { name: 'Constitution', value: 100 },
        { name: 'Règlement', value: 80 },
        { name: 'Procédures', value: 60 },
        { name: 'Budget', value: 90 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center text-3xl font-bold border border-teal-500/20 text-teal-600">
                    S
                </div>
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Espace Suppléant</h1>
                    <p className="text-muted-foreground text-lg">Suivez les travaux et préparez-vous à servir.</p>
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
                    <h3 className="text-xl font-serif font-bold mb-8">Niveau de Préparation</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={readinessData}>
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
                                    fill="#0d9488"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px] overflow-y-auto">
                    <h3 className="text-xl font-serif font-bold mb-6">Actualités du Titulaire</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
                                <div>
                                    <h4 className="font-bold text-emerald-800 dark:text-emerald-500">Vote Effectué</h4>
                                    <p className="text-sm text-emerald-700/80 dark:text-emerald-500/80 mt-1">
                                        A voté "Pour" sur la Loi de Finances 2026.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="flex gap-3">
                                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <h4 className="font-bold text-blue-800 dark:text-blue-500">Déplacement en Circonscription</h4>
                                    <p className="text-sm text-blue-700/80 dark:text-blue-500/80 mt-1">
                                        Prévu du 15 au 20 Décembre.
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

export default DashboardSubstitute;
