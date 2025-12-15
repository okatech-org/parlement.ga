import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DEPUTIES, SENATORS, PROVINCES, POLITICAL_PARTIES,
    AN_COMMISSIONS, SENATE_COMMISSIONS, BUREAU_AN, BUREAU_SENATE,
    getPartyById, PermanentCommission, BureauMember
} from "@/data/politicalData";
import {
    Users, MapPin, Building2, Crown, Shield, Gavel, Search,
    Filter, ChevronDown, ChevronRight, Briefcase, UserCheck,
    Building, Scale, Globe, Landmark, GraduationCap, Leaf,
    Heart, BookOpen, Network, ArrowDown
} from "lucide-react";

// Commission icons mapping
const commissionIcons: Record<string, any> = {
    'Lois': Scale,
    'Finances': Briefcase,
    'Affaires Étrangères': Globe,
    'Défense': Shield,
    'Économie': Landmark,
    'Social': Heart,
    'Éducation': GraduationCap,
    'Environnement': Leaf,
    'Collectivités': Building,
};

// Profile Card Component
function ProfileCard({ person, type }: { person: any; type: "deputy" | "senator" }) {
    const party = getPartyById(person.partyId);

    return (
        <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/30 transition-all">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2" style={{ borderColor: party?.color }}>
                        <AvatarFallback
                            className="text-white text-sm font-bold"
                            style={{ backgroundColor: party?.color || "#6B7280" }}
                        >
                            {person.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{person.name}</p>
                        <p className="text-slate-400 text-sm truncate">{person.constituency}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="outline" style={{ borderColor: party?.color, color: party?.color }} className="text-xs">
                                {person.party}
                            </Badge>
                            <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                                {person.province}
                            </Badge>
                        </div>
                        {person.substitute && (
                            <p className="text-slate-500 text-xs mt-1">
                                <UserCheck className="inline h-3 w-3 mr-1" />
                                Supp: {person.substitute}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Commission Card Component
function CommissionCard({ commission }: { commission: PermanentCommission }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = commissionIcons[commission.shortName] || Briefcase;

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'president': return { label: 'Président', className: 'bg-amber-600' };
            case 'vp': return { label: 'Vice-Prés.', className: 'bg-purple-600' };
            case 'rapporteur': return { label: 'Rapporteur', className: 'bg-blue-600' };
            default: return { label: 'Membre', className: 'bg-slate-600' };
        }
    };

    return (
        <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: commission.color + '20' }}>
                            <Icon className="h-5 w-5" style={{ color: commission.color }} />
                        </div>
                        <div>
                            <CardTitle className="text-white text-base">{commission.shortName}</CardTitle>
                            <CardDescription className="text-xs truncate max-w-[300px]">
                                {commission.description}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                            {commission.members.length} membres
                        </Badge>
                        {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                        ) : (
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                        )}
                    </div>
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent className="pt-2">
                    <div className="space-y-2">
                        {commission.members.map((member, idx) => {
                            const badge = getRoleBadge(member.role);
                            const party = getPartyById(member.partyId);
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30"
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback
                                                className="text-xs"
                                                style={{ backgroundColor: party?.color }}
                                            >
                                                {member.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-white text-sm">{member.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${badge.className} text-xs`}>{badge.label}</Badge>
                                        <Badge variant="outline" style={{ borderColor: party?.color, color: party?.color }} className="text-xs">
                                            {member.party}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

// Bureau Org Chart Component
function BureauOrgChart({ institution }: { institution: 'AN' | 'SENATE' }) {
    const bureau = institution === 'AN' ? BUREAU_AN : BUREAU_SENATE;
    const themeColor = institution === 'AN' ? '#10B981' : '#F59E0B';

    const president = bureau.find(m => m.level === 1);
    const vps = bureau.filter(m => m.level === 2);
    const questeurs = bureau.filter(m => m.level === 3);
    const secretaries = bureau.filter(m => m.level === 4);

    const MemberCard = ({ member }: { member: BureauMember }) => {
        const party = getPartyById(member.partyId);
        return (
            <div className="flex flex-col items-center">
                <div
                    className="relative p-1 rounded-xl"
                    style={{
                        background: `linear-gradient(135deg, ${party?.color}40, ${party?.color}20)`,
                        border: `2px solid ${party?.color}60`
                    }}
                >
                    <Avatar className="h-16 w-16 border-2 border-white/10">
                        <AvatarFallback
                            className="text-white text-lg font-bold"
                            style={{ backgroundColor: party?.color }}
                        >
                            {member.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                    {member.role === 'president' && (
                        <Crown className="absolute -top-2 -right-2 h-6 w-6 text-amber-400" />
                    )}
                </div>
                <p className="text-white text-sm font-medium mt-2 text-center max-w-[120px]">
                    {member.name}
                </p>
                <Badge
                    className="mt-1 text-xs"
                    style={{ backgroundColor: themeColor }}
                >
                    {member.roleLabel}
                </Badge>
                <Badge variant="outline" className="mt-1 text-xs" style={{ borderColor: party?.color, color: party?.color }}>
                    {member.party}
                </Badge>
            </div>
        );
    };

    const ConnectorLine = () => (
        <div className="flex justify-center py-2">
            <ArrowDown className="h-6 w-6 text-slate-500" />
        </div>
    );

    return (
        <div className="py-8">
            {/* President */}
            <div className="flex justify-center mb-4">
                {president && <MemberCard member={president} />}
            </div>

            <ConnectorLine />

            {/* Vice-Presidents */}
            <div className="flex justify-center gap-8 flex-wrap mb-4">
                {vps.map(vp => (
                    <MemberCard key={vp.id} member={vp} />
                ))}
            </div>

            <ConnectorLine />

            {/* Questeurs */}
            <div className="flex justify-center gap-8 flex-wrap mb-4">
                {questeurs.map(q => (
                    <MemberCard key={q.id} member={q} />
                ))}
            </div>

            <ConnectorLine />

            {/* Secretaries */}
            <div className="flex justify-center gap-8 flex-wrap">
                {secretaries.map(s => (
                    <MemberCard key={s.id} member={s} />
                ))}
            </div>
        </div>
    );
}

// Main Component
export default function AnnuaireElus() {
    const [activeTab, setActiveTab] = useState<"profiles" | "commissions" | "bureau">("profiles");
    const [institution, setInstitution] = useState<"all" | "AN" | "SENATE">("all");
    const [selectedProvince, setSelectedProvince] = useState<string>("all");
    const [selectedParty, setSelectedParty] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter officials
    const filteredOfficials = useMemo(() => {
        const allOfficials = [
            ...DEPUTIES.map(d => ({ ...d, type: 'deputy' as const })),
            ...SENATORS.map(s => ({ ...s, type: 'senator' as const }))
        ];

        return allOfficials.filter(person => {
            const matchInstitution = institution === "all" ||
                (institution === "AN" && person.type === "deputy") ||
                (institution === "SENATE" && person.type === "senator");
            const matchProvince = selectedProvince === "all" || person.province === selectedProvince;
            const matchParty = selectedParty === "all" || person.partyId === selectedParty;
            const matchSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                person.constituency.toLowerCase().includes(searchQuery.toLowerCase());
            return matchInstitution && matchProvince && matchParty && matchSearch;
        });
    }, [institution, selectedProvince, selectedParty, searchQuery]);

    // Filter commissions
    const filteredCommissions = useMemo(() => {
        if (institution === "all") return [...AN_COMMISSIONS, ...SENATE_COMMISSIONS];
        return institution === "AN" ? AN_COMMISSIONS : SENATE_COMMISSIONS;
    }, [institution]);

    // Stats
    const stats = useMemo(() => ({
        deputies: DEPUTIES.length,
        senators: SENATORS.length,
        total: filteredOfficials.length,
        women: filteredOfficials.filter(o => o.gender === "F").length
    }), [filteredOfficials]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Hero */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-b border-indigo-500/20">
                <div className="container mx-auto px-4 py-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                            <Users className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Annuaire des Élus</h1>
                            <p className="text-indigo-200/80">Parlement Gabonais • Ve République</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-white">{DEPUTIES.length}</div>
                                <div className="text-xs text-slate-400">Députés</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-amber-400">{SENATORS.length}</div>
                                <div className="text-xs text-slate-400">Sénateurs</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-400">{AN_COMMISSIONS.length + SENATE_COMMISSIONS.length}</div>
                                <div className="text-xs text-slate-400">Commissions</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-pink-400">{stats.women}</div>
                                <div className="text-xs text-slate-400">Femmes (filtré)</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <TabsList className="bg-slate-800/50 border border-slate-700">
                            <TabsTrigger value="profiles" className="data-[state=active]:bg-indigo-600">
                                <Users className="h-4 w-4 mr-2" />
                                Profils ({stats.total})
                            </TabsTrigger>
                            <TabsTrigger value="commissions" className="data-[state=active]:bg-purple-600">
                                <Briefcase className="h-4 w-4 mr-2" />
                                Commissions
                            </TabsTrigger>
                            <TabsTrigger value="bureau" className="data-[state=active]:bg-amber-600">
                                <Network className="h-4 w-4 mr-2" />
                                Bureaux
                            </TabsTrigger>
                        </TabsList>

                        {/* Institution Filter - Always visible */}
                        <Select value={institution} onValueChange={(v: any) => setInstitution(v)}>
                            <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                                <Building2 className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Institution" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes</SelectItem>
                                <SelectItem value="AN">Assemblée Nationale</SelectItem>
                                <SelectItem value="SENATE">Sénat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Profiles Tab */}
                    <TabsContent value="profiles" className="space-y-4">
                        {/* Filters */}
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-4">
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex-1 min-w-[200px]">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="Rechercher un élu..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 bg-slate-700 border-slate-600 text-white"
                                            />
                                        </div>
                                    </div>
                                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                                        <SelectTrigger className="w-[160px] bg-slate-700 border-slate-600 text-white">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <SelectValue placeholder="Province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Toutes</SelectItem>
                                            {PROVINCES.map(p => (
                                                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={selectedParty} onValueChange={setSelectedParty}>
                                        <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-white">
                                            <Filter className="h-4 w-4 mr-2" />
                                            <SelectValue placeholder="Parti" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tous</SelectItem>
                                            {POLITICAL_PARTIES.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.shortName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Profiles Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredOfficials.map((person) => (
                                <ProfileCard
                                    key={`${person.type}-${person.id}`}
                                    person={person}
                                    type={person.type}
                                />
                            ))}
                        </div>

                        {filteredOfficials.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                Aucun élu ne correspond aux critères de recherche.
                            </div>
                        )}
                    </TabsContent>

                    {/* Commissions Tab */}
                    <TabsContent value="commissions" className="space-y-4">
                        <div className="grid lg:grid-cols-2 gap-4">
                            {filteredCommissions.map(commission => (
                                <CommissionCard key={commission.id} commission={commission} />
                            ))}
                        </div>
                    </TabsContent>

                    {/* Bureau Tab */}
                    <TabsContent value="bureau" className="space-y-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* AN Bureau */}
                            {(institution === "all" || institution === "AN") && (
                                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 border-b border-emerald-500/20">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Building2 className="h-5 w-5 text-emerald-400" />
                                            Bureau de l'Assemblée Nationale
                                        </CardTitle>
                                        <CardDescription>Organigramme officiel</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <ScrollArea className="h-[600px]">
                                            <BureauOrgChart institution="AN" />
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Senate Bureau */}
                            {(institution === "all" || institution === "SENATE") && (
                                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 border-b border-amber-500/20">
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Landmark className="h-5 w-5 text-amber-400" />
                                            Bureau du Sénat
                                        </CardTitle>
                                        <CardDescription>Organigramme officiel</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <ScrollArea className="h-[600px]">
                                            <BureauOrgChart institution="SENATE" />
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
