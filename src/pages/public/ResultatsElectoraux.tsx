import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    DEPUTIES, SENATORS, PROVINCES, POLITICAL_PARTIES, ELECTORAL_STATS,
    getPartyById
} from "@/data/politicalData";
import {
    BarChart3, Users, MapPin, Vote, Trophy, TrendingUp,
    Search, Filter, ChevronDown, Crown, Building2, PieChart,
    ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";

export default function ResultatsElectoraux() {
    const [selectedProvince, setSelectedProvince] = useState<string>("all");
    const [selectedParty, setSelectedParty] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"percentage" | "name" | "province">("percentage");

    // Filtered deputies
    const filteredDeputies = useMemo(() => {
        return DEPUTIES.filter(d => {
            const matchProvince = selectedProvince === "all" || d.province === selectedProvince;
            const matchParty = selectedParty === "all" || d.partyId === selectedParty;
            const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.constituency.toLowerCase().includes(searchQuery.toLowerCase());
            return matchProvince && matchParty && matchSearch;
        }).sort((a, b) => {
            if (sortBy === "percentage") return (b.percentage || 0) - (a.percentage || 0);
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return a.province.localeCompare(b.province);
        });
    }, [selectedProvince, selectedParty, searchQuery, sortBy]);

    // Party colors
    const getPartyColor = (partyId: string) => {
        const party = getPartyById(partyId);
        return party?.color || "#6B7280";
    };

    // Stats by party for AN
    const partyStats = useMemo(() => {
        const stats: Record<string, { count: number; avgPercentage: number; color: string }> = {};
        DEPUTIES.forEach(d => {
            if (!stats[d.party]) {
                stats[d.party] = { count: 0, avgPercentage: 0, color: getPartyColor(d.partyId) };
            }
            stats[d.party].count++;
            if (d.percentage) {
                stats[d.party].avgPercentage += d.percentage;
            }
        });
        Object.keys(stats).forEach(party => {
            const withPercentage = DEPUTIES.filter(d => d.party === party && d.percentage).length;
            if (withPercentage > 0) {
                stats[party].avgPercentage /= withPercentage;
            }
        });
        return Object.entries(stats)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 8);
    }, []);

    // Top scores
    const topScores = useMemo(() => {
        return DEPUTIES
            .filter(d => d.percentage)
            .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
            .slice(0, 5);
    }, []);

    // Closest races
    const closestRaces = useMemo(() => {
        return DEPUTIES
            .filter(d => d.percentage && d.percentage < 55)
            .sort((a, b) => (a.percentage || 100) - (b.percentage || 100))
            .slice(0, 5);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-b border-emerald-500/20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5"></div>
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <Vote className="h-8 w-8 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Résultats Électoraux 2025</h1>
                            <p className="text-emerald-200/80">Élections législatives • Ve République</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-white">{ELECTORAL_STATS.seatsAN.total}</div>
                                <div className="text-sm text-slate-400">Sièges AN</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-emerald-400">{ELECTORAL_STATS.seatsAN.UDB}</div>
                                <div className="text-sm text-slate-400">UDB (Majorité)</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-green-400">{ELECTORAL_STATS.seatsAN.PDG}</div>
                                <div className="text-sm text-slate-400">PDG (Opposition)</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-amber-400">{PROVINCES.length}</div>
                                <div className="text-sm text-slate-400">Provinces</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-slate-800/50 border border-slate-700">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
                            <PieChart className="h-4 w-4 mr-2" />
                            Vue d'ensemble
                        </TabsTrigger>
                        <TabsTrigger value="deputies" className="data-[state=active]:bg-emerald-600">
                            <Users className="h-4 w-4 mr-2" />
                            Députés
                        </TabsTrigger>
                        <TabsTrigger value="provinces" className="data-[state=active]:bg-emerald-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            Par Province
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Party Distribution */}
                            <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-emerald-400" />
                                        Répartition par Parti
                                    </CardTitle>
                                    <CardDescription>Assemblée Nationale - 145 sièges</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {partyStats.map(([party, stats]) => (
                                        <div key={party} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: stats.color }}
                                                    />
                                                    <span className="text-white font-medium">{party}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-400 text-sm">
                                                        {stats.avgPercentage > 0 && `Moy: ${stats.avgPercentage.toFixed(1)}%`}
                                                    </span>
                                                    <Badge variant="outline" style={{ borderColor: stats.color, color: stats.color }}>
                                                        {stats.count} sièges
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Progress
                                                value={(stats.count / 145) * 100}
                                                className="h-2 bg-slate-700"
                                                style={{
                                                    // @ts-ignore
                                                    "--progress-background": stats.color
                                                }}
                                            />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Top Scores */}
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-amber-400" />
                                        Meilleurs Scores
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {topScores.map((d, i) => (
                                        <div key={d.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/30">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-500 text-black" :
                                                    i === 1 ? "bg-slate-400 text-black" :
                                                        i === 2 ? "bg-amber-700 text-white" :
                                                            "bg-slate-600 text-white"
                                                }`}>
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{d.name}</p>
                                                <p className="text-slate-400 text-xs truncate">{d.constituency}</p>
                                            </div>
                                            <Badge className="bg-emerald-600">{d.percentage?.toFixed(1)}%</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Close Races */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-orange-400" />
                                    Duels Serrés ({"<"}55%)
                                </CardTitle>
                                <CardDescription>Circonscriptions où la compétition était la plus intense</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {closestRaces.map(d => (
                                        <div key={d.id} className="p-4 rounded-lg bg-slate-700/30 border border-orange-500/20">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge
                                                    variant="outline"
                                                    style={{ borderColor: getPartyColor(d.partyId), color: getPartyColor(d.partyId) }}
                                                >
                                                    {d.party}
                                                </Badge>
                                                <span className="text-orange-400 font-bold">{d.percentage?.toFixed(1)}%</span>
                                            </div>
                                            <p className="text-white font-medium">{d.name}</p>
                                            <p className="text-slate-400 text-sm">{d.constituency}</p>
                                            {d.notes && (
                                                <p className="text-orange-300/70 text-xs mt-2">{d.notes}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Deputies Tab */}
                    <TabsContent value="deputies" className="space-y-6">
                        {/* Filters */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-4">
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex-1 min-w-[200px]">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="Rechercher un député..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 bg-slate-700 border-slate-600 text-white"
                                            />
                                        </div>
                                    </div>
                                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                                        <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <SelectValue placeholder="Province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Toutes provinces</SelectItem>
                                            {PROVINCES.map(p => (
                                                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={selectedParty} onValueChange={setSelectedParty}>
                                        <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white">
                                            <Filter className="h-4 w-4 mr-2" />
                                            <SelectValue placeholder="Parti" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tous partis</SelectItem>
                                            {POLITICAL_PARTIES.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.shortName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                                        <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white">
                                            <SelectValue placeholder="Trier par" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Score %</SelectItem>
                                            <SelectItem value="name">Nom</SelectItem>
                                            <SelectItem value="province">Province</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Deputies Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDeputies.map(d => (
                                <Card key={d.id} className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                                style={{ backgroundColor: getPartyColor(d.partyId) }}
                                            >
                                                {d.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white font-medium truncate">{d.name}</p>
                                                    {d.substituteActive && (
                                                        <Badge className="bg-orange-600 text-xs">Suppléant actif</Badge>
                                                    )}
                                                </div>
                                                <p className="text-slate-400 text-sm truncate">{d.constituency}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="outline" className="text-xs" style={{
                                                        borderColor: getPartyColor(d.partyId),
                                                        color: getPartyColor(d.partyId)
                                                    }}>
                                                        {d.party}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                                                        {d.province}
                                                    </Badge>
                                                </div>
                                                {d.percentage && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Progress value={d.percentage} className="h-1.5 flex-1 bg-slate-700" />
                                                        <span className="text-emerald-400 text-sm font-medium">{d.percentage.toFixed(1)}%</span>
                                                    </div>
                                                )}
                                                {d.substitute && (
                                                    <p className="text-slate-500 text-xs mt-2">
                                                        Suppléant: {d.substitute}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredDeputies.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                Aucun député ne correspond aux critères de recherche.
                            </div>
                        )}
                    </TabsContent>

                    {/* Provinces Tab */}
                    <TabsContent value="provinces" className="space-y-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {PROVINCES.map(province => {
                                const provinceDeputies = DEPUTIES.filter(d => d.province === province.name);
                                const partyCounts: Record<string, number> = {};
                                provinceDeputies.forEach(d => {
                                    partyCounts[d.party] = (partyCounts[d.party] || 0) + 1;
                                });
                                const dominantParty = Object.entries(partyCounts).sort((a, b) => b[1] - a[1])[0];

                                return (
                                    <Card key={province.id} className="bg-slate-800/50 border-slate-700">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-white text-lg">{province.name}</CardTitle>
                                                <Badge variant="outline" className="text-emerald-400 border-emerald-500">
                                                    {province.seatsAN} sièges
                                                </Badge>
                                            </div>
                                            <CardDescription>{province.capital}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="p-2 rounded bg-slate-700/50">
                                                    <p className="text-slate-400">Population</p>
                                                    <p className="text-white font-medium">{province.population.toLocaleString()}</p>
                                                </div>
                                                <div className="p-2 rounded bg-slate-700/50">
                                                    <p className="text-slate-400">Participation</p>
                                                    <p className="text-white font-medium">{province.participationRate}%</p>
                                                </div>
                                            </div>

                                            {dominantParty && (
                                                <div className="flex items-center gap-2 p-2 rounded bg-emerald-900/20 border border-emerald-500/20">
                                                    <Crown className="h-4 w-4 text-emerald-400" />
                                                    <span className="text-emerald-300 text-sm">
                                                        Dominant: <strong>{dominantParty[0]}</strong> ({dominantParty[1]} sièges)
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(partyCounts).slice(0, 4).map(([party, count]) => (
                                                    <Badge key={party} variant="secondary" className="text-xs bg-slate-700">
                                                        {party}: {count}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
