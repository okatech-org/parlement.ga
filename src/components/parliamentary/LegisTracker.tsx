import React from 'react';
import {
    FileText,
    Building2,
    Scale,
    Handshake,
    Check,
    ChevronRight,
    ArrowLeftRight,
    AlertTriangle,
    Clock,
    Landmark
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Types pour le suivi législatif
export type LegislativeLocation =
    | 'AN_DEPOT'
    | 'AN_BUREAU'
    | 'AN_COMMISSION'
    | 'AN_PLENIERE'
    | 'AN_VOTE'
    | 'AN_ADOPTED'
    | 'NAVETTE_AN_TO_SN'
    | 'SN_BUREAU'
    | 'SN_COMMISSION'
    | 'SN_PLENIERE'
    | 'SN_VOTE'
    | 'SN_ADOPTED'
    | 'NAVETTE_SN_TO_AN'
    | 'CMP_CONVENED'
    | 'CMP_IN_PROGRESS'
    | 'CMP_AGREEMENT'
    | 'CMP_FAILURE'
    | 'FINAL_AN'
    | 'FINAL_SN'
    | 'ADOPTED'
    | 'PROMULGATED';

export interface LegislativeText {
    id: string;
    reference: string;
    title: string;
    currentLocation: LegislativeLocation;
    originInstitution: 'ASSEMBLY' | 'SENATE';
    readingNumber: number;
    shuttleCount: number;
    depositedAt: Date;
    transmittedAt?: Date;
    adoptedAt?: Date;
    promulgatedAt?: Date;
    urgency?: boolean;
}

interface LegisTrackerProps {
    text: LegislativeText;
    showActions?: boolean;
    onTransmit?: (textId: string) => void;
    compact?: boolean;
    className?: string;
}

// Configuration des étapes du processus législatif
const STEPS = [
    {
        key: 'deposit',
        label: 'Dépôt',
        icon: FileText,
        locations: ['AN_DEPOT', 'SN_DEPOT'],
        color: 'slate'
    },
    {
        key: 'first_reading_an',
        label: '1ère Lecture AN',
        icon: Building2,
        locations: ['AN_BUREAU', 'AN_COMMISSION', 'AN_PLENIERE', 'AN_VOTE', 'AN_ADOPTED'],
        color: 'emerald'
    },
    {
        key: 'navette_to_sn',
        label: 'Transmis Sénat',
        icon: ArrowLeftRight,
        locations: ['NAVETTE_AN_TO_SN'],
        color: 'blue',
        isTransition: true
    },
    {
        key: 'first_reading_sn',
        label: '1ère Lecture Sénat',
        icon: Landmark,
        locations: ['SN_BUREAU', 'SN_COMMISSION', 'SN_PLENIERE', 'SN_VOTE', 'SN_ADOPTED'],
        color: 'amber'
    },
    {
        key: 'cmp',
        label: 'Commission Mixte (CMP)',
        icon: Handshake,
        locations: ['CMP_CONVENED', 'CMP_IN_PROGRESS', 'CMP_AGREEMENT', 'CMP_FAILURE', 'NAVETTE_SN_TO_AN'],
        color: 'slate',
        optional: true
    },
    {
        key: 'promulgation',
        label: 'Promulgation',
        icon: Check,
        locations: ['FINAL_AN', 'FINAL_SN', 'ADOPTED', 'PROMULGATED'],
        color: 'green'
    },
];

// Mapping des couleurs Tailwind
const colorClasses: Record<string, { bg: string; text: string; border: string; light: string }> = {
    slate: { bg: 'bg-slate-500', text: 'text-slate-600', border: 'border-slate-500', light: 'bg-slate-100 dark:bg-slate-900' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-500', light: 'bg-emerald-100 dark:bg-emerald-900' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-500', light: 'bg-amber-100 dark:bg-amber-900' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500', light: 'bg-blue-100 dark:bg-blue-900' },
    green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500', light: 'bg-green-100 dark:bg-green-900' },
};

// Labels lisibles pour les localisations
const locationLabels: Record<LegislativeLocation, string> = {
    AN_DEPOT: 'Dépôt à l\'Assemblée',
    AN_BUREAU: 'Bureau de l\'AN',
    AN_COMMISSION: 'Commission',
    AN_PLENIERE: 'Séance plénière',
    AN_VOTE: 'Vote en cours',
    AN_ADOPTED: 'Adopté par l\'AN',
    NAVETTE_AN_TO_SN: 'En transit vers le Sénat',
    SN_BUREAU: 'Bureau du Sénat',
    SN_COMMISSION: 'Commission sénatoriale',
    SN_PLENIERE: 'Séance plénière',
    SN_VOTE: 'Vote en cours',
    SN_ADOPTED: 'Adopté par le Sénat',
    NAVETTE_SN_TO_AN: 'En transit vers l\'AN',
    CMP_CONVENED: 'CMP convoquée',
    CMP_IN_PROGRESS: 'CMP en cours',
    CMP_AGREEMENT: 'Accord CMP',
    CMP_FAILURE: 'Échec CMP',
    FINAL_AN: 'Lecture définitive AN',
    FINAL_SN: 'Lecture définitive Sénat',
    ADOPTED: 'Texte adopté',
    PROMULGATED: 'Loi promulguée',
};

/**
 * LegisTracker - Composant de visualisation de la navette parlementaire
 * Affiche le parcours d'un texte législatif entre l'AN et le Sénat
 */
const LegisTracker: React.FC<LegisTrackerProps> = ({
    text,
    showActions = false,
    onTransmit,
    compact = false,
    className,
}) => {
    // Détermine l'étape actuelle
    const getCurrentStepIndex = (): number => {
        for (let i = 0; i < STEPS.length; i++) {
            if (STEPS[i].locations.includes(text.currentLocation)) {
                return i;
            }
        }
        return 0;
    };

    const currentStepIndex = getCurrentStepIndex();
    const currentStep = STEPS[currentStepIndex];

    // Détermine si une étape est complétée, active ou à venir
    const getStepStatus = (stepIndex: number): 'completed' | 'active' | 'upcoming' => {
        if (stepIndex < currentStepIndex) return 'completed';
        if (stepIndex === currentStepIndex) return 'active';
        return 'upcoming';
    };

    // Peut transmettre à l'autre chambre ?
    const canTransmit = ['AN_ADOPTED', 'SN_ADOPTED'].includes(text.currentLocation);

    // Animation de transit
    const isInTransit = text.currentLocation.includes('NAVETTE');

    if (compact) {
        // Version compacte pour les listes
        return (
            <div className={cn("flex items-center gap-2", className)}>
                {/* Mini indicateur de progression */}
                <div className="flex items-center gap-1">
                    {STEPS.slice(0, 4).map((step, index) => {
                        const status = getStepStatus(index);
                        const colors = colorClasses[step.color];
                        return (
                            <React.Fragment key={step.key}>
                                <div
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all",
                                        status === 'completed' && colors.bg,
                                        status === 'active' && `${colors.bg} ring-2 ring-offset-2 ring-${step.color}-300 animate-pulse`,
                                        status === 'upcoming' && 'bg-muted'
                                    )}
                                />
                                {index < 3 && (
                                    <div className={cn(
                                        "w-4 h-0.5",
                                        status === 'completed' || status === 'active' ? colors.bg : 'bg-muted'
                                    )} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Status badge */}
                <Badge
                    variant="outline"
                    className={cn(
                        "text-xs",
                        currentStep && colorClasses[currentStep.color]?.text,
                        currentStep && colorClasses[currentStep.color]?.border
                    )}
                >
                    {locationLabels[text.currentLocation]}
                </Badge>

                {isInTransit && (
                    <div className="animate-bounce">
                        <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                    </div>
                )}
            </div>
        );
    }

    // Version complète
    return (
        <div className={cn("w-full", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{text.reference}</Badge>
                        {text.urgency && (
                            <Badge className="bg-red-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Urgence
                            </Badge>
                        )}
                        {text.shuttleCount > 0 && (
                            <Badge variant="secondary">
                                Navette #{text.shuttleCount}
                            </Badge>
                        )}
                    </div>
                    <h3 className="font-semibold">{text.title}</h3>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Lecture n°{text.readingNumber}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Déposé le {text.depositedAt.toLocaleDateString('fr-FR')}
                    </p>
                </div>
            </div>

            {/* Progress Tracker */}
            <div className="relative">
                {/* Ligne de connexion */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-muted rounded-full -z-10">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${((currentStepIndex + 0.5) / STEPS.length) * 100}%` }}
                    />
                </div>

                {/* Étapes */}
                <div className="flex justify-between">
                    {STEPS.map((step, index) => {
                        const status = getStepStatus(index);
                        const colors = colorClasses[step.color];
                        const Icon = step.icon;
                        const isCurrentNavette = step.isTransition && isInTransit;

                        return (
                            <div
                                key={step.key}
                                className={cn(
                                    "flex flex-col items-center relative",
                                    step.optional && status === 'upcoming' && "opacity-40"
                                )}
                            >
                                {/* Icône de l'étape */}
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-background",
                                        status === 'completed' && colors.bg,
                                        status === 'active' && `${colors.bg} ${isCurrentNavette ? 'animate-bounce' : 'animate-pulse'} shadow-lg`,
                                        status === 'upcoming' && 'bg-muted'
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5",
                                        status !== 'upcoming' ? 'text-white' : 'text-muted-foreground'
                                    )} />
                                </div>

                                {/* Label */}
                                <div className="mt-3 text-center max-w-20">
                                    <p className={cn(
                                        "text-xs font-medium",
                                        status === 'active' && colors.text,
                                        status === 'upcoming' && 'text-muted-foreground'
                                    )}>
                                        {step.label}
                                    </p>

                                    {/* Sous-label détaillé pour l'étape active */}
                                    {status === 'active' && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {locationLabels[text.currentLocation]}
                                        </p>
                                    )}
                                </div>

                                {/* Badge optionnel */}
                                {step.optional && (
                                    <Badge variant="outline" className="absolute -top-2 -right-2 text-xs py-0">
                                        Si désaccord
                                    </Badge>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            {showActions && canTransmit && (
                <div className="mt-8 flex justify-center">
                    <Button
                        className={cn(
                            "gap-2",
                            text.currentLocation === 'AN_ADOPTED'
                                ? "bg-amber-600 hover:bg-amber-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                        )}
                        onClick={() => onTransmit?.(text.id)}
                    >
                        <ArrowLeftRight className="h-4 w-4" />
                        Transmettre à {text.currentLocation === 'AN_ADOPTED' ? 'au Sénat' : "à l'Assemblée"}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Message de transit */}
            {isInTransit && (
                <div className="mt-6 flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg animate-pulse">
                    <ArrowLeftRight className="h-5 w-5 text-blue-500" />
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {text.currentLocation === 'NAVETTE_AN_TO_SN'
                            ? "Le texte est en cours de transmission de l'Assemblée vers le Sénat..."
                            : "Le texte est en cours de transmission du Sénat vers l'Assemblée..."
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default LegisTracker;

// Export des types et utilitaires
export { STEPS, locationLabels, colorClasses };
