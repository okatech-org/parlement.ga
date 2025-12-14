import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Users,
    FileText,
    MessageSquare,
    ArrowLeft,
    ArrowRight,
    Check,
    X,
    AlertTriangle,
    GitCompare,
    Save,
    Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Espace de travail de la Commission Mixte Paritaire
 * 7 Députés + 7 Sénateurs négocient un texte commun
 */
const CMPWorkspace: React.FC = () => {
    const navigate = useNavigate();
    const { cmpId } = useParams();
    const [message, setMessage] = useState('');
    const [selectedVersion, setSelectedVersion] = useState<'an' | 'sn' | 'merged'>('merged');

    // Données simulées pour la démo
    const cmpData = {
        id: cmpId || 'CMP-2024-003',
        reference: 'CMP-2024-003',
        title: 'Commission Mixte sur la réforme constitutionnelle',
        status: 'En cours',
        legislativeText: {
            reference: 'PL-2024-035',
            title: 'Projet de loi portant révision de la Constitution',
        },
        members: {
            assembly: [
                { id: '1', name: 'Jean-Pierre OYIBA', role: 'Président', avatar: '' },
                { id: '2', name: 'Marie NZANG', role: 'Rapporteur AN', avatar: '' },
                { id: '3', name: 'Pierre MBOUMBA', role: 'Membre', avatar: '' },
                { id: '4', name: 'Sylvie NDONG', role: 'Membre', avatar: '' },
                { id: '5', name: 'Paul EKOME', role: 'Membre', avatar: '' },
                { id: '6', name: 'Anne OBIANG', role: 'Membre', avatar: '' },
                { id: '7', name: 'Michel NGUEMA', role: 'Membre', avatar: '' },
            ],
            senate: [
                { id: '8', name: 'Georges MBOULOU', role: 'Vice-Président', avatar: '' },
                { id: '9', name: 'Jeanne MOUSSAVOU', role: 'Rapporteur SN', avatar: '' },
                { id: '10', name: 'François ONDO', role: 'Membre', avatar: '' },
                { id: '11', name: 'Pauline ENGONGA', role: 'Membre', avatar: '' },
                { id: '12', name: 'Jacques MEBALE', role: 'Membre', avatar: '' },
                { id: '13', name: 'Cécile BIVEGHE', role: 'Membre', avatar: '' },
                { id: '14', name: 'Robert ESSONO', role: 'Membre', avatar: '' },
            ],
        },
        startDate: '10 Déc 2024',
        deadline: '24 Déc 2024',
    };

    // Textes comparés (simulation)
    const textVersions = {
        an: {
            title: 'Version Assemblée Nationale',
            articles: [
                {
                    number: 'Article 1',
                    content: 'Le Président de la République est élu pour un mandat de sept ans, renouvelable une seule fois.',
                    status: 'modified',
                },
                {
                    number: 'Article 2',
                    content: 'Le Premier Ministre est nommé par le Président de la République.',
                    status: 'unchanged',
                },
                {
                    number: 'Article 3',
                    content: 'L\'Assemblée Nationale peut censurer le gouvernement à la majorité des deux tiers.',
                    status: 'modified',
                },
            ],
        },
        sn: {
            title: 'Version Sénat',
            articles: [
                {
                    number: 'Article 1',
                    content: 'Le Président de la République est élu pour un mandat de cinq ans, renouvelable deux fois.',
                    status: 'modified',
                },
                {
                    number: 'Article 2',
                    content: 'Le Premier Ministre est nommé par le Président de la République.',
                    status: 'unchanged',
                },
                {
                    number: 'Article 3',
                    content: 'L\'Assemblée Nationale peut censurer le gouvernement à la majorité absolue.',
                    status: 'modified',
                },
            ],
        },
    };

    // Messages de négociation (simulation)
    const chatMessages = [
        {
            id: '1',
            author: 'Jean-Pierre OYIBA',
            role: 'Président CMP',
            institution: 'AN',
            content: 'Chers collègues, je propose que nous commencions par l\'article 1 concernant le mandat présidentiel.',
            timestamp: '10:30',
        },
        {
            id: '2',
            author: 'Georges MBOULOU',
            role: 'Vice-Président CMP',
            institution: 'SN',
            content: 'D\'accord. Le Sénat propose un mandat de 5 ans renouvelable deux fois, ce qui permet une meilleure stabilité.',
            timestamp: '10:32',
        },
        {
            id: '3',
            author: 'Marie NZANG',
            role: 'Rapporteur AN',
            institution: 'AN',
            content: 'L\'Assemblée maintient sa position sur un mandat de 7 ans renouvelable une fois. C\'est un compromis avec la version initiale de 7 ans sans limite.',
            timestamp: '10:35',
        },
    ];

    const getDiffHighlight = (anText: string, snText: string) => {
        // Simplified diff - in production, use a proper diff library
        if (anText === snText) return null;
        return 'bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/congres/cmp')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-slate-600">{cmpData.reference}</Badge>
                            <Badge className={cmpData.status === 'En cours' ? 'bg-blue-500' : 'bg-orange-500'}>
                                {cmpData.status}
                            </Badge>
                        </div>
                        <h1 className="text-2xl font-bold">{cmpData.title}</h1>
                        <p className="text-muted-foreground">
                            Texte: {cmpData.legislativeText.reference} - {cmpData.legislativeText.title}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Échéance</p>
                    <p className="font-semibold text-orange-600">{cmpData.deadline}</p>
                </div>
            </div>

            {/* Members Display */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Assembly Members */}
                <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-emerald-600">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold">
                                AN
                            </div>
                            Délégation Assemblée Nationale
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {cmpData.members.assembly.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="bg-emerald-200 text-emerald-700 text-xs">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Senate Members */}
                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-amber-600">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold">
                                SN
                            </div>
                            Délégation Sénat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {cmpData.members.senate.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="bg-amber-200 text-amber-700 text-xs">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Workspace */}
            <Tabs defaultValue="compare" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="compare" className="flex items-center gap-2">
                        <GitCompare className="h-4 w-4" />
                        Comparaison
                    </TabsTrigger>
                    <TabsTrigger value="negotiate" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Négociation
                    </TabsTrigger>
                    <TabsTrigger value="merged" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Texte Commun
                    </TabsTrigger>
                </TabsList>

                {/* Compare Tab - Split View */}
                <TabsContent value="compare" className="mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* AN Version */}
                        <Card className="border-t-4 border-t-emerald-500">
                            <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30">
                                <CardTitle className="text-emerald-700 dark:text-emerald-300">
                                    {textVersions.an.title}
                                </CardTitle>
                                <CardDescription>Votée le 5 décembre 2024</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ScrollArea className="h-[400px]">
                                    {textVersions.an.articles.map((article, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 mb-3 rounded-lg ${article.status === 'modified'
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500'
                                                    : 'bg-muted/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold">{article.number}</span>
                                                {article.status === 'modified' && (
                                                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        Différence
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm">{article.content}</p>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* SN Version */}
                        <Card className="border-t-4 border-t-amber-500">
                            <CardHeader className="bg-amber-50 dark:bg-amber-950/30">
                                <CardTitle className="text-amber-700 dark:text-amber-300">
                                    {textVersions.sn.title}
                                </CardTitle>
                                <CardDescription>Votée le 8 décembre 2024</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ScrollArea className="h-[400px]">
                                    {textVersions.sn.articles.map((article, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 mb-3 rounded-lg ${article.status === 'modified'
                                                    ? 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500'
                                                    : 'bg-muted/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold">{article.number}</span>
                                                {article.status === 'modified' && (
                                                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        Différence
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm">{article.content}</p>
                                        </div>
                                    ))}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Diff Summary */}
                    <Card className="mt-4 border-orange-200 dark:border-orange-800">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                                    <div>
                                        <p className="font-semibold">2 articles en désaccord</p>
                                        <p className="text-sm text-muted-foreground">
                                            Article 1 (mandat présidentiel), Article 3 (motion de censure)
                                        </p>
                                    </div>
                                </div>
                                <Button className="bg-slate-600 hover:bg-slate-700">
                                    Proposer un compromis
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Negotiate Tab - Chat */}
                <TabsContent value="negotiate" className="mt-4">
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader className="border-b">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Espace de Négociation
                            </CardTitle>
                            <CardDescription>
                                Discussion en temps réel entre les membres de la CMP
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col p-0">
                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {chatMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex gap-3 ${msg.institution === 'AN' ? '' : 'flex-row-reverse'}`}
                                        >
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className={
                                                    msg.institution === 'AN'
                                                        ? 'bg-emerald-200 text-emerald-700'
                                                        : 'bg-amber-200 text-amber-700'
                                                }>
                                                    {msg.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className={`max-w-[70%] ${msg.institution === 'AN' ? '' : 'text-right'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-sm">{msg.author}</span>
                                                    <Badge variant="outline" className={`text-xs ${msg.institution === 'AN' ? 'border-emerald-300 text-emerald-600' : 'border-amber-300 text-amber-600'
                                                        }`}>
                                                        {msg.role}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                                                </div>
                                                <div className={`p-3 rounded-lg ${msg.institution === 'AN'
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                                                        : 'bg-amber-50 dark:bg-amber-900/20'
                                                    }`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <div className="p-4 border-t bg-muted/30">
                                <div className="flex gap-2">
                                    <Textarea
                                        placeholder="Proposez un compromis ou répondez aux collègues..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="resize-none"
                                        rows={2}
                                    />
                                    <Button className="self-end bg-slate-600 hover:bg-slate-700">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Merged Text Tab */}
                <TabsContent value="merged" className="mt-4">
                    <Card>
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Texte Commun en Construction</CardTitle>
                                    <CardDescription>
                                        Version de compromis en cours de rédaction
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline">
                                        <Save className="h-4 w-4 mr-2" />
                                        Enregistrer
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700">
                                        <Check className="h-4 w-4 mr-2" />
                                        Soumettre au vote
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                                    <span className="font-semibold">Article 1 - ACCORD TROUVÉ</span>
                                    <p className="text-sm mt-2">
                                        Le Président de la République est élu pour un mandat de <strong>six ans</strong>,
                                        renouvelable <strong>une seule fois</strong>.
                                    </p>
                                    <Badge className="mt-2 bg-green-600">Compromis validé</Badge>
                                </div>

                                <div className="p-4 rounded-lg bg-muted/50">
                                    <span className="font-semibold">Article 2 - IDENTIQUE</span>
                                    <p className="text-sm mt-2">
                                        Le Premier Ministre est nommé par le Président de la République.
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500">
                                    <span className="font-semibold">Article 3 - EN NÉGOCIATION</span>
                                    <p className="text-sm mt-2 text-muted-foreground italic">
                                        En attente de compromis sur le seuil de la motion de censure...
                                    </p>
                                    <Badge className="mt-2 bg-orange-500">Discussion en cours</Badge>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Progression vers l'accord</span>
                                    <span className="text-sm text-muted-foreground">2/3 articles</span>
                                </div>
                                <div className="h-3 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500" style={{ width: '66%' }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <X className="h-4 w-4 mr-2" />
                    Constater l'échec de la CMP
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Valider l'accord de la CMP
                </Button>
            </div>
        </div>
    );
};

export default CMPWorkspace;
