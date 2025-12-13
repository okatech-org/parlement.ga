import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Newspaper, Calendar, ArrowRight, Home, Sun, Moon, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Actualites = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tous");

    const CATEGORIES = ["Tous", "Finances", "Environnement", "Législation", "Séance Publique", "International", "Innovation", "Démocratie"];

    const NEWS_DATA = [
        {
            title: t('news.items.commission.title'),
            excerpt: t('news.items.commission.excerpt'),
            date: "30 Nov 2025",
            category: "Environnement",
            categoryColor: "bg-green-600"
        },
        {
            title: t('news.items.reform.title'),
            excerpt: t('news.items.reform.excerpt'),
            date: "28 Nov 2025",
            category: "Législation",
            categoryColor: "bg-blue-600"
        },
        {
            title: t('news.items.budget.title'),
            excerpt: t('news.items.budget.excerpt'),
            date: "25 Nov 2025",
            category: "Finances",
            categoryColor: "bg-amber-600"
        },
        {
            title: t('news.items.digital.title'),
            excerpt: t('news.items.digital.excerpt'),
            date: "22 Nov 2025",
            category: "Innovation",
            categoryColor: "bg-purple-600"
        },
        {
            title: t('news.items.diplomacy.title'),
            excerpt: t('news.items.diplomacy.excerpt'),
            date: "20 Nov 2025",
            category: "International",
            categoryColor: "bg-indigo-600"
        },
        {
            title: t('news.items.youth.title'),
            excerpt: t('news.items.youth.excerpt'),
            date: "18 Nov 2025",
            category: "Démocratie",
            categoryColor: "bg-rose-600"
        }
    ];

    const filteredNews = NEWS_DATA.filter(news => {
        const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Tous" || news.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleReadMore = (title: string) => {
        toast.info(`${t('common.reading')} : ${title}`);
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300" dir={dir}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-border/50 py-12 px-4">
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
                        <div className="p-3 rounded-xl bg-blue-600/10 neu-inset">
                            <Newspaper className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold">{t('news.title')}</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {t('news.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Featured Article */}
                <div className="mb-16 animate-fade-in">
                    <Card className="overflow-hidden border-none shadow-elegant hover:shadow-xl transition-all duration-500 group cursor-pointer relative h-[400px]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1541872703-74c5e4436bb7?auto=format&fit=crop&q=80&w=2000"
                            alt="Featured"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 p-8 z-20 max-w-3xl">
                            <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90 border-none">
                                {t('news.featured')}
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-primary-foreground/90 transition-colors">
                                {t('news.featuredTitle')}
                            </h2>
                            <p className="text-gray-200 text-lg mb-6 line-clamp-2">
                                {t('news.featuredDesc')}
                            </p>
                            <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-100 border-none">
                                {t('common.readArticle')} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between sticky top-4 z-30 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder={t('news.searchPlaceholder')}
                            className="pl-10 bg-background/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <Badge
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNews.map((news, index) => (
                        <Card
                            key={index}
                            className="group flex flex-col overflow-hidden hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm"
                            onClick={() => handleReadMore(news.title)}
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge className={`${news.categoryColor} text-white border-none`}>
                                        {news.category}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                                        <Calendar className="w-3 h-3" />
                                        {news.date}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {news.title}
                                </h3>

                                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1 leading-relaxed">
                                    {news.excerpt}
                                </p>

                                <div className="pt-4 border-t border-border/50 flex justify-end mt-auto">
                                    <Button variant="ghost" size="sm" className="text-primary group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent">
                                        {t('common.readArticle')} <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredNews.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('news.noResults')}</h3>
                        <p className="text-muted-foreground mb-6">
                            {t('news.tryAdjusting')}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("Tous");
                            }}
                        >
                            {t('news.resetFilters')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Actualites;
