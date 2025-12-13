import { ElementType } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
    Users,
    Shield,
    FileText,
    Briefcase,
    Gavel,
    UserCheck,
    ArrowRight,
    Sun,
    Moon,
    Home,
    Building2,
    Wallet,
    Package
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";

interface SpaceCardProps {
    title: string;
    description: string;
    icon: ElementType;
    color: string;
    path: string;
    role: string;
}

const SpaceCard = ({ title, description, icon: Icon, color, path, role }: SpaceCardProps) => {
    const navigate = useNavigate();
    const { t, dir } = useLanguage();

    return (
        <Card
            className="group relative overflow-hidden p-6 hover:shadow-elegant transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm"
            onClick={() => navigate(path)}
        >
            <div className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
                <Icon className={`w-24 h-24 text-${color}`} />
            </div>

            <div className="relative z-10">
                <Badge variant="outline" className={`mb-4 border-${color}/20 text-${color} bg-${color}/5`}>
                    {role}
                </Badge>

                <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 text-${color}`} />
                </div>

                <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                    {description}
                </p>

                <Button variant="ghost" className="p-0 hover:bg-transparent group-hover:translate-x-2 transition-transform duration-300">
                    {t('hub.accessSpace')}
                    {dir === 'rtl' ? <ArrowRight className="mr-2 w-4 h-4 rotate-180" /> : <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
            </div>
        </Card>
    );
};

const UserSpacesHub = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();
    const { user, login } = useUser();

    const allSpaces = [
        // Pouvoir Législatif (Legislative Power)
        {
            title: t('hub.roles.president.title'),
            description: t('hub.roles.president.desc'),
            icon: Gavel,
            color: "primary",
            path: "/president",
            role: "Présidence",
            category: "Legislative",
            requiredRole: "president"
        },
        {
            title: t('hub.roles.vicePresident.title'),
            description: t('hub.roles.vicePresident.desc'),
            icon: UserCheck,
            color: "secondary",
            path: "/vp",
            role: "Bureau",
            category: "Legislative",
            requiredRole: "vp"
        },
        {
            title: t('hub.roles.deputy.title'),
            description: t('hub.roles.deputy.desc'),
            icon: Shield,
            color: "emerald-500",
            path: "/vote",
            role: "Hémicycle",
            category: "Legislative",
            requiredRole: "deputy"
        },
        {
            title: "Député Suppléant",
            description: "Espace dédié aux suppléants pour le suivi des travaux et la préparation à la suppléance.",
            icon: Users,
            color: "teal-500",
            path: "/suppleant",
            role: "Hémicycle",
            category: "Legislative",
            requiredRole: "substitute"
        },
        // Administration
        {
            title: t('hub.roles.questeurs.title'),
            description: t('hub.roles.questeurs.desc'),
            icon: Briefcase,
            color: "accent",
            path: "/questeurs",
            role: "Administration",
            category: "Administrative",
            requiredRole: "questeur" // Note: We'll update the filter logic to handle sub-roles
        },
        {
            title: t('hub.roles.secretaires.title'),
            description: t('hub.roles.secretaires.desc'),
            icon: FileText,
            color: "indigo-500",
            path: "/secretaires",
            role: "Greffe",
            category: "Administrative",
            requiredRole: "secretary"
        },
        // Public
        {
            title: t('hub.roles.citizen.title'),
            description: t('hub.roles.citizen.desc'),
            icon: Users,
            color: "amber-500",
            path: "/citizen",
            role: "Public",
            category: "Public",
            requiredRole: "citizen"
        }
    ];

    // Filter spaces based on user roles
    const spaces = allSpaces.filter(space => {
        if (space.requiredRole === "citizen") return true;

        // Handle Questeur sub-roles accessing the main Questeur space
        if (space.requiredRole === "questeur") {
            return user?.roles.some(r => r.startsWith('questeur'));
        }

        return user?.roles.includes(space.requiredRole as any);
    });

    return (
        <div className="min-h-screen bg-background transition-colors duration-300" dir={dir}>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50 py-12 px-4">
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

                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 animate-fade-in">
                        {t('hub.title')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        {t('hub.subtitle')}
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="space-y-12">
                    {/* Legislative Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-1 bg-primary rounded-full"></div>
                            <h2 className="text-2xl font-bold">Espaces Législatifs</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {spaces.filter(s => s.category === "Legislative").map((space, index) => (
                                <div key={index} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                                    <SpaceCard {...space} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Administrative Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-1 bg-accent rounded-full"></div>
                            <h2 className="text-2xl font-bold">Administration & Greffe</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {spaces.filter(s => s.category === "Administrative").map((space, index) => (
                                <div key={index} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                                    <SpaceCard {...space} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Public Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-1 bg-amber-500 rounded-full"></div>
                            <h2 className="text-2xl font-bold">Espace Public</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {spaces.filter(s => s.category === "Public").map((space, index) => (
                                <div key={index} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                                    <SpaceCard {...space} />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            {/* Demo Accounts Section (Dev Mode) */}
            <div className="max-w-7xl mx-auto px-4 py-8 border-t border-border/50">
                <div className="bg-muted/30 p-6 rounded-xl border border-dashed border-border">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                        Comptes de Démonstration (Mode Développement)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                login("01010101", "parlement");
                                window.location.reload();
                            }}
                            className="gap-2"
                        >
                            <Gavel className="w-4 h-4 text-primary" />
                            Président
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                login("02020202", "parlement");
                                window.location.reload();
                            }}
                            className="gap-2"
                        >
                            <UserCheck className="w-4 h-4 text-secondary" />
                            1er Vice-Président
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                login("00000000", "parlement");
                                window.location.reload();
                            }}
                            className="gap-2"
                        >
                            <Shield className="w-4 h-4 text-emerald-600" />
                            Député
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                login("03030303", "parlement");
                                window.location.reload();
                            }}
                            className="gap-2"
                        >
                            <Users className="w-4 h-4 text-teal-600" />
                            Suppléant
                        </Button>

                        <div className="w-px h-6 bg-border mx-2 self-center" />

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                login("04040401", "admin");
                                window.location.reload();
                            }}
                            className="gap-2"
                        >
                            <Wallet className="w-4 h-4 text-amber-600" />
                            Questeur (Budget)
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                login("04040402", "admin");
                                window.location.reload();
                            }}
                            className="gap-2"
                        >
                            <Package className="w-4 h-4 text-amber-600" />
                            Questeur (Ressources)
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                login("04040403", "admin");
                                window.location.reload();
                            }}
                            className="gap-2"
                        >
                            <Building2 className="w-4 h-4 text-amber-600" />
                            Questeur (Services)
                        </Button>

                        <div className="w-px h-6 bg-border mx-2 self-center" />

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                login("05050505", "admin");
                                window.location.reload();
                            }}
                            className="gap-2"
                        >
                            <FileText className="w-4 h-4 text-indigo-600" />
                            Secrétaire
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                login("99999999", "citoyen");
                                window.location.reload();
                            }}
                            className="gap-2 ml-auto text-muted-foreground"
                        >
                            <Users className="w-4 h-4" />
                            Citoyen (Reset)
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSpacesHub;
