import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Play, BookOpen, CheckCircle, Clock, Home, Sun, Moon, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";
import tutorialParliament from "@/assets/tutorial-parliament.jpg";
import tutorialLaw from "@/assets/tutorial-law.jpg";
import tutorialBudget from "@/assets/tutorial-budget.jpg";

const Tutoriels = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();

    const tutorials = [
        {
            id: 1,
            title: t('tutorials.videos.parliament.title'),
            duration: "15 min",
            level: t('tutorials.levels.beginner'),
            progress: 100,
            image: tutorialParliament
        },
        {
            id: 2,
            title: t('tutorials.videos.law.title'),
            duration: "25 min",
            level: t('tutorials.levels.intermediate'),
            progress: 45,
            image: tutorialLaw
        },
        {
            id: 3,
            title: t('tutorials.videos.budget.title'),
            duration: "20 min",
            level: t('tutorials.levels.advanced'),
            progress: 0,
            image: tutorialBudget
        }
    ];

    return (
        <div className="min-h-screen bg-background transition-colors duration-300" dir={dir}>
            {/* Unified Header */}
            <InstitutionSubHeader
                institution="AN"
                pageTitle={t('tutorials.title')}
                pageSubtitle={t('tutorials.subtitle')}
                pageIcon={GraduationCap}
            />

            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h2 className="text-xl sm:text-2xl font-bold">{t('tutorials.myLearning')}</h2>
                            <Button variant="outline" size="sm" className="w-fit">{t('tutorials.catalog')}</Button>
                        </div>

                        <div className="grid gap-4 sm:gap-6">
                            {tutorials.map((tutorial) => (
                                <Card key={tutorial.id} className="p-3 sm:p-4 hover:shadow-elegant transition-all group cursor-pointer border-border/50 active:scale-[0.99]">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <div className="relative w-full sm:w-40 h-32 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={tutorial.image}
                                                alt={tutorial.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-8 h-8 text-white fill-current" />
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-2">
                                                    <h3 className="font-bold text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-1">
                                                        {tutorial.title}
                                                    </h3>
                                                    <Badge variant="secondary" className="text-[10px] sm:text-xs w-fit flex-shrink-0">
                                                        {tutorial.level}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">
                                                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {tutorial.duration}</span>
                                                    <span className="flex items-center gap-1"><Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500" /> 4.8</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 sm:space-y-2">
                                                <div className="flex justify-between text-[10px] sm:text-xs">
                                                    <span>{tutorial.progress}% {t('common.completed')}</span>
                                                </div>
                                                <Progress value={tutorial.progress} className="h-1 sm:h-1.5" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-border/50 mt-6 sm:mt-8">
                            <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4">{t('tutorials.recommended.title')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
                                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                    <h4 className="font-bold mb-1 text-sm sm:text-base">{t('tutorials.recommended.constitution')}</h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{t('tutorials.recommended.constitutionDesc')}</p>
                                </div>
                                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2 sm:mb-3">
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                                    </div>
                                    <h4 className="font-bold mb-1 text-sm sm:text-base">{t('tutorials.recommended.voting')}</h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{t('tutorials.recommended.votingDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Shows above content on mobile */}
                    <div className="space-y-4 sm:space-y-6 order-first lg:order-last">
                        <Card className="p-4 sm:p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-none">
                            <h3 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-2">{t('tutorials.pro.title')}</h3>
                            <p className="text-indigo-100 mb-4 sm:mb-6 text-xs sm:text-sm">
                                {t('tutorials.pro.desc')}
                            </p>
                            <Button variant="secondary" size="sm" className="w-full bg-white text-indigo-600 hover:bg-indigo-50 sm:h-10">
                                {t('tutorials.pro.button')}
                            </Button>
                        </Card>

                        <Card className="p-4 sm:p-6">
                            <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">{t('tutorials.stats.title')}</h3>
                            <div className="space-y-2 sm:space-y-4">
                                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                                    <span className="text-xs sm:text-sm text-muted-foreground">{t('tutorials.stats.hours')}</span>
                                    <span className="font-bold text-sm sm:text-base">12h 30m</span>
                                </div>
                                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                                    <span className="text-xs sm:text-sm text-muted-foreground">{t('tutorials.stats.completed')}</span>
                                    <span className="font-bold text-sm sm:text-base">8</span>
                                </div>
                                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                                    <span className="text-xs sm:text-sm text-muted-foreground">{t('tutorials.stats.certificates')}</span>
                                    <span className="font-bold text-sm sm:text-base">2</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutoriels;
