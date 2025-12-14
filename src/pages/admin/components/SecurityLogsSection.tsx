import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Shield,
    Lock,
    AlertTriangle,
    Eye,
    Search,
    Filter,
    Download,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    Globe,
    Terminal,
    FileWarning,
    ShieldAlert,
    ShieldCheck,
    Key,
    Fingerprint,
    Loader2
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const INITIAL_EVENTS = [
    { id: 1, type: "auth_success", user: "admin00", ip: "192.168.1.1", location: "Libreville", time: "23:05:12", details: "Connexion réussie via PIN" },
    { id: 2, type: "auth_failed", user: "unknown", ip: "45.33.32.156", location: "Unknown", time: "23:02:45", details: "Tentative de connexion échouée (3x)" },
    { id: 3, type: "permission_change", user: "admin01", ip: "192.168.1.2", location: "Libreville", time: "22:58:30", details: "Modification rôle: deputy_042 -> questeur" },
    { id: 4, type: "config_update", user: "admin00", ip: "192.168.1.1", location: "Libreville", time: "22:45:00", details: "Mise à jour politique de sécurité" },
    { id: 5, type: "session_timeout", user: "deputy_015", ip: "10.0.0.15", location: "Port-Gentil", time: "22:30:00", details: "Session expirée après 30min d'inactivité" },
    { id: 6, type: "auth_success", user: "senator_008", ip: "10.0.0.22", location: "Franceville", time: "22:15:00", details: "Connexion biométrique" },
];

