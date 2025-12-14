import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    SocialProtocolAdapter,
    ParliamentaryRole
} from '@/Consciousness/SocialProtocolAdapter';
import {
    ParliamentaryRole as ParliamentaryRoleEnum,
    PARLIAMENTARY_ROLE_DEFINITIONS,
    isParliamentarian,
    isBureauMember,
    canVote,
    canSubmitAmendment
} from '@/Cortex/entities/ParliamentaryRole';
import {
    Crown, Users, UserCheck, Mic2, FileText, Vote, Clock, Shield,
    UserCircle, Building2, MessageSquare, ArrowRight
} from 'lucide-react';

const DEMO_ROLES: ParliamentaryRole[] = [
    'PRESIDENT',
    'VICE_PRESIDENT',
    'QUESTEUR',
    'SECRETARY',
    'DEPUTY',
    'SENATOR',
    'SUBSTITUTE',
    'STAFF',
    'CITIZEN',
    'ANONYMOUS'
];

const ROLE_ICONS: Record<ParliamentaryRole, React.ReactNode> = {
    PRESIDENT: <Crown className="w-5 h-5 text-amber-500" />,
    VICE_PRESIDENT: <Crown className="w-5 h-5 text-amber-400" />,
    QUESTEUR: <Shield className="w-5 h-5 text-blue-500" />,
    SECRETARY: <FileText className="w-5 h-5 text-green-500" />,
    DEPUTY: <UserCheck className="w-5 h-5 text-primary" />,
    SENATOR: <Building2 className="w-5 h-5 text-purple-500" />,
    SUBSTITUTE: <Users className="w-5 h-5 text-slate-500" />,
    STAFF: <UserCircle className="w-5 h-5 text-slate-400" />,
    CITIZEN: <UserCircle className="w-5 h-5 text-green-400" />,
    ADMIN: <Shield className="w-5 h-5 text-red-500" />,
    ANONYMOUS: <UserCircle className="w-5 h-5 text-muted-foreground" />
};

const ROLE_LABELS: Record<ParliamentaryRole, string> = {
    PRESIDENT: 'Président',
    VICE_PRESIDENT: 'Vice-Président',
    QUESTEUR: 'Questeur',
    SECRETARY: 'Secrétaire',
    DEPUTY: 'Député',
    SENATOR: 'Sénateur',
    SUBSTITUTE: 'Suppléant',
    STAFF: 'Staff',
    CITIZEN: 'Citoyen',
    ADMIN: 'Administrateur',
    ANONYMOUS: 'Anonyme'
};

