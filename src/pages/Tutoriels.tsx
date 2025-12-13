import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Play, BookOpen, CheckCircle, Clock, Home, Sun, Moon, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
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
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600/10 to-blue-600/10 border-b border-border/50 py-12 px-4">
                <div className="max-w-7xl mx-auto relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/")}
                        className="mb-4 hover:bg-background/50"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        {t('common.backToHome')}
                    </Button>

                    <div className="absolute top-0 right-0 md:top-4 md:right-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full"
                        >
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">{t('common.changeTheme')}</span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-indigo-600/10 neu-inset">
                            <GraduationCap className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-4xl font-bold">{t('tutorials.title')}</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {t('tutorials.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{t('tutorials.myLearning')}</h2>
                            <Button variant="outline">{t('tutorials.catalog')}</Button>
                        </div>

                        <div className="grid gap-6">
                            {tutorials.map((tutorial) => (
                                <Card key={tutorial.id} className="p-4 hover:shadow-elegant transition-all group cursor-pointer border-border/50">
                                    <div className="flex gap-4">
                                        <div className="relative w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={tutorial.image}
                                                alt={tutorial.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-8 h-8 text-white fill-current" />
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                        {tutorial.title}
                                                    </h3>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {tutorial.level}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tutorial.duration}</span>
                                                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> 4.8</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>{tutorial.progress}% {t('common.completed')}</span>
                                                </div>
                                                <Progress value={tutorial.progress} className="h-1.5" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="bg-card rounded-2xl p-8 border border-border/50 mt-8">
                            <h3 className="text-xl font-bold mb-4">{t('tutorials.recommended.title')}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                    </div>
                                    <h4 className="font-bold mb-1">{t('tutorials.recommended.constitution')}</h4>
                                    <p className="text-sm text-muted-foreground">{t('tutorials.recommended.constitutionDesc')}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-background border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                                        <CheckCircle className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h4 className="font-bold mb-1">{t('tutorials.recommended.voting')}</h4>
                                    <p className="text-sm text-muted-foreground">{t('tutorials.recommended.votingDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-none">
                            <h3 className="text-xl font-bold mb-2">{t('tutorials.pro.title')}</h3>
                            <p className="text-indigo-100 mb-6 text-sm">
                                {t('tutorials.pro.desc')}
                            </p>
                            <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                                {t('tutorials.pro.button')}
                            </Button>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold mb-4">{t('tutorials.stats.title')}</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm text-muted-foreground">{t('tutorials.stats.hours')}</span>
                                    <span className="font-bold">12h 30m</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm text-muted-foreground">{t('tutorials.stats.completed')}</span>
                                    <span className="font-bold">8</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm text-muted-foreground">{t('tutorials.stats.certificates')}</span>
                                    <span className="font-bold">2</span>
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
