import { useState } from "react";
import {
    Users, MapPin, Search, Mail, Phone, ExternalLink,
    ChevronDown, Building2, Landmark
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CitizenOfficials = () => {
    const [province, setProvince] = useState("");
    const [constituency, setConstituency] = useState("");

    const officials = [
        {
            id: 1,
            name: "Hon. Jean-Baptiste MOUSSAVOU",
            role: "Député",
            chamber: "AN",
            province: "Estuaire",
            constituency: "1er siège, 1er arrondissement de Libreville",
            party: "PDG",
            commission: "Commission des Finances",
            email: "jb.moussavou@assemblee.ga",
            phone: "+241 74 00 12 34",
            image: "", // Placeholder
        },
        {
            id: 2,
            name: "Vén. Marie-Thérèse OBIANG",
            role: "Sénatrice",
            chamber: "Sénat",
            province: "Estuaire",
            constituency: "Commune de Libreville",
            party: "Indépendant",
            commission: "Commission des Affaires Sociales",
            email: "mt.obiang@senat.ga",
            phone: "+241 66 00 56 78",
            image: "", // Placeholder
        },
        {
            id: 3,
            name: "Hon. Pierre CLAVER",
            role: "Député",
            chamber: "AN",
            province: "Haut-Ogooué",
            constituency: "2ème siège, Franceville",
            party: "Les Démocrates",
            commission: "Commission des Lois",
            email: "p.claver@assemblee.ga",
            phone: "+241 77 11 22 33",
            image: "",
        }
    ];

    // Simple filter logic
    const filteredOfficials = officials.filter(official => {
        const matchProvince = province && province !== 'all' ? official.province === province : true;
        return matchProvince;
    });

    return (
        <div className="space-y-8 container mx-auto max-w-6xl pb-10">
            {/* Header */}
            <div className="text-center space-y-4 py-8">
                <h1 className="text-3xl font-bold font-serif">Trouver mes élus</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Identifiez vos représentants à l'Assemblée Nationale et au Sénat pour suivre leur activité et les contacter.
                </p>
            </div>

            {/* Search Bar */}
            <Card className="max-w-4xl mx-auto border-[#04CDB9]/20 shadow-lg">
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Province</label>
                            <Select onValueChange={setProvince}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une province" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les provinces</SelectItem>
                                    <SelectItem value="Estuaire">Estuaire</SelectItem>
                                    <SelectItem value="Haut-Ogooué">Haut-Ogooué</SelectItem>
                                    <SelectItem value="Moyen-Ogooué">Moyen-Ogooué</SelectItem>
                                    <SelectItem value="Ngounié">Ngounié</SelectItem>
                                    <SelectItem value="Nyanga">Nyanga</SelectItem>
                                    <SelectItem value="Ogooué-Ivindo">Ogooué-Ivindo</SelectItem>
                                    <SelectItem value="Ogooué-Lolo">Ogooué-Lolo</SelectItem>
                                    <SelectItem value="Ogooué-Maritime">Ogooué-Maritime</SelectItem>
                                    <SelectItem value="Woleu-Ntem">Woleu-Ntem</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Siège / Circonscription</label>
                            <Select disabled={!province || province === 'all'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un siège" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1er siège</SelectItem>
                                    <SelectItem value="2">2ème siège</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full bg-[#04CDB9] hover:bg-[#03A89A] text-white">
                                <Search className="w-4 h-4 mr-2" />
                                Rechercher
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Vos Représentants {province && province !== 'all' ? `(${province})` : ""}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOfficials.map((official) => (
                        <Card key={official.id} className="overflow-hidden hover:shadow-lg transition-shadow border-t-4" style={{ borderTopColor: official.chamber === 'AN' ? '#3A87FD' : '#D19C00' }}>
                            <CardHeader className="bg-muted/30 pb-4">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className={official.chamber === 'AN' ? "text-[#3A87FD] border-[#3A87FD]" : "text-[#D19C00] border-[#D19C00]"}>
                                        {official.chamber === 'AN' ? <Building2 className="w-3 h-3 mr-1" /> : <Landmark className="w-3 h-3 mr-1" />}
                                        {official.role}
                                    </Badge>
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-default">
                                        {official.party}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="flex justify-center -mt-16 mb-4">
                                    <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                                        <AvatarImage src={official.image} />
                                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                            {official.name.split(' ').slice(1).map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold">{official.name}</h3>
                                    <p className="text-sm text-muted-foreground">{official.commission}</p>
                                </div>

                                <div className="text-sm space-y-2 py-4 border-t border-b border-border/50">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{official.constituency}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4 opacity-0" /> {/* Spacer */}
                                        <span>{official.province}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2 w-full">
                                    <Button variant="outline" size="sm" className="w-full flex gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full flex gap-2">
                                        <Phone className="w-4 h-4" />
                                        Appeler
                                    </Button>
                                </div>
                                <Button className="w-full" variant="ghost">
                                    Voir le profil complet <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CitizenOfficials;
