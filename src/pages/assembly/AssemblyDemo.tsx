import { useState, useMemo } from "react";
import {
    Landmark, Users, Crown, PlayCircle, Monitor, Building,
    CheckCircle, LogIn, Briefcase, UserCircle, Scale, UserCheck,
    Gavel, FileText, Calendar, Vote, ChevronDown, ChevronUp,
    MapPin, Search, Filter, User, Sparkles, UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEPUTIES_DATA, DEPUTY_MOCK_USERS, DeputyData } from "@/data/deputies";

/**
 * Page de démonstration de l'Assemblée Nationale
 * Logique modulaire : Tout membre du Bureau est d'abord un Député
 * avec des capacités additionnelles selon son rôle
 */
const AssemblyDemo = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedProvinces, setExpandedProvinces] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState("bureau");

    // Bureau members data
    const BUREAU_MEMBERS = {
        president: {
            phone: '01010101',
            name: 'Michel Régis Onanga Ndiaye',
            label: "Président de l'Assemblée Nationale",
            circonscription: 'Estuaire - Libreville 1ère',
            path: '/president',
            color: 'bg-gradient-to-br from-[#3A87FD] to-[#2A77ED]',
            textColor: 'text-white',
        },
        vicePresidents: [
            { phone: '02020201', name: 'Eloi Nzondo', label: '1er Vice-Président', parti: 'U.D.B', circonscription: 'Estuaire - Libreville', path: '/vp' },
            { phone: '02020202', name: 'Jeannot Kalima', label: '2ème Vice-Président', parti: 'P.D.G', circonscription: 'Haut-Ogooué - Lékabi-Lewolo', path: '/vp' },
            { phone: '02020203', name: 'Marie Paulette Parfaite Amouyeme Ollame épouse Divassa', label: '3ème Vice-Présidente', parti: 'U.D.B', circonscription: 'Ogooué-Maritime', path: '/vp' },
            { phone: '02020204', name: 'Roland Matsiendi', label: '4ème Vice-Président', parti: 'U.D.B', circonscription: 'Ngounié - Mougalaba', path: '/vp' },
            { phone: '02020205', name: 'Adèle Sylène Bindang Ondzigui épouse Mintogo', label: '5ème Vice-Présidente', parti: 'U.D.B', circonscription: 'Woleu-Ntem', path: '/vp' },
            { phone: '02020206', name: 'Huguette Tsono', label: '6ème Vice-Présidente', parti: 'U.D.B', circonscription: 'Haut-Ogooué', path: '/vp' },
        ],
        questeurs: [
            { phone: '04040401', name: 'Jean-Pierre Mboumba', label: '1er Questeur', circonscription: 'Nyanga - Tchibanga', path: '/questeurs' },
            { phone: '04040402', name: 'Solange Nzigou', label: '2ème Questeur', circonscription: 'Ogooué-Lolo - Koulamoutou', path: '/questeurs' },
        ],
        secretaires: [
            { phone: '05050501', name: 'Rose Mintsa', label: '1er Secrétaire', circonscription: 'Haut-Ogooué - Franceville', path: '/secretaires' },
            { phone: '05050502', name: 'Alain Ndoutoume Obiang', label: '2ème Secrétaire', circonscription: 'Estuaire - Ntoum', path: '/secretaires' },
            { phone: '05050503', name: 'Patricia Bongo Ondimba', label: '3ème Secrétaire', circonscription: 'Ogooué-Maritime - Omboué', path: '/secretaires' },
            { phone: '05050504', name: 'Térence Mbouloungou', label: '4ème Secrétaire', circonscription: 'Ngounié - Fougamou', path: '/secretaires' },
            { phone: '05050505', name: 'Claudine Ognane', label: '5ème Secrétaire', circonscription: 'Moyen-Ogooué - Ndjolé', path: '/secretaires' },
        ],
    };

    // Group deputies by province
    const deputiesByProvince = useMemo(() => {
        const grouped: Record<string, DeputyData[]> = {};
        DEPUTIES_DATA.forEach(deputy => {
            if (!grouped[deputy.province]) {
                grouped[deputy.province] = [];
            }
            grouped[deputy.province].push(deputy);
        });
        return grouped;
    }, []);

    // Province colors for visual distinction
    const PROVINCE_COLORS: Record<string, string> = {
        'Estuaire': 'from-blue-500/10 to-blue-500/5 border-blue-500/20',
        'Haut-Ogooué': 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
        'Moyen-Ogooué': 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
        'Ngounié': 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
        'Nyanga': 'from-orange-500/10 to-orange-500/5 border-orange-500/20',
        'Ogooué-Ivindo': 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20',
        'Ogooué-Lolo': 'from-pink-500/10 to-pink-500/5 border-pink-500/20',
        'Ogooué-Maritime': 'from-teal-500/10 to-teal-500/5 border-teal-500/20',
        'Woleu-Ntem': 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
        'Diaspora': 'from-rose-500/10 to-rose-500/5 border-rose-500/20',
    };

    // Filter deputies by search query
    const filteredDeputies = useMemo(() => {
        if (!searchQuery.trim()) return deputiesByProvince;

        const query = searchQuery.toLowerCase();
        const filtered: Record<string, DeputyData[]> = {};

        Object.entries(deputiesByProvince).forEach(([province, deputies]) => {
            const matchingDeputies = deputies.filter(d =>
                d.name.toLowerCase().includes(query) ||
                d.circonscription.toLowerCase().includes(query) ||
                d.substitute.name.toLowerCase().includes(query) ||
                d.parti.toLowerCase().includes(query)
            );
            if (matchingDeputies.length > 0) {
                filtered[province] = matchingDeputies;
            }
        });

        return filtered;
    }, [deputiesByProvince, searchQuery]);

    // Generate phone number for a deputy
    const getDeputyPhone = (deputyId: string): string => {
        // Find the deputy in DEPUTY_MOCK_USERS by matching the name
        const deputy = DEPUTIES_DATA.find(d => d.id === deputyId);
        if (!deputy) return '';

        // Find phone in mock users
        for (const [phone, data] of Object.entries(DEPUTY_MOCK_USERS)) {
            if (data.name === deputy.name) {
                return phone;
            }
        }
        return '';
    };

    // Get substitute phone from deputy phone
    const getSubstitutePhone = (deputyId: string): string => {
        const deputy = DEPUTIES_DATA.find(d => d.id === deputyId);
        if (!deputy) return '';

        // Find substitute in mock users
        for (const [phone, data] of Object.entries(DEPUTY_MOCK_USERS)) {
            if (data.name === deputy.substitute.name) {
                return phone;
            }
        }
        return '';
    };

    const toggleProvince = (province: string) => {
        setExpandedProvinces(prev =>
            prev.includes(province)
                ? prev.filter(p => p !== province)
                : [...prev, province]
        );
    };

    const expandAllProvinces = () => {
        setExpandedProvinces(Object.keys(deputiesByProvince));
    };

    const collapseAllProvinces = () => {
        setExpandedProvinces([]);
    };

    const handleDemoLogin = (phone: string | null, redirectPath: string) => {
        if (!phone) {
            navigate(redirectPath);
            return;
        }

        const mockUsers: Record<string, { name: string; roles: string[]; circonscription?: string; bureauLabel?: string }> = {
            // Président
            '01010101': { name: 'Michel Régis Onanga Ndiaye', roles: ['president', 'deputy', 'citizen'], circonscription: 'Estuaire - Libreville 1ère', bureauLabel: 'Président de l\'Assemblée Nationale' },
            // 6 Vice-Présidents
            '02020201': { name: 'Eloi Nzondo', roles: ['vp', 'deputy', 'citizen'], circonscription: 'Estuaire - Libreville', bureauLabel: '1er Vice-Président' },
            '02020202': { name: 'Jeannot Kalima', roles: ['vp', 'deputy', 'citizen'], circonscription: 'Haut-Ogooué - Lékabi-Lewolo', bureauLabel: '2ème Vice-Président' },
            '02020203': { name: 'Marie Paulette Parfaite Amouyeme Ollame épouse Divassa', roles: ['vp', 'deputy', 'citizen'], circonscription: 'Ogooué-Maritime', bureauLabel: '3ème Vice-Présidente' },
            '02020204': { name: 'Roland Matsiendi', roles: ['vp', 'deputy', 'citizen'], circonscription: 'Ngounié - Mougalaba', bureauLabel: '4ème Vice-Président' },
            '02020205': { name: 'Adèle Sylène Bindang Ondzigui épouse Mintogo', roles: ['vp', 'deputy', 'citizen'], circonscription: 'Woleu-Ntem', bureauLabel: '5ème Vice-Présidente' },
            '02020206': { name: 'Huguette Tsono', roles: ['vp', 'deputy', 'citizen'], circonscription: 'Haut-Ogooué', bureauLabel: '6ème Vice-Présidente' },
            // 2 Questeurs
            '04040401': { name: 'Jean-Pierre Mboumba', roles: ['questeur', 'deputy', 'citizen'], circonscription: 'Nyanga - Tchibanga', bureauLabel: '1er Questeur' },
            '04040402': { name: 'Solange Nzigou', roles: ['questeur', 'deputy', 'citizen'], circonscription: 'Ogooué-Lolo - Koulamoutou', bureauLabel: '2ème Questeur' },
            // 5 Secrétaires
            '05050501': { name: 'Rose Mintsa', roles: ['secretary', 'deputy', 'citizen'], circonscription: 'Haut-Ogooué - Franceville', bureauLabel: '1er Secrétaire' },
            '05050502': { name: 'Alain Ndoutoume Obiang', roles: ['secretary', 'deputy', 'citizen'], circonscription: 'Estuaire - Ntoum', bureauLabel: '2ème Secrétaire' },
            '05050503': { name: 'Patricia Bongo Ondimba', roles: ['secretary', 'deputy', 'citizen'], circonscription: 'Ogooué-Maritime - Omboué', bureauLabel: '3ème Secrétaire' },
            '05050504': { name: 'Térence Mbouloungou', roles: ['secretary', 'deputy', 'citizen'], circonscription: 'Ngounié - Fougamou', bureauLabel: '4ème Secrétaire' },
            '05050505': { name: 'Claudine Ognane', roles: ['secretary', 'deputy', 'citizen'], circonscription: 'Moyen-Ogooué - Ndjolé', bureauLabel: '5ème Secrétaire' },
            // Compte Citoyen (utilisateur externe)
            '01000001': { name: 'Jean-Pierre Moukagni', roles: ['citizen'], circonscription: 'Estuaire - Libreville', bureauLabel: 'Citoyen' },
            // All deputies and substitutes
            ...DEPUTY_MOCK_USERS,
        };

        const userData = mockUsers[phone] || { name: 'Député Démo', roles: ['deputy', 'citizen'], circonscription: 'Estuaire', bureauLabel: 'Député' };
        const user = {
            id: phone,
            name: userData.name,
            phoneNumber: phone,
            roles: userData.roles,
            circonscription: userData.circonscription,
            bureauLabel: userData.bureauLabel,
        };

        sessionStorage.setItem('user_data', JSON.stringify(user));
        sessionStorage.setItem('current_role', userData.roles[0]);
        sessionStorage.setItem('is_demo', 'true');
        sessionStorage.setItem('auth_origin', '/an');

        toast.success("Connexion démo réussie !");
        window.location.href = redirectPath;
    };

    // Render a deputy card with their substitute
    const DeputyCard = ({ deputy }: { deputy: DeputyData }) => {
        const deputyPhone = getDeputyPhone(deputy.id);
        const substitutePhone = getSubstitutePhone(deputy.id);

        return (
            <Card className="hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardContent className="p-0">
                    {/* Deputy section */}
                    <div
                        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b"
                        onClick={() => deputyPhone && handleDemoLogin(deputyPhone, '/vote')}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#3A87FD]/10 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-[#3A87FD]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-sm truncate">{deputy.name}</h4>
                                    <Badge variant="outline" className="text-[10px] shrink-0">
                                        {deputy.gender === 'M' ? 'H' : 'F'}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{deputy.circonscription}</p>
                                <Badge className="mt-1 text-[10px] bg-[#3A87FD]/10 text-green-700 hover:bg-[#3A87FD]/20">
                                    {deputy.parti}
                                </Badge>
                            </div>
                            <Button size="sm" variant="ghost" className="shrink-0 h-8">
                                <LogIn className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Substitute section */}
                    <div
                        className="p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => substitutePhone && handleDemoLogin(substitutePhone, '/suppleant')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0">
                                <UserCheck className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Suppléant:</span>
                                    <span className="text-xs font-medium truncate">{deputy.substitute.name}</span>
                                    {deputy.substitute.gender !== '?' && (
                                        <Badge variant="outline" className="text-[10px]">
                                            {deputy.substitute.gender === 'M' ? 'H' : 'F'}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" className="shrink-0 h-6 px-2">
                                <LogIn className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <InstitutionSubHeader
                institution="AN"
                pageTitle="Mode Démonstration"
                pageSubtitle="Explorez les fonctionnalités de l'Assemblée Nationale"
                pageIcon={PlayCircle}
            />

            {/* Hero Section */}
            <section className="py-8 bg-gradient-to-br from-[#3A87FD]/5 to-green-500/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-[#3A87FD]/10 text-[#3A87FD] border-[#3A87FD]/20">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {DEPUTIES_DATA.length} Députés • {DEPUTIES_DATA.length} Suppléants
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                        Espace Démo - Assemblée Nationale
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                        Connectez-vous en tant que membre du Bureau ou député pour tester les fonctionnalités
                    </p>
                </div>
            </section>

            {/* Main Content with Tabs */}
            <div className="container mx-auto px-4 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:max-w-lg">
                        <TabsTrigger value="bureau" className="gap-2">
                            <Crown className="w-4 h-4" />
                            <span className="hidden sm:inline">Bureau</span>
                        </TabsTrigger>
                        <TabsTrigger value="deputes" className="gap-2">
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">Députés</span>
                        </TabsTrigger>
                        <TabsTrigger value="citoyen" className="gap-2">
                            <UserPlus className="w-4 h-4" />
                            <span className="hidden sm:inline">Citoyen</span>
                        </TabsTrigger>
                        <TabsTrigger value="public" className="gap-2">
                            <Landmark className="w-4 h-4" />
                            <span className="hidden sm:inline">Public</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Bureau Tab */}
                    <TabsContent value="bureau" className="space-y-6">
                        {/* Président */}
                        <Card
                            className={`${BUREAU_MEMBERS.president.color} border-0 cursor-pointer hover:shadow-xl transition-all`}
                            onClick={() => handleDemoLogin(BUREAU_MEMBERS.president.phone, BUREAU_MEMBERS.president.path)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                        <Crown className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1 text-white">
                                        <h3 className="text-xl font-bold">{BUREAU_MEMBERS.president.name}</h3>
                                        <p className="text-white/80">{BUREAU_MEMBERS.president.label}</p>
                                        <p className="text-sm text-white/60">{BUREAU_MEMBERS.president.circonscription}</p>
                                    </div>
                                    <Button variant="secondary" className="shrink-0">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Connexion
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vice-Présidents */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Crown className="w-5 h-5 text-[#3A87FD]" />
                                Vice-Présidents ({BUREAU_MEMBERS.vicePresidents.length})
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {BUREAU_MEMBERS.vicePresidents.map((vp, index) => (
                                    <Card
                                        key={vp.phone}
                                        className="cursor-pointer hover:shadow-md hover:border-[#3A87FD]/50 transition-all"
                                        onClick={() => handleDemoLogin(vp.phone, vp.path)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#3A87FD]/10 flex items-center justify-center shrink-0 text-[#3A87FD] font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm truncate">{vp.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{vp.label}</p>
                                                    <Badge variant="outline" className="mt-1 text-[10px]">{vp.parti}</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Questeurs */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-500" />
                                Questeurs ({BUREAU_MEMBERS.questeurs.length})
                            </h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                {BUREAU_MEMBERS.questeurs.map((q, index) => (
                                    <Card
                                        key={q.phone}
                                        className="cursor-pointer hover:shadow-md hover:border-blue-500/50 transition-all"
                                        onClick={() => handleDemoLogin(q.phone, q.path)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm truncate">{q.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{q.label}</p>
                                                    <p className="text-xs text-muted-foreground">{q.circonscription}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Secrétaires */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-amber-500" />
                                Secrétaires ({BUREAU_MEMBERS.secretaires.length})
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {BUREAU_MEMBERS.secretaires.map((s, index) => (
                                    <Card
                                        key={s.phone}
                                        className="cursor-pointer hover:shadow-md hover:border-amber-500/50 transition-all"
                                        onClick={() => handleDemoLogin(s.phone, s.path)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-600 font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm truncate">{s.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{s.label}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Députés Tab */}
                    <TabsContent value="deputes" className="space-y-4">
                        {/* Search and Controls */}
                        <Card className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Rechercher un député, suppléant, circonscription..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={expandAllProvinces}>
                                            <ChevronDown className="w-4 h-4 mr-1" />
                                            Tout ouvrir
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={collapseAllProvinces}>
                                            <ChevronUp className="w-4 h-4 mr-1" />
                                            Tout fermer
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {Object.values(filteredDeputies).flat().length} députés trouvés
                                </p>
                            </CardContent>
                        </Card>

                        {/* Provinces Accordions */}
                        <div className="space-y-3">
                            {Object.entries(filteredDeputies).map(([province, deputies]) => (
                                <Collapsible
                                    key={province}
                                    open={expandedProvinces.includes(province)}
                                    onOpenChange={() => toggleProvince(province)}
                                >
                                    <Card className={`bg-gradient-to-r ${PROVINCE_COLORS[province] || 'from-gray-500/10 to-gray-500/5 border-gray-500/20'}`}>
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="w-5 h-5 text-muted-foreground" />
                                                        <div>
                                                            <CardTitle className="text-lg">{province}</CardTitle>
                                                            <CardDescription>{deputies.length} député{deputies.length > 1 ? 's' : ''}</CardDescription>
                                                        </div>
                                                    </div>
                                                    {expandedProvinces.includes(province)
                                                        ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                                        : <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                    }
                                                </div>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="pt-0 pb-4">
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {deputies.map(deputy => (
                                                        <DeputyCard key={deputy.id} deputy={deputy} />
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>
                            ))}
                        </div>

                        {Object.keys(filteredDeputies).length === 0 && (
                            <Card className="p-12 text-center">
                                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                                <h3 className="font-semibold text-lg mb-2">Aucun résultat</h3>
                                <p className="text-muted-foreground">
                                    Aucun député ne correspond à votre recherche "{searchQuery}"
                                </p>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Citoyen Tab */}
                    <TabsContent value="citoyen" className="space-y-4">
                        <Card className="border-[#3A87FD]/20 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#3A87FD] to-[#2A77ED] p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                        <UserPlus className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Espace Citoyen</h3>
                                        <p className="text-white/80">Suivez les travaux et participez à la vie démocratique</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-muted/50">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-[#3A87FD]" />
                                            Suivre les textes
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Recevez des notifications sur les projets de loi qui vous intéressent
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/50">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-[#3A87FD]" />
                                            Contacter votre député
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Envoyez un message à votre représentant élu
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Connectez-vous en tant que citoyen pour accéder à votre espace
                                    </p>
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-[#3A87FD] to-[#2A77ED]"
                                        onClick={() => handleDemoLogin('01000001', '/espace/citoyen')}
                                    >
                                        <LogIn className="w-5 h-5 mr-2" />
                                        Connexion Citoyen Démo
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Compte démo: Jean-Pierre Moukagni (Tel: 01000001)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Public Tab */}
                    <TabsContent value="public" className="space-y-4">
                        <Card className="border-[#3A87FD]/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Landmark className="w-5 h-5 text-[#3A87FD]" />
                                    Accès Public
                                </CardTitle>
                                <CardDescription>
                                    Explorez le portail public de l'Assemblée Nationale
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={() => navigate('/an')}
                                >
                                    <Landmark className="w-5 h-5 mr-2" />
                                    Accéder au Portail Public AN
                                </Button>

                                <Separator />

                                <div className="grid sm:grid-cols-2 gap-3">
                                    <Button variant="outline" onClick={() => navigate('/an/actualites')}>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Actualités
                                    </Button>
                                    <Button variant="outline" onClick={() => navigate('/an/processus')}>
                                        <Scale className="w-4 h-4 mr-2" />
                                        Processus Législatif
                                    </Button>
                                    <Button variant="outline" onClick={() => navigate('/an/tutoriels')}>
                                        <Monitor className="w-4 h-4 mr-2" />
                                        Tutoriels
                                    </Button>
                                    <Button variant="outline" onClick={() => navigate('/an/sensibilisation')}>
                                        <Users className="w-4 h-4 mr-2" />
                                        Sensibilisation
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AssemblyDemo;
