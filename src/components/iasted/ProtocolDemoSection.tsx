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
import { useLanguage } from '@/contexts/LanguageContext';

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

export const ProtocolDemoSection = () => {
    const { t } = useLanguage();
    const [selectedRole, setSelectedRole] = useState<ParliamentaryRole>('DEPUTY');
    const [isFemale, setIsFemale] = useState(false);
    const [simulatedTime, setSimulatedTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');

    const roleDefinition = PARLIAMENTARY_ROLE_DEFINITIONS[selectedRole as ParliamentaryRoleEnum];

    const getRoleTranslationKey = (role: ParliamentaryRole): string => {
        const mapping: Record<string, string> = {
            'PRESIDENT': 'president',
            'VICE_PRESIDENT': 'vicePresident',
            'QUESTEUR': 'questeur',
            'SECRETARY': 'secretary',
            'DEPUTY': 'deputy',
            'SENATOR': 'senator',
            'SUBSTITUTE': 'substitute',
            'STAFF': 'staff',
            'CITIZEN': 'citizen',
            'ADMIN': 'admin',
            'ANONYMOUS': 'anonymous'
        };
        return mapping[role] || 'anonymous';
    };

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
                        {t('congress.demo.protocol.sectionTitle')}
                    </CardTitle>
                    <CardDescription>
                        {t('congress.demo.protocol.sectionSubtitle')}
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
                                {/* @ts-ignore */}
                                <span className="text-sm">{t(`congress.demo.protocol.roles.${getRoleTranslationKey(role)}`)}</span>
                            </Button>
                        ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{t('congress.demo.protocol.gender')} :</span>
                            <Button
                                size="sm"
                                variant={!isFemale ? 'default' : 'outline'}
                                onClick={() => setIsFemale(false)}
                            >
                                {t('congress.demo.protocol.male')}
                            </Button>
                            <Button
                                size="sm"
                                variant={isFemale ? 'default' : 'outline'}
                                onClick={() => setIsFemale(true)}
                            >
                                {t('congress.demo.protocol.female')}
                            </Button>
                        </div>

                        <Separator orientation="vertical" className="h-8 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{t('congress.demo.protocol.time')} :</span>
                            <Button
                                size="sm"
                                variant={simulatedTime === 'morning' ? 'default' : 'outline'}
                                onClick={() => setSimulatedTime('morning')}
                            >
                                {t('congress.demo.protocol.morning')}
                            </Button>
                            <Button
                                size="sm"
                                variant={simulatedTime === 'afternoon' ? 'default' : 'outline'}
                                onClick={() => setSimulatedTime('afternoon')}
                            >
                                {t('congress.demo.protocol.afternoon')}
                            </Button>
                            <Button
                                size="sm"
                                variant={simulatedTime === 'evening' ? 'default' : 'outline'}
                                onClick={() => setSimulatedTime('evening')}
                            >
                                {t('congress.demo.protocol.evening')}
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
                            {/* @ts-ignore */}
                            {t(`congress.demo.protocol.roles.${getRoleTranslationKey(selectedRole)}`)}
                        </CardTitle>
                        <CardDescription>
                            {t('congress.demo.protocol.definitionTitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {roleDefinition && (
                            <>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">{t('congress.demo.protocol.honorific')}</h4>
                                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                        {/* @ts-ignore */}
                                        {isFemale ? t(`congress.demo.protocol.honorifics.${getRoleTranslationKey(selectedRole)}.f`) : t(`congress.demo.protocol.honorifics.${getRoleTranslationKey(selectedRole)}.m`)}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {isParliamentarian(selectedRole as ParliamentaryRoleEnum) && (
                                        <Badge variant="default">{t('congress.demo.protocol.parliamentarian')}</Badge>
                                    )}
                                    {isBureauMember(selectedRole as ParliamentaryRoleEnum) && (
                                        <Badge variant="secondary">{t('congress.demo.protocol.bureauMember')}</Badge>
                                    )}
                                    {canVote(selectedRole as ParliamentaryRoleEnum) && (
                                        <Badge className="bg-green-500/20 text-green-700">
                                            <Vote className="w-3 h-3 mr-1" />
                                            {t('congress.demo.protocol.canVote')}
                                        </Badge>
                                    )}
                                    {canSubmitAmendment(selectedRole as ParliamentaryRoleEnum) && (
                                        <Badge className="bg-blue-500/20 text-blue-700">
                                            <FileText className="w-3 h-3 mr-1" />
                                            {t('congress.demo.protocol.canAmend')}
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">{t('congress.demo.protocol.hierarchy')}</h4>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-2 bg-primary rounded-full"
                                            style={{ width: `${100 - (roleDefinition.hierarchyLevel * 8)}%` }}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {t('congress.demo.protocol.level')} {roleDefinition.hierarchyLevel}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">{t('congress.demo.protocol.toneTitle')}</h4>
                            <Badge variant="outline" className="capitalize">
                                {getTone()}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                                {getTone() === 'formal' && t('congress.demo.protocol.toneFormal')}
                                {getTone() === 'warm' && t('congress.demo.protocol.toneWarm')}
                                {getTone() === 'technical' && t('congress.demo.protocol.toneTechnical')}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">{t('congress.demo.protocol.emoticons')}</h4>
                            <Badge variant={canUseEmoticons() ? 'default' : 'secondary'}>
                                {canUseEmoticons() ? t('congress.demo.protocol.empoticonsAllowed') : t('congress.demo.protocol.empoticonsForbidden')}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Generated Messages */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            {t('congress.demo.protocol.messagesTitle')}
                        </CardTitle>
                        <CardDescription>
                            {t('congress.demo.protocol.messagesSubtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <Mic2 className="w-4 h-4 text-primary" />
                                        {t('congress.demo.protocol.greeting')}
                                    </h4>
                                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                                        <p className="text-sm italic">"{getSimulatedGreeting()}"</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <Users className="w-4 h-4 text-green-500" />
                                        {t('congress.demo.protocol.welcome')}
                                    </h4>
                                    <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-lg">
                                        <p className="text-sm italic">"{getWelcomeMessage()}"</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        {t('congress.demo.protocol.confirmation')}
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
                                        {t('congress.demo.protocol.error')}
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
                                        {t('congress.demo.protocol.closing')}
                                    </h4>
                                    <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg">
                                        <p className="text-sm italic">"{getClosing()}"</p>
                                    </div>
                                </div>

                                {/* Message hors périmètre */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-500" />
                                        {t('congress.demo.protocol.outOfScope')}
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
