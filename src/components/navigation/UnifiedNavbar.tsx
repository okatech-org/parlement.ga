import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Menu, X, Sun, Moon, Globe, ChevronDown,
    User, LogIn, Building2, Landmark, Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInstitution, InstitutionType, INSTITUTIONS } from '@/contexts/InstitutionContext';
import { cn } from '@/lib/utils';

// Langues supportées
const LANGUAGES = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

export interface NavLink {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    external?: boolean;
}

interface UnifiedNavbarProps {
    links?: NavLink[];
    showLogin?: boolean;
    loginPath?: string;
    transparent?: boolean;
}

/**
 * Barre de navigation unifiée qui s'adapte à chaque institution
 * Gère le thème sombre/clair et le multilingue
 */
const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({
    links = [],
    showLogin = true,
    loginPath,
    transparent = false,
}) => {
    const navigate = useNavigate();
    const { currentInstitution, institutionConfig, setCurrentInstitution } = useInstitution();
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });
    const [currentLang, setCurrentLang] = useState('fr');

    const { theme } = institutionConfig;

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Change language
    const changeLanguage = (langCode: string) => {
        setCurrentLang(langCode);
        localStorage.setItem('lang', langCode);
        // TODO: Intégrer avec i18n
    };

    // Institution selector icon
    const getInstitutionIcon = (type: InstitutionType) => {
        switch (type) {
            case 'ASSEMBLY': return Building2;
            case 'SENATE': return Landmark;
            case 'PARLIAMENT': return Scale;
        }
    };

    const InstitutionIcon = getInstitutionIcon(currentInstitution);
    const currentLangData = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

    // Default login path based on institution
    const effectiveLoginPath = loginPath || `${institutionConfig.basePath}/login`;

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            transparent
                ? "bg-transparent"
                : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left: Logo & Institution Name */}
                    <div className="flex items-center gap-3">
                        {/* Institution Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                                        theme.bgClass.replace('bg-', 'hover:bg-').replace(/(\d+)/, '100'),
                                        theme.textClass
                                    )}
                                >
                                    <InstitutionIcon className="h-5 w-5" />
                                    <span className="font-semibold hidden sm:inline">
                                        {institutionConfig.shortCode}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64">
                                {Object.values(INSTITUTIONS).map((inst) => {
                                    const Icon = getInstitutionIcon(inst.id);
                                    return (
                                        <DropdownMenuItem
                                            key={inst.id}
                                            onClick={() => {
                                                setCurrentInstitution(inst.id);
                                                navigate(inst.basePath);
                                            }}
                                            className={cn(
                                                "flex items-center gap-3 p-3 cursor-pointer",
                                                currentInstitution === inst.id && "bg-muted"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center",
                                                inst.theme.bgClass,
                                                "text-white"
                                            )}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{inst.name}</p>
                                                <p className="text-xs text-muted-foreground">{inst.description}</p>
                                            </div>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Institution Name */}
                        <Link
                            to={institutionConfig.basePath}
                            className="flex items-center gap-2"
                        >
                            <span className={cn(
                                "text-lg font-bold",
                                transparent ? "text-white" : "text-gray-900 dark:text-white"
                            )}>
                                {institutionConfig.name}
                            </span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                to={link.href}
                                target={link.external ? "_blank" : undefined}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    transparent
                                        ? "text-white/80 hover:text-white hover:bg-white/10"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    {link.icon && <link.icon className="h-4 w-4" />}
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Right: Tools & Login */}
                    <div className="flex items-center gap-2">

                        {/* Language Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "flex items-center gap-1",
                                        transparent ? "text-white/80 hover:text-white" : ""
                                    )}
                                >
                                    <span className="text-lg">{currentLangData.flag}</span>
                                    <Globe className="h-4 w-4 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {LANGUAGES.map((lang) => (
                                    <DropdownMenuItem
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={cn(
                                            "flex items-center gap-2",
                                            currentLang === lang.code && "bg-muted"
                                        )}
                                    >
                                        <span className="text-lg">{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className={transparent ? "text-white/80 hover:text-white" : ""}
                        >
                            {isDark ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {/* Login Button */}
                        {showLogin && (
                            <Button
                                onClick={() => navigate(effectiveLoginPath)}
                                className={cn(
                                    "hidden sm:flex items-center gap-2",
                                    theme.bgClass,
                                    "hover:opacity-90 text-white"
                                )}
                            >
                                <LogIn className="h-4 w-4" />
                                Connexion
                            </Button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "md:hidden",
                                transparent ? "text-white" : ""
                            )}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
                    <div className="px-4 py-4 space-y-2">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                to={link.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.icon && <link.icon className="h-5 w-5" />}
                                {link.label}
                            </Link>
                        ))}

                        {showLogin && (
                            <Button
                                onClick={() => {
                                    navigate(effectiveLoginPath);
                                    setIsOpen(false);
                                }}
                                className={cn("w-full mt-4", theme.bgClass, "text-white")}
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Connexion
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default UnifiedNavbar;