export const ProtocolDemoSection = () => {
    const [selectedRole, setSelectedRole] = useState<ParliamentaryRole>('DEPUTY');
    const [isFemale, setIsFemale] = useState(false);
    const [simulatedTime, setSimulatedTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');

    const roleDefinition = PARLIAMENTARY_ROLE_DEFINITIONS[selectedRole as ParliamentaryRoleEnum];

    const getSimulatedGreeting = () => {
        return SocialProtocolAdapter.generateSalutation(selectedRole);
    };

    const getWelcomeMessage = () => {
        return SocialProtocolAdapter.generateWelcomeMessage(selectedRole, 'Jean Dupont');
    };

    const getClosing = () => {
        return SocialProtocolAdapter.generateClosing(selectedRole);
    };

    const getTone = () => {
        return SocialProtocolAdapter.getTone(selectedRole);
    };

    const canUseEmoticons = () => {
        return SocialProtocolAdapter.canUseEmoticons(selectedRole);
    };

    return (
        <div className="space-y-8">
            {/* Selection Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Sélectionnez un Rôle Parlementaire
                    </CardTitle>
                    <CardDescription>
                        Visualisez comment iAsted adapte son protocole de communication
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {DEMO_ROLES.map((role) => (
                            <Button
                                key={role}
                                variant={selectedRole === role ? 'default' : 'outline'}
                                className="flex items-center gap-2 h-auto py-3"
                                onClick={() => setSelectedRole(role)}
                            >
                                {ROLE_ICONS[role]}
                                <span className="text-sm">{ROLE_LABELS[role]}</span>
                            </Button>
                        ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Genre :</span>
                            <Button
                                size="sm"
                                variant={!isFemale ? 'default' : 'outline'}
                                onClick={() => setIsFemale(false)}
                            >
                                Masculin
                            </Button>
                            <Button
                                size="sm"
                                variant={isFemale ? 'default' : 'outline'}
                                onClick={() => setIsFemale(true)}
                            >
                                Féminin
                            </Button>
                        </div>

                        <Separator orientation="vertical" className="h-8 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Heure simulée :</span>
                            <Button
                                size="sm"
                                variant={simulatedTime === 'morning' ? 'default' : 'outline'}
                                onClick={() => setSimulatedTime('morning')}
                            >
                                Matin
                            </Button>
                            <Button
                                size="sm"
                                variant={simulatedTime === 'afternoon' ? 'default' : 'outline'}
                                onClick={() => setSimulatedTime('afternoon')}
                            >
                                Après-midi
                            </Button>
                            <Button
                                size="sm"
                                variant={simulatedTime === 'evening' ? 'default' : 'outline'}
                                onClick={() => setSimulatedTime('evening')}
                            >
                                Soir
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Role Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {ROLE_ICONS[selectedRole]}
                            {ROLE_LABELS[selectedRole]}
                        </CardTitle>
                        <CardDescription>
                            Définition et permissions du rôle
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {roleDefinition && (
                            <>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Titre Honorifique</h4>
                                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                        {isFemale ? roleDefinition.honorificFeminin : roleDefinition.honorificMasculin}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {isParliamentarian(selectedRole as ParliamentaryRoleEnum) && (
                                        <Badge variant="default">Parlementaire</Badge>
                                    )}
                                    {isBureauMember(selectedRole as ParliamentaryRoleEnum) && (
                                        <Badge variant="secondary">Membre du Bureau</Badge>
                                    )}
                                    {canVote(selectedRole as ParliamentaryRoleEnum) && (
                                        <Badge className="bg-green-500/20 text-green-700">
                                            <Vote className="w-3 h-3 mr-1" />
                                            Peut Voter
                                        </Badge>
                                    )}
                                    {canSubmitAmendment(selectedRole as ParliamentaryRoleEnum) && (
                                        <Badge className="bg-blue-500/20 text-blue-700">
                                            <FileText className="w-3 h-3 mr-1" />
                                            Peut Amender
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Niveau Hiérarchique</h4>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-2 bg-primary rounded-full"
                                            style={{ width: `${100 - (roleDefinition.hierarchyLevel * 8)}%` }}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            Niveau {roleDefinition.hierarchyLevel}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Ton de Communication</h4>
                            <Badge variant="outline" className="capitalize">
                                {getTone()}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                                {getTone() === 'formal' && 'Communication protocolaire et déférente'}
                                {getTone() === 'warm' && 'Communication chaleureuse et accessible'}
                                {getTone() === 'technical' && 'Communication technique et directe'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Emoticons</h4>
                            <Badge variant={canUseEmoticons() ? 'default' : 'secondary'}>
                                {canUseEmoticons() ? 'Autorisés' : 'Non autorisés'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Generated Messages */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Messages iAsted
                        </CardTitle>
                        <CardDescription>
                            Exemples de communication adaptée au rôle
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <Mic2 className="w-4 h-4 text-primary" />
                                        Salutation
                                    </h4>
                                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                                        <p className="text-sm italic">"{getSimulatedGreeting()}"</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <Users className="w-4 h-4 text-green-500" />
                                        Message de Bienvenue Personnalisé
                                    </h4>
                                    <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-lg">
                                        <p className="text-sm italic">"{getWelcomeMessage()}"</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        Confirmation d'Action
                                    </h4>
                                    <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg">
                                        <p className="text-sm italic">
                                            "{SocialProtocolAdapter.adaptMessage(
                                                'votre amendement a été enregistré',
                                                selectedRole,
                                                'confirmation'
                                            )}"
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-red-500" />
                                        Message d'Erreur
                                    </h4>
                                    <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-lg">
                                        <p className="text-sm italic">
                                            "{SocialProtocolAdapter.adaptMessage(
                                                'Je n\'ai pas pu soumettre votre question.',
                                                selectedRole,
                                                'error'
                                            )}"
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <ArrowRight className="w-4 h-4 text-amber-500" />
                                        Formule de Conclusion
                                    </h4>
                                    <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg">
                                        <p className="text-sm italic">"{getClosing()}"</p>
                                    </div>
                                </div>

                                {/* Message hors périmètre */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-500" />
                                        Demande Hors Périmètre
                                    </h4>
                                    <div className="bg-slate-500/5 border border-slate-500/20 p-4 rounded-lg">
                                        <p className="text-sm italic">
                                            "{SocialProtocolAdapter.generateOutOfScopeMessage()}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
