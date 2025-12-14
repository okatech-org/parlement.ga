import { 
    Building2, Users, FileText, ArrowLeftRight, Scale,
    CheckCircle, Clock, Send, MessageSquare, MapPin,
    ChevronRight, Home, Sun, Moon, PlayCircle, Gavel, BookOpen,
    ArrowDown, Vote, Briefcase, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import MermaidDiagram from "@/components/MermaidDiagram";

/**
 * Page dédiée au Protocole Législatif de l'Assemblée Nationale
 */
const AssemblyProcessPage = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    // Diagramme du flux législatif
    const legislativeFlowChart = `
flowchart TD
    A[📄 Dépôt du texte] --> B{Type de texte}
    B -->|Projet de loi| C[Gouvernement]
    B -->|Proposition| D[Député]
    C --> E[Bureau de l'AN]
    D --> E
    E --> F[Commission compétente]
    F --> G[Examen en commission]
    G --> H[Rapport du rapporteur]
    H --> I[Inscription à l'ordre du jour]
    I --> J[Discussion générale]
    J --> K[Examen des amendements]
    K --> L[Vote article par article]
    L --> M{Vote final}
    M -->|Adopté| N[Transmission au Sénat]
    M -->|Rejeté| O[Fin de procédure]
    N --> P{Navette parlementaire}
    
    style A fill:#10b981,color:#fff
    style M fill:#f59e0b,color:#fff
    style N fill:#3b82f6,color:#fff
    style O fill:#ef4444,color:#fff
`;

    // Diagramme des commissions
    const commissionsChart = `
flowchart LR
    AN[Assemblée Nationale] --> C1[Commission des Lois]
    AN --> C2[Commission des Finances]
    AN --> C3[Commission Affaires Étrangères]
    AN --> C4[Commission Défense]
    AN --> C5[Commission Affaires Sociales]
    AN --> C6[Commission Économique]
    
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
            title: "Dépôt du texte",
            duration: "Jour 1",
            icon: FileText,
            color: "bg-emerald-500",
            description: "Le projet ou proposition de loi est déposé sur le bureau de l'Assemblée Nationale.",
            details: [
                "Projets de loi : déposés par le Gouvernement",
                "Propositions de loi : initiative des députés",
                "Enregistrement et attribution d'un numéro",
                "Publication et diffusion aux groupes"
            ]
        },
        {
            phase: "Phase 2",
            title: "Renvoi en Commission",
            duration: "Jour 2",
            icon: Users,
            color: "bg-blue-500",
            description: "Le Président de l'AN saisit la commission permanente compétente.",
            details: [
                "6 commissions permanentes",
                "Désignation d'un rapporteur",
                "Auditions des ministres",
                "Consultations d'experts"
            ]
        },
        {
            phase: "Phase 3",
            title: "Travail en Commission",
            duration: "Jours 3-15",
            icon: Gavel,
            color: "bg-amber-500",
            description: "Examen approfondi du texte et des amendements en commission.",
            details: [
                "Examen article par article",
                "Dépôt et discussion des amendements",
                "Vote des amendements en commission",
                "Rédaction du rapport"
            ]
        },
        {
            phase: "Phase 4",
            title: "Discussion en Plénière",
            duration: "Jours 16-25",
            icon: MessageSquare,
            color: "bg-purple-500",
            description: "Débat général et examen des amendements en séance publique.",
            details: [
                "Présentation par le rapporteur",
                "Discussion générale",
                "Défense des amendements",
                "Interventions des groupes"
            ]
        },
        {
            phase: "Phase 5",
            title: "Vote solennel",
            duration: "Jour 26-30",
            icon: Vote,
            color: "bg-red-500",
            description: "Vote final sur l'ensemble du texte amendé.",
            details: [
                "Explications de vote",
                "Scrutin public ou à main levée",
                "Majorité simple requise",
                "Proclamation des résultats"
            ]
        },
        {
            phase: "Phase 6",
            title: "Transmission",
            duration: "Après vote",
            icon: Send,
            color: "bg-indigo-500",
            description: "Le texte adopté est transmis au Sénat pour examen.",
            details: [
                "Notification au Président du Sénat",
                "Délai de 20 jours pour le Sénat",
                "Début de la navette parlementaire",
                "Suivi en temps réel"
            ]
        }
    ];

    // Navette parlementaire
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
            {/* Header */}
            <header className="border-b border-border bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => navigate("/an")}>
                                <Home className="h-5 w-5" />
                            </Button>
                            <Separator orientation="vertical" className="h-6" />
                            <Building2 className="h-7 w-7 text-emerald-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Processus Législatif</h1>
                                <p className="text-xs text-gray-500">Assemblée Nationale</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-600" onClick={() => navigate("/an/demo")}>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Démo
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="py-16 bg-gradient-to-br from-emerald-600 to-green-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-white/20 text-white border-white/30">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Guide Complet
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Protocole Législatif de l'Assemblée
                    </h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto mb-6">
                        Du dépôt d'un projet de loi à sa transmission au Sénat, découvrez le parcours complet d'un texte à l'Assemblée Nationale.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Badge className="bg-white/20 text-white border-white/30 text-sm py-1.5 px-3">
                            <Users className="h-4 w-4 mr-1" />
                            143 députés
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 text-sm py-1.5 px-3">
                            <Briefcase className="h-4 w-4 mr-1" />
                            6 commissions
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 text-sm py-1.5 px-3">
                            <Clock className="h-4 w-4 mr-1" />
                            ~30 jours
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Diagramme principal */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Flux Législatif</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Visualisez le parcours complet d'un texte à l'Assemblée Nationale
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <MermaidDiagram 
                            chart={legislativeFlowChart} 
                            title="Parcours d'un texte législatif"
                            className="shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Commissions */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Les 6 Commissions Permanentes</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Chaque texte est examiné par la commission compétente
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <MermaidDiagram 
                            chart={commissionsChart} 
                            className="shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Processus détaillé */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Les 6 Phases du Processus</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Détail de chaque étape du parcours législatif
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {processSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <Card key={index} className="overflow-hidden shadow-lg">
                                    <div className="flex flex-col md:flex-row">
                                        <div className={`${step.color} p-6 md:w-64 flex flex-col justify-center items-center text-white`}>
                                            <Badge className="mb-2 bg-white/20 text-white border-0">
                                                {step.phase}
                                            </Badge>
                                            <Icon className="h-10 w-10 mb-2" />
                                            <h3 className="font-bold text-center">{step.title}</h3>
                                            <span className="text-sm opacity-80">{step.duration}</span>
                                        </div>
                                        <div className="p-6 flex-1">
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {step.details.map((detail, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                                        <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {index < processSteps.length - 1 && (
                                        <div className="flex justify-center py-2 bg-gray-50 dark:bg-gray-800">
                                            <ArrowDown className="h-5 w-5 text-gray-400" />
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Navette parlementaire */}
            <section className="py-16 bg-emerald-50 dark:bg-emerald-950/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <ArrowLeftRight className="h-3 w-3 mr-1" />
                            Bicaméralisme
                        </Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">La Navette Parlementaire</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Échanges entre l'Assemblée Nationale et le Sénat jusqu'à l'adoption définitive
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <MermaidDiagram 
                            chart={navetteChart} 
                            title="Processus de navette entre les deux chambres"
                            className="shadow-lg"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
                        <Card className="bg-white dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-600">
                                    <CheckCircle className="h-5 w-5" />
                                    Texte conforme
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Si le Sénat adopte le texte sans modification, celui-ci est définitivement adopté et transmis pour promulgation.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    Texte amendé
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Si le Sénat modifie le texte, il revient à l'AN pour une nouvelle lecture. Après 2 lectures, une CMP peut être convoquée.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-emerald-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Prêt à explorer ?</h2>
                    <p className="opacity-90 mb-8">
                        Testez les fonctionnalités de l'Assemblée Nationale en mode démonstration
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Button size="lg" variant="secondary" onClick={() => navigate("/an/demo")}>
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Accéder à la démo
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => navigate("/an")}>
                            <Home className="mr-2 h-5 w-5" />
                            Retour à l'accueil
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-emerald-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Building2 className="h-6 w-6" />
                        <span className="font-bold">Assemblée Nationale du Gabon</span>
                    </div>
                    <p className="text-sm opacity-80">
                        Palais Léon Mba - Libreville
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AssemblyProcessPage;
