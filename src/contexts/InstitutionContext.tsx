import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

// Types d'institutions parlementaires gabonaises
export type InstitutionType = 'ASSEMBLY' | 'SENATE' | 'PARLIAMENT';

export interface InstitutionTheme {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    accent: string;
    gradient: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
}

export interface InstitutionConfig {
    id: InstitutionType;
    name: string;
    fullName: string;
    shortCode: string;
    basePath: string;
    logo: string;
    theme: InstitutionTheme;
    description: string;
}

// Configuration des trois institutions
export const INSTITUTIONS: Record<InstitutionType, InstitutionConfig> = {
    ASSEMBLY: {
        id: 'ASSEMBLY',
        name: 'Assemblée Nationale',
        fullName: 'Assemblée Nationale de la République Gabonaise',
        shortCode: 'AN',
        basePath: '/an',
        logo: '/images/assembly-logo.png',
        theme: {
            primary: '#009B48',
            primaryDark: '#007A38',
            primaryLight: '#00C25A',
            accent: '#FFD700',
            gradient: 'from-emerald-600 to-green-700',
            bgClass: 'bg-emerald-500',
            textClass: 'text-emerald-600',
            borderClass: 'border-emerald-500',
        },
        description: 'Palais Léon Mba - Chambre basse du Parlement',
    },
    SENATE: {
        id: 'SENATE',
        name: 'Sénat',
        fullName: 'Sénat de la République Gabonaise',
        shortCode: 'SN',
        basePath: '/senat',
        logo: '/images/senate-logo.png',
        theme: {
            primary: '#B8860B',
            primaryDark: '#8B6914',
            primaryLight: '#DAA520',
            accent: '#DC143C',
            gradient: 'from-amber-600 to-yellow-700',
            bgClass: 'bg-amber-600',
            textClass: 'text-amber-600',
            borderClass: 'border-amber-600',
        },
        description: 'Palais Omar Bongo Ondimba - Chambre haute du Parlement',
    },
    PARLIAMENT: {
        id: 'PARLIAMENT',
        name: 'Congrès',
        fullName: 'Parlement de la République Gabonaise',
        shortCode: 'PG',
        basePath: '/congres',
        logo: '/images/parliament-logo.png',
        theme: {
            primary: '#1E3A5F',
            primaryDark: '#0F2847',
            primaryLight: '#2D5A8E',
            accent: '#C0C0C0',
            gradient: 'from-slate-700 to-gray-800',
            bgClass: 'bg-slate-700',
            textClass: 'text-slate-700',
            borderClass: 'border-slate-700',
        },
        description: 'Réunion des deux chambres - Services communs',
    },
};

interface InstitutionContextType {
    currentInstitution: InstitutionType;
    setCurrentInstitution: (institution: InstitutionType) => void;
    institutionConfig: InstitutionConfig;
    getInstitutionByPath: (path: string) => InstitutionType;
    isAssembly: boolean;
    isSenate: boolean;
    isParliament: boolean;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

interface InstitutionProviderProps {
    children: ReactNode;
}

export const InstitutionProvider: React.FC<InstitutionProviderProps> = ({ children }) => {
    const location = useLocation();
    const [currentInstitution, setCurrentInstitution] = useState<InstitutionType>('ASSEMBLY');

    // Détecte l'institution basée sur l'URL
    const getInstitutionByPath = (path: string): InstitutionType => {
        if (path.startsWith('/senat')) return 'SENATE';
        if (path.startsWith('/congres')) return 'PARLIAMENT';
        if (path.startsWith('/an')) return 'ASSEMBLY';

        // Routes legacy - détecter par contexte
        // Les anciennes routes comme /vote, /president, etc. sont considérées comme Assemblée par défaut
        return 'ASSEMBLY';
    };

    // Met à jour l'institution courante quand l'URL change
    useEffect(() => {
        const detectedInstitution = getInstitutionByPath(location.pathname);
        if (detectedInstitution !== currentInstitution) {
            setCurrentInstitution(detectedInstitution);
        }
    }, [location.pathname]);

    // Sauvegarde dans sessionStorage pour persistance
    useEffect(() => {
        sessionStorage.setItem('current_institution', currentInstitution);
    }, [currentInstitution]);

    // Restaure depuis sessionStorage au chargement
    useEffect(() => {
        const saved = sessionStorage.getItem('current_institution') as InstitutionType | null;
        if (saved && INSTITUTIONS[saved]) {
            setCurrentInstitution(saved);
        }
    }, []);

    const value: InstitutionContextType = {
        currentInstitution,
        setCurrentInstitution,
        institutionConfig: INSTITUTIONS[currentInstitution],
        getInstitutionByPath,
        isAssembly: currentInstitution === 'ASSEMBLY',
        isSenate: currentInstitution === 'SENATE',
        isParliament: currentInstitution === 'PARLIAMENT',
    };

    return (
        <InstitutionContext.Provider value={value}>
            {children}
        </InstitutionContext.Provider>
    );
};

export const useInstitution = (): InstitutionContextType => {
    const context = useContext(InstitutionContext);
    if (context === undefined) {
        throw new Error('useInstitution must be used within an InstitutionProvider');
    }
    return context;
};

// Hook utilitaire pour obtenir les classes CSS dynamiques selon l'institution
export const useInstitutionStyles = () => {
    const { institutionConfig } = useInstitution();
    const { theme } = institutionConfig;

    return {
        primaryBg: theme.bgClass,
        primaryText: theme.textClass,
        primaryBorder: theme.borderClass,
        gradient: theme.gradient,
        // Classes composées pour les composants communs
        buttonPrimary: `${theme.bgClass} hover:opacity-90`,
        cardHighlight: `border-l-4 ${theme.borderClass}`,
        badge: `${theme.bgClass.replace('bg-', 'bg-').replace('500', '100')} ${theme.textClass}`,
        activeNavItem: `${theme.bgClass.replace('bg-', 'bg-').replace(/\d+/, '100')} ${theme.textClass}`,
    };
};

export default InstitutionContext;
