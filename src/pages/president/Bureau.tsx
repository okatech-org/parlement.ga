import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertCircle, Mail, Phone, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Types
interface BureauMember {
    id: string;
    role: string;
    name: string;
    party: string;
    email: string;
    phone: string;
    image?: string;
    gender?: "male" | "female";
}

// Detect gender from name patterns
const detectGender = (name: string): "male" | "female" => {
    const femininePatterns = [
        /^marie/i, /^paulette/i, /^parfaite/i, /^adèle/i, /^sylène/i,
        /^huguette/i, /^nadine/i, /^murielle/i, /^christiane/i, /^eva/i, /^ismaëla/i,
        /ette$/i, /ine$/i, /elle$/i
    ];
    const nameLower = name.toLowerCase();
    if (femininePatterns.some(pattern => pattern.test(nameLower))) {
        return "female";
    }
    return "male";
};

// Bureau members data
const BUREAU_MEMBERS: BureauMember[] = [
    // Présidence
    { id: "1", role: "Président", name: "Michel Régis ONANGA MAMADOU NDIAYE", party: "UDB", email: "president@assemblee.ga", phone: "+241 01 01 01 01", gender: "male" },
    // Vice-Présidents
    { id: "2", role: "1er Vice-Président", name: "Eloi NZONDO", party: "UDB", email: "vp1@assemblee.ga", phone: "+241 02 02 02 02", gender: "male" },
    { id: "3", role: "2ème Vice-Président", name: "Jeannot KALIMA", party: "PDG", email: "vp2@assemblee.ga", phone: "+241 03 03 03 03", gender: "male" },
    { id: "4", role: "3ème Vice-Président", name: "Marie Paulette Parfaite AMOUYEME OLLAME ép DIVASSA", party: "UDB", email: "vp3@assemblee.ga", phone: "+241 04 04 04 04", gender: "female" },
    { id: "5", role: "4ème Vice-Président", name: "Roland MATSIENDI", party: "UDB", email: "vp4@assemblee.ga", phone: "+241 05 05 05 05", gender: "male" },
    { id: "6", role: "5ème Vice-Président", name: "Adèle Sylène BINDANG ONDZIGUI ép MINTOGO", party: "UDB", email: "vp5@assemblee.ga", phone: "+241 06 06 06 06", gender: "female" },
    { id: "7", role: "6ème Vice-Président", name: "Huguette TSONO", party: "UDB", email: "vp6@assemblee.ga", phone: "+241 07 07 07 07", gender: "female" },
    // Questeurs
    { id: "8", role: "1er Questeur", name: "Mesmin Boris NGABIKOUMOU WADA", party: "UDB", email: "questeur1@assemblee.ga", phone: "+241 08 08 08 08", gender: "male" },
    { id: "9", role: "2ème Questeur", name: "Nadine Murielle OGOULA", party: "UDB", email: "questeur2@assemblee.ga", phone: "+241 09 09 09 09", gender: "female" },
    // Secrétaires
    { id: "10", role: "1er Secrétaire", name: "Alban Stéphane OSSINGA ONANGA", party: "UDB", email: "sec1@assemblee.ga", phone: "+241 10 10 10 10", gender: "male" },
    { id: "11", role: "2ème Secrétaire", name: "Faustin BILIE BI ESSONE", party: "Force Patriotique", email: "sec2@assemblee.ga", phone: "+241 11 11 11 11", gender: "male" },
    { id: "12", role: "3ème Secrétaire", name: "Christiane NZIENGUI", party: "UDB", email: "sec3@assemblee.ga", phone: "+241 12 12 12 12", gender: "female" },
    { id: "13", role: "4ème Secrétaire", name: "Eva Léopold Aimé", party: "Force Patriotique", email: "sec4@assemblee.ga", phone: "+241 13 13 13 13", gender: "female" },
    { id: "14", role: "5ème Secrétaire", name: "Alexandre Gilbert AWASSI", party: "UDB", email: "sec5@assemblee.ga", phone: "+241 14 14 14 14", gender: "male" },
    { id: "15", role: "6ème Secrétaire", name: "Ismaëla MPIRA ép OURA", party: "UDB", email: "sec6@assemblee.ga", phone: "+241 15 15 15 15", gender: "female" },
];

