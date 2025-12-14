import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ThumbsUp, ThumbsDown, Minus, Lock, CheckCircle2, Users, FileText, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AnimatedDashboardCard, AnimatedProgressBar } from "@/components/animations/DashboardAnimations";

const DashboardDeputy = () => {
    const { t } = useLanguage(); // Kept for context if needed, though mostly hardcoded text here
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedVote, setSelectedVote] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    const currentBill = {
        id: "PL-2025-001",
        title: "Loi portant protection de l'environnement et des forêts",
        description: "Cette loi vise à renforcer les sanctions contre la déforestation illégale et à protéger la biodiversité gabonaise.",
        details: [
            "Article 1: Interdiction de la coupe d'arbres sans autorisation",
            "Article 2: Sanctions pénales pour déforestation illégale",
            "Article 3: Création d'un fonds pour la reforestation",
            "Article 4: Mise en place d'un système de surveillance par satellite"
        ],
        voteDeadline: "2025-03-15 18:00"
    };

    const voteResults = {
        pour: 65,
        contre: 30,
        abstention: 25,
        total: 120
    };

    const handleAuthenticate = () => {
        toast.success("Authentification réussie", {
            description: "Vous pouvez maintenant voter en toute sécurité"
        });
        setIsAuthenticated(true);
    };

    const handleVote = (voteType: string) => {
        if (!isAuthenticated) {
            toast.error("Authentification requise", {
                description: "Veuillez vous authentifier pour voter"
            });
            return;
        }

        setSelectedVote(voteType);

        setTimeout(() => {
            setHasVoted(true);
            toast.success("Vote enregistré", {
                description: `Votre vote "${voteType}" a été enregistré de manière sécurisée et immuable`
            });
        }, 1000);
    };

    // Metrics for the dashboard view
    const metrics = [
        { label: "Taux de Présence", value: "92%", icon: Users, subLabel: "Session en cours" },
        { label: "Votes Effectués", value: "45", icon: CheckCircle2, subLabel: "Sur 50 lois" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <AnimatedDashboardCard delay={0}>
                <DashboardHeader
                    title="Espace Député"
                    subtitle="Session Parlementaire Active"
                    avatarInitial="D"
                />
            </AnimatedDashboardCard>

            {/* Authentication Card (Priority) */}
            {!isAuthenticated && (
                <AnimatedDashboardCard delay={0.1}>
                    <Card className="p-8 bg-card shadow-elegant border-primary/20">
                        <div className="text-center">
                            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h2 className="text-2xl font-serif font-bold mb-2">Authentification Sécurisée</h2>
                            <p className="text-muted-foreground mb-6">
                                Pour accéder au système de vote, veuillez vous authentifier avec votre badge biométrique
                            </p>
                            <Button size="lg" onClick={handleAuthenticate} className="shadow-elegant">
                                <Shield className="mr-2 h-5 w-5" />
                                S'authentifier (2FA)
                            </Button>
                        </div>
                    </Card>
                </AnimatedDashboardCard>
            )}

            {/* Voting Interface & Bill Details */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Voting/Bill Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Bill Information */}
                    <AnimatedDashboardCard delay={0.2}>
                        <Card className="p-8 bg-card shadow-card-custom">
                            <div className="mb-6">
                                <Badge variant="outline" className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                                    Vote en cours
                                </Badge>
                                <h2 className="text-3xl font-serif font-bold mb-3">{currentBill.title}</h2>
                                <p className="text-muted-foreground mb-2">{currentBill.description}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                                    <span className="font-mono">{currentBill.id}</span>
                                    <span>•</span>
                                    <span>Clôture: {currentBill.voteDeadline}</span>
                                </div>
                            </div>

                            <div className="border-t border-border pt-6">
                                <h3 className="font-semibold mb-4">Articles principaux:</h3>
                                <ul className="space-y-3">
                                    {currentBill.details.map((detail, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    </AnimatedDashboardCard>

                    {/* Voting Buttons */}
                    {isAuthenticated && !hasVoted && (
                        <AnimatedDashboardCard delay={0.3}>
                            <Card className="p-8 bg-card shadow-elegant border-primary/10">
                                <h3 className="text-xl font-serif font-bold mb-6 text-center">Exprimez votre vote</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <Button
                                        size="lg"
                                        variant={selectedVote === "Pour" ? "default" : "outline"}
                                        className="h-32 flex flex-col gap-3 hover:shadow-elegant transition-all"
                                        onClick={() => handleVote("Pour")}
                                    >
                                        <ThumbsUp className="h-8 w-8" />
                                        <span className="font-semibold">Pour</span>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant={selectedVote === "Contre" ? "default" : "outline"}
                                        className="h-32 flex flex-col gap-3 hover:shadow-elegant transition-all"
                                        onClick={() => handleVote("Contre")}
                                    >
                                        <ThumbsDown className="h-8 w-8" />
                                        <span className="font-semibold">Contre</span>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant={selectedVote === "Abstention" ? "default" : "outline"}
                                        className="h-32 flex flex-col gap-3 hover:shadow-elegant transition-all"
                                        onClick={() => handleVote("Abstention")}
                                    >
                                        <Minus className="h-8 w-8" />
                                        <span className="font-semibold">Abstention</span>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground text-center mt-6">
                                    <Shield className="inline h-3 w-3 mr-1" />
                                    Vote chiffré et immuable • Traçabilité blockchain
                                </p>
                            </Card>
                        </AnimatedDashboardCard>
                    )}

                    {/* Vote Confirmation */}
                    {hasVoted && (
                        <AnimatedDashboardCard delay={0.3}>
                            <Card className="p-8 bg-primary/5 border-primary/20 shadow-elegant">
                                <div className="text-center">
                                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-2xl font-serif font-bold mb-2">Vote enregistré</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Votre vote "<span className="font-semibold text-primary">{selectedVote}</span>" a été enregistré avec succès
                                    </p>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        Hash: 0xA3F8...92BC
                                    </Badge>
                                </div>
                            </Card>
                        </AnimatedDashboardCard>
                    )}
                </div>

                {/* Sidebar Column (Stats & Results) */}
                <div className="space-y-6">
                    {/* Live Results */}
                    <AnimatedDashboardCard delay={0.4}>
                        <Card className="p-6 bg-card shadow-card-custom">
                            <h3 className="text-xl font-serif font-bold mb-6">Résultats en temps réel</h3>
                            <div className="space-y-6">
                                <AnimatedProgressBar
                                    label="Pour"
                                    value={voteResults.pour}
                                    max={voteResults.total}
                                    color="bg-primary"
                                    delay={0.5}
                                    showValue
                                />
                                <AnimatedProgressBar
                                    label="Contre"
                                    value={voteResults.contre}
                                    max={voteResults.total}
                                    color="bg-destructive"
                                    delay={0.6}
                                    showValue
                                />
                                <AnimatedProgressBar
                                    label="Abstention"
                                    value={voteResults.abstention}
                                    max={voteResults.total}
                                    color="bg-muted-foreground"
                                    delay={0.7}
                                    showValue
                                />
                            </div>
                        </Card>
                    </AnimatedDashboardCard>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-1 gap-4">
                        {metrics.map((metric, index) => (
                            <AnimatedDashboardCard key={index} delay={0.5 + index * 0.1}>
                                <DashboardStatsCard
                                    icon={metric.icon}
                                    value={metric.value}
                                    label={metric.label}
                                    subLabel={metric.subLabel}
                                />
                            </AnimatedDashboardCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardDeputy;
