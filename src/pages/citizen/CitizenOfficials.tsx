import { useState } from "react";
import {
    Users, MapPin, Mail, Phone, ExternalLink,
    Building2, Landmark, ChevronRight, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUser } from "@/contexts/UserContext";

const CitizenOfficials = () => {
    const { user } = useUser();

    // Mock location data for the connected citizen
    const userLocation = {
        province: "Estuaire",
        constituency: "1er siège, 1er arrondissement de Libreville",
        commune: "Libreville"
    };

    const myRepresentatives = [
        {
            id: 1,
            name: "Hon. Jean-Baptiste MOUSSAVOU",
            role: "Député Titulaire",
            chamber: "AN",
            party: "PDG",
            commission: "Commission des Finances",
            email: "jb.moussavou@assemblee.ga",
            phone: "+241 74 00 12 34",
            image: "",
            isSubstitute: false
        },
        {
            id: 2,
            name: "M. Paul ONDO",
            role: "Député Suppléant",
            chamber: "AN",
            party: "PDG",
            commission: "-",
            email: "p.ondo@assemblee.ga",
            phone: "+241 74 00 12 35",
            image: "",
            isSubstitute: true
        },
        {
            id: 3,
            name: "Vén. Marie-Thérèse OBIANG",
            role: "Sénatrice Titulaire",
            chamber: "Sénat",
            party: "Indépendant",
            commission: "Commission des Affaires Sociales",
            email: "mt.obiang@senat.ga",
            phone: "+241 66 00 56 78",
            image: "",
            isSubstitute: false
        },
        {
            id: 4,
            name: "M. Jacques ESSONO",
            role: "Sénateur Suppléant",
            chamber: "Sénat",
            party: "Indépendant",
            commission: "-",
            email: "j.essono@senat.ga",
            phone: "+241 66 00 56 79",
            image: "",
            isSubstitute: true
        }
    ];

    return (
        <div className="space-y-8 container mx-auto max-w-6xl pb-10">
            {/* Header */}
            <div className="text-center space-y-4 py-8">
                <h1 className="text-3xl font-bold font-serif">Mes Représentants</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Vos élus locaux à l'Assemblée Nationale et au Sénat.
                </p>
            </div>

            {/* User Location Card */}
            <Alert className="bg-[#04CDB9]/10 border-[#04CDB9]/30 text-center flex flex-col items-center justify-center max-w-2xl mx-auto py-6">
                <MapPin className="h-6 w-6 mb-2 text-[#04CDB9]" />
                <AlertTitle className="text-lg font-bold text-[#03A89A} mb-1">Votre Circonscription</AlertTitle>
                <AlertDescription className="text-base text-muted-foreground">
                    {userLocation.constituency} • {userLocation.province}
                </AlertDescription>
            </Alert>

            {/* Representatives Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Deputy Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-[#3A87FD]">
                        <Building2 className="w-6 h-6" />
                        Vos Députés (AN)
                    </h2>
                    <div className="grid gap-4">
                        {myRepresentatives.filter(r => r.chamber === 'AN').map(official => (
                            <OfficialCard key={official.id} official={official} color="#3A87FD" />
                        ))}
                    </div>
                </div>

                {/* Senator Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-[#D19C00]">
                        <Landmark className="w-6 h-6" />
                        Vos Sénateurs (Sénat)
                    </h2>
                    <div className="grid gap-4">
                        {myRepresentatives.filter(r => r.chamber === 'Sénat').map(official => (
                            <OfficialCard key={official.id} official={official} color="#D19C00" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer / Other Actions */}
            <div className="flex justify-center pt-8 border-t border-border/50">
                <Button variant="outline" className="text-muted-foreground">
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher un autre élu (Annuaire global)
                </Button>
            </div>
        </div>
    );
};

const OfficialCard = ({ official, color }: { official: any, color: string }) => {
    return (
        <Card className={`overflow-hidden hover:shadow-md transition-shadow border-l-4 ${official.isSubstitute ? 'opacity-90 scale-95 origin-left bg-muted/20' : ''}`} style={{ borderLeftColor: color }}>
            <CardContent className="p-4 flex gap-4 items-start">
                <Avatar className={`w-16 h-16 border-2 shadow-sm ${official.isSubstitute ? 'w-12 h-12' : ''}`} style={{ borderColor: color }}>
                    <AvatarImage src={official.image} />
                    <AvatarFallback className="font-bold text-muted-foreground">
                        {official.name.split(' ').slice(1).map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className={`font-bold ${official.isSubstitute ? 'text-base' : 'text-lg'}`}>{official.name}</h3>
                            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: color }}>{official.role}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] h-5">{official.party}</Badge>
                    </div>

                    {!official.isSubstitute && (
                        <p className="text-xs text-muted-foreground">{official.commission}</p>
                    )}

                    <div className="flex gap-2 pt-2 mt-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <Mail className="w-3 h-3 mr-1" />
                            Message
                        </Button>
                        {!official.isSubstitute && (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                <Phone className="w-3 h-3 mr-1" />
                                Appel
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs ml-auto">
                            Profil <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CitizenOfficials;
