import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DEPUTIES, SENATORS, PROVINCES, POLITICAL_PARTIES,
    getPartyById, Deputy, Senator
} from "@/data/politicalData";
import {
    User, MapPin, Building2, Phone, Mail, Vote, Users,
    Search, Filter, Crown, Shield, Gavel, FileText,
    ChevronRight, ArrowLeft, UserCheck, Calendar
} from "lucide-react";

// Profile Card Component
function ProfileCard({
    person,
    type
}: {
    person: Deputy | Senator;
    type: "deputy" | "senator"
}) {
    const party = getPartyById(person.partyId);
    const isSenator = type === "senator";
    const senator = person as Senator;
    const deputy = person as Deputy;

    const getRoleBadges = () => {
        const roles = person.roles || [];
        return roles.map(role => {
            const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
                president: { label: "Président", className: "bg-amber-600", icon: <Crown className="h-3 w-3" /> },
                vp: { label: "Vice-Président", className: "bg-purple-600", icon: <Shield className="h-3 w-3" /> },
                questeur: { label: "Questeur", className: "bg-blue-600", icon: <Gavel className="h-3 w-3" /> },
                commission_president: { label: "Prés. Commission", className: "bg-teal-600", icon: <Users className="h-3 w-3" /> },
            };
            const c = config[role];
            if (!c || role === "deputy" || role === "senator") return null;
            return (
                <Badge key={role} className={`${c.className} flex items-center gap-1`}>
                    {c.icon}
                    {c.label}
                </Badge>
            );
        }).filter(Boolean);
    };

    return (
        <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2" style={{ borderColor: party?.color }}>
                        <AvatarFallback
                            className="text-white text-lg font-bold"
                            style={{ backgroundColor: party?.color || "#6B7280" }}
                        >
                            {person.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold text-lg">{person.name}</h3>
                            {deputy.substituteActive && (
                                <Badge className="bg-orange-600 text-xs">Suppléant siège</Badge>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge
                                variant="outline"
                                style={{ borderColor: party?.color, color: party?.color }}
                            >
                                {person.party}
                            </Badge>
                            <Badge variant="outline" className="text-slate-400 border-slate-600">
                                <MapPin className="h-3 w-3 mr-1" />
                                {person.province}
                            </Badge>
                            {getRoleBadges()}
                        </div>

                        <div className="space-y-1 text-sm text-slate-400">
                            <p className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                {person.constituency}
                            </p>
                            {isSenator && senator.substitute && (
                                <p className="flex items-center gap-2">
                                    <UserCheck className="h-4 w-4" />
                                    Suppléant: {senator.substitute}
                                </p>
                            )}
                            {!isSenator && deputy.substitute && (
                                <p className="flex items-center gap-2">
                                    <UserCheck className="h-4 w-4" />
                                    Suppléant: {deputy.substitute}
                                </p>
                            )}
                            {deputy.percentage && (
                                <p className="flex items-center gap-2 text-emerald-400">
                                    <Vote className="h-4 w-4" />
                                    Élu avec {deputy.percentage.toFixed(1)}% des voix
                                </p>
                            )}
                        </div>

                        {person.notes && (
                            <p className="mt-3 text-xs text-slate-500 italic border-l-2 border-slate-600 pl-2">
                                {person.notes}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ProfilsElus() {
    const [activeTab, setActiveTab] = useState<"deputies" | "senators">("deputies");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProvince, setSelectedProvince] = useState<string>("all");
    const [selectedParty, setSelectedParty] = useState<string>("all");
    const [selectedGender, setSelectedGender] = useState<string>("all");
    const [selectedRole, setSelectedRole] = useState<string>("all");

    // Filter functions
    const filterPerson = (person: Deputy | Senator) => {
        const matchSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.constituency.toLowerCase().includes(searchQuery.toLowerCase());
        const matchProvince = selectedProvince === "all" || person.province === selectedProvince;
        const matchParty = selectedParty === "all" || person.partyId === selectedParty;
        const matchGender = selectedGender === "all" || person.gender === selectedGender;
        const matchRole = selectedRole === "all" || person.roles.includes(selectedRole);
        return matchSearch && matchProvince && matchParty && matchGender && matchRole;
    };

    const filteredDeputies = useMemo(() =>
        DEPUTIES.filter(filterPerson),
        [searchQuery, selectedProvince, selectedParty, selectedGender, selectedRole]
    );

    const filteredSenators = useMemo(() =>
        SENATORS.filter(filterPerson),
        [searchQuery, selectedProvince, selectedParty, selectedGender, selectedRole]
    );

    // Stats
    const stats = useMemo(() => {
        const deputies = activeTab === "deputies" ? filteredDeputies : filteredSenators;
        const women = deputies.filter(d => d.gender === "F").length;
        const withRoles = deputies.filter(d => d.roles.some(r => !["deputy", "senator"].includes(r))).length;
        return {
            total: deputies.length,
            women,
            womenPercent: deputies.length > 0 ? ((women / deputies.length) * 100).toFixed(1) : "0",
            withRoles
        };
    }, [activeTab, filteredDeputies, filteredSenators]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-b border-blue-500/20">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Users className="h-8 w-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Profils des Élus</h1>
                            <p className="text-blue-200/80">Députés & Sénateurs • Ve République</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-white">{DEPUTIES.length}</div>
                                <div className="text-sm text-slate-400">Députés</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-amber-400">{SENATORS.length}</div>
                                <div className="text-sm text-slate-400">Sénateurs</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-pink-400">{stats.womenPercent}%</div>
                                <div className="text-sm text-slate-400">Femmes</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-3xl font-bold text-emerald-400">{PROVINCES.length}</div>
                                <div className="text-sm text-slate-400">Provinces</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <TabsList className="bg-slate-800/50 border border-slate-700">
                            <TabsTrigger value="deputies" className="data-[state=active]:bg-blue-600">
                                <Building2 className="h-4 w-4 mr-2" />
                                Députés ({filteredDeputies.length})
                            </TabsTrigger>
                            <TabsTrigger value="senators" className="data-[state=active]:bg-amber-600">
                                <Crown className="h-4 w-4 mr-2" />
                                Sénateurs ({filteredSenators.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Filters */}
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Rechercher par nom ou circonscription..."
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
                                <Select value={selectedGender} onValueChange={setSelectedGender}>
                                    <SelectTrigger className="w-[120px] bg-slate-700 border-slate-600 text-white">
                                        <User className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Genre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
                                        <SelectItem value="M">Hommes</SelectItem>
                                        <SelectItem value="F">Femmes</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger className="w-[160px] bg-slate-700 border-slate-600 text-white">
                                        <Crown className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Fonction" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes</SelectItem>
                                        <SelectItem value="president">Président</SelectItem>
                                        <SelectItem value="vp">Vice-Président</SelectItem>
                                        <SelectItem value="questeur">Questeur</SelectItem>
                                        <SelectItem value="commission_president">Prés. Commission</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Deputies Grid */}
                    <TabsContent value="deputies" className="mt-0">
                        <div className="grid md:grid-cols-2 gap-4">
                            {filteredDeputies.map(deputy => (
                                <ProfileCard key={deputy.id} person={deputy} type="deputy" />
                            ))}
                        </div>
                        {filteredDeputies.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                Aucun député ne correspond aux critères.
                            </div>
                        )}
                    </TabsContent>

                    {/* Senators Grid */}
                    <TabsContent value="senators" className="mt-0">
                        <div className="grid md:grid-cols-2 gap-4">
                            {filteredSenators.map(senator => (
                                <ProfileCard key={senator.id} person={senator} type="senator" />
                            ))}
                        </div>
                        {filteredSenators.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                Aucun sénateur ne correspond aux critères.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
