import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Wallet, Package, AlertTriangle, CheckCircle, TrendingUp, Building2, Users, FileText, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AnimatedDashboardCard } from "@/components/animations/DashboardAnimations";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";

const DashboardQuesteur = () => {
    const { t } = useLanguage();
    const { user } = useUser();

    // Determine the specific role context
    const isBudget = user?.roles.includes('questeur_budget');
    const isResources = user?.roles.includes('questeur_resources');
    const isServices = user?.roles.includes('questeur_services');
    const isGeneral = user?.roles.includes('questeur') || (!isBudget && !isResources && !isServices);

    // --- MOCK DATA & METRICS DEFINITIONS ---
    const budgetMetrics = [
        { label: "Budget Annuel", subLabel: "Exercice 2024", value: "450M FCFA", icon: Wallet, color: "text-amber-600" },
        { label: "Exécution", subLabel: "Taux global", value: "68%", icon: TrendingUp, color: "text-emerald-600" },
        { label: "Reste à Engager", subLabel: "Disponible", value: "144M FCFA", icon: CheckCircle, color: "text-blue-600" },
        { label: "Demandes", subLabel: "En attente", value: "12", icon: AlertTriangle, color: "text-orange-600", urgent: true }
    ];

    const resourcesMetrics = [
        { label: "Total Inventaire", subLabel: "Articles", value: "1,247", icon: Package, color: "text-blue-600" },
        { label: "Maintenance", subLabel: "En réparation", value: "23", icon: AlertTriangle, color: "text-orange-600" },
        { label: "Commandes", subLabel: "En livraison", value: "8", icon: TrendingUp, color: "text-emerald-600" },
        { label: "Valeur Stock", subLabel: "Estimation", value: "85M FCFA", icon: Wallet, color: "text-amber-600" }
    ];

    const servicesMetrics = [
        { label: "Personnel", subLabel: "Effectif total", value: "111", icon: Users, color: "text-indigo-600" },
        { label: "Services Actifs", subLabel: "Opérationnels", value: "8/8", icon: Building2, color: "text-emerald-600" },
        { label: "Tâches", subLabel: "En traitement", value: "127", icon: FileText, color: "text-blue-600" },
        { label: "Incidents", subLabel: "Aujourd'hui", value: "3", icon: AlertTriangle, color: "text-red-600", urgent: true }
    ];

    let activeMetrics = budgetMetrics;
    if (isResources) activeMetrics = resourcesMetrics;
    if (isServices) activeMetrics = servicesMetrics;
    if (isGeneral) {
        activeMetrics = [budgetMetrics[0], resourcesMetrics[0], servicesMetrics[0], budgetMetrics[3]];
    }

    // --- CHARTS DATA ---
    const budgetData = [
        { label: 'Personnel', value: 180, color: '#f59e0b' },
        { label: 'Équipement', value: 120, color: '#fb923c' },
        { label: 'Maintenance', value: 80, color: '#fbbf24' },
        { label: 'Services', value: 70, color: '#fcd34d' },
    ];

    const expenseData = [
        { name: 'Jan', value: 35 },
        { name: 'Fév', value: 42 },
        { name: 'Mar', value: 38 },
        { name: 'Avr', value: 45 },
        { name: 'Mai', value: 40 },
        { name: 'Juin', value: 48 },
    ];

    const title = isBudget ? "Espace Budget" : isResources ? "Espace Ressources" : isServices ? "Espace Services" : "Espace Questeur";
    const subtitle = isBudget ? "Pilotage et contrôle de l'exécution budgétaire." : isResources ? "Gestion du patrimoine et de la logistique." : isServices ? "Coordination des services administratifs." : "Vue d'ensemble de l'administration parlementaire.";

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <AnimatedDashboardCard delay={0}>
                <DashboardHeader
                    title={title}
                    subtitle={subtitle}
                    avatarInitial="Q"
                />
            </AnimatedDashboardCard>

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeMetrics.map((metric, index) => (
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

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {(isBudget || isGeneral) && (
                    <>
                        <AnimatedDashboardCard delay={0.3}>
                            <Card className="h-full border-none shadow-sm bg-white dark:bg-card">
                                <CardHeader>
                                    <CardTitle>Répartition Budgétaire</CardTitle>
                                    <CardDescription>En Millions de FCFA</CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <InteractiveDonutChart
                                        data={budgetData}
                                        size={220}
                                        thickness={40}
                                        centerLabel="Total"
                                        centerValue="450M"
                                    />
                                </CardContent>
                            </Card>
                        </AnimatedDashboardCard>

                        <AnimatedDashboardCard delay={0.4}>
                            <Card className="h-full border-none shadow-sm bg-white dark:bg-card p-8">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle>Évolution des Dépenses</CardTitle>
                                </CardHeader>
                                <div className="h-[250px] pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={expenseData}>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
                                            <YAxis hide />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} fill="#f59e0b" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </AnimatedDashboardCard>
                    </>
                )}

                {isResources && (
                    <AnimatedDashboardCard delay={0.3} className="col-span-2">
                        <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px]">
                            <CardTitle className="mb-8">État du Stock et Commandes</CardTitle>
                            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                                <p>Graphique de rotation des stocks (À implémenter)</p>
                            </div>
                        </Card>
                    </AnimatedDashboardCard>
                )}

                {isServices && (
                    <AnimatedDashboardCard delay={0.3} className="col-span-2">
                        <Card className="p-8 border-none shadow-sm bg-white dark:bg-card h-[400px]">
                            <CardTitle className="mb-8">Performance des Services</CardTitle>
                            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                                <p>Graphique de résolution des tickets (À implémenter)</p>
                            </div>
                        </Card>
                    </AnimatedDashboardCard>
                )}
            </div>

            {/* Recent Activity */}
            <AnimatedDashboardCard delay={0.5}>
                <Card className="p-8 border-none shadow-sm bg-white dark:bg-card">
                    <CardTitle className="mb-6">Activités Récentes</CardTitle>
                    <div className="space-y-4">
                        {(isBudget || isGeneral) && (
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                                <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Budget Q2 Approuvé</h4>
                                    <p className="text-sm text-muted-foreground">Allocation trimestrielle validée - 112M FCFA</p>
                                    <p className="text-xs text-muted-foreground mt-1">Il y a 2 heures</p>
                                </div>
                            </div>
                        )}

                        {(isBudget || isResources || isGeneral) && (
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-colors">
                                <AlertTriangle className="w-5 h-5 text-orange-600 mt-1" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Demande d'Équipement en Attente</h4>
                                    <p className="text-sm text-muted-foreground">Commission des Finances - Nouveau matériel informatique</p>
                                    <p className="text-xs text-muted-foreground mt-1">Il y a 5 heures</p>
                                </div>
                            </div>
                        )}

                        {(isResources || isGeneral) && (
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors">
                                <Package className="w-5 h-5 text-blue-600 mt-1" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Inventaire Mis à Jour</h4>
                                    <p className="text-sm text-muted-foreground">347 nouveaux articles enregistrés dans le système</p>
                                    <p className="text-xs text-muted-foreground mt-1">Hier</p>
                                </div>
                            </div>
                        )}

                        {(isServices || isGeneral) && (
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-colors">
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
            </AnimatedDashboardCard>
        </div>
    );
};

export default DashboardQuesteur;
