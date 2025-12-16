import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, BookOpen, Users, Download, Info, CheckCircle, Home, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";
import awarenessCivic from "@/assets/awareness-civic.jpg";
import awarenessYouth from "@/assets/awareness-youth.jpg";

const Sensibilisation = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();
    const [downloading, setDownloading] = useState<string | null>(null);

    const handleDownload = (docName: string) => {
        setDownloading(docName);
        toast.info(`${t('common.downloading')} ${docName}...`);
        setTimeout(() => {
            setDownloading(null);
            toast.success(t('common.downloadSuccess'));
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300" dir={dir}>
            {/* Unified Header */}
            <InstitutionSubHeader
                institution="AN"
                pageTitle={t('sensibilisation.title')}
                pageSubtitle={t('sensibilisation.subtitle')}
                pageIcon={Lightbulb}
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <Tabs defaultValue="campaigns" className="space-y-8">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                        <TabsTrigger value="campaigns">{t('sensibilisation.tabs.campaigns')}</TabsTrigger>
                        <TabsTrigger value="guides">{t('sensibilisation.tabs.guides')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="campaigns" className="space-y-8 animate-fade-in">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="overflow-hidden border-l-4 border-l-amber-500 hover:shadow-elegant transition-all">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={awarenessCivic}
                                        alt="Campagne civique"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <Badge className="absolute top-4 left-4 bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">
                                        {t('sensibilisation.campaigns.active')}
                                    </Badge>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-3">{t('sensibilisation.campaigns.civic.title')}</h3>
                                    <p className="text-muted-foreground mb-6">
                                        {t('sensibilisation.campaigns.civic.desc')}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Button>{t('common.participate')}</Button>
                                        <Button variant="outline">{t('common.learnMore')}</Button>
                                    </div>
                                </div>
                            </Card>

                            <Card className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-elegant transition-all">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={awarenessYouth}
                                        alt="Programme jeunesse"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <Badge className="absolute top-4 left-4 bg-green-100 text-green-800 hover:bg-green-200 border-none">
                                        {t('sensibilisation.campaigns.upcoming')}
                                    </Badge>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-3">{t('sensibilisation.campaigns.youth.title')}</h3>
                                    <p className="text-muted-foreground mb-6">
                                        {t('sensibilisation.campaigns.youth.desc')}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Button variant="outline" disabled>{t('common.comingSoon')}</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="bg-card rounded-2xl p-8 border border-border/50">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                {t('sensibilisation.impact.title')}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center p-4 bg-background rounded-xl">
                                    <div className="text-3xl font-bold text-primary mb-1">15k+</div>
                                    <div className="text-sm text-muted-foreground">{t('sensibilisation.impact.citizens')}</div>
                                </div>
                                <div className="text-center p-4 bg-background rounded-xl">
                                    <div className="text-3xl font-bold text-primary mb-1">50+</div>
                                    <div className="text-sm text-muted-foreground">{t('sensibilisation.impact.workshops')}</div>
                                </div>
                                <div className="text-center p-4 bg-background rounded-xl">
                                    <div className="text-3xl font-bold text-primary mb-1">12</div>
                                    <div className="text-sm text-muted-foreground">{t('sensibilisation.impact.regions')}</div>
                                </div>
                                <div className="text-center p-4 bg-background rounded-xl">
                                    <div className="text-3xl font-bold text-primary mb-1">98%</div>
                                    <div className="text-sm text-muted-foreground">{t('sensibilisation.impact.satisfaction')}</div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="guides" className="space-y-6 animate-fade-in">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="p-6 hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold mb-2">{t('sensibilisation.guides.guideTitle')} {i}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {t('sensibilisation.guides.guideDesc')}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-between group-hover:bg-primary/5"
                                        onClick={() => handleDownload(`Guide_Citoyen_Vol${i}.pdf`)}
                                        disabled={downloading === `Guide_Citoyen_Vol${i}.pdf`}
                                    >
                                        {downloading === `Guide_Citoyen_Vol${i}.pdf` ? t('common.downloading') : t('common.download')}
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Sensibilisation;
