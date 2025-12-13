import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUp, Users, FileText, Gavel, Calendar, Home, Sun, Moon, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";

const Statistiques = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();

    const data = [
        { name: 'Jan', lois: 4, amendements: 24 },
        { name: 'Fév', lois: 3, amendements: 13 },
        { name: 'Mar', lois: 2, amendements: 38 },
        { name: 'Avr', lois: 6, amendements: 40 },
        { name: 'Mai', lois: 8, amendements: 55 },
        { name: 'Juin', lois: 5, amendements: 32 },
    ];

    return (
        <div className="min-h-screen bg-background transition-colors duration-300" dir={dir}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-b border-border/50 py-12 px-4">
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
                        <div className="p-3 rounded-xl bg-emerald-600/10 neu-inset">
                            <PieChart className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h1 className="text-4xl font-bold">{t('stats.title')}</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {t('stats.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* KPI Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <Card className="p-6 hover:shadow-elegant transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <span className="flex items-center text-green-600 text-sm font-medium">
                                +12% <ArrowUp className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">124</div>
                        <div className="text-sm text-muted-foreground">{t('stats.kpi.laws')}</div>
                    </Card>

                    <Card className="p-6 hover:shadow-elegant transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <Gavel className="w-6 h-6 text-secondary" />
                            </div>
                            <span className="flex items-center text-green-600 text-sm font-medium">
                                +5% <ArrowUp className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">45</div>
                        <div className="text-sm text-muted-foreground">{t('stats.kpi.sessions')}</div>
                    </Card>

                    <Card className="p-6 hover:shadow-elegant transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-orange-500" />
                            </div>
                            <span className="flex items-center text-green-600 text-sm font-medium">
                                +18% <ArrowUp className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">89%</div>
                        <div className="text-sm text-muted-foreground">{t('stats.kpi.participation')}</div>
                    </Card>

                    <Card className="p-6 hover:shadow-elegant transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="flex items-center text-green-600 text-sm font-medium">
                                +8% <ArrowUp className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">312</div>
                        <div className="text-sm text-muted-foreground">{t('stats.kpi.questions')}</div>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-6">{t('stats.charts.activity')}</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <Bar dataKey="lois" fill="var(--primary)" radius={[4, 4, 0, 0]} name={t('stats.kpi.laws')} />
                                    <Bar dataKey="amendements" fill="var(--secondary)" radius={[4, 4, 0, 0]} name={t('stats.charts.amendments')} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-6">{t('stats.charts.trends')}</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <Line type="monotone" dataKey="amendements" stroke="var(--primary)" strokeWidth={2} name={t('stats.charts.amendments')} />
                                    <Line type="monotone" dataKey="lois" stroke="var(--secondary)" strokeWidth={2} name={t('stats.kpi.laws')} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Statistiques;
