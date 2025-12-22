import { useState, useEffect } from "react";
import { Search, Building2, UserCircle, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNerve } from "@/hooks/useNerve";
import { DirectoryContact } from "@/data/mock-directory";
import { cn } from "@/lib/utils";

interface SmartDirectorySearchProps {
    onSelect: (contact: DirectoryContact) => void;
    className?: string;
}

export const SmartDirectorySearch = ({ onSelect, className }: SmartDirectorySearchProps) => {
    const [contacts, setContacts] = useState<DirectoryContact[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const { stimulate } = useNerve("SOCIAL:DIRECTORY_READY", (payload) => {
        console.log("📇 [SmartSearch] Annuaire reçu", payload.contacts.length);
        setContacts(payload.contacts);
    });

    // Demander l'annuaire au montage
    useEffect(() => {
        stimulate("SOCIAL:REFRESH_DIRECTORY", {});
    }, [stimulate]);

    // Logique de filtrage
    const filteredContacts = contacts.filter((contact) => {
        // 1. Text Search
        const matchesSearch =
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.bureauLabel?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // 2. Category Filter
        if (activeFilter === "ALL") return true;
        if (activeFilter === "AN") return contact.institution === "AN";
        if (activeFilter === "SENAT") return contact.institution === "SENAT";
        if (activeFilter === "BUREAU") {
            // Détection approximative des membres de bureau via leurs rôles
            return (
                contact.roles.includes("president") ||
                contact.roles.includes("vp") ||
                contact.roles.includes("questeur") ||
                contact.roles.includes("secretary") ||
                contact.roles.includes("president_senate") ||
                contact.roles.includes("vp_senate")
            );
        }

        return true;
    });

    return (
        <div className={cn("flex flex-col h-full bg-background border rounded-lg", className)}>
            {/* Header & Search */}
            <div className="p-4 border-b space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un parlementaire, un rôle..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Tabs defaultValue="ALL" value={activeFilter} onValueChange={setActiveFilter}>
                    <TabsList className="w-full grid grid-cols-4">
                        <TabsTrigger value="ALL" className="text-xs">Tout</TabsTrigger>
                        <TabsTrigger value="AN" className="text-xs">AN</TabsTrigger>
                        <TabsTrigger value="SENAT" className="text-xs">Sénat</TabsTrigger>
                        <TabsTrigger value="BUREAU" className="text-xs">Bureau</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Results List */}
            <ScrollArea className="flex-1 p-2">
                {filteredContacts.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground text-sm">
                        Aucun contact trouvé.
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredContacts.map((contact) => (
                            <button
                                key={contact.id}
                                onClick={() => onSelect(contact)}
                                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors text-left group"
                            >
                                <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary/20 transition-all">
                                    <AvatarImage src={contact.avatar} />
                                    <AvatarFallback className={cn(
                                        "text-xs font-bold",
                                        contact.institution === 'AN' ? "bg-blue-100 text-blue-700" :
                                            contact.institution === 'SENAT' ? "bg-red-100 text-red-700" : "bg-gray-100"
                                    )}>
                                        {contact.institution === 'AN' ? 'AN' : 'SN'}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                                        {contact.institution === 'AN' && <Badge variant="outline" className="text-[10px] h-5 border-blue-200 text-blue-700">AN</Badge>}
                                        {contact.institution === 'SENAT' && <Badge variant="outline" className="text-[10px] h-5 border-red-200 text-red-700">Sénat</Badge>}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                        {contact.roles.some(r => r.includes('president') || r.includes('vp')) ? (
                                            <Briefcase className="w-3 h-3" />
                                        ) : (
                                            <UserCircle className="w-3 h-3" />
                                        )}
                                        {contact.bureauLabel}
                                        {contact.circonscription && ` • ${contact.circonscription}`}
                                        {contact.province && ` • ${contact.province}`}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Footer Status */}
            <div className="p-2 border-t bg-muted/20 text-center">
                <span className="text-[10px] text-muted-foreground">
                    {filteredContacts.length} résultat(s) • Annuaire Unifié Sécurisé
                </span>
            </div>
        </div>
    );
};
