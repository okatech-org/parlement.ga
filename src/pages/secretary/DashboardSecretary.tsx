import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { FileText, Calendar, Mail, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const DashboardSecretary = () => {
    const { t } = useLanguage();
    const { user } = useUser();

    // Use bureauLabel for display (e.g., "1er Secrétaire", "2ème Secrétaire")
    const secretaryLabel = user?.bureauLabel || "Secrétaire";

    const metrics = [
        {
            label: "Documents Traités",
            value: "128",
            icon: FileText,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            label: "Séances à Venir",
            value: "3",
            icon: Calendar,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Messages Non Lus",
            value: "5",
            icon: Mail,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            label: "Tâches Urgentes",
            value: "2",
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-500/10"
        }
    ];

    const documentStats = [
        { name: 'Lundi', value: 12 },
        { name: 'Mardi', value: 19 },
        { name: 'Mercredi', value: 15 },
        { name: 'Jeudi', value: 22 },
        { name: 'Vendredi', value: 18 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl font-bold border border-border/50 text-indigo-600">
                    S
                </div>
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Espace {secretaryLabel}</h1>
                    <p className="text-muted-foreground text-lg">Bienvenue dans votre espace de gestion administrative.</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-none shadow-sm bg-white dark:bg-card group cursor-pointer">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${metric.bg} group-hover:scale-110 transition-transform duration-300`}>
                                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                                </div>
                                {index === 3 && (
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold mb-1 group-hover:text-indigo-600 transition-colors">{metric.value}</h3>
                                <p className="font-medium text-muted-foreground">{metric.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity / Chart */}
                <Card className="lg:col-span-2 p-8 border-none shadow-sm bg-white dark:bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-serif font-bold">Activité Hebdomadaire</h3>
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4" />
                            <span>+12% vs semaine dernière</span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={documentStats}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#888888' }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                >
                                    {documentStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#6366f1" className="hover:opacity-80 transition-opacity" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Quick Actions / Notifications */}
                <Card className="p-6 border-none shadow-sm bg-white dark:bg-card hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-serif font-bold mb-6">Tâches Récentes</h3>
                    <div className="space-y-4">
                        {[
                            { title: "Préparer l'ordre du jour", time: "Il y a 2h", status: "completed" },
                            { title: "Valider le CR de séance", time: "Il y a 4h", status: "pending" },
                            { title: "Envoyer les convocations", time: "Hier", status: "completed" },
                            { title: "Mise à jour des dossiers", time: "Hier", status: "pending" },
                        ].map((task, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                                {task.status === 'completed' ? (
                                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                ) : (
                                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/20">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-medium text-sm group-hover:text-indigo-600 transition-colors">{task.title}</p>
                                    <p className="text-xs text-muted-foreground">{task.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardSecretary;
