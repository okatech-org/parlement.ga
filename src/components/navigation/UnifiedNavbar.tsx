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
import { useLanguage } from '@/contexts/LanguageContext';

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
    const { t } = useLanguage();
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
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">

                    {/* Left: Logo & Institution Name */}
                    <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-shrink-0">
                        {/* Institution Selector - Hidden on mobile for space */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors",
                                        theme.bgClass.replace('bg-', 'hover:bg-').replace(/(\d+)/, '100'),
                                        theme.textClass
                                    )}
                                >
                                    <InstitutionIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 hidden sm:block" />
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
                            className="flex items-center gap-2 min-w-0"
                        >
                            <span className={cn(
                                "text-sm sm:text-lg font-bold truncate max-w-[120px] sm:max-w-none",
                                transparent ? "text-white" : "text-gray-900 dark:text-white"
                            )}>
                                {t(`institutions.${institutionConfig.id}.name`)}
                            </span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links (Desktop only - lg breakpoint) */}
                    <div className="hidden lg:flex items-center gap-1">
                        {/* Bouton de retour vers Parlement (hub central) - visible uniquement sur AN ou Sénat */}
                        {currentInstitution !== 'PARLIAMENT' && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate('/')}
                                    className="border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 mr-2"
                                >
                                    <Scale className="h-4 w-4 mr-1" />
                                    {t('assembly.layout.parliament')}
                                </Button>
                                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mr-2" />
                            </>
                        )}

                        {links.map((link, index) => (
                            <Link
                                key={index}
                                to={link.href}
                                target={link.external ? "_blank" : undefined}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
                    <div className="flex items-center gap-1 sm:gap-2">

                        {/* Language Selector - Icon only on mobile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8 sm:h-9 sm:w-auto sm:px-3",
                                        transparent ? "text-white/80 hover:text-white" : ""
                                    )}
                                >
                                    <span className="text-base sm:text-lg">{currentLangData.flag}</span>
                                    <span className="hidden sm:inline ml-1 text-sm">{currentLangData.code.toUpperCase()}</span>
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
                            className={cn(
                                "h-8 w-8 sm:h-9 sm:w-9",
                                transparent ? "text-white/80 hover:text-white" : ""
                            )}
                        >
                            {isDark ? (
                                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                        </Button>

                        {/* Login Button - Hidden on mobile, show in mobile menu */}
                        {showLogin && (
                            <Button
                                onClick={() => navigate(effectiveLoginPath)}
                                size="sm"
                                className={cn(
                                    "hidden lg:flex items-center gap-2",
                                    theme.bgClass,
                                    "hover:opacity-90 text-white"
                                )}
                            >
                                <LogIn className="h-4 w-4" />
                                {t('common.login')}
                            </Button>
                        )}

                        {/* Mobile Menu Toggle - Always visible on mobile/tablet */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "lg:hidden h-8 w-8 sm:h-9 sm:w-9",
                                transparent ? "text-white" : ""
                            )}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 max-h-[70vh] overflow-y-auto">
                    <div className="px-4 py-4 space-y-2">
                        {/* Parliament link for mobile */}
                        {currentInstitution !== 'PARLIAMENT' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    navigate('/');
                                    setIsOpen(false);
                                }}
                                className="w-full justify-start border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300 mb-3"
                            >
                                <Scale className="h-4 w-4 mr-2" />
                                {t('assembly.layout.parliament')}
                            </Button>
                        )}

                        {links.map((link, index) => (
                            <Link
                                key={index}
                                to={link.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98]"
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
                                {t('common.login')}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default UnifiedNavbar;
