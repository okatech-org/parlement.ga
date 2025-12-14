import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    FileText,
    Calendar,
    Vote,
    Gavel,
    Building2,
    ArrowRight,
    Clock,
    TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

/**
 * Page d'accueil de l'Assemblée Nationale
 * Route: /an
 */
const AssemblyHome: React.FC = () => {
    const navigate = useNavigate();

    // Données simulées pour la démo
    const stats = {
        deputies: 120,
        activeSessions: 3,
        pendingLaws: 12,
        votesToday: 5,
    };

    const recentTexts = [
        {
            id: '1',
            reference: 'PL-2024-042',
            title: 'Projet de loi de finances rectificative 2024',
            status: 'En commission',
            progress: 45,
        },
        {
            id: '2',
            reference: 'PPL-2024-018',
            title: 'Proposition de loi relative à la protection de l\'environnement',
            status: 'Examen en plénière',
            progress: 75,
        },
        {
            id: '3',
            reference: 'PL-2024-039',
            title: 'Projet de loi portant code des investissements',
            status: 'Vote prévu',
            progress: 90,
        },
    ];

    const upcomingSessions = [
        {
            id: '1',
            title: 'Séance des questions au Gouvernement',
            date: '16 Déc 2024',
            time: '10:00',
            type: 'Questions',
        },
        {
            id: '2',
            title: 'Examen du projet de loi de finances',
            date: '17 Déc 2024',
            time: '09:00',
            type: 'Plénière',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-8 md:p-12 text-white">
                <div className="absolute inset-0 bg-[url('/images/assembly-pattern.svg')] opacity-10"></div>
                <div className="relative z-10">
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">
                        XIVe Législature
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Assemblée Nationale
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mb-6">
                        Bienvenue au Palais Léon Mba. Suivez en direct les travaux parlementaires
                        et participez à la vie démocratique de la Nation.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="bg-white text-emerald-700 hover:bg-white/90"
                            onClick={() => navigate('/an/hemicycle')}
                        >
                            <Building2 className="mr-2 h-5 w-5" />
                            Accéder à l'Hémicycle
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/50 text-white hover:bg-white/10"
                            onClick={() => navigate('/an/travaux')}
                        >
                            <FileText className="mr-2 h-5 w-5" />
                            Voir les Travaux
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-emerald-200 dark:border-emerald-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Députés</p>
                                <p className="text-3xl font-bold text-emerald-600">{stats.deputies}</p>
                            </div>
                            <Users className="h-10 w-10 text-emerald-500/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-200 dark:border-emerald-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Sessions actives</p>
                                <p className="text-3xl font-bold text-emerald-600">{stats.activeSessions}</p>
                            </div>
                            <Calendar className="h-10 w-10 text-emerald-500/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-200 dark:border-emerald-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Textes en cours</p>
                                <p className="text-3xl font-bold text-emerald-600">{stats.pendingLaws}</p>
                            </div>
                            <FileText className="h-10 w-10 text-emerald-500/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-200 dark:border-emerald-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Votes aujourd'hui</p>
                                <p className="text-3xl font-bold text-emerald-600">{stats.votesToday}</p>
                            </div>
                            <Vote className="h-10 w-10 text-emerald-500/30" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Legislative Texts */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Gavel className="h-5 w-5 text-emerald-600" />
                                    Textes Législatifs en Cours
                                </CardTitle>
                                <CardDescription>Suivi de la navette parlementaire</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/an/travaux')}>
                                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentTexts.map((text) => (
                            <div
                                key={text.id}
                                className="p-4 rounded-lg border border-border hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer"
                                onClick={() => navigate(`/an/textes/${text.id}`)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <Badge variant="outline" className="text-emerald-600 border-emerald-300 mb-2">
                                            {text.reference}
                                        </Badge>
                                        <h4 className="font-medium">{text.title}</h4>
                                    </div>
                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                        {text.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <Progress value={text.progress} className="flex-1 h-2" />
                                    <span className="text-sm text-muted-foreground">{text.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Upcoming Sessions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-emerald-600" />
                            Prochaines Séances
                        </CardTitle>
                        <CardDescription>Agenda parlementaire</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingSessions.map((session) => (
                            <div
                                key={session.id}
                                className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                            >
                                <Badge className="mb-2 bg-emerald-600">{session.type}</Badge>
                                <h4 className="font-medium mb-2">{session.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{session.date}</span>
                                    <span>•</span>
                                    <Clock className="h-4 w-4" />
                                    <span>{session.time}</span>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full border-emerald-300 text-emerald-600" onClick={() => navigate('/an/agenda')}>
                            Voir l'agenda complet
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Access Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-emerald-500"
                    onClick={() => navigate('/an/deputes')}
                >
                    <CardContent className="pt-6">
                        <Users className="h-8 w-8 text-emerald-600 mb-3" />
                        <h3 className="font-semibold mb-1">Vos Députés</h3>
                        <p className="text-sm text-muted-foreground">
                            Consultez la liste des 120 députés et leurs travaux
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-emerald-500"
                    onClick={() => navigate('/an/commissions')}
                >
                    <CardContent className="pt-6">
                        <Building2 className="h-8 w-8 text-emerald-600 mb-3" />
                        <h3 className="font-semibold mb-1">Commissions</h3>
                        <p className="text-sm text-muted-foreground">
                            Accédez aux travaux des commissions permanentes
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-emerald-500"
                    onClick={() => navigate('/an/votes')}
                >
                    <CardContent className="pt-6">
                        <TrendingUp className="h-8 w-8 text-emerald-600 mb-3" />
                        <h3 className="font-semibold mb-1">Résultats des Votes</h3>
                        <p className="text-sm text-muted-foreground">
                            Consultez l'historique des votes et scrutins
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AssemblyHome;
