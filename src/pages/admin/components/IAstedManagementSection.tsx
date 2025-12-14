import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Bot,
    Building2,
    Landmark,
    Scale,
    Users,
    Settings,
    Zap,
    TrendingUp,
    MessageSquare,
    Mic,
    Brain,
    BarChart3,
    CheckCircle2,
    XCircle,
    Edit,
    Search
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const IAstedManagementSection = () => {
    const [configDialogOpen, setConfigDialogOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<any>(null);

    const organizations = [
        {
            id: "an",
            name: "Assemblée Nationale",
            icon: Building2,
            color: "emerald",
            enabled: true,
            users: 156,
            usersWithAccess: 45,
            tokensUsed: 2450000,
            tokensLimit: 5000000,
            features: { voice: true, api: false, premium: true }
        },
        {
            id: "senat",
            name: "Sénat",
            icon: Landmark,
            color: "amber",
            enabled: true,
            users: 108,
            usersWithAccess: 32,
            tokensUsed: 1820000,
            tokensLimit: 3000000,
            features: { voice: true, api: false, premium: false }
        },
        {
            id: "congres",
            name: "Congrès / Parlement",
            icon: Scale,
            color: "blue",
            enabled: true,
            users: 45,
            usersWithAccess: 20,
            tokensUsed: 890000,
            tokensLimit: 2000000,
            features: { voice: false, api: false, premium: false }
        },
        {
            id: "citoyens",
            name: "Espace Citoyen",
            icon: Users,
            color: "purple",
            enabled: false,
            users: 3500,
            usersWithAccess: 0,
            tokensUsed: 0,
            tokensLimit: 0,
            features: { voice: false, api: false, premium: false }
        },
    ];

    const userAccounts = [
        { id: 1, name: "Michel Régis Onanga Ndiaye", role: "Président AN", org: "AN", enabled: true, tokensUsed: 125000, tokensLimit: 500000, features: { voice: true, premium: true } },
        { id: 2, name: "François Ndong Obiang", role: "Vice-Président AN", org: "AN", enabled: true, tokensUsed: 89000, tokensLimit: 300000, features: { voice: true, premium: false } },
        { id: 3, name: "Admin Système", role: "Super Admin", org: "Système", enabled: true, tokensUsed: 450000, tokensLimit: 1000000, features: { voice: true, premium: true, api: true } },
        { id: 4, name: "Marie Thérèse Bekale", role: "Sénatrice", org: "Sénat", enabled: true, tokensUsed: 45000, tokensLimit: 200000, features: { voice: true, premium: false } },
        { id: 5, name: "Jean-Baptiste Bikalou", role: "Député", org: "AN", enabled: false, tokensUsed: 0, tokensLimit: 100000, features: { voice: false, premium: false } },
    ];

    const globalStats = {
        totalOrgs: organizations.filter(o => o.enabled).length,
        totalUsers: userAccounts.filter(u => u.enabled).length,
        totalTokensUsed: organizations.reduce((acc, o) => acc + o.tokensUsed, 0) + userAccounts.reduce((acc, u) => acc + u.tokensUsed, 0),
        totalTokensLimit: organizations.reduce((acc, o) => acc + o.tokensLimit, 0),
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200", text: "text-emerald-600" },
            amber: { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200", text: "text-amber-600" },
            blue: { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200", text: "text-blue-600" },
            purple: { bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200", text: "text-purple-600" },
        };
        return colors[color] || colors.blue;
    };

    const formatTokens = (tokens: number) => {
        if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
        if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
        return tokens.toString();
    };

    const openConfigDialog = (org: any) => {
        setSelectedOrg(org);
        setConfigDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Bot className="h-8 w-8 text-indigo-500" />
                        Gestion iAsted
                    </h1>
                    <p className="text-muted-foreground">Attribution et configuration de l'assistant IA</p>
                </div>
                <Badge className="bg-indigo-500 py-1 px-3">
                    <Zap className="h-3 w-3 mr-1" />
                    Licence Enterprise
                </Badge>
            </div>

            {/* Global Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-4 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5">
                    <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-indigo-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Organismes Actifs</p>
                            <p className="text-2xl font-bold">{globalStats.totalOrgs}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5">
                    <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-green-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Comptes Activés</p>
                            <p className="text-2xl font-bold">{globalStats.totalUsers}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="h-8 w-8 text-purple-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Tokens Utilisés</p>
                            <p className="text-2xl font-bold">{formatTokens(globalStats.totalTokensUsed)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-amber-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Utilisation Globale</p>
                            <p className="text-2xl font-bold">{Math.round((globalStats.totalTokensUsed / globalStats.totalTokensLimit) * 100)}%</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Tabs defaultValue="organizations" className="w-full">
                <TabsList>
                    <TabsTrigger value="organizations" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Organismes
                    </TabsTrigger>
                    <TabsTrigger value="accounts" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Comptes Individuels
                    </TabsTrigger>
                    <TabsTrigger value="usage" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Suivi d'Usage
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="organizations" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {organizations.map((org) => {
                            const Icon = org.icon;
                            const colors = getColorClasses(org.color);
                            const usagePercent = org.tokensLimit > 0 ? (org.tokensUsed / org.tokensLimit) * 100 : 0;

                            return (
                                <Card key={org.id} className={`p-6 ${colors.border} hover:shadow-lg transition-shadow`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-xl ${colors.bg}`}>
                                                <Icon className={`h-6 w-6 ${colors.text}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{org.name}</h3>
                                                <p className="text-sm text-muted-foreground">{org.usersWithAccess}/{org.users} utilisateurs</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch checked={org.enabled} />
                                        </div>
                                    </div>

                                    {org.enabled && (
                                        <>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Tokens utilisés</span>
                                                    <span>{formatTokens(org.tokensUsed)} / {formatTokens(org.tokensLimit)}</span>
                                                </div>
                                                <Progress value={usagePercent} className="h-2" />
                                            </div>

                                            <div className="flex items-center gap-2 mb-4">
                                                <Badge variant="outline" className={org.features.voice ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}>
                                                    <Mic className="h-3 w-3 mr-1" />
                                                    Vocal
                                                </Badge>
                                                <Badge variant="outline" className={org.features.premium ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-400"}>
                                                    <Brain className="h-3 w-3 mr-1" />
                                                    Premium
                                                </Badge>
                                                <Badge variant="outline" className={org.features.api ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"}>
                                                    <Zap className="h-3 w-3 mr-1" />
                                                    API
                                                </Badge>
                                            </div>

                                            <Button variant="outline" size="sm" className="w-full" onClick={() => openConfigDialog(org)}>
                                                <Settings className="h-4 w-4 mr-2" />
                                                Configurer
                                            </Button>
                                        </>
                                    )}

                                    {!org.enabled && (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            iAsted désactivé pour cet organisme
                                        </p>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="accounts" className="mt-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="Rechercher un compte..." />
                        </div>
                    </div>

                    <Card className="overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium text-sm">Utilisateur</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Organisme</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Quota Tokens</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Fonctionnalités</th>
                                    <th className="text-left py-3 px-4 font-medium text-sm">Statut</th>
                                    <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userAccounts.map((account) => (
                                    <tr key={account.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium">{account.name}</p>
                                                <p className="text-xs text-muted-foreground">{account.role}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge variant="outline">{account.org}</Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="w-32">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>{formatTokens(account.tokensUsed)}</span>
                                                    <span className="text-muted-foreground">/ {formatTokens(account.tokensLimit)}</span>
                                                </div>
                                                <Progress value={(account.tokensUsed / account.tokensLimit) * 100} className="h-1.5" />
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-1">
                                                {account.features.voice && <Badge variant="outline" className="text-xs bg-green-50 text-green-600"><Mic className="h-2 w-2" /></Badge>}
                                                {account.features.premium && <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600"><Brain className="h-2 w-2" /></Badge>}
                                                {account.features.api && <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600"><Zap className="h-2 w-2" /></Badge>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {account.enabled ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Actif</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-gray-50 text-gray-500"><XCircle className="h-3 w-3 mr-1" />Inactif</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>

                <TabsContent value="usage" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">Consommation par Organisme</h3>
                            <div className="space-y-4">
                                {organizations.filter(o => o.enabled).map((org) => {
                                    const Icon = org.icon;
                                    const colors = getColorClasses(org.color);
                                    return (
                                        <div key={org.id} className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${colors.bg}`}>
                                                <Icon className={`h-5 w-5 ${colors.text}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium">{org.name}</span>
                                                    <span className="text-sm text-muted-foreground">{formatTokens(org.tokensUsed)}</span>
                                                </div>
                                                <Progress value={(org.tokensUsed / org.tokensLimit) * 100} className="h-2" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">Historique d'Utilisation (7 jours)</h3>
                            <div className="h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <p className="text-muted-foreground text-sm">Graphique d'évolution - Intégration à venir</p>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Configuration Dialog */}
            <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Configuration iAsted - {selectedOrg?.name}</DialogTitle>
                        <DialogDescription>
                            Paramétrez les limites et fonctionnalités pour cet organisme.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Limite de Tokens Mensuelle</Label>
                            <div className="flex items-center gap-4">
                                <Slider defaultValue={[50]} max={100} step={1} className="flex-1" />
                                <span className="text-sm font-mono w-16">5M</span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Fonctionnalités Activées</Label>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Mic className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Mode Vocal</span>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Brain className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm">Modèle Premium</span>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">Accès API</span>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>Annuler</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setConfigDialogOpen(false)}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IAstedManagementSection;
