import { 
    Landmark, Users, FileText, ArrowLeftRight, Scale, Crown,
    CheckCircle, Clock, Send, MessageSquare, MapPin, AlertTriangle,
    ChevronRight, Home, Sun, Moon, PlayCircle, Gavel, BookOpen,
    ArrowDown, Building, Vote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import MermaidDiagram from "@/components/MermaidDiagram";

/**
 * Page dédiée au Protocole Législatif du Sénat
 * Détails approfondis sur le fonctionnement
 */
const SenateProcessPage = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    // Étapes détaillées du processus
    const processSteps = [
        {
            phase: "Phase 1",
            title: "Réception du texte",
            duration: "Jour 1",
            icon: FileText,
            color: "bg-blue-500",
            description: "Le texte voté par l'Assemblée Nationale est transmis au Sénat par le Président de l'AN.",
            details: [
                "Enregistrement au Bureau du Sénat",
                "Attribution d'un numéro de référence",
                "Notification aux groupes parlementaires",
                "Déclenchement du délai de 20 jours"
            ]
        },
        {
            phase: "Phase 2",
            title: "Affectation en Commission",
            duration: "Jour 2",
            icon: Users,
            color: "bg-amber-500",
            description: "Le Président du Sénat saisit la commission permanente compétente.",
            details: [
                "Désignation de la commission compétente",
                "Nomination d'un rapporteur",
                "Transmission du dossier complet",
                "Priorité si texte relatif aux collectivités"
            ]
        },
        {
            phase: "Phase 3",
            title: "Examen en Commission",
            duration: "Jours 3-12",
            icon: Gavel,
            color: "bg-purple-500",
            description: "La commission étudie le texte article par article et propose des amendements.",
            details: [
                "Audition des ministres concernés",
                "Examen article par article",
                "Dépôt et discussion des amendements",
                "Adoption du rapport de la commission"
            ]
        },
        {
            phase: "Phase 4",
            title: "Discussion en Plénière",
            duration: "Jours 13-17",
            icon: MessageSquare,
            color: "bg-green-500",
            description: "Débat général et examen des amendements en séance publique.",
            details: [
                "Présentation par le rapporteur",
                "Discussion générale",
                "Examen des amendements",
                "Explications de vote"
            ]
        },
        {
            phase: "Phase 5",
            title: "Vote solennel",
            duration: "Jours 18-20",
            icon: Vote,
            color: "bg-red-500",
            description: "Vote final sur l'ensemble du texte (conforme ou amendé).",
            details: [
                "Scrutin public ou à main levée",
                "Majorité simple requise",
                "Proclamation des résultats",
                "Rédaction du PV de séance"
            ]
        },
        {
            phase: "Phase 6",
            title: "Transmission",
            duration: "Après vote",
            icon: Send,
            color: "bg-indigo-500",
            description: "Le texte est transmis selon le résultat du vote.",
            details: [
                "Si conforme : envoi pour promulgation",
                "Si amendé : retour à l'Assemblée Nationale",
                "Si rejeté : procédure CMP possible",
                "Archivage au Journal Officiel"
            ]
        }
    ];

    // Spécificités du Sénat
    const senateSpecificities = [
        {
            title: "Représentation territoriale",
            icon: MapPin,
            description: "Le Sénat représente les collectivités locales. Les textes les concernant bénéficient d'un traitement prioritaire.",
            examples: ["Décentralisation", "Finances locales", "Organisation territoriale"]
        },
        {
            title: "Doléances des élus locaux",
            icon: AlertTriangle,
            description: "Les sénateurs recueillent les préoccupations des maires et conseillers départementaux.",
            examples: ["Infrastructure", "Éducation", "Santé", "Développement"]
        },
        {
            title: "Visites de terrain",
            icon: Building,
            description: "Les sénateurs effectuent des missions dans leurs provinces pour évaluer les besoins.",
            examples: ["Rapports de visite", "Recommandations", "Suivi des projets"]
        }
    ];

    // CMP
    const cmpProcess = [
        { step: 1, title: "Convocation", description: "En cas de désaccord après 2 lectures" },
        { step: 2, title: "Composition", description: "7 députés + 7 sénateurs" },
        { step: 3, title: "Négociation", description: "Élaboration d'un texte commun" },
        { step: 4, title: "Vote CMP", description: "Adoption du compromis ou échec" },
        { step: 5, title: "Lecture finale", description: "Examen par les deux chambres" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => navigate("/senat")}>
                                <Home className="h-5 w-5" />
                            </Button>
                            <Separator orientation="vertical" className="h-6" />
                            <Landmark className="h-7 w-7 text-primary" />
                            <div>
                                <h1 className="text-xl font-serif font-bold text-foreground">Processus Législatif</h1>
                                <p className="text-xs text-muted-foreground">Fonctionnement du Sénat</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate("/senat/demo")}>
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
            <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Guide Complet
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Protocole Législatif du Sénat
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                        Découvrez en détail le fonctionnement de la chambre haute du Parlement gabonais,
                        de la réception des textes à leur adoption.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Badge variant="outline" className="text-sm py-1.5 px-3">
                            <Clock className="h-4 w-4 mr-1" />
                            Délai de 20 jours
                        </Badge>
                        <Badge variant="outline" className="text-sm py-1.5 px-3">
                            <Users className="h-4 w-4 mr-1" />
                            102 sénateurs
                        </Badge>
                        <Badge variant="outline" className="text-sm py-1.5 px-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            9 provinces
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Diagramme du flux législatif */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold mb-4">Flux Législatif au Sénat</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Visualisez le parcours complet d'un texte reçu de l'Assemblée Nationale
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
                            title="Parcours d'un texte au Sénat"
                            className="shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Processus détaillé */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold mb-4">Les 6 Phases du Processus</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Chaque texte reçu de l'Assemblée Nationale suit un parcours rigoureux
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {processSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <Card key={index} className="overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        <div className={`${step.color} p-6 md:w-64 flex flex-col justify-center items-center text-white`}>
                                            <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-0">
                                                {step.phase}
                                            </Badge>
                                            <Icon className="h-10 w-10 mb-2" />
                                            <h3 className="font-bold text-center">{step.title}</h3>
                                            <span className="text-sm opacity-80">{step.duration}</span>
                                        </div>
                                        <div className="p-6 flex-1">
                                            <p className="text-muted-foreground mb-4">{step.description}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {step.details.map((detail, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                        <span>{detail}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {index < processSteps.length - 1 && (
                                        <div className="flex justify-center py-2 bg-muted/30">
                                            <ArrowDown className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Spécificités du Sénat */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold mb-4">Spécificités du Sénat</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Le Sénat se distingue par son rôle de représentation des collectivités territoriales
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
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            <Scale className="h-3 w-3 mr-1" />
                            Procédure spéciale
                        </Badge>
                        <h2 className="text-3xl font-serif font-bold mb-4">Commission Mixte Paritaire (CMP)</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            En cas de désaccord persistant entre les deux chambres, une CMP est convoquée
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
                                        Si accord
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Le texte commun est soumis aux deux assemblées pour adoption.
                                        Si adopté, il est transmis pour promulgation.
                                    </p>
                                </div>
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        Si échec
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        L'Assemblée Nationale peut statuer définitivement après une nouvelle lecture.
                                        Le Sénat peut demander une nouvelle délibération.
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
                    <h2 className="text-2xl font-serif font-bold mb-4">Prêt à explorer ?</h2>
                    <p className="text-muted-foreground mb-8">
                        Testez les fonctionnalités du Sénat en mode démonstration
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Button size="lg" onClick={() => navigate("/senat/demo")}>
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Accéder à la démo
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/senat")}>
                            <Home className="mr-2 h-5 w-5" />
                            Retour à l'accueil
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Landmark className="h-6 w-6 text-primary" />
                        <span className="font-serif font-bold">Sénat du Gabon</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Palais Omar Bongo Ondimba - Libreville
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SenateProcessPage;
