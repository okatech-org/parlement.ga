import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Landmark, Scale, Sun, Moon, ChevronRight, Menu, X,
    Newspaper, BookOpen, GraduationCap, Workflow, PlayCircle
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export type InstitutionType = "AN" | "SENATE" | "PARLIAMENT";

interface NavigationItem {
    labelKey: string;
    path: string;
    icon?: React.ElementType;
}

interface InstitutionSubHeaderProps {
    /** Type of institution: AN, SENATE, or PARLIAMENT */
    institution: InstitutionType;
    /** Current page title */
    pageTitle: string;
    /** Optional subtitle */
    pageSubtitle?: string;
    /** Optional icon for the page */
    pageIcon?: React.ElementType;
    /** Optional extra actions on the right side (like Export PDF button) */
    extraActions?: React.ReactNode;
    /** Show language selector */
    showLanguageSelector?: boolean;
    /** Show login button */
    showLoginButton?: boolean;
}

// Institution configuration with translation keys
const getInstitutionConfig = (t: (key: string) => string): Record<InstitutionType, {
    name: string;
    shortName: string;
    homeRoute: string;
    loginRoute: string;
    parentRoute: string;
    parentLabel: string;
    color: string;
    bgGradient: string;
    navItems: NavigationItem[];
}> => ({
    AN: {
        name: t('subHeader.institutions.an.name'),
        shortName: t('subHeader.institutions.an.shortName'),
        homeRoute: "/an",
        loginRoute: "/an/login",
        parentRoute: "/",
        parentLabel: t('subHeader.common.parliament'),
        color: "primary",
        bgGradient: "from-emerald-600/10 to-emerald-800/5",
        navItems: [
            { labelKey: "subHeader.nav.news", path: "/an/actualites", icon: Newspaper },
            { labelKey: "subHeader.nav.awareness", path: "/an/sensibilisation", icon: BookOpen },
            { labelKey: "subHeader.nav.tutorials", path: "/an/tutoriels", icon: GraduationCap },
            { labelKey: "subHeader.nav.process", path: "/an/processus", icon: Workflow },
            { labelKey: "subHeader.nav.demo", path: "/an/demo", icon: PlayCircle },
        ]
    },
    SENATE: {
        name: t('subHeader.institutions.senate.name'),
        shortName: t('subHeader.institutions.senate.shortName'),
        homeRoute: "/senat",
        loginRoute: "/senat/login",
        parentRoute: "/",
        parentLabel: t('subHeader.common.parliament'),
        color: "amber",
        bgGradient: "from-amber-600/10 to-amber-800/5",
        navItems: [
            { labelKey: "subHeader.nav.news", path: "/senat/actualites", icon: Newspaper },
            { labelKey: "subHeader.nav.awareness", path: "/senat/sensibilisation", icon: BookOpen },
            { labelKey: "subHeader.nav.tutorials", path: "/senat/tutoriels", icon: GraduationCap },
            { labelKey: "subHeader.nav.process", path: "/senat/processus", icon: Workflow },
            { labelKey: "subHeader.nav.demo", path: "/senat/demo", icon: PlayCircle },
        ]
    },
    PARLIAMENT: {
        name: t('subHeader.institutions.parliament.name'),
        shortName: t('subHeader.institutions.parliament.shortName'),
        homeRoute: "/",
        loginRoute: "/parlement/login",
        parentRoute: "/",
        parentLabel: t('subHeader.common.home'),
        color: "violet",
        bgGradient: "from-violet-600/10 to-indigo-800/5",
        navItems: [
            { labelKey: "subHeader.nav.archives", path: "/archives", icon: BookOpen },
            { labelKey: "subHeader.nav.comparison", path: "/processus-comparaison", icon: Workflow },
            { labelKey: "subHeader.nav.demo", path: "/parlement/demo", icon: PlayCircle },
        ]
    }
});

/**
 * Composant d'en-tête unifié pour les pages secondaires des institutions
 * Assure une navigation cohérente et un design harmonieux
 */
