import { useState } from "react";
import {
    Users,
    ArrowLeftRight,
    Clock,
    AlertTriangle,
    CheckCircle2,
    FileText,
    MessageSquare,
    ExternalLink,
    Filter,
    Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

interface CMP {
    id: string;
    law: string;
    status: "blocage" | "en_cours" | "accord_partiel" | "accord_total" | "echec";
    progress: number;
    deadline: string;
    daysRemaining: number;
    anMembers: { name: string; avatar?: string }[];
    senateMembers: { name: string; avatar?: string }[];
    lastUpdate: string;
    articlesTotal: number;
    articlesAgreed: number;
}

const CMP_STATUS = {
    blocage: { label: "Blocage", color: "bg-red-500", textColor: "text-red-600" },
    en_cours: { label: "En cours", color: "bg-amber-500", textColor: "text-amber-600" },
    accord_partiel: { label: "Accord partiel", color: "bg-blue-500", textColor: "text-blue-600" },
    accord_total: { label: "Accord total", color: "bg-green-500", textColor: "text-green-600" },
    echec: { label: "Échec", color: "bg-slate-500", textColor: "text-slate-600" },
};

export const CongressCMPSupervisionSection = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const cmps: CMP[] = [
        {
            id: "CMP-089",
            law: "Projet de Loi de Finances 2025",
            status: "blocage",
            progress: 45,
            deadline: "2024-12-25",
            daysRemaining: 5,
            anMembers: [
                { name: "Jean Ndong" },
                { name: "Marie Obame" },
                { name: "Paul Mengue" },
            ],
            senateMembers: [
                { name: "Pierre Nzé" },
                { name: "Claire Mba" },
                { name: "Jacques Ondo" },
            ],
            lastUpdate: "2024-12-18T10:30:00",
            articlesTotal: 45,
            articlesAgreed: 20,
        },
        {
            id: "CMP-090",
            law: "Loi sur la Cybersécurité",
            status: "en_cours",
            progress: 70,
            deadline: "2025-01-02",
            daysRemaining: 12,
            anMembers: [
                { name: "Faustin Boukoubi" },
                { name: "Angélique Ngoma" },
            ],
            senateMembers: [
                { name: "Simon Oyono" },
                { name: "Rose Mintsa" },
            ],
            lastUpdate: "2024-12-17T16:45:00",
            articlesTotal: 32,
            articlesAgreed: 22,
        },
        {
            id: "CMP-091",
            law: "Code de l'Environnement",
            status: "accord_partiel",
            progress: 90,
            deadline: "2024-12-22",
            daysRemaining: 2,
            anMembers: [
                { name: "Léa Ndoutoume" },
                { name: "Marc Essono" },
            ],
            senateMembers: [
                { name: "Anne Mounanga" },
                { name: "Thierry Obiang" },
            ],
            lastUpdate: "2024-12-18T09:00:00",
            articlesTotal: 28,
            articlesAgreed: 25,
        },
    ];

    const filteredCMPs = cmps.filter(cmp => {
        const matchesSearch = cmp.law.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cmp.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || cmp.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getUrgencyBadge = (daysRemaining: number) => {
        if (daysRemaining <= 3) return <Badge className="bg-red-500">Urgent</Badge>;
        if (daysRemaining <= 7) return <Badge className="bg-amber-500">Attention</Badge>;
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Supervision des CMP</h2>
                    <p className="text-muted-foreground">Suivi des Commissions Mixtes Paritaires actives</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                            <ArrowLeftRight className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">CMP actives</p>
                            <p className="text-2xl font-bold">{cmps.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">En blocage</p>
                            <p className="text-2xl font-bold">{cmps.filter(c => c.status === 'blocage').length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Accords</p>
                            <p className="text-2xl font-bold">{cmps.filter(c => c.status === 'accord_partiel' || c.status === 'accord_total').length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Urgentes (J-3)</p>
                            <p className="text-2xl font-bold">{cmps.filter(c => c.daysRemaining <= 3).length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une CMP..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                {Object.entries(CMP_STATUS).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* CMP Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCMPs.map((cmp) => (
                    <Card
                        key={cmp.id}
                        className={`border-l-4 ${CMP_STATUS[cmp.status].color.replace('bg-', 'border-')} hover:shadow-lg transition-shadow`}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">{cmp.id}</Badge>
                                        {getUrgencyBadge(cmp.daysRemaining)}
                                    </div>
                                    <CardTitle className="text-lg">{cmp.law}</CardTitle>
                                </div>
                                <Badge className={CMP_STATUS[cmp.status].color}>
                                    {CMP_STATUS[cmp.status].label}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Progress */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progression des négociations</span>
                                    <span className="font-medium">{cmp.progress}%</span>
                                </div>
                                <Progress value={cmp.progress} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{cmp.articlesAgreed}/{cmp.articlesTotal} articles résolus</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        J-{cmp.daysRemaining}
                                    </span>
                                </div>
                            </div>

                            {/* Members */}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Délégation AN</p>
                                    <div className="flex -space-x-2">
                                        {cmp.anMembers.slice(0, 3).map((member, idx) => (
                                            <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {cmp.anMembers.length > 3 && (
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                                                +{cmp.anMembers.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Délégation Sénat</p>
                                    <div className="flex -space-x-2">
                                        {cmp.senateMembers.slice(0, 3).map((member, idx) => (
                                            <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {cmp.senateMembers.length > 3 && (
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                                                +{cmp.senateMembers.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-xs text-muted-foreground">
                                    Màj: {new Date(cmp.lastUpdate).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm">
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="gap-1"
                                        onClick={() => navigate(`/parlement/cmp/${cmp.id}`)}
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Accéder
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
