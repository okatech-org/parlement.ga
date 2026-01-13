import { useState, useEffect } from "react";
import {
    Landmark, Users, FileText, Scale, Calendar,
    Bell, CheckCircle, AlertTriangle, Clock, Crown,
    MapPin, ArrowLeftRight, Shield, Vote, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Dashboard du Congrès - Vue Unifiée pour Députés et Sénateurs
 * Thème Bleu Roi / Gris Ardoise pour marquer la solennité
 */
const CongressDashboard = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Simulation de l'utilisateur connecté (à remplacer par le contexte réel)
    const currentUser = {
        name: "Jean-Pierre Oyiba",
        chamber: "ASSEMBLY", // ou "SENATE"
        chamberLabel: t('congress.common.an'),
        isCMPMember: true,
        cmpCount: 1,
    };

    // Prochaine session du Congrès (simulée)
    const nextSession = {
        id: "1",
        reference: "CONG-2024-003",
        title: "Révision Constitutionnelle - Autonomie des Collectivités",
        date: "20 Décembre 2024",
        time: "10h00",
        location: "Palais du Parlement - Hémicycle Unifié",
        majorityRequired: "Trois-Cinquièmes (60%)",
        quorumReached: false,
        deputiesExpected: 145,
        senatorsExpected: 102,
        deputiesPresent: 0,
        senatorsPresent: 0,
    };

    // CMP en cours pour l'utilisateur
    const activeCMP = currentUser.isCMPMember ? {
        id: "cmp-1",
        reference: "CMP-2024-007",
        title: "Loi de Finances 2025",
        status: "NEGOTIATION",
        deadline: "22 Décembre 2024",
        daysLeft: 8,
        progress: 45, // % des articles traités
    } : null;

    // Statistiques du Parlement
    const parliamentStats = [
        { label: t('congress.dashboard.stats.laws'), value: 47, subLabel: t('congress.dashboard.stats.sub.legislature'), icon: FileText },
        { label: t('congress.dashboard.stats.revisions'), value: 3, subLabel: t('congress.dashboard.stats.sub.since'), icon: BookOpen },
        { label: t('congress.dashboard.stats.cmpCount'), value: 12, subLabel: t('congress.dashboard.stats.sub.all'), icon: ArrowLeftRight },
        { label: t('congress.dashboard.stats.archives'), value: 1247, subLabel: t('congress.dashboard.stats.sub.history'), icon: Landmark },
    ];

    // Vérifier si on peut émarger (jour J par exemple)
    const canCheckIn = false; // À dynamiser avec la date réelle

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header Solennel - Bleu Roi */}
            <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-800 text-white border-b border-blue-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                                <Scale className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-serif font-bold">{t('congress.dashboard.title')}</h1>
                                <p className="text-sm text-blue-200 flex items-center gap-2">
                                    <Crown className="h-3 w-3" />
                                    {t('congress.dashboard.subtitle')} {currentUser.name}
                                    <Badge variant="outline" className="border-blue-400 text-blue-200 text-[10px] ml-2">
                                        {currentUser.chamberLabel}
                                    </Badge>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10"
                            >
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-white/30 text-white hover:bg-white/10"
                                onClick={() => navigate("/")}
                            >
                                <Landmark className="h-4 w-4 mr-2" />
                                {t('congress.dashboard.homeBtn')}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 space-y-8">

                {/* Alerte CMP Active */}
                {activeCMP && (
                    <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/30 animate-pulse-slow">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className="bg-amber-500 text-white">{activeCMP.reference}</Badge>
                                            <Badge variant="outline" className="border-amber-500 text-amber-700">
                                                {activeCMP.status === "NEGOTIATION" ? t('congress.dashboard.cmpCard.negotiation') : activeCMP.status}
                                            </Badge>
                                        </div>
                                        <h3 className="font-bold text-lg text-foreground">{t('congress.common.cmp')} - {activeCMP.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {t('congress.dashboard.cmpCard.deadline')}: {activeCMP.deadline} ({activeCMP.daysLeft} {t('congress.dashboard.cmpCard.daysLeft')})
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground mb-1">{t('congress.dashboard.cmpCard.progress')}</p>
                                    <div className="flex items-center gap-2">
                                        <Progress value={activeCMP.progress} className="w-24 h-3" />
                                        <span className="font-bold">{activeCMP.progress}%</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="mt-4 bg-amber-600 hover:bg-amber-700"
                                onClick={() => navigate("/parlement/cmp/" + activeCMP.id)}
                            >
                                <ArrowLeftRight className="h-4 w-4 mr-2" />
                                {t('congress.dashboard.cmpCard.btn')}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Section Séance Solennelle */}
                <Card className="border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Badge className="bg-white/20 text-white mb-2">{nextSession.reference}</Badge>
                                <h2 className="text-2xl font-serif font-bold mb-1">{nextSession.title}</h2>
                                <p className="text-blue-200 text-sm flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {nextSession.location}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{nextSession.date}</div>
                                <div className="text-xl text-blue-200">{nextSession.time}</div>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Quorum */}
                            <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('congress.dashboard.session.quorum.title')}</h4>
                                <div className={`text-3xl font-bold ${nextSession.quorumReached ? 'text-green-600' : 'text-amber-600'}`}>
                                    {nextSession.deputiesPresent + nextSession.senatorsPresent}
                                    <span className="text-lg text-muted-foreground">
                                        / {Math.ceil((nextSession.deputiesExpected + nextSession.senatorsExpected) / 2)}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {nextSession.quorumReached ? `${t('congress.dashboard.session.quorum.reached')} ✓` : t('congress.dashboard.session.quorum.notReached')}
                                </p>
                            </div>

                            {/* Présences par chambre */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                                    <span className="text-sm font-medium">{t('congress.common.deputies')}</span>
                                    <Badge variant="secondary">
                                        {nextSession.deputiesPresent} / {nextSession.deputiesExpected}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-primary/10 rounded">
                                    <span className="text-sm font-medium">{t('congress.common.senators')}</span>
                                    <Badge variant="secondary">
                                        {nextSession.senatorsPresent} / {nextSession.senatorsExpected}
                                    </Badge>
                                </div>
                            </div>

                            {/* Bouton Émarger */}
                            <div className="flex flex-col items-center justify-center">
                                <Button
                                    size="lg"
                                    className={`${canCheckIn ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'}`}
                                    disabled={!canCheckIn}
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    {t('congress.dashboard.session.checkin')}
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2 text-center">
                                    {canCheckIn
                                        ? t('congress.dashboard.session.checkinAvailable')
                                        : t('congress.dashboard.session.checkinUnavailable')}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Vote className="h-5 w-5 text-blue-700" />
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100">{t('congress.dashboard.session.majorityRequired')}</h4>
                            </div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>{nextSession.majorityRequired}</strong> {t('congress.dashboard.session.majorityDesc')}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistiques du Parlement */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {parliamentStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-5 text-center">
                                    <Icon className="h-8 w-8 mx-auto mb-2 text-blue-900 dark:text-blue-400 opacity-80" />
                                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <p className="text-xs text-muted-foreground/70">{stat.subLabel}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Actions Rapides */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => navigate("/parlement/archives")}>
                        <CardContent className="p-6 text-center">
                            <BookOpen className="h-10 w-10 mx-auto mb-3 text-blue-900" />
                            <h3 className="font-bold mb-1">{t('congress.dashboard.quick.archives.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('congress.dashboard.quick.archives.desc')}</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => navigate("/parlement/sessions")}>
                        <CardContent className="p-6 text-center">
                            <Calendar className="h-10 w-10 mx-auto mb-3 text-blue-900" />
                            <h3 className="font-bold mb-1">{t('congress.dashboard.quick.history.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('congress.dashboard.quick.history.desc')}</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => navigate("/parlement/cmp")}>
                        <CardContent className="p-6 text-center">
                            <ArrowLeftRight className="h-10 w-10 mx-auto mb-3 text-blue-900" />
                            <h3 className="font-bold mb-1">{t('congress.dashboard.quick.cmp.title')}</h3>
                            <p className="text-sm text-muted-foreground">{t('congress.dashboard.quick.cmp.desc')}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer Solennel */}
            <footer className="bg-slate-800 text-slate-300 py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-3 mb-3">
                        <Scale className="h-6 w-6" />
                        <span className="font-serif font-bold text-white">{t('congress.common.congress')}</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        "L'Union - Le Travail - La Justice"
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CongressDashboard;
