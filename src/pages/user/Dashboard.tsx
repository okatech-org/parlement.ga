import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Activity,
    FileText,
    MessageSquare,
    Calendar,
    ArrowRight,
    TrendingUp
} from "lucide-react";

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Tableau de bord
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Bienvenue dans votre espace personnel. Voici un aperçu de vos activités.
                    </p>
                </div>
                <Button className="neu-raised hover:scale-105 transition-transform bg-primary text-primary-foreground shadow-lg hover:shadow-xl border-none">
                    Nouvelle demande
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Documents", icon: FileText, value: "12", sub: "+2 depuis le mois dernier", color: "text-blue-500" },
                    { title: "Messages", icon: MessageSquare, value: "+5", sub: "3 non lus", color: "text-green-500" },
                    { title: "Rendez-vous", icon: Calendar, value: "3", sub: "Prochain dans 2 jours", color: "text-purple-500" },
                    { title: "Activité", icon: Activity, value: "+573", sub: "+201 depuis la dernière heure", color: "text-orange-500" },
                ].map((item, index) => (
                    <div key={index} className="neu-raised p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                {item.title}
                            </h3>
                            <div className={`p-2 rounded-full neu-inset ${item.color}`}>
                                <item.icon className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-bold text-foreground">{item.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {item.sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 neu-raised rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Activités Récentes</h3>
                        <Button variant="ghost" size="sm" className="neu-inset hover:bg-background">Voir tout</Button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center group">
                                <div className="h-10 w-10 rounded-full neu-inset flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <div className="ml-4 space-y-1 flex-1">
                                    <p className="text-sm font-medium leading-none">
                                        Document signé
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Vous avez signé le document #DOC-2024-{100 + i}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium text-sm text-muted-foreground">
                                    Il y a {i}h
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-3 neu-raised rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Notifications</h3>
                        <Button variant="ghost" size="icon" className="neu-icon-btn h-8 w-8">
                            <span className="sr-only">Settings</span>
                            <div className="h-1 w-1 rounded-full bg-foreground" />
                            <div className="h-1 w-1 rounded-full bg-foreground mx-0.5" />
                            <div className="h-1 w-1 rounded-full bg-foreground" />
                        </Button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                <span className="relative flex h-2 w-2 mt-2 mr-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                </span>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Nouvelle directive
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        Le service administratif a publié une note importante concernant les nouvelles procédures.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
