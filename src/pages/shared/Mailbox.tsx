import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Mail,
    Inbox,
    Send,
    File,
    Trash2,
    Search,
    Star,
    MoreVertical,
    Reply,
    Forward,
    Paperclip,
    Archive,
    BrainCircuit
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import SmartMailImport from "@/components/mail/SmartMailImport";

// Mock Data
const mockEmails = [
    { id: 1, sender: "Président de l'Assemblée", subject: "Ordre du jour de la prochaine séance", preview: "Veuillez trouver ci-joint l'ordre du jour...", date: "10:30", read: false, starred: true, folder: "inbox" },
    { id: 2, sender: "Commission des Finances", subject: "Rapport Budgétaire Q3", preview: "Le rapport final est disponible pour révision...", date: "Hier", read: true, starred: false, folder: "inbox" },
    { id: 3, sender: "Service Informatique", subject: "Maintenance Planifiée", preview: "Une maintenance des serveurs aura lieu ce...", date: "Lun", read: true, starred: false, folder: "inbox" },
    { id: 4, sender: "Moi", subject: "Question Écrite au Gouvernement", preview: "Monsieur le Ministre, je souhaite attirer votre...", date: "Lun", read: true, starred: false, folder: "sent" },
    { id: 5, sender: "Secrétariat Général", subject: "Note de Service #45", preview: "Nouvelles procédures d'accès au bâtiment...", date: "05 Nov", read: true, starred: false, folder: "archive" },
];

const Mailbox = () => {
    const { user } = useUser();
    const [activeFolder, setActiveFolder] = useState("inbox");
    const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSmartImportOpen, setIsSmartImportOpen] = useState(false);

    const filteredEmails = mockEmails.filter(email =>
        email.folder === activeFolder &&
        (email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.sender.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const currentEmail = mockEmails.find(e => e.id === selectedEmail);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col animate-fade-in p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">iBoîte</h1>
                <p className="text-muted-foreground">Messagerie interne sécurisée.</p>
            </div>

            <Card className="flex-1 flex overflow-hidden border-border/50 shadow-sm bg-background">
                {/* Sidebar */}
                <div className="w-64 border-r border-border/50 bg-muted/10 flex flex-col p-4 gap-2">
                    <Button className="w-full gap-2 mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
                        <Mail className="w-4 h-4" /> Nouveau Message
                    </Button>

                    {/* Smart Import Button (Visible for all parliamentary roles) */}
                    {user?.roles.some(role =>
                        ['secretary', 'president', 'vp', 'deputy', 'substitute', 'questeur', 'questeur_budget', 'questeur_resources', 'questeur_services'].includes(role)
                    ) && (
                            <Button
                                className="w-full gap-2 mb-4 bg-cyan-600 text-white hover:bg-cyan-700"
                                onClick={() => setIsSmartImportOpen(true)}
                            >
                                <BrainCircuit className="w-4 h-4" /> Import Intelligent
                            </Button>
                        )}

                    <nav className="space-y-1">
                        <Button
                            variant={activeFolder === "inbox" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3"
                            onClick={() => { setActiveFolder("inbox"); setSelectedEmail(null); }}
                        >
                            <Inbox className="w-4 h-4" /> Boîte de réception
                            <Badge className="ml-auto bg-primary text-primary-foreground">3</Badge>
                        </Button>
                        <Button
                            variant={activeFolder === "sent" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3"
                            onClick={() => { setActiveFolder("sent"); setSelectedEmail(null); }}
                        >
                            <Send className="w-4 h-4" /> Envoyés
                        </Button>
                        <Button
                            variant={activeFolder === "drafts" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3"
                            onClick={() => { setActiveFolder("drafts"); setSelectedEmail(null); }}
                        >
                            <File className="w-4 h-4" /> Brouillons
                        </Button>
                        <Button
                            variant={activeFolder === "archive" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3"
                            onClick={() => { setActiveFolder("archive"); setSelectedEmail(null); }}
                        >
                            <Archive className="w-4 h-4" /> Archives
                        </Button>
                        <Button
                            variant={activeFolder === "trash" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                            onClick={() => { setActiveFolder("trash"); setSelectedEmail(null); }}
                        >
                            <Trash2 className="w-4 h-4" /> Corbeille
                        </Button>
                    </nav>
                </div>

                {/* Email List */}
                <div className={`${selectedEmail ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-border/50 bg-background`}>
                    <div className="p-4 border-b border-border/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Rechercher..."
                                className="pl-9 bg-muted/30 border-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredEmails.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                Aucun message
                            </div>
                        ) : (
                            filteredEmails.map(email => (
                                <div
                                    key={email.id}
                                    onClick={() => setSelectedEmail(email.id)}
                                    className={`p-4 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors ${selectedEmail === email.id ? 'bg-muted/50' : ''} ${!email.read ? 'bg-primary/5' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-sm truncate max-w-[180px] ${!email.read ? 'font-bold' : 'font-medium'}`}>
                                            {email.sender}
                                        </span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {email.date}
                                        </span>
                                    </div>
                                    <h4 className={`text-sm mb-1 truncate ${!email.read ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
                                        {email.subject}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {email.preview}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Email Content */}
                <div className={`${!selectedEmail ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-background`}>
                    {currentEmail ? (
                        <>
                            {/* Toolbar */}
                            <div className="p-4 border-b border-border/50 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedEmail(null)} className="md:hidden">
                                        <Reply className="w-4 h-4" /> {/* Back Icon placeholder */}
                                    </Button>
                                    <Button variant="ghost" size="icon" title="Archiver">
                                        <Archive className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title="Supprimer">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <div className="w-px h-6 bg-border mx-2" />
                                    <Button variant="ghost" size="icon" title="Marquer comme non lu">
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Message Header */}
                            <div className="p-6 border-b border-border/50">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold font-serif">{currentEmail.subject}</h2>
                                    <Button variant="ghost" size="icon">
                                        <Star className={`w-4 h-4 ${currentEmail.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{currentEmail.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-semibold text-sm">{currentEmail.sender}</span>
                                            <span className="text-xs text-muted-foreground">Aujourd'hui à 10:30</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">À: Moi</p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className="flex-1 p-6 overflow-y-auto prose dark:prose-invert max-w-none">
                                <p>Bonjour,</p>
                                <p>{currentEmail.preview}</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p>Cordialement,</p>
                                <p className="font-semibold">{currentEmail.sender}</p>
                            </div>

                            {/* Reply Area */}
                            <div className="p-4 border-t border-border/50 bg-muted/10">
                                <div className="flex gap-2">
                                    <Button variant="outline" className="gap-2">
                                        <Reply className="w-4 h-4" /> Répondre
                                    </Button>
                                    <Button variant="outline" className="gap-2">
                                        <Forward className="w-4 h-4" /> Transférer
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <Mail className="w-16 h-16 mb-4 opacity-20" />
                            <p>Sélectionnez un message pour le lire</p>
                        </div>
                    )}
                </div>
            </Card>

            <SmartMailImport
                isOpen={isSmartImportOpen}
                onClose={() => setIsSmartImportOpen(false)}
            />
        </div>
    );
};

export default Mailbox;
