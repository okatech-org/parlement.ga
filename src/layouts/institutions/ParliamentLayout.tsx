import React, { ReactNode, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useInstitution, INSTITUTIONS } from '@/contexts/InstitutionContext';
import { cn } from '@/lib/utils';
import {
    Building,
    Users,
    FileText,
    Calendar,
    Settings,
    Home,
    ChevronRight,
    Scale,
    Archive,
    Handshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParliamentLayoutProps {
    children?: ReactNode;
}

/**
 * Layout Racine pour le Congrès (Réunion des deux chambres)
 * Base route: /congres
 * Thème: Neutre/Souverain (Bleu marine/Gris)
 */
const ParliamentLayout: React.FC<ParliamentLayoutProps> = ({ children }) => {
    const { setCurrentInstitution, institutionConfig } = useInstitution();
    const location = useLocation();
    const navigate = useNavigate();

    // Force l'institution à PARLIAMENT quand ce layout est actif
    useEffect(() => {
        setCurrentInstitution('PARLIAMENT');
    }, [setCurrentInstitution]);

    const config = INSTITUTIONS.PARLIAMENT;

    // Navigation principale du Congrès
    const mainNavItems = [
        { icon: Home, label: 'Accueil', path: '/congres' },
        { icon: Handshake, label: 'CMP', path: '/congres/cmp' },
        { icon: Scale, label: 'Sessions Conjointes', path: '/congres/sessions' },
        { icon: Archive, label: 'Archives', path: '/congres/archives' },
        { icon: FileText, label: 'Textes Communs', path: '/congres/textes' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-slate-950">
            {/* Barre institutionnelle supérieure */}
            <header className="bg-gradient-to-r from-slate-700 to-gray-800 text-white shadow-lg">
                <div className="container mx-auto px-4">
                    {/* Barre d'identification institutionnelle */}
                    <div className="py-2 border-b border-white/20 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                PG
                            </div>
                            <span className="font-medium">{config.fullName}</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/80 hover:text-white hover:bg-white/10"
                                onClick={() => navigate('/an')}
                            >
                                ← Assemblée
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/80 hover:text-white hover:bg-white/10"
                                onClick={() => navigate('/senat')}
                            >
                                Sénat →
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
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Button variant="link" className="p-0 h-auto text-slate-600" onClick={() => navigate('/')}>
                    Parlement.ga
                </Button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-700 font-medium">Congrès</span>
                {location.pathname !== '/congres' && (
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
            <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold">
                                PG
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                    {config.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {config.description}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            © 2024 Parlement.ga - Plateforme citoyenne unifiée
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ParliamentLayout;
