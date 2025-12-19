import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Landmark, ArrowLeft, PlayCircle, BookOpen, GraduationCap, Search,
    ChevronRight, Clock, CheckCircle, Star, Download, Share2, Filter,
    Video, FileText, Monitor, Smartphone, Lock, Users, Settings,
    Mail, Calendar, Vote, BarChart3, Map, Bell, MessageSquare
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Page Tutoriels du Sénat
 * Guides pratiques pour utiliser la plateforme numérique
 */
const SenateTutoriels = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const { t } = useLanguage();

    const tutorials = [
        {
            id: 1,
            title: t('senate.tutorials.items.login.title'),
            description: t('senate.tutorials.items.login.description'),
            category: t('senate.tutorials.categories.authentication'),
            level: t('senate.tutorials.levels.beginner'),
            duration: "5 min",
            icon: Lock,
            color: "red",
            steps: 4,
            views: 2450,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 2,
            title: t('senate.tutorials.items.consultTexts.title'),
            description: t('senate.tutorials.items.consultTexts.description'),
            category: t('senate.tutorials.categories.shuttle'),
            level: t('senate.tutorials.levels.beginner'),
            duration: "8 min",
            icon: FileText,
            color: "blue",
            steps: 6,
            views: 1890,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 3,
            title: t('senate.tutorials.items.proposeAmendment.title'),
            description: t('senate.tutorials.items.proposeAmendment.description'),
            category: t('senate.tutorials.categories.legislation'),
            level: t('senate.tutorials.levels.intermediate'),
            duration: "15 min",
            icon: FileText,
            color: "purple",
            steps: 10,
            views: 1560,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 4,
            title: t('senate.tutorials.items.manageAgenda.title'),
            description: t('senate.tutorials.items.manageAgenda.description'),
            category: t('senate.tutorials.categories.agenda'),
            level: t('senate.tutorials.levels.beginner'),
            duration: "7 min",
            icon: Calendar,
            color: "green",
            steps: 5,
            views: 1340,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 5,
            title: t('senate.tutorials.items.voteInPlenary.title'),
            description: t('senate.tutorials.items.voteInPlenary.description'),
            category: t('senate.tutorials.categories.vote'),
            level: t('senate.tutorials.levels.intermediate'),
            duration: "10 min",
            icon: Vote,
            color: "amber",
            steps: 8,
            views: 2100,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 6,
            title: t('senate.tutorials.items.secureMessaging.title'),
            description: t('senate.tutorials.items.secureMessaging.description'),
            category: t('senate.tutorials.categories.communication'),
            level: t('senate.tutorials.levels.beginner'),
            duration: "6 min",
            icon: Mail,
            color: "cyan",
            steps: 4,
            views: 980,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 7,
            title: t('senate.tutorials.items.accessStats.title'),
            description: t('senate.tutorials.items.accessStats.description'),
            category: t('senate.tutorials.categories.statistics'),
            level: t('senate.tutorials.levels.intermediate'),
            duration: "8 min",
            icon: BarChart3,
            color: "indigo",
            steps: 5,
            views: 760,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 8,
            title: t('senate.tutorials.items.manageGrievances.title'),
            description: t('senate.tutorials.items.manageGrievances.description'),
            category: t('senate.tutorials.categories.territory'),
            level: t('senate.tutorials.levels.advanced'),
            duration: "20 min",
            icon: Map,
            color: "emerald",
            steps: 12,
            views: 1120,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 9,
            title: t('senate.tutorials.items.configureNotifications.title'),
            description: t('senate.tutorials.items.configureNotifications.description'),
            category: t('senate.tutorials.categories.settings'),
            level: t('senate.tutorials.levels.beginner'),
            duration: "4 min",
            icon: Bell,
            color: "orange",
            steps: 3,
            views: 650,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 10,
            title: t('senate.tutorials.items.virtualCMP.title'),
            description: t('senate.tutorials.items.virtualCMP.description'),
            category: t('senate.tutorials.categories.cmp'),
            level: t('senate.tutorials.levels.advanced'),
            duration: "25 min",
            icon: Users,
            color: "rose",
            steps: 15,
            views: 890,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 11,
            title: t('senate.tutorials.items.useAI.title'),
            description: t('senate.tutorials.items.useAI.description'),
            category: t('senate.tutorials.categories.ai'),
            level: t('senate.tutorials.levels.intermediate'),
            duration: "12 min",
            icon: MessageSquare,
            color: "violet",
            steps: 7,
            views: 2340,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 12,
            title: t('senate.tutorials.items.mobilePlatform.title'),
            description: t('senate.tutorials.items.mobilePlatform.description'),
            category: t('senate.tutorials.categories.mobile'),
            level: t('senate.tutorials.levels.beginner'),
            duration: "5 min",
            icon: Smartphone,
            color: "slate",
            steps: 4,
            views: 1560,
            featured: false,
            videoUrl: "#"
        }
    ];

    const categories = [
        { value: "all", label: t('senate.tutorials.hero.allCategories') },
        { value: t('senate.tutorials.categories.authentication'), label: t('senate.tutorials.categories.authentication') },
        { value: t('senate.tutorials.categories.shuttle'), label: t('senate.tutorials.categories.shuttle') },
        { value: t('senate.tutorials.categories.legislation'), label: t('senate.tutorials.categories.legislation') },
        { value: t('senate.tutorials.categories.agenda'), label: t('senate.tutorials.categories.agenda') },
        { value: t('senate.tutorials.categories.vote'), label: t('senate.tutorials.categories.vote') },
        { value: t('senate.tutorials.categories.communication'), label: t('senate.tutorials.categories.communication') },
        { value: t('senate.tutorials.categories.statistics'), label: t('senate.tutorials.categories.statistics') },
        { value: t('senate.tutorials.categories.territory'), label: t('senate.tutorials.categories.territory') },
        { value: t('senate.tutorials.categories.settings'), label: t('senate.tutorials.categories.settings') },
        { value: t('senate.tutorials.categories.cmp'), label: t('senate.tutorials.categories.cmp') },
        { value: t('senate.tutorials.categories.ai'), label: t('senate.tutorials.categories.ai') },
        { value: t('senate.tutorials.categories.mobile'), label: t('senate.tutorials.categories.mobile') },
    ];

    const levels = [
        { value: "all", label: t('senate.tutorials.hero.allLevels') },
        { value: t('senate.tutorials.levels.beginner'), label: t('senate.tutorials.levels.beginner') },
        { value: t('senate.tutorials.levels.intermediate'), label: t('senate.tutorials.levels.intermediate') },
        { value: t('senate.tutorials.levels.advanced'), label: t('senate.tutorials.levels.advanced') },
    ];

    const filteredTutorials = tutorials.filter(tuto => {
        const matchSearch = tuto.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tuto.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = categoryFilter === "all" || tuto.category === categoryFilter;
        const matchLevel = levelFilter === "all" || tuto.level === levelFilter;
        return matchSearch && matchCategory && matchLevel;
    });

    const featuredTutorials = filteredTutorials.filter(t => t.featured);

    const getLevelColor = (level: string) => {
        const beginner = t('senate.tutorials.levels.beginner');
        const intermediate = t('senate.tutorials.levels.intermediate');
        const advanced = t('senate.tutorials.levels.advanced');

        if (level === beginner) return "bg-green-100 text-green-700 border-green-200";
        if (level === intermediate) return "bg-[#D19C00]/10 text-amber-700 border-[#D19C00]/20";
        if (level === advanced) return "bg-red-100 text-red-700 border-red-200";
        return "bg-gray-100 text-gray-700";
    };

    // Stats
    const totalTutorials = tutorials.length;
    const totalDuration = tutorials.reduce((acc, t) => acc + parseInt(t.duration), 0);
    const totalViews = tutorials.reduce((acc, t) => acc + t.views, 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Unified Header */}
            <InstitutionSubHeader
                institution="SENATE"
                pageTitle={t('senate.tutorials.header.title')}
                pageSubtitle={t('senate.tutorials.header.subtitle')}
                pageIcon={GraduationCap}
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-[#D19C00]/10 text-amber-700 border-[#D19C00]/20" variant="outline">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {totalTutorials} {t('senate.tutorials.hero.badge')}
                        </Badge>
                        <h2 className="text-4xl font-serif font-bold mb-4">
                            {t('senate.tutorials.hero.title')}
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            {t('senate.tutorials.hero.description')}
                        </p>

                        {/* Search & Filters */}
                        <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('senate.tutorials.hero.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder={t('senate.tutorials.hero.allCategories')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-full md:w-[150px]">
                                    <SelectValue placeholder={t('senate.tutorials.hero.allLevels')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {levels.map(level => (
                                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                        <Card className="text-center p-4 bg-white/80 dark:bg-card">
                            <Video className="h-6 w-6 mx-auto text-[#D19C00] mb-2" />
                            <div className="text-2xl font-bold">{totalTutorials}</div>
                            <div className="text-xs text-muted-foreground">{t('senate.tutorials.stats.tutorials')}</div>
                        </Card>
                        <Card className="text-center p-4 bg-white/80 dark:bg-card">
                            <Clock className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                            <div className="text-2xl font-bold">{totalDuration}</div>
                            <div className="text-xs text-muted-foreground">{t('senate.tutorials.stats.minutesContent')}</div>
                        </Card>
                        <Card className="text-center p-4 bg-white/80 dark:bg-card">
                            <Star className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                            <div className="text-2xl font-bold">{(totalViews / 1000).toFixed(1)}k</div>
                            <div className="text-xs text-muted-foreground">{t('senate.tutorials.stats.totalViews')}</div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Tutorials */}
            {featuredTutorials.length > 0 && (
                <section className="py-12 container mx-auto px-4">
                    <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                        <Star className="h-6 w-6 text-[#D19C00]" />
                        {t('senate.tutorials.sections.recommended')}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredTutorials.map((tutorial) => {
                            const Icon = tutorial.icon;
                            return (
                                <Card
                                    key={tutorial.id}
                                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-t-4"
                                    style={{ borderTopColor: `var(--${tutorial.color}-500, #f59e0b)` }}
                                >
                                    <div className={`relative h-40 bg-gradient-to-br from-${tutorial.color}-100 to-${tutorial.color}-200 dark:from-${tutorial.color}-900/30 dark:to-${tutorial.color}-800/30 flex items-center justify-center`}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Icon className={`h-16 w-16 text-${tutorial.color}-500/30`} />
                                        </div>
                                        <div className="relative z-10 w-16 h-16 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <PlayCircle className="h-8 w-8 text-[#D19C00]" />
                                        </div>
                                        <div className="absolute top-3 left-3">
                                            <Badge className={getLevelColor(tutorial.level)}>{tutorial.level}</Badge>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <Badge variant="secondary" className="bg-white/90">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {tutorial.duration}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-lg group-hover:text-[#D19C00] transition-colors">
                                            {tutorial.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {tutorial.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="h-4 w-4" />
                                                {tutorial.steps} {t('senate.tutorials.sections.steps')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                {tutorial.views.toLocaleString()} {t('senate.tutorials.sections.views')}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* All Tutorials */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-[#D19C00]" />
                        {t('senate.tutorials.sections.all')} ({filteredTutorials.length})
                    </h3>

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="all">{t('senate.tutorials.hero.allLevels')}</TabsTrigger>
                            <TabsTrigger value={t('senate.tutorials.levels.beginner')}>{t('senate.tutorials.levels.beginner')}</TabsTrigger>
                            <TabsTrigger value={t('senate.tutorials.levels.intermediate')}>{t('senate.tutorials.levels.intermediate')}</TabsTrigger>
                            <TabsTrigger value={t('senate.tutorials.levels.advanced')}>{t('senate.tutorials.levels.advanced')}</TabsTrigger>
                        </TabsList>

                        {["all", t('senate.tutorials.levels.beginner'), t('senate.tutorials.levels.intermediate'), t('senate.tutorials.levels.advanced')].map(level => (
                            <TabsContent key={level} value={level}>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {filteredTutorials
                                        .filter(t => level === "all" || t.level === level)
                                        .map((tutorial) => {
                                            const Icon = tutorial.icon;
                                            return (
                                                <Card
                                                    key={tutorial.id}
                                                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                                >
                                                    <CardHeader className="pb-2">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className={`w-10 h-10 rounded-lg bg-${tutorial.color}-100 dark:bg-${tutorial.color}-900/30 flex items-center justify-center`}>
                                                                <Icon className={`h-5 w-5 text-${tutorial.color}-600`} />
                                                            </div>
                                                            <Badge variant="outline" className={getLevelColor(tutorial.level)}>
                                                                {tutorial.level}
                                                            </Badge>
                                                        </div>
                                                        <CardTitle className="text-base group-hover:text-[#D19C00] transition-colors line-clamp-2">
                                                            {tutorial.title}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                            {tutorial.description}
                                                        </p>
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {tutorial.duration}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <CheckCircle className="h-3 w-3" />
                                                                {tutorial.steps} {t('senate.tutorials.sections.steps')}
                                                            </span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>

            {/* Learning Path */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-[#D19C00]/10 text-amber-700 border-[#D19C00]/20" variant="outline">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {t('senate.tutorials.learningPath.badge')}
                        </Badge>
                        <h3 className="text-3xl font-serif font-bold mb-4">{t('senate.tutorials.learningPath.title')}</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('senate.tutorials.learningPath.description')}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-4">
                            {[
                                { title: t('senate.tutorials.learningPath.paths.basics.title'), tutorials: t('senate.tutorials.learningPath.paths.basics.tutorials'), progress: 100 },
                                { title: t('senate.tutorials.learningPath.paths.legislative.title'), tutorials: t('senate.tutorials.learningPath.paths.legislative.tutorials'), progress: 60 },
                                { title: t('senate.tutorials.learningPath.paths.communication.title'), tutorials: t('senate.tutorials.learningPath.paths.communication.tutorials'), progress: 30 },
                                { title: t('senate.tutorials.learningPath.paths.advanced.title'), tutorials: t('senate.tutorials.learningPath.paths.advanced.tutorials'), progress: 0 },
                            ].map((path, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold">{path.title}</h4>
                                            <p className="text-sm text-muted-foreground">{path.tutorials}</p>
                                        </div>
                                        <Badge variant={path.progress === 100 ? "default" : "outline"}>
                                            {path.progress === 100 ? (
                                                <><CheckCircle className="h-3 w-3 mr-1" /> {t('senate.tutorials.learningPath.completed')}</>
                                            ) : (
                                                `${path.progress}%`
                                            )}
                                        </Badge>
                                    </div>
                                    <Progress value={path.progress} className="h-2" />
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-serif font-bold mb-4">{t('senate.tutorials.cta.title')}</h3>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        {t('senate.tutorials.cta.description')}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" variant="secondary">
                            <MessageSquare className="mr-2 h-5 w-5" />
                            {t('senate.tutorials.cta.contactSupport')}
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                            <Download className="mr-2 h-5 w-5" />
                            {t('senate.tutorials.cta.downloadGuide')}
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
                            <span className="font-serif font-semibold">{t('senate.tutorials.footer.title')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat")}>
                                {t('senate.tutorials.footer.home')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/actualites")}>
                                {t('senate.tutorials.footer.news')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/sensibilisation")}>
                                {t('senate.tutorials.footer.sensibilisation')}
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} {t('senate.tutorials.footer.copyright')}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SenateTutoriels;
