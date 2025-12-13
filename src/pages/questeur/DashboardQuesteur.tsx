import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Wallet, Package, AlertTriangle, CheckCircle, TrendingUp, Building2, Users, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const DashboardQuesteur = () => {
    const { t } = useLanguage();
    const { user } = useUser();

    // Determine the specific role context
    const isBudget = user?.roles.includes('questeur_budget');
    const isResources = user?.roles.includes('questeur_resources');
    const isServices = user?.roles.includes('questeur_services');
    // If generic 'questeur' or multiple roles, show overview (or default to budget if it's the only one)
    const isGeneral = user?.roles.includes('questeur') || (!isBudget && !isResources && !isServices);

    // --- MOCK DATA & METRICS DEFINITIONS ---

    // 1. BUDGET METRICS
    const budgetMetrics = [
        {
            label: "Budget Annuel",
            subLabel: "Exercice 2024",
            value: "450M FCFA",
            icon: Wallet,
            color: "text-amber-600",
            bg: "bg-amber-100 dark:bg-amber-900/20"
        },
        {
            label: "Exécution",
            subLabel: "Taux global",
            value: "68%",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-100 dark:bg-emerald-900/20"
        },
        {
            label: "Reste à Engager",
            subLabel: "Disponible",
            value: "144M FCFA",
            icon: CheckCircle,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            label: "Demandes",
            subLabel: "En attente de validation",
            value: "12",
            icon: AlertTriangle,
            color: "text-orange-600",
            bg: "bg-orange-100 dark:bg-orange-900/20"
        }
    ];

    // 2. RESOURCES METRICS
    const resourcesMetrics = [
        {
            label: "Total Inventaire",
            subLabel: "Articles enregistrés",
            value: "1,247",
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            label: "Maintenance",
            subLabel: "Équipements en réparation",
            value: "23",
            icon: AlertTriangle,
            color: "text-orange-600",
            bg: "bg-orange-100 dark:bg-orange-900/20"
        },
        {
            label: "Commandes",
            subLabel: "En cours de livraison",
            value: "8",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-100 dark:bg-emerald-900/20"
        },
        {
            label: "Valeur Stock",
            subLabel: "Estimation actuelle",
            value: "85M FCFA",
            icon: Wallet,
            color: "text-amber-600",
            bg: "bg-amber-100 dark:bg-amber-900/20"
        }
    ];

    // 3. SERVICES METRICS
    const servicesMetrics = [
        {
            label: "Personnel",
            subLabel: "Effectif total",
            value: "111",
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-100 dark:bg-indigo-900/20"
        },
        {
            label: "Services Actifs",
            subLabel: "Opérationnels",
            value: "8/8",
            icon: Building2,
            color: "text-emerald-600",
            bg: "bg-emerald-100 dark:bg-emerald-900/20"
        },
        {
            label: "Tâches",
            subLabel: "En cours de traitement",
            value: "127",
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            label: "Incidents",
            subLabel: "Signalés aujourd'hui",
            value: "3",
            icon: AlertTriangle,
            color: "text-red-600",
            bg: "bg-red-100 dark:bg-red-900/20"
        }
    ];

    // Select metrics based on role
    let activeMetrics = budgetMetrics; // Default
    if (isResources) activeMetrics = resourcesMetrics;
    if (isServices) activeMetrics = servicesMetrics;
    if (isGeneral) {
        // General view combines key metrics
        activeMetrics = [
            budgetMetrics[0], // Budget
            resourcesMetrics[0], // Inventory
            servicesMetrics[0], // Personnel
            budgetMetrics[3] // Pending Requests
        ];
    }

    // --- CHARTS DATA ---
    const budgetData = [
        { name: 'Personnel', value: 180 },
        { name: 'Équipement', value: 120 },
        { name: 'Maintenance', value: 80 },
        { name: 'Services', value: 70 },
    ];

    const expenseData = [
        { name: 'Jan', value: 35 },
        { name: 'Fév', value: 42 },
        { name: 'Mar', value: 38 },
        { name: 'Avr', value: 45 },
        { name: 'Mai', value: 40 },
        { name: 'Juin', value: 48 },
    ];

    const COLORS = ['#f59e0b', '#fb923c', '#fbbf24', '#fcd34d'];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-3xl font-bold border border-amber-500/20 text-amber-600">
                    Q
                </div>
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">
                        {isBudget ? "Espace Budget" :
                            isResources ? "Espace Ressources" :
                                isServices ? "Espace Services" : "Espace Questeur"}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {isBudget ? "Pilotage et contrôle de l'exécution budgétaire." :
                            isResources ? "Gestion du patrimoine et de la logistique." :
                                isServices ? "Coordination des services administratifs." :
                                    "Vue d'ensemble de l'administration parlementaire."}
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeMetrics.map((metric, index) => (
                    <Card key={index} className="p-6 hover:shadow-md transition-shadow duration-300 border-none shadow-sm bg-white dark:bg-card">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${metric.bg}`}>
                                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                                </div>
                                {index === 1 && <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-1 rounded-full"><ArrowUpRight className="w-3 h-3 mr-1" /> +2.4%</div>}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-bold mb-1 ${metric.color}`}>{metric.value}</h3>
                                <p className="font-bold text-sm text-foreground">{metric.label}</p>
                                <p className="text-xs text-muted-foreground">{metric.subLabel}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Section - Conditional Rendering */}
            <div className="grid md:grid-cols-2 gap-6">
                {(isBudget || isGeneral) && (
                    <>
                        <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px]">
                            <h3 className="text-xl font-serif font-bold mb-8">Répartition Budgétaire (M FCFA)</h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={budgetData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {budgetData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px]">
                            <h3 className="text-xl font-serif font-bold mb-8">Évolution des Dépenses (M FCFA)</h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={expenseData}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
                                        <YAxis hide />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60} fill="#f59e0b" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </>
                )}

                {isResources && (
                    <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px] col-span-2">
                        <h3 className="text-xl font-serif font-bold mb-8">État du Stock et Commandes</h3>
                        <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                            {/* Placeholder for Resources Chart */}
                            <p>Graphique de rotation des stocks (À implémenter)</p>
                        </div>
                    </Card>
                )}

                {isServices && (
                    <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px] col-span-2">
                        <h3 className="text-xl font-serif font-bold mb-8">Performance des Services</h3>
                        <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                            {/* Placeholder for Services Chart */}
                            <p>Graphique de résolution des tickets (À implémenter)</p>
                        </div>
                    </Card>
                )}
            </div>

            {/* Recent Activity - Context Aware */}
            <Card className="p-8 border-none shadow-sm bg-white dark:bg-card">
                <h3 className="text-xl font-serif font-bold mb-6">Activités Récentes</h3>
                <div className="space-y-4">
                    {(isBudget || isGeneral) && (
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
                            <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">Budget Q2 Approuvé</h4>
                                <p className="text-sm text-muted-foreground">Allocation trimestrielle validée - 112M FCFA</p>
                                <p className="text-xs text-muted-foreground mt-1">Il y a 2 heures</p>
                            </div>
                        </div>
                    )}

                    {(isBudget || isResources || isGeneral) && (
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-500/5 border border-orange-500/10">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">Demande d'Équipement en Attente</h4>
                                <p className="text-sm text-muted-foreground">Commission des Finances - Nouveau matériel informatique</p>
                                <p className="text-xs text-muted-foreground mt-1">Il y a 5 heures</p>
                            </div>
                        </div>
                    )}

                    {(isResources || isGeneral) && (
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                            <Package className="w-5 h-5 text-blue-600 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">Inventaire Mis à Jour</h4>
                                <p className="text-sm text-muted-foreground">347 nouveaux articles enregistrés dans le système</p>
                                <p className="text-xs text-muted-foreground mt-1">Hier</p>
                            </div>
                        </div>
                    )}

                    {(isServices || isGeneral) && (
                        <div className="flex items-start gap-4 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                            <Users className="w-5 h-5 text-indigo-600 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">Recrutement Finalisé</h4>
                                <p className="text-sm text-muted-foreground">3 nouveaux agents de sécurité ont rejoint l'équipe</p>
                                <p className="text-xs text-muted-foreground mt-1">Il y a 2 jours</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default DashboardQuesteur;
