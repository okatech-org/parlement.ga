import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Users,
    Building2,
    Landmark,
    Scale,
    Filter,
    ZoomIn,
    ZoomOut,
    Info,
    TrendingUp,
    TrendingDown,
    Vote
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    PROVINCES as POLITICAL_PROVINCES,
    SENATORS,
    DEPUTIES,
    ELECTORAL_STATS,
    getSenatorsByProvince,
    getDeputiesByProvince,
    getPartyById
} from "@/data/politicalData";

const ElectedMapSection = () => {
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [institutionFilter, setInstitutionFilter] = useState("all");

    // Transform POLITICAL_PROVINCES to include SVG paths for the map
    const provinces = POLITICAL_PROVINCES.map(p => {
        // SVG paths for Gabon provinces (stylized representation)
        const pathMap: Record<string, string> = {
            "estuaire": "M 180 80 L 220 60 L 260 80 L 250 130 L 200 150 L 160 120 Z",
            "haut-ogooue": "M 280 180 L 350 160 L 380 200 L 370 260 L 310 280 L 260 240 Z",
            "moyen-ogooue": "M 140 140 L 180 150 L 200 200 L 170 240 L 120 220 L 110 170 Z",
            "ngounie": "M 120 240 L 170 250 L 200 300 L 180 350 L 130 340 L 100 290 Z",
            "nyanga": "M 80 300 L 120 290 L 130 350 L 100 400 L 60 380 L 50 330 Z",
            "ogooue-ivindo": "M 220 120 L 280 100 L 340 130 L 330 190 L 270 200 L 230 170 Z",
            "ogooue-lolo": "M 200 210 L 260 200 L 280 250 L 260 300 L 210 290 L 190 250 Z",
            "ogooue-maritime": "M 60 120 L 110 100 L 140 140 L 120 190 L 70 180 L 40 150 Z",
            "woleu-ntem": "M 200 20 L 280 10 L 320 50 L 300 100 L 240 110 L 190 70 Z",
        };

        // Color map based on dominant party
        const colorMap: Record<string, string> = {
            "udb": "#1E40AF",   // Blue
            "pdg": "#059669",   // Green
            "rpm": "#DC2626",   // Red
            "un": "#F59E0B",    // Orange
            "psd": "#EC4899",   // Pink
            "ind": "#6B7280",   // Gray
        };

        // Get real senators and deputies for this province
        const provinceSenators = SENATORS.filter(s =>
            s.province.toLowerCase().replace(/[- ]/g, '-') === p.id ||
            s.province === p.name
        );
        const provinceDeputies = DEPUTIES.filter(d =>
            d.province.toLowerCase().replace(/[- ]/g, '-') === p.id ||
            d.province === p.name
        );

        return {
            id: p.id,
            name: p.name,
            capital: p.capital,
            path: pathMap[p.id] || "M 100 100 L 150 100 L 150 150 L 100 150 Z",
            color: colorMap[p.dominantParty] || "#10b981",
            deputies: p.seatsAN,
            senators: p.seatsSenate,
            population: p.population,
            eligibleVoters: p.eligibleVoters,
            registeredVoters: p.registeredVoters,
            actualVoters: p.actualVoters,
            participationRate: p.participationRate,
            effectiveRepresentationRate: p.effectiveRepresentationRate,
            dominantParty: p.dominantParty,
            analysis: p.analysis,
            officials: [
                ...provinceSenators.slice(0, 3).map(s => ({
                    name: s.name,
                    role: s.roles.includes('president') ? 'Président du Sénat' :
                        s.roles.includes('vp') ? 'Vice-Président Sénat' :
                            s.roles.includes('questeur') ? 'Questeur Sénat' : 'Sénateur',
                    party: s.party,
                    partyId: s.partyId
                })),
                ...provinceDeputies.slice(0, 2).map(d => ({
                    name: d.name,
                    role: d.roles.includes('president') ? 'Président de l\'AN' :
                        d.roles.includes('vp') ? 'Vice-Président AN' :
                            d.roles.includes('questeur') ? 'Questeur AN' : 'Député',
                    party: d.party,
                    partyId: d.partyId
                })),
            ],
            // Total real counts
            realSenatorCount: provinceSenators.length,
            realDeputyCount: provinceDeputies.length
        };
    });

    const totalDeputies = provinces.reduce((acc, p) => acc + p.deputies, 0);
    const totalSenators = provinces.reduce((acc, p) => acc + p.senators, 0);
    const totalPopulation = provinces.reduce((acc, p) => acc + p.population, 0);
    const totalEligible = provinces.reduce((acc, p) => acc + p.eligibleVoters, 0);

    const getRepresentationRatio = (province: typeof provinces[0]) => {
        const totalElected = province.deputies + province.senators;
        return Math.round(province.eligibleVoters / totalElected);
    };

    const nationalAvgRatio = Math.round(totalEligible / (totalDeputies + totalSenators));

    const getRepresentationStatus = (province: typeof provinces[0]) => {
        const ratio = getRepresentationRatio(province);
        if (ratio < nationalAvgRatio * 0.8) return { label: "Sur-représentée", color: "text-green-600", icon: TrendingUp };
        if (ratio > nationalAvgRatio * 1.2) return { label: "Sous-représentée", color: "text-red-600", icon: TrendingDown };
        return { label: "Équilibrée", color: "text-blue-600", icon: null };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <MapPin className="h-8 w-8 text-blue-500" />
                        Cartographie des Élus
                    </h1>
                    <p className="text-muted-foreground">Répartition géographique et données démographiques</p>
                </div>
                <div className="flex gap-2">
                    <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Institution" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes Institutions</SelectItem>
                            <SelectItem value="an">Assemblée Nationale</SelectItem>
                            <SelectItem value="senat">Sénat</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* National Summary */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
                    <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-emerald-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Députés</p>
                            <p className="text-2xl font-bold">{totalDeputies}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-600/5">
                    <div className="flex items-center gap-3">
                        <Landmark className="h-8 w-8 text-amber-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Sénateurs</p>
                            <p className="text-2xl font-bold">{totalSenators}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
                    <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Électeurs Inscrits</p>
                            <p className="text-2xl font-bold">{(totalEligible / 1000000).toFixed(1)}M</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                    <div className="flex items-center gap-3">
                        <Scale className="h-8 w-8 text-purple-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Ratio Moyen</p>
                            <p className="text-2xl font-bold">{nationalAvgRatio.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">électeurs/élu</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Interactive Map */}
                <Card className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            Carte du Gabon
                        </h3>
                        <div className="flex gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8"><ZoomIn className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8"><ZoomOut className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <div className="relative bg-slate-100 dark:bg-slate-900/50 rounded-xl p-4 min-h-[400px]">
                        <svg viewBox="0 0 400 420" className="w-full h-full">
                            {provinces.map((province) => (
                                <Tooltip key={province.id}>
                                    <TooltipTrigger asChild>
                                        <g
                                            className="cursor-pointer transition-all duration-200"
                                            onClick={() => setSelectedProvince(selectedProvince === province.id ? null : province.id)}
                                        >
                                            <path
                                                d={province.path}
                                                fill={selectedProvince === province.id ? province.color : `${province.color}66`}
                                                stroke={province.color}
                                                strokeWidth={selectedProvince === province.id ? 3 : 1.5}
                                                className="hover:opacity-80 transition-opacity"
                                            />
                                            {/* Province Label */}
                                            <text
                                                x={parseInt(province.path.split(' ')[1]) + 30}
                                                y={parseInt(province.path.split(' ')[2]) + 50}
                                                className="text-[10px] font-medium fill-current pointer-events-none"
                                                textAnchor="middle"
                                            >
                                                {province.name.split('-')[0]}
                                            </text>
                                            {/* Elected Count Badge */}
                                            <circle
                                                cx={parseInt(province.path.split(' ')[1]) + 30}
                                                cy={parseInt(province.path.split(' ')[2]) + 65}
                                                r="12"
                                                fill={province.color}
                                                className="pointer-events-none"
                                            />
                                            <text
                                                x={parseInt(province.path.split(' ')[1]) + 30}
                                                y={parseInt(province.path.split(' ')[2]) + 69}
                                                className="text-[9px] font-bold fill-white pointer-events-none"
                                                textAnchor="middle"
                                            >
                                                {province.deputies + province.senators}
                                            </text>
                                        </g>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="p-3">
                                        <div className="space-y-1">
                                            <p className="font-semibold">{province.name}</p>
                                            <p className="text-xs text-muted-foreground">Capitale: {province.capital}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600">{province.deputies} Députés</Badge>
                                                <Badge variant="outline" className="bg-amber-50 text-amber-600">{province.senators} Sénateurs</Badge>
                                            </div>
                                            <p className="text-xs mt-2">Population: {province.population.toLocaleString()}</p>
                                            <p className="text-xs">Électeurs: {province.eligibleVoters.toLocaleString()}</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </svg>
                    </div>
                </Card>

                {/* Province Details Panel */}
                <Card className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        {selectedProvince ? provinces.find(p => p.id === selectedProvince)?.name : "Sélectionnez une province"}
                    </h3>

                    {selectedProvince ? (
                        (() => {
                            const province = provinces.find(p => p.id === selectedProvince)!;
                            const status = getRepresentationStatus(province);
                            const StatusIcon = status.icon;

                            return (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${province.color}15` }}>
                                        <p className="text-sm text-muted-foreground">Capitale</p>
                                        <p className="font-semibold">{province.capital}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                            <p className="text-xs text-muted-foreground">Députés</p>
                                            <p className="text-xl font-bold text-emerald-600">{province.deputies}</p>
                                        </div>
                                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                            <p className="text-xs text-muted-foreground">Sénateurs</p>
                                            <p className="text-xl font-bold text-amber-600">{province.senators}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-2">Données Démographiques & Électorales (2025)</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Population totale</span>
                                                <span className="font-medium">{province.population.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Électeurs éligibles</span>
                                                <span className="font-medium">{province.eligibleVoters.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Inscrits</span>
                                                <span className="font-medium">{(province as any).registeredVoters?.toLocaleString() || '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Votants (1er tour)</span>
                                                <span className="font-medium">{(province as any).actualVoters?.toLocaleString() || '-'}</span>
                                            </div>
                                            <div className="flex justify-between border-t pt-2">
                                                <span className="text-sm font-medium">Taux de participation</span>
                                                <Badge variant="outline" className={
                                                    (province as any).participationRate > 55 ? 'bg-green-50 text-green-600' :
                                                        (province as any).participationRate > 40 ? 'bg-amber-50 text-amber-600' :
                                                            'bg-red-50 text-red-600'
                                                }>
                                                    {(province as any).participationRate || 0}%
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Électeurs / Élu</span>
                                                <span className="font-medium">{getRepresentationRatio(province).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {(province as any).analysis && (
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                                            <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Analyse</p>
                                            <p className="text-sm text-blue-600 dark:text-blue-400">{(province as any).analysis}</p>
                                        </div>
                                    )}

                                    <div className={`p-3 rounded-lg flex items-center gap-2 ${status.label === "Sur-représentée" ? "bg-green-50" :
                                        status.label === "Sous-représentée" ? "bg-red-50" : "bg-blue-50"
                                        }`}>
                                        {StatusIcon && <StatusIcon className={`h-4 w-4 ${status.color}`} />}
                                        <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                                    </div>

                                    {province.officials.length > 0 && (
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">Élus de la province</p>
                                            <div className="space-y-2">
                                                {province.officials.map((official, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border">
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                                            <Users className="h-5 w-5 text-slate-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{official.name}</p>
                                                            <p className="text-xs text-muted-foreground">{official.role} • {official.party}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>Cliquez sur une province pour voir les détails</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Representation Comparison Table */}
            <Card className="p-6">
                <h3 className="font-semibold mb-4">Comparatif de Représentativité</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium">Province</th>
                                <th className="text-center py-3 px-4 font-medium">Députés</th>
                                <th className="text-center py-3 px-4 font-medium">Sénateurs</th>
                                <th className="text-right py-3 px-4 font-medium">Électeurs</th>
                                <th className="text-right py-3 px-4 font-medium">Ratio</th>
                                <th className="text-center py-3 px-4 font-medium">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {provinces.sort((a, b) => getRepresentationRatio(b) - getRepresentationRatio(a)).map((province) => {
                                const status = getRepresentationStatus(province);
                                return (
                                    <tr key={province.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: province.color }}></div>
                                                <span className="font-medium">{province.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">{province.deputies}</td>
                                        <td className="py-3 px-4 text-center">{province.senators}</td>
                                        <td className="py-3 px-4 text-right">{province.eligibleVoters.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-right font-mono">{getRepresentationRatio(province).toLocaleString()}</td>
                                        <td className="py-3 px-4 text-center">
                                            <Badge variant="outline" className={
                                                status.label === "Sur-représentée" ? "bg-green-50 text-green-600" :
                                                    status.label === "Sous-représentée" ? "bg-red-50 text-red-600" :
                                                        "bg-blue-50 text-blue-600"
                                            }>
                                                {status.label}
                                            </Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ElectedMapSection;
