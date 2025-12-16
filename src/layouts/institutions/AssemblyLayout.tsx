import React, { ReactNode, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useInstitution, INSTITUTIONS } from '@/contexts/InstitutionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
    Building2,
    Users,
    FileText,
    Calendar,
    Settings,
    Home,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssemblyLayoutProps {
    children?: ReactNode;
}

/**
 * Layout Racine pour l'Assemblée Nationale
 * Base route: /an
 * Thème: Vert/Bleu (Couleurs du drapeau gabonais)
 */
const AssemblyLayout: React.FC<AssemblyLayoutProps> = ({ children }) => {
    const { setCurrentInstitution, institutionConfig } = useInstitution();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Force l'institution à ASSEMBLY quand ce layout est actif
    useEffect(() => {
        setCurrentInstitution('ASSEMBLY');
    }, [setCurrentInstitution]);

    const config = INSTITUTIONS.ASSEMBLY;

    // Navigation principale de l'Assemblée
    const mainNavItems = [
        { icon: Home, label: t('assembly.layout.home'), path: '/an' },
        { icon: Building2, label: t('assembly.layout.hemicycle'), path: '/an/hemicycle' },
        { icon: Users, label: t('assembly.layout.deputies'), path: '/an/deputes' },
        { icon: FileText, label: t('assembly.layout.works'), path: '/an/travaux' },
        { icon: Calendar, label: t('assembly.layout.agenda'), path: '/an/agenda' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950">
            {/* Barre institutionnelle supérieure */}
            <header className="bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg">
                <div className="container mx-auto px-4">
                    {/* Barre d'identification institutionnelle */}
                    <div className="py-2 border-b border-white/20 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                AN
                            </div>
                            <span className="font-medium">{config.fullName}</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/80 hover:text-white hover:bg-white/10"
                                onClick={() => navigate('/senat')}
                            >
                                {t('assembly.layout.senateLink')} →
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/80 hover:text-white hover:bg-white/10"
                                onClick={() => navigate('/congres')}
                            >
                                {t('assembly.layout.congressLink')} →
                            </Button>
                        </nav>
                    </div>

                    {/* Navigation principale */}
                    <nav className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {mainNavItems.map((item) => (
                                <Button
                                    key={item.path}
                                    variant="ghost"
                                    className={cn(
                                        "text-white/80 hover:text-white hover:bg-white/10 gap-2",
                                        location.pathname === item.path && "bg-white/20 text-white"
                                    )}
                                    onClick={() => navigate(item.path)}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/80 hover:text-white hover:bg-white/10"
                            onClick={() => navigate('/portail')}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="sr-only">{t('assembly.layout.settings')}</span>
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Button variant="link" className="p-0 h-auto text-emerald-600" onClick={() => navigate('/')}>
                    {t('assembly.layout.breadcrumbHome')}
                </Button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-emerald-700 font-medium">{t('assembly.layout.breadcrumbAN')}</span>
                {location.pathname !== '/an' && (
                    <>
                        <ChevronRight className="w-4 h-4" />
                        <span>{location.pathname.split('/').pop()}</span>
                    </>
                )}
            </div>

            {/* Contenu principal */}
            <main className="container mx-auto px-4 py-6">
                {children || <Outlet />}
            </main>

            {/* Footer institutionnel */}
            <footer className="mt-auto border-t border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                                AN
                            </div>
                            <div>
                                <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                                    {config.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {config.description}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t('common.copyright')} - {t('assembly.layout.footerDesc')}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AssemblyLayout;
