import {
    Building2, Users, FileText, ArrowLeftRight, Scale,
    CheckCircle, Clock, Send, MessageSquare, MapPin,
    ChevronRight, Home, Sun, Moon, PlayCircle, Gavel, BookOpen,
    ArrowDown, Vote, Briefcase, AlertTriangle, Download, Workflow
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
import { useLanguage } from "@/contexts/LanguageContext";
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";

/**
 * Page dédiée au Protocole Législatif de l'Assemblée Nationale
 */
const AssemblyProcessPage = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();

    // Diagramme du flux législatif (traduit dynamiquement)
    const legislativeFlowChart = `
flowchart TD
    A[📄 ${t('assembly.process.flowchart.textDeposit')}] --> B{${t('assembly.process.flowchart.textType')}}
    B -->|${t('assembly.process.flowchart.billType')}| C[${t('assembly.process.flowchart.government')}]
    B -->|${t('assembly.process.flowchart.proposal')}| D[${t('assembly.process.flowchart.deputy')}]
    C --> E[${t('assembly.process.flowchart.anBureau')}]
    D --> E
    E --> F[${t('assembly.process.flowchart.competentCommission')}]
    F --> G[${t('assembly.process.flowchart.commissionExamination')}]
    G --> H[${t('assembly.process.flowchart.rapporteurReport')}]
    H --> I[${t('assembly.process.flowchart.agendaRegistration')}]
    I --> J[${t('assembly.process.flowchart.generalDiscussion')}]
    J --> K[${t('assembly.process.flowchart.amendmentsExamination')}]
    K --> L[${t('assembly.process.flowchart.articleByArticleVote')}]
    L --> M{${t('assembly.process.flowchart.finalVote')}}
    M -->|${t('assembly.process.flowchart.adopted')}| N[${t('assembly.process.flowchart.transmissionSenate')}]
    M -->|${t('assembly.process.flowchart.rejected')}| O[${t('assembly.process.flowchart.endProcedure')}]
    N --> P{${t('assembly.process.flowchart.parliamentaryShuttle')}}
    
    style A fill:#10b981,color:#fff
    style M fill:#f59e0b,color:#fff
    style N fill:#3b82f6,color:#fff
    style O fill:#ef4444,color:#fff
`;

    // Diagramme des commissions (traduit dynamiquement)
    const commissionsChart = `
flowchart LR
    AN[${t('assembly.process.flowchart.nationalAssembly')}] --> C1[${t('assembly.process.flowchart.commissions.laws')}]
    AN --> C2[${t('assembly.process.flowchart.commissions.finances')}]
    AN --> C3[${t('assembly.process.flowchart.commissions.foreignAffairs')}]
    AN --> C4[${t('assembly.process.flowchart.commissions.defense')}]
    AN --> C5[${t('assembly.process.flowchart.commissions.socialAffairs')}]
    AN --> C6[${t('assembly.process.flowchart.commissions.economic')}]
    
    style AN fill:#10b981,color:#fff
    style C1 fill:#3b82f6,color:#fff
    style C2 fill:#f59e0b,color:#fff
    style C3 fill:#8b5cf6,color:#fff
    style C4 fill:#ef4444,color:#fff
    style C5 fill:#ec4899,color:#fff
    style C6 fill:#14b8a6,color:#fff
`;

    // Étapes détaillées du processus
    const processSteps = [
        {
            phase: "Phase 1",
            title: t('assembly.process.steps.phase1.title'),
            duration: t('assembly.process.steps.phase1.duration'),
            icon: FileText,
            color: "bg-emerald-500",
            description: t('assembly.process.steps.phase1.description'),
            details: [
                t('assembly.process.steps.phase1.details.0'),
                t('assembly.process.steps.phase1.details.1'),
                t('assembly.process.steps.phase1.details.2'),
                t('assembly.process.steps.phase1.details.3')
            ]
        },
        {
            phase: "Phase 2",
            title: t('assembly.process.steps.phase2.title'),
            duration: t('assembly.process.steps.phase2.duration'),
            icon: Users,
            color: "bg-blue-500",
            description: t('assembly.process.steps.phase2.description'),
            details: [
                t('assembly.process.steps.phase2.details.0'),
                t('assembly.process.steps.phase2.details.1'),
                t('assembly.process.steps.phase2.details.2'),
                t('assembly.process.steps.phase2.details.3')
            ]
        },
        {
            phase: "Phase 3",
            title: t('assembly.process.steps.phase3.title'),
            duration: t('assembly.process.steps.phase3.duration'),
            icon: Gavel,
            color: "bg-amber-500",
            description: t('assembly.process.steps.phase3.description'),
            details: [
                t('assembly.process.steps.phase3.details.0'),
                t('assembly.process.steps.phase3.details.1'),
                t('assembly.process.steps.phase3.details.2'),
                t('assembly.process.steps.phase3.details.3')
            ]
        },
        {
            phase: "Phase 4",
            title: t('assembly.process.steps.phase4.title'),
            duration: t('assembly.process.steps.phase4.duration'),
            icon: MessageSquare,
            color: "bg-purple-500",
            description: t('assembly.process.steps.phase4.description'),
            details: [
                t('assembly.process.steps.phase4.details.0'),
                t('assembly.process.steps.phase4.details.1'),
                t('assembly.process.steps.phase4.details.2'),
                t('assembly.process.steps.phase4.details.3')
            ]
        },
        {
            phase: "Phase 5",
            title: t('assembly.process.steps.phase5.title'),
            duration: t('assembly.process.steps.phase5.duration'),
            icon: Vote,
            color: "bg-red-500",
            description: t('assembly.process.steps.phase5.description'),
            details: [
                t('assembly.process.steps.phase5.details.0'),
                t('assembly.process.steps.phase5.details.1'),
                t('assembly.process.steps.phase5.details.2'),
                t('assembly.process.steps.phase5.details.3')
            ]
        },
        {
            phase: "Phase 6",
            title: t('assembly.process.steps.phase6.title'),
            duration: t('assembly.process.steps.phase6.duration'),
            icon: Send,
            color: "bg-indigo-500",
            description: t('assembly.process.steps.phase6.description'),
            details: [
                t('assembly.process.steps.phase6.details.0'),
                t('assembly.process.steps.phase6.details.1'),
                t('assembly.process.steps.phase6.details.2'),
                t('assembly.process.steps.phase6.details.3')
            ]
        }
    ];

    // Navette parlementaire simplifiée
    const navetteChart = `
flowchart LR
    subgraph AN1[1ère lecture AN]
        A1[Dépôt] --> A2[Commission] --> A3[Plénière] --> A4[Vote]
    end
    
    subgraph SN1[1ère lecture Sénat]
        S1[Réception] --> S2[Commission] --> S3[Plénière] --> S4[Vote]
    end
    
    subgraph Decision[Décision]
        D1{Texte identique?}
    end
    
    A4 -->|Transmission| S1
    S4 --> D1
    D1 -->|Oui| P[Promulgation]
    D1 -->|Non| AN2[2ème lecture AN]
    AN2 --> SN2[2ème lecture Sénat]
    SN2 --> CMP[Commission Mixte Paritaire]
    
    style A4 fill:#10b981,color:#fff
    style S4 fill:#3b82f6,color:#fff
    style P fill:#22c55e,color:#fff
    style CMP fill:#f59e0b,color:#fff
`;

    // Navette complète AN-Sénat-CMP
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
            'AN_COM': 'phases',
            'AN_PLEN': 'phases',
            'AN_VOTE': 'phases',
            'SN_COM': 'senat-link',
            'CMP': 'cmp-section',
            'PROMULGATION': 'navette-section'
        };
        const section = sectionMap[nodeId];
        if (section) {
            const element = document.getElementById(section);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Export PDF handler
    const handleExportPDF = () => {
        exportProcessPDF({
            title: t('assembly.process.heroTitle'),
            subtitle: t('assembly.process.subtitle'),
            institution: 'AN',
            phases: processSteps.map(s => ({
                phase: s.phase,
                title: s.title,
                duration: s.duration,
                description: s.description,
                details: s.details
            }))
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
            {/* Unified Header with Export PDF action */}
            <InstitutionSubHeader
                institution="AN"
                pageTitle={t('assembly.process.title')}
                pageSubtitle={t('assembly.process.subtitle')}
                pageIcon={Workflow}
                extraActions={
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                        <Download className="h-4 w-4 mr-2" />
                        {t('assembly.process.exportBtn')}
                    </Button>
                }
            />

            {/* Hero */}
            <section className="py-10 sm:py-16 bg-gradient-to-br from-emerald-600 to-green-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-3 sm:mb-4 bg-white/20 text-white border-white/30">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {t('assembly.process.heroBadge')}
                    </Badge>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                        {t('assembly.process.heroTitle')}
                    </h1>
                    <p className="text-base sm:text-xl opacity-90 max-w-3xl mx-auto mb-4 sm:mb-6 px-2">
                        {t('assembly.process.heroDesc')}
                    </p>
                    <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
                        <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {t('assembly.process.stats.deputies')}
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3">
                            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {t('assembly.process.stats.commissions')}
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {t('assembly.process.stats.days')}
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Diagramme principal */}
            <section id="flux-section" className="py-10 sm:py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('assembly.process.flow.title')}</h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {t('assembly.process.flow.desc')}
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto overflow-x-auto">
                        <MermaidDiagram
                            chart={legislativeFlowChart}
                            title={t('assembly.process.flow.diagramTitle')}
                            className="shadow-lg min-w-[600px] sm:min-w-0"
                            onNodeClick={handleNodeClick}
                        />
                    </div>
                </div>
            </section>

            {/* Commissions */}
            <section id="commissions-section" className="py-10 sm:py-16 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('assembly.process.commissions.title')}</h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {t('assembly.process.commissions.desc')}
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto overflow-x-auto">
                        <MermaidDiagram
                            chart={commissionsChart}
                            className="shadow-lg min-w-[500px] sm:min-w-0"
                        />
                    </div>
                </div>
            </section>

            {/* Processus détaillé */}
            <section id="phases" className="py-10 sm:py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('assembly.process.phases.title')}</h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {t('assembly.process.phases.desc')}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                        {processSteps.map((step, index) => (
                            <AnimatedPhaseCard
                                key={index}
                                step={step}
                                index={index}
                                isLast={index === processSteps.length - 1}
                                variant="assembly"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Navette parlementaire */}
            <section id="navette-section" className="py-10 sm:py-16 bg-emerald-50 dark:bg-emerald-950/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 sm:mb-12">
                        <Badge className="mb-3 sm:mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <ArrowLeftRight className="h-3 w-3 mr-1" />
                            {t('assembly.process.shuttle.badge')}
                        </Badge>
                        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('assembly.process.shuttle.title')}</h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {t('assembly.process.shuttle.desc')}
                        </p>
                    </div>
                    <div className="max-w-6xl mx-auto mb-6 sm:mb-8 overflow-x-auto">
                        <MermaidDiagram
                            chart={navetteCompleteChart}
                            title={t('assembly.process.shuttle.title')}
                            className="shadow-lg min-w-[700px] sm:min-w-0"
                            onNodeClick={handleNodeClick}
                        />
                    </div>
                    <div className="max-w-5xl mx-auto overflow-x-auto">
                        <MermaidDiagram
                            chart={navetteChart}
                            title="Vue simplifiée de la navette"
                            className="shadow-lg min-w-[500px] sm:min-w-0"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mt-6 sm:mt-8">
                        <Card className="bg-white dark:bg-gray-800">
                            <CardHeader className="pb-2 sm:pb-4">
                                <CardTitle className="flex items-center gap-2 text-emerald-600 text-base sm:text-lg">
                                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                    {t('assembly.process.shuttle.identical')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    {t('assembly.process.shuttle.identicalDesc')}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-gray-800">
                            <CardHeader className="pb-2 sm:pb-4">
                                <CardTitle className="flex items-center gap-2 text-amber-600 text-base sm:text-lg">
                                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                                    {t('assembly.process.shuttle.amended')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    {t('assembly.process.shuttle.amendedDesc')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-10 sm:py-16 bg-emerald-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('assembly.process.cta.title')}</h2>
                    <p className="opacity-90 mb-6 sm:mb-8 text-sm sm:text-base">
                        {t('assembly.process.cta.desc')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        <Button size="lg" variant="secondary" onClick={() => navigate("/an/demo")} className="w-full sm:w-auto">
                            <PlayCircle className="mr-2 h-5 w-5" />
                            {t('assembly.process.cta.demoBtn')}
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto" onClick={() => navigate("/an")}>
                            <Home className="mr-2 h-5 w-5" />
                            {t('assembly.process.cta.homeBtn')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-emerald-900 text-white py-6 sm:py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-3 sm:mb-4">
                        <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="font-bold text-sm sm:text-base">{t('assembly.layout.breadcrumbAN')}</span>
                    </div>
                    <p className="text-xs sm:text-sm opacity-80">
                        {t('assembly.footer.address')}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AssemblyProcessPage;
