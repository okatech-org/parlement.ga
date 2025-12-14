import React, { ReactNode, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useInstitution, INSTITUTIONS } from '@/contexts/InstitutionContext';
import { cn } from '@/lib/utils';
import {
    Building2,
    Users,
    FileText,
    Calendar,
    Settings,
    Home,
    ChevronRight,
    Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SenateLayoutProps {
    children?: ReactNode;
}

/**
 * Layout Racine pour le Sénat
 * Base route: /senat
 * Thème: Rouge/Or (Couleurs sénatoriales)
 */
const SenateLayout: React.FC<SenateLayoutProps> = ({ children }) => {
    const { setCurrentInstitution, institutionConfig } = useInstitution();
    const location = useLocation();
    const navigate = useNavigate();

    // Force l'institution à SENATE quand ce layout est actif
    useEffect(() => {
        setCurrentInstitution('SENATE');
    }, [setCurrentInstitution]);

    const config = INSTITUTIONS.SENATE;

    // Navigation principale du Sénat
    const mainNavItems = [
        { icon: Home, label: 'Accueil Sénat', path: '/senat' },
        { icon: Landmark, label: 'Palais', path: '/senat/palais' },
        { icon: Users, label: 'Sénateurs', path: '/senat/senateurs' },
        { icon: FileText, label: 'Travaux', path: '/senat/travaux' },
        { icon: Calendar, label: 'Agenda', path: '/senat/agenda' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950">
            {/* Barre institutionnelle supérieure */}
            <header className="bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-lg">
                <div className="container mx-auto px-4">
                    {/* Barre d'identification institutionnelle */}
                    <div className="py-2 border-b border-white/20 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                SN
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
                                onClick={() => navigate('/congres')}
                            >
                                Congrès →
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
                <Button variant="link" className="p-0 h-auto text-amber-600" onClick={() => navigate('/')}>
                    Parlement.ga
                </Button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-amber-700 font-medium">Sénat</span>
                {location.pathname !== '/senat' && (
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
            <footer className="mt-auto border-t border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
                                SN
                            </div>
                            <div>
                                <p className="font-semibold text-amber-800 dark:text-amber-200">
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

export default SenateLayout;
