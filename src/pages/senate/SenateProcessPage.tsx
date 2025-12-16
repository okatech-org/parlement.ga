import {
    Landmark, Users, FileText, ArrowLeftRight, Scale, Crown,
    CheckCircle, Clock, Send, MessageSquare, MapPin, AlertTriangle,
    ChevronRight, Home, Sun, Moon, PlayCircle, Gavel, BookOpen,
    ArrowDown, Building, Vote, Download, Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import MermaidDiagram from "@/components/MermaidDiagram";
import AnimatedPhaseCard from "@/components/AnimatedPhaseCard";
import { exportProcessPDF } from "@/utils/exportProcessPDF";
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Page dédiée au Protocole Législatif du Sénat
 * Détails approfondis sur le fonctionnement
 */
const SenateProcessPage = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();

    // Étapes détaillées du processus
    const processSteps = [
        {
            phase: t('senate.process.phases.phase1.phase'),
            title: t('senate.process.phases.phase1.title'),
            duration: t('senate.process.phases.phase1.duration'),
            icon: FileText,
            color: "bg-blue-500",
            description: t('senate.process.phases.phase1.description'),
            details: t('senate.process.phases.phase1.details') as unknown as string[]
        },
        {
            phase: t('senate.process.phases.phase2.phase'),
            title: t('senate.process.phases.phase2.title'),
            duration: t('senate.process.phases.phase2.duration'),
            icon: Users,
            color: "bg-amber-500",
            description: t('senate.process.phases.phase2.description'),
            details: t('senate.process.phases.phase2.details') as unknown as string[]
        },
        {
            phase: t('senate.process.phases.phase3.phase'),
            title: t('senate.process.phases.phase3.title'),
            duration: t('senate.process.phases.phase3.duration'),
            icon: Gavel,
            color: "bg-purple-500",
            description: t('senate.process.phases.phase3.description'),
            details: t('senate.process.phases.phase3.details') as unknown as string[]
        },
        {
            phase: t('senate.process.phases.phase4.phase'),
            title: t('senate.process.phases.phase4.title'),
            duration: t('senate.process.phases.phase4.duration'),
            icon: MessageSquare,
            color: "bg-green-500",
            description: t('senate.process.phases.phase4.description'),
            details: t('senate.process.phases.phase4.details') as unknown as string[]
        },
        {
            phase: t('senate.process.phases.phase5.phase'),
            title: t('senate.process.phases.phase5.title'),
            duration: t('senate.process.phases.phase5.duration'),
            icon: Vote,
            color: "bg-red-500",
            description: t('senate.process.phases.phase5.description'),
            details: t('senate.process.phases.phase5.details') as unknown as string[]
        },
        {
            phase: t('senate.process.phases.phase6.phase'),
            title: t('senate.process.phases.phase6.title'),
            duration: t('senate.process.phases.phase6.duration'),
            icon: Send,
            color: "bg-indigo-500",
            description: t('senate.process.phases.phase6.description'),
            details: t('senate.process.phases.phase6.details') as unknown as string[]
        }
    ];

    // Spécificités du Sénat
    const senateSpecificities = [
        {
            title: t('senate.process.specificities.territorial.title'),
            icon: MapPin,
            description: t('senate.process.specificities.territorial.description'),
            examples: t('senate.process.specificities.territorial.examples') as unknown as string[]
        },
        {
            title: t('senate.process.specificities.grievances.title'),
            icon: AlertTriangle,
            description: t('senate.process.specificities.grievances.description'),
            examples: t('senate.process.specificities.grievances.examples') as unknown as string[]
        },
        {
            title: t('senate.process.specificities.fieldVisits.title'),
            icon: Building,
            description: t('senate.process.specificities.fieldVisits.description'),
            examples: t('senate.process.specificities.fieldVisits.examples') as unknown as string[]
        }
    ];

    // CMP
    const cmpProcess = [
        { step: 1, title: t('senate.process.cmp.steps.convocation.title'), description: t('senate.process.cmp.steps.convocation.description') },
        { step: 2, title: t('senate.process.cmp.steps.composition.title'), description: t('senate.process.cmp.steps.composition.description') },
        { step: 3, title: t('senate.process.cmp.steps.negotiation.title'), description: t('senate.process.cmp.steps.negotiation.description') },
        { step: 4, title: t('senate.process.cmp.steps.vote.title'), description: t('senate.process.cmp.steps.vote.description') },
        { step: 5, title: t('senate.process.cmp.steps.finalReading.title'), description: t('senate.process.cmp.steps.finalReading.description') },
    ];

    // Diagramme de la navette complète
    const navetteCompleteChart = `
flowchart TD
    subgraph DEPOT[📄 DÉPÔT]
        D1[Projet de loi<br/>Gouvernement] --> BUREAU
        D2[Proposition de loi<br/>Député/Sénateur] --> BUREAU
        BUREAU[Bureau de la chambre saisie]
    end

    subgraph AN[🏛️ ASSEMBLÉE NATIONALE]
        AN_COM[Commission permanente]
        AN_RAP[Rapport du rapporteur]
        AN_PLEN[Discussion en plénière]
        AN_VOTE{Vote AN}
        AN_COM --> AN_RAP --> AN_PLEN --> AN_VOTE
    end

    subgraph SN[🏛️ SÉNAT]
        SN_COM[Commission permanente]
        SN_RAP[Rapport du rapporteur]
        SN_PLEN[Discussion en plénière]
        SN_VOTE{Vote Sénat}
        SN_COM --> SN_RAP --> SN_PLEN --> SN_VOTE
    end

    subgraph NAVETTE[🔄 NAVETTE PARLEMENTAIRE]
        NAV_CHECK{Textes identiques?}
        L2_AN[2ème lecture AN]
        L2_SN[2ème lecture Sénat]
        NAV_CHECK2{Accord?}
    end

    subgraph CMP[⚖️ COMMISSION MIXTE PARITAIRE]
        CMP_CONV[Convocation CMP<br/>7 députés + 7 sénateurs]
        CMP_NEG[Négociation texte commun]
        CMP_VOTE{Vote CMP}
        CMP_CONV --> CMP_NEG --> CMP_VOTE
    end

    subgraph FINAL[✅ ADOPTION DÉFINITIVE]
        FINAL_AN[Lecture définitive AN]
        FINAL_SN[Lecture définitive Sénat]
        PROMULGATION[Promulgation<br/>Journal Officiel]
    end

    BUREAU --> AN_COM
    AN_VOTE -->|Adopté| SN_COM
    AN_VOTE -->|Rejeté| FIN1[Fin de procédure]
    SN_VOTE --> NAV_CHECK
    NAV_CHECK -->|Oui| PROMULGATION
    NAV_CHECK -->|Non| L2_AN
    L2_AN --> L2_SN --> NAV_CHECK2
    NAV_CHECK2 -->|Oui| PROMULGATION
    NAV_CHECK2 -->|Non| CMP_CONV
    CMP_VOTE -->|Accord| FINAL_AN
    CMP_VOTE -->|Échec| FINAL_AN
    FINAL_AN --> FINAL_SN --> PROMULGATION

    style BUREAU fill:#6366f1,color:#fff
    style AN_VOTE fill:#10b981,color:#fff
    style SN_VOTE fill:#3b82f6,color:#fff
    style NAV_CHECK fill:#f59e0b,color:#fff
    style NAV_CHECK2 fill:#f59e0b,color:#fff
    style CMP_VOTE fill:#ef4444,color:#fff
    style PROMULGATION fill:#22c55e,color:#fff
`;

    // Handler pour les clics sur les noeuds
    const handleNodeClick = (nodeId: string) => {
        const sectionMap: Record<string, string> = {
            'SN_COM': 'phases',
            'SN_PLEN': 'phases',
            'SN_VOTE': 'phases',
            'AN_COM': 'an-link',
            'CMP': 'cmp-section',
            'PROMULGATION': 'navette-section'
        };
        const section = sectionMap[nodeId];
        if (section === 'an-link') {
            navigate('/an/processus');
        } else if (section) {
            const element = document.getElementById(section);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Export PDF handler
    const handleExportPDF = () => {
        exportProcessPDF({
            title: t('senate.process.heroTitle'),
            subtitle: "République Gabonaise",
            institution: 'SN',
            phases: processSteps.map(s => ({
                phase: s.phase,
                title: s.title,
                duration: s.duration,
                description: s.description,
                details: s.details
            })),
            specificities: senateSpecificities,
            cmpProcess
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Unified Header with Export PDF action */}
            <InstitutionSubHeader
                institution="SENATE"
                pageTitle={t('senate.process.title')}
                pageSubtitle={t('senate.process.subtitle')}
                pageIcon={Workflow}
                extraActions={
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                        <Download className="h-4 w-4 mr-2" />
                        {t('senate.process.exportBtn')}
                    </Button>
                }
            />

            {/* Hero */}
            <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {t('senate.process.heroBadge')}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        {t('senate.process.heroTitle')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                        {t('senate.process.heroDesc')}
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Badge variant="outline" className="text-sm py-1.5 px-3">
                            <Clock className="h-4 w-4 mr-1" />
                            {t('senate.process.stats.delay')}
                        </Badge>
                        <Badge variant="outline" className="text-sm py-1.5 px-3">
                            <Users className="h-4 w-4 mr-1" />
                            {t('senate.process.stats.senators')}
                        </Badge>
                        <Badge variant="outline" className="text-sm py-1.5 px-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {t('senate.process.stats.provinces')}
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Diagramme de la navette complète */}
            <section id="navette-section" className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                            <ArrowLeftRight className="h-3 w-3 mr-1" />
                            {t('senate.process.navette.badge')}
                        </Badge>
                        <h2 className="text-3xl font-serif font-bold mb-4">{t('senate.process.navette.title')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('senate.process.navette.desc')}
                            <span className="text-primary font-medium"> {t('senate.process.navette.clickToNavigate')}</span>
                        </p>
                    </div>
                    <div className="max-w-6xl mx-auto">
                        <MermaidDiagram
                            chart={navetteCompleteChart}
                            title={t('senate.process.navette.title')}
                            className="shadow-lg"
                            onNodeClick={handleNodeClick}
                        />
                    </div>
                </div>
            </section>

            {/* Diagramme du flux législatif au Sénat */}
            <section id="flux-senat" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold mb-4">{t('senate.process.flow.title')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('senate.process.flow.desc')}
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <MermaidDiagram
                            chart={`
flowchart TD
    A[📨 Réception du texte AN] --> B[Bureau du Sénat]
    B --> C{Texte sur collectivités?}
    C -->|Oui| D[Traitement prioritaire]
    C -->|Non| E[Procédure normale]
    D --> F[Commission compétente]
    E --> F
    F --> G[Nomination rapporteur]
    G --> H[Examen en commission]
    H --> I[Auditions]
    I --> J[Rapport de la commission]
    J --> K[Discussion en plénière]
    K --> L[Vote des amendements]
    L --> M{Vote final}
    M -->|Conforme| N[Promulgation]
    M -->|Amendé| O[Retour AN]
    M -->|Rejeté| P[CMP possible]
    
    style A fill:#3b82f6,color:#fff
    style N fill:#22c55e,color:#fff
    style O fill:#f59e0b,color:#fff
    style P fill:#ef4444,color:#fff
`}
                            title={t('senate.process.flow.title')}
                            className="shadow-lg"
                            onNodeClick={handleNodeClick}
                        />
                    </div>
                </div>
            </section>

            {/* Processus détaillé */}
            <section id="phases" className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold mb-4">{t('senate.process.phases.title')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('senate.process.phases.desc')}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {processSteps.map((step, index) => (
                            <AnimatedPhaseCard
                                key={index}
                                step={step}
                                index={index}
                                isLast={index === processSteps.length - 1}
                                variant="senate"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Spécificités du Sénat */}
            <section id="specificites" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold mb-4">{t('senate.process.specificities.title')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('senate.process.specificities.desc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {senateSpecificities.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Card key={index}>
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {item.examples.map((ex, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">{ex}</Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Commission Mixte Paritaire */}
            <section id="cmp-section" className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            <Scale className="h-3 w-3 mr-1" />
                            {t('senate.process.cmp.badge')}
                        </Badge>
                        <h2 className="text-3xl font-serif font-bold mb-4">{t('senate.process.cmp.title')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('senate.process.cmp.desc')}
                        </p>
                    </div>

                    <Card className="max-w-4xl mx-auto">
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {cmpProcess.map((item, index) => (
                                    <div key={item.step} className="text-center relative">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-amber-500 flex items-center justify-center text-white font-bold mb-2">
                                            {item.step}
                                        </div>
                                        <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                        {index < cmpProcess.length - 1 && (
                                            <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-amber-200 dark:bg-amber-800" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-8" />

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        {t('senate.process.cmp.ifAgreement')}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {t('senate.process.cmp.agreementDesc')}
                                    </p>
                                </div>
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        {t('senate.process.cmp.ifFailure')}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {t('senate.process.cmp.failureDesc')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-primary/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-serif font-bold mb-4">{t('senate.process.cta.title')}</h2>
                    <p className="text-muted-foreground mb-8">
                        {t('senate.process.cta.desc')}
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Button size="lg" onClick={() => navigate("/senat/demo")}>
                            <PlayCircle className="mr-2 h-5 w-5" />
                            {t('senate.process.cta.accessDemo')}
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/senat")}>
                            <Home className="mr-2 h-5 w-5" />
                            {t('senate.process.cta.backHome')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Landmark className="h-6 w-6 text-primary" />
                        <span className="font-serif font-bold">{t('senate.process.footer.title')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('senate.process.footer.address')}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SenateProcessPage;
