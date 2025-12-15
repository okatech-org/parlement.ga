import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    PROVINCES, POLITICAL_PARTIES, ELECTORAL_STATS, DEPUTIES, SENATORS,
    REPRESENTATIVITY_DATA
} from "@/data/politicalData";
import {
    BarChart3, Users, MapPin, TrendingUp, TrendingDown, AlertTriangle,
    CheckCircle, XCircle, Minus, PieChart, Activity, Target,
    Vote, UserCheck, Building2, Globe
} from "lucide-react";

export default function AnalyseStatistique() {
    // Calculate statistics
    const stats = useMemo(() => {
        const totalPopulation = PROVINCES.reduce((sum, p) => sum + p.population, 0);
        const totalRegistered = PROVINCES.reduce((sum, p) => sum + p.registeredVoters, 0);
        const totalVoters = PROVINCES.reduce((sum, p) => sum + p.actualVoters, 0);
        const avgParticipation = PROVINCES.reduce((sum, p) => sum + p.participationRate, 0) / PROVINCES.length;

        const womenDeputies = DEPUTIES.filter(d => d.gender === "F").length;
        const womenSenators = SENATORS.filter(s => s.gender === "F").length;

        const highestParticipation = [...PROVINCES].sort((a, b) => b.participationRate - a.participationRate)[0];
        const lowestParticipation = [...PROVINCES].sort((a, b) => a.participationRate - b.participationRate)[0];

        return {
            totalPopulation,
            totalRegistered,
            totalVoters,
            avgParticipation,
            womenDeputies,
            womenSenators,
            womenDeputiesPercent: (womenDeputies / DEPUTIES.length * 100).toFixed(1),
            womenSenatorsPercent: (womenSenators / SENATORS.length * 100).toFixed(1),
            highestParticipation,
            lowestParticipation
        };
    }, []);

    // Party analysis
    const partyAnalysis = useMemo(() => {
        return POLITICAL_PARTIES
            .filter(p => p.seatsAN > 0 || p.seatsSenate > 0)
            .map(party => ({
                ...party,
                totalSeats: party.seatsAN + party.seatsSenate,
                percentAN: ((party.seatsAN / 145) * 100).toFixed(1),
                percentSenate: ((party.seatsSenate / 68) * 100).toFixed(1),
                deputies: DEPUTIES.filter(d => d.partyId === party.id),
                senators: SENATORS.filter(s => s.partyId === party.id)
            }))
            .sort((a, b) => b.totalSeats - a.totalSeats);
    }, []);

    // Province analysis with deficit
    const provinceAnalysis = useMemo(() => {
        return PROVINCES.map(p => {
            const data = REPRESENTATIVITY_DATA.find(r => r.provinceId === p.id);
            const deputies = DEPUTIES.filter(d => d.province === p.name);
            const senators = SENATORS.filter(s => s.province === p.name);

            return {
                ...p,
                deputiesCount: deputies.length,
                senatorsCount: senators.length,
                deficit: data?.democraticDeficit || "medium",
                effectiveRate: data?.effectiveRate || 0
            };
        }).sort((a, b) => b.participationRate - a.participationRate);
    }, []);

    const getDeficitColor = (deficit: string) => {
        switch (deficit) {
            case "low": return "text-emerald-400";
            case "medium": return "text-amber-400";
            case "high": return "text-orange-400";
            case "critical": return "text-red-400";
            default: return "text-slate-400";
        }
    };

    const getDeficitIcon = (deficit: string) => {
        switch (deficit) {
            case "low": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
            case "medium": return <Minus className="h-4 w-4 text-amber-400" />;
            case "high": return <AlertTriangle className="h-4 w-4 text-orange-400" />;
            case "critical": return <XCircle className="h-4 w-4 text-red-400" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Hero */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Activity className="h-8 w-8 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Analyse Statistique</h1>
                            <p className="text-purple-200/80">Participation & Représentativité • Élections 2025</p>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-white">{stats.avgParticipation.toFixed(1)}%</div>
                                <div className="text-sm text-slate-400">Participation moyenne</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-emerald-400">{stats.totalVoters.toLocaleString()}</div>
                                <div className="text-sm text-slate-400">Votants</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-pink-400">{stats.womenDeputiesPercent}%</div>
                                <div className="text-sm text-slate-400">Femmes à l'AN</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-amber-400">{stats.womenSenatorsPercent}%</div>
                                <div className="text-sm text-slate-400">Femmes au Sénat</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="participation" className="space-y-6">
                    <TabsList className="bg-slate-800/50 border border-slate-700">
                        <TabsTrigger value="participation" className="data-[state=active]:bg-purple-600">
                            <Vote className="h-4 w-4 mr-2" />
                            Participation
                        </TabsTrigger>
                        <TabsTrigger value="parties" className="data-[state=active]:bg-purple-600">
                            <PieChart className="h-4 w-4 mr-2" />
                            Partis
                        </TabsTrigger>
                        <TabsTrigger value="gender" className="data-[state=active]:bg-purple-600">
                            <Users className="h-4 w-4 mr-2" />
                            Parité
                        </TabsTrigger>
                        <TabsTrigger value="deficit" className="data-[state=active]:bg-purple-600">
                            <Target className="h-4 w-4 mr-2" />
                            Déficit Démocratique
                        </TabsTrigger>
                    </TabsList>

                    {/* Participation Tab */}
                    <TabsContent value="participation" className="space-y-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Participation by Province */}
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-purple-400" />
                                        Participation par Province
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {provinceAnalysis.map(p => (
                                        <div key={p.id} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white font-medium">{p.name}</span>
                                                <div className="flex items-center gap-2">
                                                    {p.participationRate > stats.avgParticipation ? (
                                                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                                                    ) : (
                                                        <TrendingDown className="h-4 w-4 text-red-400" />
                                                    )}
                                                    <span className={`font-medium ${p.participationRate > 50 ? "text-emerald-400" :
                                                            p.participationRate > 40 ? "text-amber-400" : "text-red-400"
                                                        }`}>
                                                        {p.participationRate}%
                                                    </span>
                                                </div>
                                            </div>
                                            <Progress
                                                value={p.participationRate}
                                                className="h-2 bg-slate-700"
                                            />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Extremes */}
                            <div className="space-y-6">
                                <Card className="bg-emerald-900/20 border-emerald-500/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-emerald-400 flex items-center gap-2 text-lg">
                                            <TrendingUp className="h-5 w-5" />
                                            Meilleure Participation
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {stats.highestParticipation.name}
                                        </div>
                                        <div className="text-emerald-400 text-2xl font-semibold">
                                            {stats.highestParticipation.participationRate}%
                                        </div>
                                        <p className="text-slate-400 text-sm mt-2">
                                            {stats.highestParticipation.actualVoters.toLocaleString()} votants sur{" "}
                                            {stats.highestParticipation.registeredVoters.toLocaleString()} inscrits
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-red-900/20 border-red-500/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-red-400 flex items-center gap-2 text-lg">
                                            <TrendingDown className="h-5 w-5" />
                                            Plus Faible Participation
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {stats.lowestParticipation.name}
                                        </div>
                                        <div className="text-red-400 text-2xl font-semibold">
                                            {stats.lowestParticipation.participationRate}%
                                        </div>
                                        <p className="text-slate-400 text-sm mt-2">
                                            {stats.lowestParticipation.analysis}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Parties Tab */}
                    <TabsContent value="parties" className="space-y-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {partyAnalysis.slice(0, 9).map(party => (
                                <Card key={party.id} className="bg-slate-800/50 border-slate-700">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: party.color }}
                                                />
                                                <CardTitle className="text-white text-lg">{party.shortName}</CardTitle>
                                            </div>
                                            <Badge className="bg-slate-700">{party.totalSeats} sièges</Badge>
                                        </div>
                                        <CardDescription className="truncate">{party.name}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-2 rounded bg-blue-900/30 border border-blue-500/20">
                                                <p className="text-blue-400 text-xs">Assemblée</p>
                                                <p className="text-white font-bold">{party.seatsAN}</p>
                                                <p className="text-slate-400 text-xs">{party.percentAN}%</p>
                                            </div>
                                            <div className="p-2 rounded bg-amber-900/30 border border-amber-500/20">
                                                <p className="text-amber-400 text-xs">Sénat</p>
                                                <p className="text-white font-bold">{party.seatsSenate}</p>
                                                <p className="text-slate-400 text-xs">{party.percentSenate}%</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <p>Leader: {party.leader}</p>
                                            <p>Idéologie: {party.ideology}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Gender Tab */}
                    <TabsContent value="gender" className="space-y-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* AN Gender */}
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Assemblée Nationale</CardTitle>
                                    <CardDescription>Répartition hommes/femmes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-blue-400">Hommes</span>
                                                <span className="text-white font-medium">
                                                    {DEPUTIES.length - stats.womenDeputies} ({(100 - parseFloat(stats.womenDeputiesPercent)).toFixed(1)}%)
                                                </span>
                                            </div>
                                            <Progress value={100 - parseFloat(stats.womenDeputiesPercent)} className="h-3 bg-slate-700" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-pink-400">Femmes</span>
                                                <span className="text-white font-medium">
                                                    {stats.womenDeputies} ({stats.womenDeputiesPercent}%)
                                                </span>
                                            </div>
                                            <Progress value={parseFloat(stats.womenDeputiesPercent)} className="h-3 bg-slate-700" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Senate Gender */}
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white">Sénat</CardTitle>
                                    <CardDescription>Répartition hommes/femmes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-blue-400">Hommes</span>
                                                <span className="text-white font-medium">
                                                    {SENATORS.length - stats.womenSenators} ({(100 - parseFloat(stats.womenSenatorsPercent)).toFixed(1)}%)
                                                </span>
                                            </div>
                                            <Progress value={100 - parseFloat(stats.womenSenatorsPercent)} className="h-3 bg-slate-700" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-pink-400">Femmes</span>
                                                <span className="text-white font-medium">
                                                    {stats.womenSenators} ({stats.womenSenatorsPercent}%)
                                                </span>
                                            </div>
                                            <Progress value={parseFloat(stats.womenSenatorsPercent)} className="h-3 bg-slate-700" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Deficit Tab */}
                    <TabsContent value="deficit" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Target className="h-5 w-5 text-purple-400" />
                                    Indice de Déficit Démocratique par Province
                                </CardTitle>
                                <CardDescription>
                                    Mesure l'écart entre population éligible et représentation effective
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {provinceAnalysis.map(p => (
                                        <div
                                            key={p.id}
                                            className={`p-4 rounded-lg border ${p.deficit === "critical" ? "bg-red-900/20 border-red-500/30" :
                                                    p.deficit === "high" ? "bg-orange-900/20 border-orange-500/30" :
                                                        p.deficit === "medium" ? "bg-amber-900/20 border-amber-500/30" :
                                                            "bg-emerald-900/20 border-emerald-500/30"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-white font-medium">{p.name}</span>
                                                {getDeficitIcon(p.deficit)}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-slate-400">Représentativité</p>
                                                    <p className={`font-bold ${getDeficitColor(p.deficit)}`}>
                                                        {p.effectiveRate}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-400">Participation</p>
                                                    <p className="text-white font-medium">{p.participationRate}%</p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`mt-2 ${getDeficitColor(p.deficit)} border-current`}
                                            >
                                                {p.deficit === "critical" ? "Déficit critique" :
                                                    p.deficit === "high" ? "Déficit élevé" :
                                                        p.deficit === "medium" ? "Déficit modéré" :
                                                            "Bon niveau"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