const SecurityLogsSection = () => {
    const [logFilter, setLogFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [loading, setLoading] = useState(false);

    const securityPolicies = [
        { name: "Authentification Multi-Facteurs (MFA)", status: "active", coverage: "100%", lastUpdate: "2024-12-10" },
        { name: "Politique de Mots de Passe", status: "active", coverage: "100%", lastUpdate: "2024-12-01" },
        { name: "Verrouillage après Échecs", status: "active", coverage: "95%", lastUpdate: "2024-11-25" },
        { name: "Chiffrement des Données", status: "active", coverage: "100%", lastUpdate: "2024-11-15" },
        { name: "Audit des Accès", status: "active", coverage: "100%", lastUpdate: "2024-12-14" },
    ];

    const threatAlerts = [
        { id: 1, severity: "high", title: "Tentative d'intrusion détectée", source: "45.33.32.156", time: "Il y a 3 min", status: "investigating" },
        { id: 2, severity: "medium", title: "Activité inhabituelle sur compte", source: "deputy_042", time: "Il y a 15 min", status: "resolved" },
        { id: 3, severity: "low", title: "Certificat SSL expire dans 30 jours", source: "api.parlement.ga", time: "Il y a 2h", status: "pending" },
    ];

    const filteredEvents = events.filter(event => {
        const matchesFilter = logFilter === "all" ||
            (logFilter === "auth" && event.type.startsWith("auth")) ||
            (logFilter === "permission" && event.type === "permission_change") ||
            (logFilter === "config" && event.type === "config_update");

        const matchesSearch = event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.ip.includes(searchQuery);

        return matchesFilter && matchesSearch;
    });

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            // Add a mock random event
            const newEvent = {
                id: Date.now(),
                type: Math.random() > 0.5 ? "auth_success" : "auth_failed",
                user: "user_" + Math.floor(Math.random() * 100),
                ip: "192.168.1." + Math.floor(Math.random() * 255),
                location: "Libreville",
                time: new Date().toLocaleTimeString('fr-FR'),
                details: "Nouvelle activité détectée"
            };
            setEvents([newEvent, ...events]);
            toast.success("Logs actualisés");
        } finally {
            setLoading(false);
        }
    };

    const getEventTypeBadge = (type: string) => {
        const config: Record<string, { label: string; className: string; icon: typeof Shield }> = {
            auth_success: { label: "Connexion", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
            auth_failed: { label: "Échec Auth", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
            permission_change: { label: "Permissions", className: "bg-purple-100 text-purple-700 border-purple-200", icon: Key },
            config_update: { label: "Config", className: "bg-blue-100 text-blue-700 border-blue-200", icon: Shield },
            session_timeout: { label: "Timeout", className: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
        };
        const c = config[type] || { label: type, className: "bg-gray-100 text-gray-700", icon: Shield };
        const Icon = c.icon;
        return (
            <Badge variant="outline" className={c.className}>
                <Icon className="h-3 w-3 mr-1" />{c.label}
            </Badge>
        );
    };

    const getSeverityBadge = (severity: string) => {
        if (severity === 'high') return <Badge className="bg-red-500">Critique</Badge>;
        if (severity === 'medium') return <Badge className="bg-amber-500">Moyen</Badge>;
        return <Badge className="bg-blue-500">Faible</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sécurité & Logs</h1>
                    <p className="text-muted-foreground">Surveillance, audit et gestion des menaces</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.success("Logs exportés (CSV)")}>
                        <Download className="h-4 w-4 mr-2" />
                        Exporter Logs
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Actualiser
                    </Button>
                </div>
            </div>

            {/* Security Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-green-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Niveau Sécurité</p>
                            <p className="text-2xl font-bold text-green-600">Élevé</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200">
                    <div className="flex items-center gap-3">
                        <Fingerprint className="h-8 w-8 text-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Auth Biométrique</p>
                            <p className="text-2xl font-bold text-blue-600">78%</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-8 w-8 text-amber-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Alertes Actives</p>
                            <p className="text-2xl font-bold text-amber-600">3</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-red-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Menaces Bloquées</p>
                            <p className="text-2xl font-bold text-red-600">127</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Tabs defaultValue="logs" className="w-full">
                <TabsList>
                    <TabsTrigger value="logs" className="flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        Logs d'Audit
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Alertes
                    </TabsTrigger>
                    <TabsTrigger value="policies" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Politiques
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="logs" className="mt-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="Rechercher dans les logs (User, IP)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={logFilter} onValueChange={setLogFilter}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filtrer par type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les événements</SelectItem>
                                <SelectItem value="auth">Authentification</SelectItem>
                                <SelectItem value="permission">Permissions</SelectItem>
                                <SelectItem value="config">Configuration</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Card className="overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium">Heure</th>
                                    <th className="text-left py-3 px-4 font-medium">Type</th>
                                    <th className="text-left py-3 px-4 font-medium">Utilisateur</th>
                                    <th className="text-left py-3 px-4 font-medium">IP / Lieu</th>
                                    <th className="text-left py-3 px-4 font-medium">Détails</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-xs">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="py-3 px-4 text-slate-500">{event.time}</td>
                                        <td className="py-3 px-4">{getEventTypeBadge(event.type)}</td>
                                        <td className="py-3 px-4 font-medium">{event.user}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <Globe className="h-3 w-3 text-muted-foreground" />
                                                <span>{event.ip}</span>
                                                <span className="text-muted-foreground">({event.location})</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground">{event.details}</td>
                                    </tr>
                                ))}
                                {filteredEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                                            Aucun log trouvé pour ces critères.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>

                <TabsContent value="alerts" className="mt-6">
                    <div className="space-y-4">
                        {threatAlerts.map((alert) => (
                            <Card key={alert.id} className={`p-4 border-l-4 ${alert.severity === 'high' ? 'border-l-red-500' :
                                    alert.severity === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-lg ${alert.severity === 'high' ? 'bg-red-100' :
                                                alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                                            }`}>
                                            <FileWarning className={`h-5 w-5 ${alert.severity === 'high' ? 'text-red-600' :
                                                    alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {getSeverityBadge(alert.severity)}
                                                <h4 className="font-medium">{alert.title}</h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Source: {alert.source}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={
                                            alert.status === 'resolved' ? 'bg-green-50 text-green-600' :
                                                alert.status === 'investigating' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-blue-50 text-blue-600'
                                        }>
                                            {alert.status === 'resolved' ? 'Résolu' :
                                                alert.status === 'investigating' ? 'En cours' : 'En attente'}
                                        </Badge>
                                        <Button size="sm" variant="outline" onClick={() => toast.info("Détails alerte")}>
                                            <Eye className="h-4 w-4 mr-1" />
                                            Détails
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="policies" className="mt-6">
                    <Card className="overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium">Politique</th>
                                    <th className="text-left py-3 px-4 font-medium">Statut</th>
                                    <th className="text-left py-3 px-4 font-medium">Couverture</th>
                                    <th className="text-left py-3 px-4 font-medium">Dernière MàJ</th>
                                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {securityPolicies.map((policy, idx) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="py-3 px-4 font-medium">{policy.name}</td>
                                        <td className="py-3 px-4">
                                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />Actif
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">{policy.coverage}</td>
                                        <td className="py-3 px-4 text-muted-foreground">{policy.lastUpdate}</td>
                                        <td className="py-3 px-4 text-right">
                                            <Button size="sm" variant="ghost" onClick={() => toast.info("Modification politique restreinte")}>
                                                <Lock className="h-4 w-4 mr-1" />
                                                Configurer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SecurityLogsSection;
