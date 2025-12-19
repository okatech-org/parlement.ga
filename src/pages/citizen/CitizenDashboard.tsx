import {
    Bell, FileText, CalendarDays, Heart, MessageSquare,
    TrendingUp, Vote, Eye, Users, Building2, Landmark, Scale,
    ChevronRight, ExternalLink, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

/**
 * Dashboard Citoyen Universel
 * Accès aux travaux des 3 institutions (AN, Sénat, Parlement)
 * 
 * Palette officielle:
 * - AN: #3A87FD (bleu)
 * - Sénat: #D19C00 (or)
 * - Parlement: #77BA41 (vert)
 * - Citoyen: #04CDB9 (cyan)
 */
const DashboardCitizen = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const basePath = "/espace/citoyen";

    // Mock data - textes suivis des deux chambres
    const followedTexts = [
        { id: 1, title: "Projet de loi sur le numérique", chamber: "AN", status: "En commission", progress: 40 },
        { id: 2, title: "Proposition de loi environnement", chamber: "Sénat", status: "1ère lecture", progress: 25 },
        { id: 3, title: "Budget 2025", chamber: "Congrès", status: "Vote prévu", progress: 75 },
    ];

    // Événements des deux chambres
    const upcomingEvents = [
        { id: 1, title: "Séance plénière AN", chamber: "AN", date: "23 Déc", time: "10:00" },
        { id: 2, title: "Questions au Gouvernement", chamber: "Sénat", date: "26 Déc", time: "15:00" },
    ];

    // Notifications
    const notifications = [
        { id: 1, title: "Nouveau texte en discussion à l'AN", time: "Il y a 2h", read: false },
        { id: 2, title: "Votre pétition a atteint 5000 signatures", time: "Hier", read: true },
    ];

    // Institutions pour les raccourcis avec couleurs officielles
    const institutions = [
        {
            name: "Assemblée Nationale",
            path: "/an",
            icon: Building2,
            color: "#3A87FD",
            bgLight: "bg-[#3A87FD]/10",
            textColor: "text-[#3A87FD]",
            borderColor: "border-[#3A87FD]"
        },
        {
            name: "Sénat",
            path: "/senat",
            icon: Landmark,
            color: "#D19C00",
            bgLight: "bg-[#D19C00]/10",
            textColor: "text-[#D19C00]",
            borderColor: "border-[#D19C00]"
        },
        {
            name: "Parlement / Congrès",
            path: "/parlement",
            icon: Scale,
            color: "#77BA41",
            bgLight: "bg-[#77BA41]/10",
            textColor: "text-[#77BA41]",
            borderColor: "border-[#77BA41]"
        },
    ];

    // Couleur citoyen
    const citizenColor = "#04CDB9";

    // Helper pour obtenir la couleur par chambre
    const getChamberStyle = (chamber: string) => {
        switch (chamber) {
            case 'AN': return { text: 'text-[#3A87FD]', border: 'border-[#3A87FD]' };
            case 'Sénat': return { text: 'text-[#D19C00]', border: 'border-[#D19C00]' };
            case 'Congrès': return { text: 'text-[#77BA41]', border: 'border-[#77BA41]' };
            default: return { text: 'text-muted-foreground', border: 'border-muted' };
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header - Couleur Citoyen #04CDB9 */}
            <div
                className="rounded-xl p-6 text-white"
                style={{ background: `linear-gradient(135deg, ${citizenColor} 0%, #03A89A 100%)` }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                        <Users className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Bienvenue, {user?.name || 'Citoyen'}</h1>
                        <p className="text-white/80">Espace Citoyen • Parlement Gabonais</p>
                    </div>
                </div>
            </div>

            {/* Accès aux 3 Institutions */}
            <div className="grid md:grid-cols-3 gap-4">
                {institutions.map((inst, index) => (
                    <Card
                        key={index}
                        className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-[#04CDB9]/30"
                        onClick={() => navigate(inst.path)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg ${inst.bgLight} flex items-center justify-center`}>
                                    <inst.icon className={`w-6 h-6 ${inst.textColor}`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{inst.name}</h3>
                                    <p className="text-xs text-muted-foreground">Accéder au portail</p>
                                </div>
                                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`${basePath}/suivi`)}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#04CDB9]/10 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-[#04CDB9]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{followedTexts.length}</p>
                                <p className="text-xs text-muted-foreground">Textes suivis</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`${basePath}/petitions`)}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                <Heart className="w-5 h-5 text-pink-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">3</p>
                                <p className="text-xs text-muted-foreground">Pétitions signées</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`${basePath}/agenda`)}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#77BA41]/10 flex items-center justify-center">
                                <CalendarDays className="w-5 h-5 text-[#77BA41]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{upcomingEvents.length}</p>
                                <p className="text-xs text-muted-foreground">Événements</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`${basePath}/notifications`)}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{notifications.filter(n => !n.read).length}</p>
                                <p className="text-xs text-muted-foreground">Notifications</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Followed Texts - Both Chambers */}
                <Card className="border-[#04CDB9]/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#04CDB9]" />
                            Textes suivis
                        </CardTitle>
                        <CardDescription>
                            Projets et propositions de loi des deux chambres
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {followedTexts.map(text => {
                            const style = getChamberStyle(text.chamber);
                            return (
                                <div key={text.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-sm">{text.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`${style.text} ${style.border}`}>
                                                {text.chamber}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">{text.status}</Badge>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all"
                                            style={{
                                                width: `${text.progress}%`,
                                                background: `linear-gradient(90deg, ${citizenColor} 0%, #03A89A 100%)`
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        <Button variant="outline" className="w-full" onClick={() => navigate(`${basePath}/suivi`)}>
                            Voir tous les textes
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Upcoming Events - Both Chambers */}
                <Card className="border-[#04CDB9]/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-[#77BA41]" />
                            Prochains événements
                        </CardTitle>
                        <CardDescription>
                            Séances publiques (AN et Sénat)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {upcomingEvents.map(event => {
                            const style = getChamberStyle(event.chamber);
                            return (
                                <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border hover:shadow-sm transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-lg bg-muted flex flex-col items-center justify-center">
                                        <span className="text-lg font-bold">
                                            {event.date.split(' ')[0]}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {event.date.split(' ')[1]}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">{event.title}</h4>
                                        <p className="text-xs text-muted-foreground">{event.time}</p>
                                    </div>
                                    <Badge variant="outline" className={`${style.text} ${style.border}`}>
                                        {event.chamber}
                                    </Badge>
                                </div>
                            );
                        })}
                        <Button variant="outline" className="w-full" onClick={() => navigate(`${basePath}/agenda`)}>
                            Voir l'agenda complet
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-3 gap-3">
                        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate(`${basePath}/elus`)}>
                            <Users className="w-6 h-6 text-[#04CDB9]" />
                            <span>Trouver mes élus</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate(`${basePath}/petitions`)}>
                            <Send className="w-6 h-6 text-pink-600" />
                            <span>Proposer une pétition</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/quiz")}>
                            <ExternalLink className="w-6 h-6 text-[#77BA41]" />
                            <span>Quiz législatif</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardCitizen;
