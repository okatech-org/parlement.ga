import { useState, useMemo } from "react";
import {
    Landmark, Users, Crown, PlayCircle, Monitor, Building,
    CheckCircle, LogIn, Briefcase, UserCircle, Scale, UserCheck,
    FileText, ChevronDown, ChevronUp, MapPin, Search, Sparkles, UserPlus
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
import { SENATORS_DATA, SENATOR_MOCK_USERS, SenatorData } from "@/data/senators";

/**
 * Page de démonstration du Sénat
 * Logique modulaire : Tout membre du Bureau est d'abord un Sénateur
 * avec des capacités additionnelles selon son rôle
 * 
 * Composition 5e République: 1 Président + 5 VP + 2 Questeurs + 5 Secrétaires
 * Sénat: 64+ membres élus par suffrage indirect
 */
const SenateDemo = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedProvinces, setExpandedProvinces] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState("bureau");

    // Bureau members data - 6ème Législature (2025)
    // Présidente: Huguette Yvonne NYANA EKOUME (succède à Paulette Missambo de la transition)
    const BUREAU_MEMBERS = {
        president: {
            phone: '11111111',
            name: 'Huguette Yvonne NYANA EKOUME Ep. AWORI',
            label: 'Présidente du Sénat',
            province: 'Ogooué-Ivindo',
            circonscription: 'Makokou',
            path: '/senat/espace/president',
            color: 'bg-gradient-to-br from-[#D19C00] to-[#B18B00]',
            textColor: 'text-white',
            parti: 'U.D.B',
        },
        vicePresidents: [
            { phone: '12121211', name: 'MABIALA Serge Maurice', label: '1er Vice-Président', province: 'Ngounié', circonscription: 'Mouila', path: '/senat/espace/vp', parti: 'U.D.B' },
            { phone: '12121212', name: 'BIYOGHE MBA Paul', label: '2ème Vice-Président', province: 'Estuaire', circonscription: 'Ntoum 2ème/3ème', path: '/senat/espace/vp', parti: 'U.D.B' },
            { phone: '12121213', name: 'FOUEFOUE Élodie Diane Ep. SANDJOH', label: '3ème Vice-Présidente', province: 'Haut-Ogooué', circonscription: 'Franceville 3ème/4ème', path: '/senat/espace/vp', parti: 'U.D.B' },
            { phone: '12121214', name: 'REVANGUE Madeleine Sidonie', label: '4ème Vice-Présidente', province: 'Moyen-Ogooué', circonscription: 'Lambaréné', path: '/senat/espace/vp', parti: 'U.D.B' },
            { phone: '12121215', name: 'ONA ESSANGUI Marc', label: '5ème Vice-Président', province: 'Woleu-Ntem', circonscription: 'Woleu', path: '/senat/espace/vp', parti: 'U.D.B' },
        ],
        questeurs: [
            { phone: '14141411', name: 'OWONO NGUEMA Jean Christophe', label: '1er Questeur', province: 'Woleu-Ntem', circonscription: 'Oyem', path: '/senat/espace/questeur', parti: 'U.D.B' },
            { phone: '14141412', name: 'MAGHOUMBOU Liliane Anette Ep. NDJAMI', label: '2ème Questeur', province: 'Nyanga', circonscription: 'Tchibanga', path: '/senat/espace/questeur', parti: 'U.D.B' },
        ],
        secretaires: [
            { phone: '15151511', name: 'NGOUBOU Etienne Dieudonné', label: '1er Secrétaire', province: 'Nyanga', circonscription: 'Basse-Banio / Mayumba', path: '/senat/espace/secretary', parti: 'U.D.B' },
            { phone: '15151512', name: 'MPAGA Georges', label: '2ème Secrétaire', province: 'Ogooué-Maritime', circonscription: 'Etimboué / Omboué', path: '/senat/espace/secretary', parti: 'U.D.B' },
            { phone: '15151513', name: 'Secrétaire 3', label: '3ème Secrétaire', province: 'Non identifié', circonscription: 'Non identifié', path: '/senat/espace/secretary', parti: 'U.D.B' },
            { phone: '15151514', name: 'Secrétaire 4', label: '4ème Secrétaire', province: 'Non identifié', circonscription: 'Non identifié', path: '/senat/espace/secretary', parti: 'U.D.B' },
            { phone: '15151515', name: 'Secrétaire 5', label: '5ème Secrétaire', province: 'Non identifié', circonscription: 'Non identifié', path: '/senat/espace/secretary', parti: 'U.D.B' },
        ],
    };

    // Group senators by province
    const senatorsByProvince = useMemo(() => {
        const grouped: Record<string, SenatorData[]> = {};
        SENATORS_DATA.forEach(senator => {
            if (!grouped[senator.province]) {
                grouped[senator.province] = [];
            }
            grouped[senator.province].push(senator);
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
        'Woleu-Ntem': 'from-[#D19C00]/10 to-amber-500/5 border-[#D19C00]/20',
    };

    // Filter senators by search query
    const filteredSenators = useMemo(() => {
        if (!searchQuery.trim()) return senatorsByProvince;

        const query = searchQuery.toLowerCase();
        const filtered: Record<string, SenatorData[]> = {};

        Object.entries(senatorsByProvince).forEach(([province, senators]) => {
            const matchingSenators = senators.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.circonscription.toLowerCase().includes(query) ||
                s.substitute.name.toLowerCase().includes(query) ||
                s.parti.toLowerCase().includes(query) ||
                province.toLowerCase().includes(query)
            );
            if (matchingSenators.length > 0) {
                filtered[province] = matchingSenators;
            }
        });

        return filtered;
    }, [senatorsByProvince, searchQuery]);

    // Generate phone number for a senator
    const getSenatorPhone = (senatorId: string): string => {
        const senator = SENATORS_DATA.find(s => s.id === senatorId);
        if (!senator) return '';

        for (const [phone, data] of Object.entries(SENATOR_MOCK_USERS)) {
            if (data.name === senator.name) {
                return phone;
            }
        }
        return '';
    };

    // Get substitute phone from senator
    const getSubstitutePhone = (senatorId: string): string => {
        const senator = SENATORS_DATA.find(s => s.id === senatorId);
        if (!senator) return '';

        for (const [phone, data] of Object.entries(SENATOR_MOCK_USERS)) {
            if (data.name === senator.substitute.name) {
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
        setExpandedProvinces(Object.keys(senatorsByProvince));
    };

    const collapseAllProvinces = () => {
        setExpandedProvinces([]);
    };

    const handleDemoLogin = (phone: string | null, redirectPath: string) => {
        if (!phone) {
            navigate(redirectPath);
            return;
        }

        const mockUsers: Record<string, { name: string; roles: string[]; province?: string; circonscription?: string; bureauLabel?: string; origine?: string }> = {
            // Présidente du Sénat - 6ème Législature
            '11111111': { name: 'Huguette Yvonne NYANA EKOUME Ep. AWORI', roles: ['president_senate', 'senator', 'citizen'], province: 'Ogooué-Ivindo', circonscription: 'Makokou', bureauLabel: 'Présidente du Sénat', origine: 'partis' },
            // 5 Vice-Présidents
            '12121211': { name: 'MABIALA Serge Maurice', roles: ['vp_senate', 'senator', 'citizen'], province: 'Ngounié', circonscription: 'Mouila', bureauLabel: '1er Vice-Président', origine: 'partis' },
            '12121212': { name: 'BIYOGHE MBA Paul', roles: ['vp_senate', 'senator', 'citizen'], province: 'Estuaire', circonscription: 'Ntoum 2ème/3ème', bureauLabel: '2ème Vice-Président', origine: 'partis' },
            '12121213': { name: 'FOUEFOUE Élodie Diane Ep. SANDJOH', roles: ['vp_senate', 'senator', 'citizen'], province: 'Haut-Ogooué', circonscription: 'Franceville 3ème/4ème', bureauLabel: '3ème Vice-Présidente', origine: 'partis' },
            '12121214': { name: 'REVANGUE Madeleine Sidonie', roles: ['vp_senate', 'senator', 'citizen'], province: 'Moyen-Ogooué', circonscription: 'Lambaréné', bureauLabel: '4ème Vice-Présidente', origine: 'partis' },
            '12121215': { name: 'ONA ESSANGUI Marc', roles: ['vp_senate', 'senator', 'citizen'], province: 'Woleu-Ntem', circonscription: 'Woleu', bureauLabel: '5ème Vice-Président', origine: 'partis' },
            // 2 Questeurs
            '14141411': { name: 'OWONO NGUEMA Jean Christophe', roles: ['questeur_senate', 'senator', 'citizen'], province: 'Woleu-Ntem', circonscription: 'Oyem', bureauLabel: '1er Questeur', origine: 'partis' },
            '14141412': { name: 'MAGHOUMBOU Liliane Anette Ep. NDJAMI', roles: ['questeur_senate', 'senator', 'citizen'], province: 'Nyanga', circonscription: 'Tchibanga', bureauLabel: '2ème Questeur', origine: 'partis' },
            // 5 Secrétaires (2 identifiés + 3 à confirmer)
            '15151511': { name: 'NGOUBOU Etienne Dieudonné', roles: ['secretary_senate', 'senator', 'citizen'], province: 'Nyanga', circonscription: 'Basse-Banio / Mayumba', bureauLabel: '1er Secrétaire', origine: 'partis' },
            '15151512': { name: 'MPAGA Georges', roles: ['secretary_senate', 'senator', 'citizen'], province: 'Ogooué-Maritime', circonscription: 'Etimboué / Omboué', bureauLabel: '2ème Secrétaire', origine: 'partis' },
            '15151513': { name: 'Secrétaire 3', roles: ['secretary_senate', 'senator', 'citizen'], province: 'Non identifié', bureauLabel: '3ème Secrétaire', origine: 'partis' },
            '15151514': { name: 'Secrétaire 4', roles: ['secretary_senate', 'senator', 'citizen'], province: 'Non identifié', bureauLabel: '4ème Secrétaire', origine: 'partis' },
            '15151515': { name: 'Secrétaire 5', roles: ['secretary_senate', 'senator', 'citizen'], province: 'Non identifié', bureauLabel: '5ème Secrétaire', origine: 'partis' },
            // Compte Citoyen (utilisateur externe)
            '01000002': { name: 'Marie-Claire Mbeng', roles: ['citizen'], province: 'Estuaire', circonscription: 'Libreville', bureauLabel: 'Citoyen' },
            // All senators and substitutes
            ...SENATOR_MOCK_USERS,
        };

        const userData = mockUsers[phone] || { name: 'Sénateur Démo', roles: ['senator', 'citizen'], province: 'Estuaire', bureauLabel: 'Sénateur' };
        const user = {
            id: phone,
            name: userData.name,
            phoneNumber: phone,
            roles: userData.roles,
            province: userData.province,
            circonscription: userData.circonscription,
            bureauLabel: userData.bureauLabel,
            origine: userData.origine,
        };

        sessionStorage.setItem('user_data', JSON.stringify(user));
        sessionStorage.setItem('current_role', userData.roles[0]);
        sessionStorage.setItem('is_demo', 'true');
        sessionStorage.setItem('auth_origin', '/senat');

        toast.success("Connexion démo réussie !");
        window.location.href = redirectPath;
    };

    // Render a senator card with their substitute
    const SenatorCard = ({ senator }: { senator: SenatorData }) => {
        const senatorPhone = getSenatorPhone(senator.id);
        const substitutePhone = getSubstitutePhone(senator.id);

        return (
            <Card className="hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardContent className="p-0">
                    {/* Senator section */}
                    <div
                        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b"
                        onClick={() => senatorPhone && handleDemoLogin(senatorPhone, '/senat/espace/senateur')}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#D19C00]/10 flex items-center justify-center shrink-0">
                                <Users className="w-5 h-5 text-[#D19C00]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-sm truncate">{senator.name}</h4>
                                    <Badge variant="outline" className="text-[10px] shrink-0">
                                        {senator.gender === 'M' ? 'H' : 'F'}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{senator.circonscription}</p>
                                <Badge className="mt-1 text-[10px] bg-[#D19C00]/10 text-amber-700 hover:bg-[#D19C00]/20">
                                    {senator.parti}
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
                        onClick={() => substitutePhone && handleDemoLogin(substitutePhone, '/senat/espace/suppleant')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0">
                                <UserCheck className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Suppléant:</span>
                                    <span className="text-xs font-medium truncate">{senator.substitute.name}</span>
                                    {senator.substitute.gender !== '?' && (
                                        <Badge variant="outline" className="text-[10px]">
                                            {senator.substitute.gender === 'M' ? 'H' : 'F'}
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
                institution="SENATE"
                pageTitle="Mode Démonstration"
                pageSubtitle="Explorez les fonctionnalités du Sénat"
                pageIcon={PlayCircle}
            />

            {/* Hero Section */}
            <section className="py-8 bg-gradient-to-br from-[#D19C00]/5 to-amber-500/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-[#D19C00]/10 text-[#D19C00] border-[#D19C00]/20">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {SENATORS_DATA.length} Sénateurs • {SENATORS_DATA.length} Suppléants
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                        Espace Démo - Sénat
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                        Connectez-vous en tant que membre du Bureau ou sénateur pour tester les fonctionnalités
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
                        <TabsTrigger value="senateurs" className="gap-2">
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">Sénateurs</span>
                        </TabsTrigger>
                        <TabsTrigger value="citoyen" className="gap-2">
                            <UserPlus className="w-4 h-4" />
                            <span className="hidden sm:inline">Citoyen</span>
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
                                        <p className="text-sm text-white/60">{BUREAU_MEMBERS.president.circonscription} - {BUREAU_MEMBERS.president.province}</p>
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
                                <Crown className="w-5 h-5 text-[#D19C00]" />
                                Vice-Présidents ({BUREAU_MEMBERS.vicePresidents.length})
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {BUREAU_MEMBERS.vicePresidents.map((vp, index) => (
                                    <Card
                                        key={vp.phone}
                                        className="cursor-pointer hover:shadow-md hover:border-[#D19C00]/50 transition-all"
                                        onClick={() => handleDemoLogin(vp.phone, vp.path)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#D19C00]/10 flex items-center justify-center shrink-0 text-[#D19C00] font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm truncate">{vp.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{vp.label}</p>
                                                    <p className="text-xs text-muted-foreground">{vp.province}</p>
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
                                                    <p className="text-xs text-muted-foreground">{q.province}</p>
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
                                <FileText className="w-5 h-5 text-orange-500" />
                                Secrétaires ({BUREAU_MEMBERS.secretaires.length})
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {BUREAU_MEMBERS.secretaires.map((s, index) => (
                                    <Card
                                        key={s.phone}
                                        className="cursor-pointer hover:shadow-md hover:border-orange-500/50 transition-all"
                                        onClick={() => handleDemoLogin(s.phone, s.path)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 text-[#D19C00] font-bold">
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

                    {/* Sénateurs Tab */}
                    <TabsContent value="senateurs" className="space-y-4">
                        {/* Search and Controls */}
                        <Card className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Rechercher un sénateur, suppléant, circonscription, province..."
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
                                    {Object.values(filteredSenators).flat().length} sénateurs trouvés
                                </p>
                            </CardContent>
                        </Card>

                        {/* Provinces Accordions */}
                        <div className="space-y-3">
                            {Object.entries(filteredSenators).map(([province, senators]) => (
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
                                                            <CardDescription>{senators.length} sénateur{senators.length > 1 ? 's' : ''}</CardDescription>
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
                                                    {senators.map(senator => (
                                                        <SenatorCard key={senator.id} senator={senator} />
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>
                            ))}
                        </div>

                        {Object.keys(filteredSenators).length === 0 && (
                            <Card className="p-12 text-center">
                                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                            </Card>
                        )}
                    </TabsContent>

                    {/* Citoyen Tab */}
                    <TabsContent value="citoyen" className="space-y-4">
                        <Card className="border-[#D19C00]/20 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#D19C00] to-[#B18B00] p-6 text-white">
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
                                            <FileText className="w-4 h-4 text-[#D19C00]" />
                                            Suivre les textes
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Recevez des notifications sur les projets de loi qui vous intéressent
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/50">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-[#D19C00]" />
                                            Contacter votre sénateur
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
                                        className="bg-gradient-to-r from-[#D19C00] to-[#B18B00]"
                                        onClick={() => handleDemoLogin('01000002', '/espace/citoyen')}
                                    >
                                        <LogIn className="w-5 h-5 mr-2" />
                                        Connexion Citoyen Démo
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Compte démo: Marie-Claire Mbeng (Tel: 01000002)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>


                </Tabs>
            </div>
        </div>
    );
};

export default SenateDemo;
