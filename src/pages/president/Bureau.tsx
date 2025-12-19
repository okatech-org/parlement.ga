import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertCircle, User, Mail, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Types
interface BureauMember {
    id: string;
    role: string;
    name: string;
    party: string;
    email: string;
    phone: string;
    image?: string;
}

// Mock Data Service
const fetchBureauMembers = async (): Promise<BureauMember[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.05) {
                reject(new Error("Erreur lors du chargement des membres."));
            } else {
                resolve([
                    // Présidence
                    { id: "1", role: "Président", name: "Michel Régis ONANGA MAMADOU NDIAYE", party: "UDB", email: "president@assemblee.ga", phone: "+241 01 01 01 01" },
                    // Vice-Présidents
                    { id: "2", role: "1er Vice-Président", name: "Eloi NZONDO", party: "UDB", email: "vp1@assemblee.ga", phone: "+241 02 02 02 02" },
                    { id: "3", role: "2ème Vice-Président", name: "Jeannot KALIMA", party: "PDG", email: "vp2@assemblee.ga", phone: "+241 03 03 03 03" },
                    { id: "4", role: "3ème Vice-Président", name: "Marie Paulette Parfaite AMOUYEME OLLAME ép DIVASSA", party: "UDB", email: "vp3@assemblee.ga", phone: "+241 04 04 04 04" },
                    { id: "5", role: "4ème Vice-Président", name: "Roland MATSIENDI", party: "UDB", email: "vp4@assemblee.ga", phone: "+241 05 05 05 05" },
                    { id: "6", role: "5ème Vice-Président", name: "Adèle Sylène BINDANG ONDZIGUI ép MINTOGO", party: "UDB", email: "vp5@assemblee.ga", phone: "+241 06 06 06 06" },
                    { id: "7", role: "6ème Vice-Président", name: "Huguette TSONO", party: "UDB", email: "vp6@assemblee.ga", phone: "+241 07 07 07 07" },
                    // Questeurs
                    { id: "8", role: "1er Questeur", name: "Mesmin Boris NGABIKOUMOU WADA", party: "UDB", email: "questeur1@assemblee.ga", phone: "+241 08 08 08 08" },
                    { id: "9", role: "2ème Questeur", name: "Nadine Murielle OGOULA", party: "UDB", email: "questeur2@assemblee.ga", phone: "+241 09 09 09 09" },
                    // Secrétaires
                    { id: "10", role: "1er Secrétaire", name: "Alban Stéphane OSSINGA ONANGA", party: "UDB", email: "sec1@assemblee.ga", phone: "+241 10 10 10 10" },
                    { id: "11", role: "2ème Secrétaire", name: "Faustin BILIE BI ESSONE", party: "Force Patriotique", email: "sec2@assemblee.ga", phone: "+241 11 11 11 11" },
                    { id: "12", role: "3ème Secrétaire", name: "Christiane NZIENGUI", party: "UDB", email: "sec3@assemblee.ga", phone: "+241 12 12 12 12" },
                    { id: "13", role: "4ème Secrétaire", name: "Eva Léopold Aimé", party: "Force Patriotique", email: "sec4@assemblee.ga", phone: "+241 13 13 13 13" },
                    { id: "14", role: "5ème Secrétaire", name: "Alexandre Gilbert AWASSI", party: "UDB", email: "sec5@assemblee.ga", phone: "+241 14 14 14 14" },
                    { id: "15", role: "6ème Secrétaire", name: "Ismaëla MPIRA ép OURA", party: "UDB", email: "sec6@assemblee.ga", phone: "+241 15 15 15 15" },
                ]);
            }
        }, 1000);
    });
};

const Bureau = () => {
    const { t } = useLanguage();
    const [members, setMembers] = useState<BureauMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadMembers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchBureauMembers();
            setMembers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            toast.error("Impossible de charger les membres du bureau");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const handleContact = (member: BureauMember, type: 'email' | 'phone') => {
        toast.success(`Contact ${type === 'email' ? 'Email' : 'Téléphonique'} initié avec ${member.name}`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">{t('president.sidebar.bureau')}</h1>
                    <p className="text-muted-foreground">Composition et gestion du Bureau de l'Assemblée Nationale.</p>
                </div>
                <Button onClick={loadMembers} variant="outline" disabled={loading} size="icon">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="flex flex-col justify-center items-center h-64 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-lg font-medium text-red-500">{error}</p>
                    <Button onClick={loadMembers} variant="outline">Réessayer</Button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <Card key={member.id} className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 group">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2 border-primary/20 text-primary bg-primary/5">
                                        {member.role}
                                    </Badge>
                                    <h3 className="font-bold text-lg leading-tight">{member.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{member.party}</p>
                                </div>

                                <div className="w-full pt-4 border-t border-border/50 flex gap-2">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 hover:bg-primary/5 hover:text-primary"
                                        onClick={() => handleContact(member, 'email')}
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 hover:bg-primary/5 hover:text-primary"
                                        onClick={() => handleContact(member, 'phone')}
                                    >
                                        <Phone className="w-4 h-4 mr-2" />
                                        Appeler
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bureau;