const InstitutionSubHeader = ({
    institution,
    pageTitle,
    pageSubtitle,
    pageIcon: PageIcon,
    extraActions,
    showLanguageSelector = true,
    showLoginButton = true
}: InstitutionSubHeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, dir, t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const config = getInstitutionConfig(t)[institution];

    useEffect(() => {
        setMounted(true);
    }, []);

    // Check if a nav item is currently active
    const isActive = (path: string) => location.pathname === path;

    return (
        <header
            className="border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-50 shadow-sm"
            dir={dir}
        >
            <div className="container mx-auto px-4">
                {/* Main header row */}
                <div className="flex items-center justify-between py-3">
                    {/* Left side: Institution branding + page title */}
                    <div className="flex items-center gap-3">
                        {/* Home button for institution */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(config.homeRoute)}
                            className="hidden sm:flex items-center gap-2 font-semibold hover:bg-muted"
                        >
                            <Landmark className="h-5 w-5 text-primary" />
                            <span className="font-serif">{config.shortName}</span>
                        </Button>

                        <Separator orientation="vertical" className="h-6 hidden sm:block" />

                        {/* Page title */}
                        <div className="flex items-center gap-2">
                            {PageIcon && (
                                <PageIcon className="h-5 w-5 text-primary" />
                            )}
                            <div>
                                <h1 className="text-base sm:text-lg font-serif font-bold text-foreground leading-tight">
                                    {pageTitle}
                                </h1>
                                {pageSubtitle && (
                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                        {pageSubtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {config.navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Button
                                    key={item.path}
                                    variant={active ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => navigate(item.path)}
                                    className={cn(
                                        "text-sm",
                                        active && "bg-primary/10 text-primary font-medium"
                                    )}
                                >
                                    {Icon && <Icon className="h-4 w-4 mr-1.5" />}
                                    {t(item.labelKey)}
                                </Button>
                            );
                        })}
                    </nav>

                    {/* Right side: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Extra actions (like Export PDF) */}
                        {extraActions}

                        {/* Language Selector */}
                        {showLanguageSelector && (
                            <select
                                className="text-xs border border-border rounded-md px-2 py-1.5 bg-background cursor-pointer hover:bg-muted transition-colors hidden sm:block"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                            >
                                <option value="fr">🇫🇷 FR</option>
                                <option value="en">🇬🇧 EN</option>
                                <option value="es">🇪🇸 ES</option>
                                <option value="ar">🇸🇦 AR</option>
                                <option value="pt">🇵🇹 PT</option>
                            </select>
                        )}

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {mounted && theme === "dark" ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </Button>

                        {/* Login Button */}
                        {showLoginButton && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(config.loginRoute)}
                                className="hidden sm:flex"
                            >
                                {t('subHeader.common.login')}
                            </Button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden h-8 w-8"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-border py-3 space-y-1">
                        {/* Back to institution home */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                navigate(config.homeRoute);
                                setMobileMenuOpen(false);
                            }}
                            className="w-full justify-start gap-2"
                        >
                            <Landmark className="h-4 w-4" />
                            {t('subHeader.common.home')} {config.shortName}
                        </Button>

                        <Separator className="my-2" />

                        {/* Navigation items */}
                        {config.navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Button
                                    key={item.path}
                                    variant={active ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        navigate(item.path);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        active && "bg-primary/10 text-primary"
                                    )}
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {t(item.labelKey)}
                                </Button>
                            );
                        })}

                        <Separator className="my-2" />

                        {/* Back to Parliament hub */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                navigate(config.parentRoute);
                                setMobileMenuOpen(false);
                            }}
                            className="w-full justify-start gap-2"
                        >
                            <Scale className="h-4 w-4" />
                            {config.parentLabel}
                        </Button>

                        {/* Login on mobile */}
                        {showLoginButton && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                    navigate(config.loginRoute);
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full mt-2"
                            >
                                {t('subHeader.common.login')}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default InstitutionSubHeader;