const Bureau = () => {
    const { t } = useLanguage();
    const [members, setMembers] = useState<BureauMember[]>(BUREAU_MEMBERS);
    const [loading, setLoading] = useState(false);
    const [generatingPortrait, setGeneratingPortrait] = useState<string | null>(null);

    const handleContact = (member: BureauMember, type: 'email' | 'phone') => {
        toast.success(`Contact ${type === 'email' ? 'Email' : 'Téléphonique'} initié avec ${member.name}`);
    };

    const generatePortrait = async (member: BureauMember) => {
        setGeneratingPortrait(member.id);
        try {
            const { data, error } = await supabase.functions.invoke('generate-portrait', {
                body: {
                    name: member.name,
                    role: member.role,
                    gender: member.gender || detectGender(member.name)
                }
            });

            if (error) throw error;

            if (data?.imageUrl) {
                setMembers(prev => prev.map(m => 
                    m.id === member.id ? { ...m, image: data.imageUrl } : m
                ));
                toast.success(`Portrait généré pour ${member.name}`);
            }
        } catch (error) {
            console.error('Error generating portrait:', error);
            toast.error("Erreur lors de la génération du portrait");
        } finally {
            setGeneratingPortrait(null);
        }
    };

    const generateAllPortraits = async () => {
        setLoading(true);
        for (const member of members.filter(m => !m.image)) {
            await generatePortrait(member);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        setLoading(false);
    };

    const getRoleBadgeColor = (role: string) => {
        if (role.includes("Président") && !role.includes("Vice")) return "bg-primary text-primary-foreground";
        if (role.includes("Vice")) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
        if (role.includes("Questeur")) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
        return "bg-muted text-muted-foreground";
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">{t('president.sidebar.bureau')}</h1>
                    <p className="text-muted-foreground">Composition du Bureau de l'Assemblée Nationale de la Transition</p>
                </div>
                <Button 
                    onClick={generateAllPortraits} 
                    variant="outline" 
                    disabled={loading}
                    className="gap-2"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                    Générer les portraits IA
                </Button>
            </div>

            {/* President Card - Featured */}
            {members.filter(m => m.role === "Président").map((member) => (
                <Card key={member.id} className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            {member.image ? (
                                <img 
                                    src={member.image} 
                                    alt={member.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold">
                                    {member.name.charAt(0)}
                                </div>
                            )}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background shadow-md"
                                onClick={() => generatePortrait(member)}
                                disabled={generatingPortrait === member.id}
                            >
                                {generatingPortrait === member.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                            <h2 className="text-2xl font-bold mt-2">{member.name}</h2>
                            <p className="text-muted-foreground">{member.party}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleContact(member, 'email')}>
                                <Mail className="w-4 h-4 mr-2" /> Email
                            </Button>
                            <Button variant="outline" onClick={() => handleContact(member, 'phone')}>
                                <Phone className="w-4 h-4 mr-2" /> Appeler
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}

            {/* Vice-Presidents Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Vice-Présidents</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.filter(m => m.role.includes("Vice")).map((member) => (
                        <Card key={member.id} className="p-4 hover:shadow-lg transition-all duration-300 border-border/50 group">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {member.image ? (
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 text-xl font-bold">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => generatePortrait(member)}
                                        disabled={generatingPortrait === member.id}
                                    >
                                        {generatingPortrait === member.id ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                    </Button>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Badge variant="outline" className={getRoleBadgeColor(member.role) + " text-xs"}>
                                        {member.role}
                                    </Badge>
                                    <h3 className="font-semibold text-sm leading-tight mt-1 truncate">{member.name}</h3>
                                    <p className="text-xs text-muted-foreground">{member.party}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Questeurs Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Questeurs</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {members.filter(m => m.role.includes("Questeur")).map((member) => (
                        <Card key={member.id} className="p-4 hover:shadow-lg transition-all duration-300 border-border/50 group">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {member.image ? (
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 text-xl font-bold">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => generatePortrait(member)}
                                        disabled={generatingPortrait === member.id}
                                    >
                                        {generatingPortrait === member.id ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                    </Button>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Badge variant="outline" className={getRoleBadgeColor(member.role) + " text-xs"}>
                                        {member.role}
                                    </Badge>
                                    <h3 className="font-semibold text-sm leading-tight mt-1 truncate">{member.name}</h3>
                                    <p className="text-xs text-muted-foreground">{member.party}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Secretaires Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-foreground">Secrétaires</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.filter(m => m.role.includes("Secrétaire")).map((member) => (
                        <Card key={member.id} className="p-4 hover:shadow-lg transition-all duration-300 border-border/50 group">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {member.image ? (
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-lg font-bold">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => generatePortrait(member)}
                                        disabled={generatingPortrait === member.id}
                                    >
                                        {generatingPortrait === member.id ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                    </Button>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Badge variant="outline" className="text-xs">
                                        {member.role}
                                    </Badge>
                                    <h3 className="font-semibold text-sm leading-tight mt-1 truncate">{member.name}</h3>
                                    <p className="text-xs text-muted-foreground">{member.party}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bureau;
