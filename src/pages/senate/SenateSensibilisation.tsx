import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Landmark, ArrowLeft, Users, BookOpen, Scale, MapPin, Crown, FileText,
    ChevronRight, CheckCircle, ArrowLeftRight, Vote, Gavel, Building2,
    Clock, Shield, Globe, Award, Target, Lightbulb, HelpCircle, Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SENATORS, PROVINCES, POLITICAL_PARTIES, ELECTORAL_STATS } from "@/data/politicalData";

/**
 * Page Sensibilisation du Sénat
 * Éducation civique sur le rôle et le fonctionnement du Sénat
 */
const SenateSensibilisation = () => {
    const navigate = useNavigate();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    // Données statistiques réelles
    const senatorsCount = SENATORS.length;
    const provincesCount = PROVINCES.length;
    const partyDistribution = POLITICAL_PARTIES.filter(p => p.seatsSenate > 0);

    const senateRoles = [
        {
            icon: Crown,
            title: "Représentation Territoriale",
            description: "Le Sénat représente les collectivités territoriales de la République. Chaque province du Gabon y est représentée.",
            color: "amber"
        },
        {
            icon: FileText,
            title: "Examen des Lois",
            description: "Le Sénat examine en seconde lecture les textes votés par l'Assemblée Nationale dans un délai de 20 jours.",
            color: "blue"
        },
        {
            icon: Scale,
            title: "Équilibre Institutionnel",
            description: "En cas de désaccord avec l'AN, le Sénat peut proposer des amendements ou demander une Commission Mixte Paritaire.",
            color: "purple"
        },
        {
            icon: MapPin,
            title: "Lien avec les Territoires",
            description: "Les sénateurs maintiennent un lien permanent avec les élus locaux (maires, conseillers) de leur circonscription.",
            color: "green"
        },
        {
            icon: Shield,
            title: "Gardien de la Constitution",
            description: "Le Sénat peut saisir la Cour Constitutionnelle pour vérifier la conformité des lois à la Constitution.",
            color: "red"
        },
        {
            icon: Globe,
            title: "Diplomatie Parlementaire",
            description: "Le Sénat entretient des relations avec les chambres hautes d'autres pays pour les échanges d'expériences.",
            color: "cyan"
        }
    ];

    const legislativeProcess = [
        {
            step: 1,
            title: "Réception du texte",
            description: "Le texte voté par l'Assemblée Nationale est transmis au Sénat.",
            icon: FileText,
            duration: "Jour 1"
        },
        {
            step: 2,
            title: "Examen en commission",
            description: "La commission compétente étudie le texte et propose des amendements.",
            icon: Users,
            duration: "Jours 2-10"
        },
        {
            step: 3,
            title: "Débat en plénière",
            description: "L'ensemble des sénateurs débattent du texte et des amendements.",
            icon: Gavel,
            duration: "Jours 11-15"
        },
        {
            step: 4,
            title: "Vote",
            description: "Les sénateurs votent le texte, éventuellement modifié.",
            icon: Vote,
            duration: "Jours 16-20"
        },
        {
            step: 5,
            title: "Navette ou promulgation",
            description: "Retour à l'AN si modifié, ou transmission pour promulgation si identique.",
            icon: ArrowLeftRight,
            duration: "Après vote"
        }
    ];

    const faqs = [
        {
            question: "Quelle est la différence entre un député et un sénateur ?",
            answer: "Le député est élu au suffrage universel direct par les citoyens et représente la Nation. Le sénateur est élu au suffrage universel indirect par les conseillers municipaux et départementaux, et représente les collectivités territoriales."
        },
        {
            question: "Combien y a-t-il de sénateurs au Gabon ?",
            answer: `Le Sénat de la Ve République compte ${senatorsCount} sénateurs, élus pour représenter les ${provincesCount} provinces du Gabon et assurer la voix des territoires au Parlement.`
        },
        {
            question: "Comment devient-on sénateur ?",
            answer: "Pour être élu sénateur, il faut être Gabonais, avoir au moins 40 ans, jouir de ses droits civiques et politiques, et être élu par un collège électoral composé des conseillers municipaux et départementaux."
        },
        {
            question: "Quel est le délai d'examen d'un texte par le Sénat ?",
            answer: "La Constitution accorde au Sénat un délai de 20 jours pour examiner les textes transmis par l'Assemblée Nationale. Pour les textes relatifs aux collectivités territoriales, ce délai peut être prolongé."
        },
        {
            question: "Qu'est-ce que la navette parlementaire ?",
            answer: "La navette est le va-et-vient d'un texte de loi entre l'Assemblée Nationale et le Sénat jusqu'à adoption d'un texte identique. En cas de désaccord persistant, une Commission Mixte Paritaire (CMP) composée de 7 députés et 7 sénateurs peut être convoquée."
        },
        {
            question: "Le Sénat peut-il bloquer une loi ?",
            answer: "Non, le Sénat ne peut pas bloquer définitivement une loi. Si le désaccord persiste après la CMP, c'est l'Assemblée Nationale qui a le dernier mot. Cependant, pour les textes concernant les collectivités territoriales, l'avis du Sénat a un poids particulier."
        },
        {
            question: "Qui préside le Sénat ?",
            answer: `La présidente actuelle du Sénat est ${SENATORS.find(s => s.roles.includes('president'))?.name || 'Madeleine Sidonie Revangue'}, élue en novembre 2025. Le/La président(e) du Sénat est la deuxième personnalité de l'État après le Président de la République.`
        },
        {
            question: "Où se trouve le Sénat ?",
            answer: "Le Sénat siège au Palais Omar Bongo Ondimba à Libreville, dans la province de l'Estuaire."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-gradient-to-r from-amber-600 to-amber-700 text-white sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/senat")}
                                className="text-white hover:bg-white/20"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-8 w-8" />
                                <div>
                                    <h1 className="text-xl font-serif font-bold">Sensibilisation</h1>
                                    <p className="text-amber-100 text-sm">Comprendre le Sénat</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={() => navigate("/senat/tutoriels")}>
                                Tutoriels
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200" variant="outline">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Éducation civique
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            Comprendre le rôle du Sénat
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Le Sénat est la chambre haute du Parlement. Découvrez son fonctionnement,
                            ses missions et son importance dans l'équilibre des pouvoirs.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                                <Target className="mr-2 h-5 w-5" />
                                Les missions du Sénat
                            </Button>
                            <Button size="lg" variant="outline">
                                <HelpCircle className="mr-2 h-5 w-5" />
                                FAQ
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Figures */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <Card className="text-center p-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200">
                            <div className="text-4xl font-bold text-amber-600 mb-2">{senatorsCount}</div>
                            <div className="text-sm text-muted-foreground">Sénateurs</div>
                        </Card>
                        <Card className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                            <div className="text-4xl font-bold text-blue-600 mb-2">{provincesCount}</div>
                            <div className="text-sm text-muted-foreground">Provinces</div>
                        </Card>
                        <Card className="text-center p-6 bg-green-50 dark:bg-green-900/20 border-green-200">
                            <div className="text-4xl font-bold text-green-600 mb-2">20</div>
                            <div className="text-sm text-muted-foreground">Jours (délai légal)</div>
                        </Card>
                        <Card className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                            <div className="text-4xl font-bold text-purple-600 mb-2">2e</div>
                            <div className="text-sm text-muted-foreground">Personnalité de l'État</div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-serif font-bold mb-4">Les missions du Sénat</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Le Sénat joue un rôle essentiel dans le fonctionnement de la démocratie gabonaise
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {senateRoles.map((role, index) => {
                            const Icon = role.icon;
                            return (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className={`w-12 h-12 rounded-lg bg-${role.color}-100 dark:bg-${role.color}-900/30 flex items-center justify-center mb-3`}>
                                            <Icon className={`h-6 w-6 text-${role.color}-600`} />
                                        </div>
                                        <CardTitle className="text-lg">{role.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">{role.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Legislative Process */}
            <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200" variant="outline">
                            <ArrowLeftRight className="h-3 w-3 mr-1" />
                            Processus Législatif
                        </Badge>
                        <h3 className="text-3xl font-serif font-bold mb-4">Comment le Sénat examine une loi</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Du dépôt du texte à sa transmission : les 5 étapes clés
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-5 gap-4">
                            {legislativeProcess.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.step} className="relative">
                                        <Card className="text-center p-4 h-full">
                                            <div className="w-10 h-10 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center font-bold mb-3">
                                                {step.step}
                                            </div>
                                            <Icon className="h-6 w-6 mx-auto text-amber-600 mb-2" />
                                            <h4 className="font-semibold text-sm mb-2">{step.title}</h4>
                                            <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                                            <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                                        </Card>
                                        {index < legislativeProcess.length - 1 && (
                                            <div className="hidden md:block absolute top-1/3 -right-2 z-10">
                                                <ChevronRight className="h-4 w-4 text-amber-600" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Party Distribution */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-serif font-bold mb-4">Composition politique du Sénat</h3>
                        <p className="text-muted-foreground">Répartition des {senatorsCount} sièges par formation politique (2025)</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {partyDistribution.sort((a, b) => b.seatsSenate - a.seatsSenate).map((party) => (
                            <Card key={party.id} className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: party.color }}
                                    />
                                    <span className="font-semibold">{party.shortName}</span>
                                </div>
                                <div className="text-3xl font-bold mb-1" style={{ color: party.color }}>
                                    {party.seatsSenate}
                                </div>
                                <div className="text-sm text-muted-foreground">sièges</div>
                                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            backgroundColor: party.color,
                                            width: `${(party.seatsSenate / senatorsCount) * 100}%`
                                        }}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4" variant="outline">
                            <HelpCircle className="h-3 w-3 mr-1" />
                            Questions fréquentes
                        </Badge>
                        <h3 className="text-3xl font-serif font-bold mb-4">FAQ sur le Sénat</h3>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <Card
                                key={index}
                                className="cursor-pointer overflow-hidden"
                                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-medium flex items-center gap-2">
                                            <Info className="h-4 w-4 text-amber-500" />
                                            {faq.question}
                                        </CardTitle>
                                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${expandedFaq === index ? 'rotate-90' : ''}`} />
                                    </div>
                                </CardHeader>
                                {expandedFaq === index && (
                                    <CardContent className="pt-0">
                                        <p className="text-muted-foreground text-sm pl-6">
                                            {faq.answer}
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-serif font-bold mb-4">Visitez le Sénat</h3>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Le Sénat organise régulièrement des journées portes ouvertes pour permettre aux citoyens
                        de découvrir l'institution et son fonctionnement.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" variant="secondary">
                            <Building2 className="mr-2 h-5 w-5" />
                            Réserver une visite
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                            <Users className="mr-2 h-5 w-5" />
                            Contacter un sénateur
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-amber-500" />
                            <span className="font-serif font-semibold">Sénat de la République Gabonaise</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat")}>
                                Accueil
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/actualites")}>
                                Actualités
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/tutoriels")}>
                                Tutoriels
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Tous droits réservés
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SenateSensibilisation;
