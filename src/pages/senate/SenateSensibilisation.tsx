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
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Page Sensibilisation du Sénat
 * Éducation civique sur le rôle et le fonctionnement du Sénat
 */
const SenateSensibilisation = () => {
    const navigate = useNavigate();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const { t } = useLanguage();

    // Données statistiques réelles
    const senatorsCount = SENATORS.length;
    const provincesCount = PROVINCES.length;
    const partyDistribution = POLITICAL_PARTIES.filter(p => p.seatsSenate > 0);

    const senateRoles = [
        {
            icon: Crown,
            title: t('senate.sensibilisation.roles.territorial.title'),
            description: t('senate.sensibilisation.roles.territorial.description'),
            color: "amber"
        },
        {
            icon: FileText,
            title: t('senate.sensibilisation.roles.lawsExam.title'),
            description: t('senate.sensibilisation.roles.lawsExam.description'),
            color: "blue"
        },
        {
            icon: Scale,
            title: t('senate.sensibilisation.roles.balance.title'),
            description: t('senate.sensibilisation.roles.balance.description'),
            color: "purple"
        },
        {
            icon: MapPin,
            title: t('senate.sensibilisation.roles.link.title'),
            description: t('senate.sensibilisation.roles.link.description'),
            color: "green"
        },
        {
            icon: Shield,
            title: t('senate.sensibilisation.roles.guardian.title'),
            description: t('senate.sensibilisation.roles.guardian.description'),
            color: "red"
        },
        {
            icon: Globe,
            title: t('senate.sensibilisation.roles.diplomacy.title'),
            description: t('senate.sensibilisation.roles.diplomacy.description'),
            color: "cyan"
        }
    ];

    const legislativeProcess = [
        {
            step: 1,
            title: t('senate.sensibilisation.process.steps.reception.title'),
            description: t('senate.sensibilisation.process.steps.reception.description'),
            icon: FileText,
            duration: t('senate.sensibilisation.process.steps.reception.duration')
        },
        {
            step: 2,
            title: t('senate.sensibilisation.process.steps.commission.title'),
            description: t('senate.sensibilisation.process.steps.commission.description'),
            icon: Users,
            duration: t('senate.sensibilisation.process.steps.commission.duration')
        },
        {
            step: 3,
            title: t('senate.sensibilisation.process.steps.plenary.title'),
            description: t('senate.sensibilisation.process.steps.plenary.description'),
            icon: Gavel,
            duration: t('senate.sensibilisation.process.steps.plenary.duration')
        },
        {
            step: 4,
            title: t('senate.sensibilisation.process.steps.vote.title'),
            description: t('senate.sensibilisation.process.steps.vote.description'),
            icon: Vote,
            duration: t('senate.sensibilisation.process.steps.vote.duration')
        },
        {
            step: 5,
            title: t('senate.sensibilisation.process.steps.shuttle.title'),
            description: t('senate.sensibilisation.process.steps.shuttle.description'),
            icon: ArrowLeftRight,
            duration: t('senate.sensibilisation.process.steps.shuttle.duration')
        }
    ];

    const faqs = [
        {
            question: t('senate.sensibilisation.faq.questions.q1.question'),
            answer: t('senate.sensibilisation.faq.questions.q1.answer')
        },
        {
            question: t('senate.sensibilisation.faq.questions.q2.question'),
            answer: t('senate.sensibilisation.faq.questions.q2.answer')
        },
        {
            question: t('senate.sensibilisation.faq.questions.q3.question'),
            answer: t('senate.sensibilisation.faq.questions.q3.answer')
        },
        {
            question: t('senate.sensibilisation.faq.questions.q4.question'),
            answer: t('senate.sensibilisation.faq.questions.q4.answer')
        },
        {
            question: t('senate.sensibilisation.faq.questions.q5.question'),
            answer: t('senate.sensibilisation.faq.questions.q5.answer')
        },
        {
            question: t('senate.sensibilisation.faq.questions.q6.question'),
            answer: t('senate.sensibilisation.faq.questions.q6.answer')
        },
        {
            question: t('senate.sensibilisation.faq.questions.q7.question'),
            answer: t('senate.sensibilisation.faq.questions.q7.answer')
        },
        {
            question: t('senate.sensibilisation.faq.questions.q8.question'),
            answer: t('senate.sensibilisation.faq.questions.q8.answer')
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Unified Header */}
            <InstitutionSubHeader
                institution="SENATE"
                pageTitle={t('senate.sensibilisation.header.title')}
                pageSubtitle={t('senate.sensibilisation.header.subtitle')}
                pageIcon={BookOpen}
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-[#D19C00]/10 text-amber-700 border-[#D19C00]/20" variant="outline">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            {t('senate.sensibilisation.hero.badge')}
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            {t('senate.sensibilisation.hero.title')}
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {t('senate.sensibilisation.hero.description')}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg" className="bg-[#D19C00] hover:bg-amber-700">
                                <Target className="mr-2 h-5 w-5" />
                                {t('senate.sensibilisation.hero.btnMissions')}
                            </Button>
                            <Button size="lg" variant="outline">
                                <HelpCircle className="mr-2 h-5 w-5" />
                                {t('senate.sensibilisation.hero.btnFaq')}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Figures */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <Card className="text-center p-6 bg-[#D19C00]/5 dark:bg-amber-900/20 border-[#D19C00]/20">
                            <div className="text-4xl font-bold text-[#D19C00] mb-2">{senatorsCount}</div>
                            <div className="text-sm text-muted-foreground">{t('senate.sensibilisation.stats.senators')}</div>
                        </Card>
                        <Card className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                            <div className="text-4xl font-bold text-blue-600 mb-2">{provincesCount}</div>
                            <div className="text-sm text-muted-foreground">{t('senate.sensibilisation.stats.provinces')}</div>
                        </Card>
                        <Card className="text-center p-6 bg-green-50 dark:bg-green-900/20 border-green-200">
                            <div className="text-4xl font-bold text-green-600 mb-2">20</div>
                            <div className="text-sm text-muted-foreground">{t('senate.sensibilisation.stats.legalDelay')}</div>
                        </Card>
                        <Card className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                            <div className="text-4xl font-bold text-purple-600 mb-2">2e</div>
                            <div className="text-sm text-muted-foreground">{t('senate.sensibilisation.stats.stateRank')}</div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-serif font-bold mb-4">{t('senate.sensibilisation.roles.title')}</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('senate.sensibilisation.roles.description')}
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
                        <Badge className="mb-4 bg-[#D19C00]/10 text-amber-700 border-[#D19C00]/20" variant="outline">
                            <ArrowLeftRight className="h-3 w-3 mr-1" />
                            {t('senate.sensibilisation.process.badge')}
                        </Badge>
                        <h3 className="text-3xl font-serif font-bold mb-4">{t('senate.sensibilisation.process.title')}</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('senate.sensibilisation.process.description')}
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-5 gap-4">
                            {legislativeProcess.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.step} className="relative">
                                        <Card className="text-center p-4 h-full">
                                            <div className="w-10 h-10 mx-auto rounded-full bg-[#D19C00] text-white flex items-center justify-center font-bold mb-3">
                                                {step.step}
                                            </div>
                                            <Icon className="h-6 w-6 mx-auto text-[#D19C00] mb-2" />
                                            <h4 className="font-semibold text-sm mb-2">{step.title}</h4>
                                            <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                                            <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                                        </Card>
                                        {index < legislativeProcess.length - 1 && (
                                            <div className="hidden md:block absolute top-1/3 -right-2 z-10">
                                                <ChevronRight className="h-4 w-4 text-[#D19C00]" />
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
                        <h3 className="text-3xl font-serif font-bold mb-4">{t('senate.sensibilisation.composition.title')}</h3>
                        <p className="text-muted-foreground">{t('senate.sensibilisation.composition.description')}</p>
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
                                <div className="text-sm text-muted-foreground">{t('senate.sensibilisation.composition.seats')}</div>
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
                            {t('senate.sensibilisation.faq.badge')}
                        </Badge>
                        <h3 className="text-3xl font-serif font-bold mb-4">{t('senate.sensibilisation.faq.title')}</h3>
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
                                            <Info className="h-4 w-4 text-[#D19C00]" />
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
                    <h3 className="text-3xl font-serif font-bold mb-4">{t('senate.sensibilisation.cta.title')}</h3>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        {t('senate.sensibilisation.cta.description')}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" variant="secondary">
                            <Building2 className="mr-2 h-5 w-5" />
                            {t('senate.sensibilisation.cta.bookVisit')}
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                            <Users className="mr-2 h-5 w-5" />
                            {t('senate.sensibilisation.cta.contactSenator')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-[#D19C00]" />
                            <span className="font-serif font-semibold">{t('senate.sensibilisation.footer.title')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat")}>
                                {t('senate.sensibilisation.footer.home')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/actualites")}>
                                {t('senate.sensibilisation.footer.news')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/tutoriels")}>
                                {t('senate.sensibilisation.footer.tutorials')}
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} {t('senate.sensibilisation.footer.copyright')}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SenateSensibilisation;
