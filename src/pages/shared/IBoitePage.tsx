/**
 * iBoîte - Boîte aux Lettres Souveraine
 * 
 * Adapté au design parlement.ga: Card, font-serif, neu-raised, Avatar, subtle borders
 * Features: 3 sections (Courriers, Colis, Emails), prévisualisation A4, multi-comptes
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { iBoiteService } from '@/services/iboite-service';
import { IBoiteComposeMessage } from '@/components/iboite/IBoiteComposeMessage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
    Package, Mail, MessageCircle, MapPin, Copy, Check, Send, Plus, X,
    Building2, User, Reply, Star, Trash2, Inbox, Clock,
    Truck, Printer, Download, AlertCircle, FileText,
    QrCode, ChevronDown, Home, Briefcase, Users,
    ArrowLeft, Paperclip, Archive, Search, Loader2, Phone, Video, MoreVertical, Mic
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { IBoiteConversation, IBoiteMessage } from '@/types/environments';

// Types
type SectionType = "courriers" | "colis" | "emails";
type FolderType = "inbox" | "sent" | "pending" | "trash";
type EmailFolderType = "inbox" | "sent" | "starred" | "trash" | "archive";
type AccountType = "personal" | "professional";

interface Account {
    id: string;
    name: string;
    type: AccountType;
    icon: typeof Home;
    address: {
        label: string;
        fullAddress: string;
        street: string;
        city: string;
        postalCode: string;
        qrCode: string;
    };
    email: string;
}

interface DigitalLetter {
    id: string; accountId: string; folder: FolderType; sender: string; senderAddress: string;
    recipient: string; recipientAddress: string; subject: string; content: string;
    attachments: { name: string; size: string }[]; isRead: boolean; type: "action_required" | "informational" | "standard";
    createdAt: Date; dueDate?: Date;
}

interface PackageDelivery {
    id: string; accountId: string; trackingNumber: string; sender: string; description: string;
    status: "pending" | "transit" | "delivered" | "available"; estimatedDelivery?: Date;
}

// Context type
export type IBoiteContext = 'default' | 'congress' | 'cmp' | 'bureau' | 'an' | 'senat' | 'deputy' | 'senator' | 'questeur_an' | 'questeur_senat' | 'president_an' | 'president_senat' | 'vp_an' | 'vp_senat' | 'citizen';

// Function to get accounts based on context
function getAccountsForContext(context: IBoiteContext): Account[] {
    switch (context) {
        case 'president_an':
            return [
                {
                    id: "president", name: "Président AN", type: "professional", icon: Building2,
                    address: { label: "Président de l'Assemblée Nationale", fullAddress: "Palais Léon Mba", street: "Avenue du Palais", city: "Libreville", postalCode: "BP 100", qrCode: "PGA-PRES-AN" },
                    email: "president@assemblee.ga"
                },
                {
                    id: "bureau", name: "Bureau AN", type: "professional", icon: Users,
                    address: { label: "Bureau de l'Assemblée Nationale", fullAddress: "Palais Léon Mba", street: "Avenue du Palais", city: "Libreville", postalCode: "BP 100", qrCode: "PGA-BUR-AN" },
                    email: "bureau@assemblee.ga"
                }
            ];
        case 'deputy':
        case 'an':
            return [
                {
                    id: "depute", name: "Député", type: "professional", icon: User,
                    address: { label: "Bureau du Député", fullAddress: "Assemblée Nationale", street: "Avenue du Palais Léon Mba", city: "Libreville", postalCode: "BP 1000", qrCode: "PGA-DEP" },
                    email: "depute@assemblee.ga"
                },
                {
                    id: "commission", name: "Commission", type: "professional", icon: Users,
                    address: { label: "Commission Parlementaire", fullAddress: "Assemblée Nationale", street: "Avenue du Palais", city: "Libreville", postalCode: "BP 1000", qrCode: "PGA-COM" },
                    email: "commission@assemblee.ga"
                }
            ];
        case 'questeur_an':
            return [
                {
                    id: "questeur", name: "Questeur AN", type: "professional", icon: Briefcase,
                    address: { label: "Questure - Assemblée Nationale", fullAddress: "Palais Léon Mba", street: "Avenue du Palais", city: "Libreville", postalCode: "BP 200", qrCode: "PGA-QUEST-AN" },
                    email: "questure@assemblee.ga"
                },
                {
                    id: "finances", name: "Finances AN", type: "professional", icon: Building2,
                    address: { label: "Direction Financière AN", fullAddress: "Assemblée Nationale", street: "Avenue du Palais", city: "Libreville", postalCode: "BP 200", qrCode: "PGA-FIN-AN" },
                    email: "finances@assemblee.ga"
                }
            ];
        case 'president_senat':
            return [
                {
                    id: "president", name: "Président Sénat", type: "professional", icon: Building2,
                    address: { label: "Président du Sénat", fullAddress: "Palais Omar Bongo", street: "Boulevard Triomphal", city: "Libreville", postalCode: "BP 300", qrCode: "PGA-PRES-SEN" },
                    email: "president@senat.ga"
                },
                {
                    id: "bureau", name: "Bureau Sénat", type: "professional", icon: Users,
                    address: { label: "Bureau du Sénat", fullAddress: "Palais Omar Bongo", street: "Boulevard Triomphal", city: "Libreville", postalCode: "BP 300", qrCode: "PGA-BUR-SEN" },
                    email: "bureau@senat.ga"
                }
            ];
        case 'senator':
        case 'senat':
            return [
                {
                    id: "senateur", name: "Sénateur", type: "professional", icon: User,
                    address: { label: "Bureau du Sénateur", fullAddress: "Sénat", street: "Boulevard Triomphal", city: "Libreville", postalCode: "BP 2000", qrCode: "PGA-SEN" },
                    email: "senateur@senat.ga"
                },
                {
                    id: "commission", name: "Commission", type: "professional", icon: Users,
                    address: { label: "Commission Sénatoriale", fullAddress: "Sénat", street: "Boulevard Triomphal", city: "Libreville", postalCode: "BP 2000", qrCode: "PGA-COM-SEN" },
                    email: "commission@senat.ga"
                }
            ];
        case 'questeur_senat':
            return [
                {
                    id: "questeur", name: "Questeur Sénat", type: "professional", icon: Briefcase,
                    address: { label: "Questure - Sénat", fullAddress: "Palais Omar Bongo", street: "Boulevard Triomphal", city: "Libreville", postalCode: "BP 400", qrCode: "PGA-QUEST-SEN" },
                    email: "questure@senat.ga"
                },
                {
                    id: "finances", name: "Finances Sénat", type: "professional", icon: Building2,
                    address: { label: "Direction Financière Sénat", fullAddress: "Sénat", street: "Boulevard Triomphal", city: "Libreville", postalCode: "BP 400", qrCode: "PGA-FIN-SEN" },
                    email: "finances@senat.ga"
                }
            ];
        case 'congress':
        case 'cmp':
            return [
                {
                    id: "congres", name: "Congrès", type: "professional", icon: Building2,
                    address: { label: "Congrès du Parlement", fullAddress: "Palais du Congrès", street: "Libreville", city: "Libreville", postalCode: "BP 500", qrCode: "PGA-CONG" },
                    email: "congres@parlement.ga"
                },
                {
                    id: "cmp", name: "CMP", type: "professional", icon: Users,
                    address: { label: "Commission Mixte Paritaire", fullAddress: "Parlement", street: "Libreville", city: "Libreville", postalCode: "BP 500", qrCode: "PGA-CMP" },
                    email: "cmp@parlement.ga"
                }
            ];
        case 'citizen':
            return [
                {
                    id: "citoyen", name: "Citoyen", type: "personal", icon: Home,
                    address: { label: "Espace Citoyen", fullAddress: "Parlement du Gabon", street: "Libreville", city: "Libreville", postalCode: "BP 600", qrCode: "PGA-CIT" },
                    email: "citoyen@parlement.ga"
                }
            ];
        default:
            return [
                {
                    id: "utilisateur", name: "Utilisateur", type: "personal", icon: Home,
                    address: { label: "Compte Utilisateur", fullAddress: "Parlement du Gabon", street: "Libreville", city: "Libreville", postalCode: "BP 1000", qrCode: "PGA-USER" },
                    email: "utilisateur@parlement.ga"
                }
            ];
    }
}

interface IBoitePageProps {
    context?: IBoiteContext;
    contextLabel?: string;
}

// Mock Data for letters and packages
const getMockLetters = (accountId: string): DigitalLetter[] => [
    { id: "l1", accountId, folder: "inbox", sender: "Secrétariat Général", senderAddress: "Secrétariat Général\nAssemblée Nationale\nBP 123 Libreville", recipient: "Destinataire", recipientAddress: "Bureau Parlementaire\nBP 1000\nLibreville, GABON", subject: "Convocation - Session Plénière", content: "Honorable,\n\nVous êtes convoqué à la session plénière extraordinaire qui se tiendra le 15 janvier 2026 à 10h00 dans l'hémicycle.\n\nOrdre du jour :\n- Examen du projet de loi de finances rectificative\n- Questions au gouvernement\n\nVotre présence est obligatoire.\n\nVeuillez agréer l'expression de notre haute considération.\n\nLe Secrétaire Général", attachments: [], isRead: false, type: "action_required", createdAt: new Date(Date.now() - 7200000), dueDate: new Date(Date.now() + 86400000 * 2) },
    { id: "l2", accountId, folder: "inbox", sender: "Commission des Lois", senderAddress: "Commission des Lois\nParlement\nLibreville", recipient: "Destinataire", recipientAddress: "Bureau Parlementaire\nLibreville", subject: "Rapport d'étude - Projet de Loi n°2025-42", content: "Honorable,\n\nVeuillez trouver ci-joint le rapport d'étude concernant le projet de loi n°2025-42 relatif à la modernisation de l'administration publique.\n\nLa commission se réunira le 20 janvier pour l'examen de ce texte.\n\nCordialement,\nLe Président de la Commission", attachments: [{ name: "Rapport_PL_2025-42.pdf", size: "2.4 MB" }], isRead: true, type: "informational", createdAt: new Date(Date.now() - 172800000) },
    { id: "l3", accountId, folder: "sent", sender: "Expéditeur", senderAddress: "Bureau Parlementaire\nBP 1000\nLibreville", recipient: "Mairie de Libreville", recipientAddress: "Mairie de Libreville\nService État Civil\nBP 123 Libreville", subject: "Demande d'intervention - Quartier Akébé", content: "Monsieur le Maire,\n\nSuite aux doléances des habitants du quartier Akébé concernant l'état des routes, je sollicite une intervention rapide de vos services.\n\nMerci de votre diligence.\n\nRespectueux hommages.", attachments: [], isRead: true, type: "standard", createdAt: new Date(Date.now() - 432000000) },
];

const getMockPackages = (accountId: string): PackageDelivery[] => [
    { id: "pkg1", accountId, trackingNumber: "GA2026-78901", sender: "Service Documentation", description: "Documents parlementaires", status: "available" },
    { id: "pkg2", accountId, trackingNumber: "GA2026-78902", sender: "Imprimerie Nationale", description: "Recueil des lois 2025", status: "transit", estimatedDelivery: new Date(Date.now() + 86400000 * 2) },
];

export default function IBoitePage({ context = 'default', contextLabel }: IBoitePageProps) {
    // Get accounts based on context
    const accounts = useMemo(() => getAccountsForContext(context), [context]);
    const [selectedAccount, setSelectedAccount] = useState<Account>(accounts[0]);
    const [activeSection, setActiveSection] = useState<SectionType>("courriers");
    const [currentFolder, setCurrentFolder] = useState<FolderType>("inbox");
    const [emailFolder, setEmailFolder] = useState<EmailFolderType>("inbox");
    const [letters, setLetters] = useState<DigitalLetter[]>(() => getMockLetters(accounts[0].id));
    const [selectedLetter, setSelectedLetter] = useState<DigitalLetter | null>(null);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showComposeEmail, setShowComposeEmail] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Backend integration
    const [conversations, setConversations] = useState<IBoiteConversation[]>([]);
    const [messages, setMessages] = useState<IBoiteMessage[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");

    // Preview container ref for A4 scaling
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const [previewScale, setPreviewScale] = useState(1);

    useEffect(() => {
        const calculateScale = () => {
            if (previewContainerRef.current) {
                const container = previewContainerRef.current;
                const containerWidth = container.clientWidth - 48;
                const containerHeight = container.clientHeight - 48;
                const a4Width = 595;
                const a4Height = 842;
                setPreviewScale(Math.min(containerWidth / a4Width, containerHeight / a4Height, 1));
            }
        };
        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [selectedLetter]);

    // Load conversations
    useEffect(() => {
        if (activeSection === "emails") {
            const loadConversations = async () => {
                setIsLoading(true);
                try {
                    const { supabase } = await import('@/integrations/supabase/client');
                    const { data: session } = await supabase.auth.getSession();
                    if (session?.session?.user?.id) {
                        setCurrentUserId(session.session.user.id);
                    }
                    const convs = await iBoiteService.getConversations({ archived: emailFolder === 'archive' });
                    setConversations(convs);
                } catch (error) {
                    console.error('[IBoitePage] Error:', error);
                }
                setIsLoading(false);
            };
            loadConversations();
        }
    }, [activeSection, emailFolder]);

    // Load messages
    useEffect(() => {
        if (selectedConversationId) {
            const loadMessages = async () => {
                try {
                    const msgs = await iBoiteService.getMessages(selectedConversationId);
                    setMessages(msgs.reverse());
                    await iBoiteService.markConversationAsRead(selectedConversationId);
                } catch (error) {
                    console.error('[IBoitePage] Error:', error);
                }
            };
            loadMessages();
        }
    }, [selectedConversationId]);

    // Filtered data
    const packages = useMemo(() => getMockPackages(selectedAccount.id), [selectedAccount.id]);
    const accountLetters = letters.filter(l => l.accountId === selectedAccount.id);
    const accountPackages = packages;
    const filteredLetters = accountLetters.filter(l => l.folder === currentFolder);
    const unreadLetters = accountLetters.filter(l => l.folder === "inbox" && !l.isRead).length;
    const availablePackages = accountPackages.filter(p => p.status === "available").length;
    const unreadEmails = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);

    const copyAddress = () => {
        navigator.clipboard.writeText(`${selectedAccount.address.fullAddress}\n${selectedAccount.address.street}\n${selectedAccount.address.postalCode} ${selectedAccount.address.city}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const moveLetter = (id: string, target: FolderType) => {
        setLetters(prev => prev.map(l => l.id === id ? { ...l, folder: target } : l));
        setSelectedLetter(null);
    };

    const sectionBadges = { courriers: unreadLetters, colis: availablePackages, emails: unreadEmails };

    const handleMessageSent = useCallback((conversationId: string) => {
        toast.success('Message envoyé');
        setShowComposeEmail(false);
        iBoiteService.getConversations({ archived: false }).then(setConversations);
    }, []);

    const selectedConversation = useMemo(() =>
        conversations.find(c => c.id === selectedConversationId) || null
        , [conversations, selectedConversationId]);

    return (
        <div className="p-6 h-[calc(100vh-100px)] flex flex-col animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold mb-2">iBoîte</h1>
                        <p className="text-muted-foreground">
                            Boîte aux lettres souveraine • Communications sécurisées
                        </p>
                    </div>
                    {context !== 'default' && (
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {contextLabel || context.toUpperCase()}
                        </Badge>
                    )}
                </div>
            </div>

            <Card className="flex-1 neu-raised flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 border-r border-border/50 flex flex-col bg-muted/10">
                    {/* Account Selector */}
                    <div className="p-4 border-b border-border/50">
                        <div className="relative">
                            <button
                                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                                <Avatar className="h-10 w-10 border-2 border-primary/20">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {selectedAccount.type === "professional" ? <Building2 className="w-5 h-5" /> : <Home className="w-5 h-5" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="font-semibold text-sm truncate">{selectedAccount.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{selectedAccount.email}</p>
                                </div>
                                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", accountDropdownOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {accountDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-lg border border-border overflow-hidden z-50"
                                    >
                                        {accounts.map(account => (
                                            <button
                                                key={account.id}
                                                onClick={() => { setSelectedAccount(account); setAccountDropdownOpen(false); setSelectedLetter(null); }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors",
                                                    selectedAccount.id === account.id && "bg-primary/5"
                                                )}
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                                        {account.type === "professional" ? <Building2 className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">{account.name}</span>
                                                {selectedAccount.id === account.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Address */}
                        <div className="mt-3 p-2 rounded-lg bg-muted/30 text-xs text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{selectedAccount.address.street}</span>
                            <button onClick={copyAddress} className="p-1 rounded hover:bg-muted ml-auto shrink-0">
                                {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                            </button>
                        </div>
                    </div>

                    {/* Section Tabs */}
                    <div className="p-4 border-b border-border/50">
                        <div className="space-y-1">
                            {[
                                { id: "courriers" as SectionType, label: "Courriers", icon: Mail, color: "text-blue-600" },
                                { id: "colis" as SectionType, label: "Colis", icon: Package, color: "text-amber-600" },
                                { id: "emails" as SectionType, label: "eMails", icon: MessageCircle, color: "text-green-600" },
                            ].map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => { setActiveSection(section.id); setSelectedLetter(null); setSelectedConversationId(null); }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                        activeSection === section.id
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "text-muted-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <section.icon className={cn("w-4 h-4", activeSection !== section.id && section.color)} />
                                        {section.label}
                                    </div>
                                    {sectionBadges[section.id] > 0 && (
                                        <Badge className={cn(
                                            "h-5 min-w-5 rounded-full text-[10px] p-0 flex items-center justify-center",
                                            activeSection === section.id ? "bg-primary-foreground text-primary" : ""
                                        )}>
                                            {sectionBadges[section.id]}
                                        </Badge>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Folder/Actions based on section */}
                    <div className="flex-1 overflow-auto p-4">
                        {activeSection === "courriers" && (
                            <>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Dossiers</p>
                                <div className="space-y-1">
                                    {[
                                        { id: "inbox" as FolderType, label: "Réception", icon: Inbox, count: unreadLetters },
                                        { id: "sent" as FolderType, label: "Expédiés", icon: Send },
                                        { id: "pending" as FolderType, label: "À traiter", icon: Clock, count: accountLetters.filter(l => l.folder === "pending").length },
                                        { id: "trash" as FolderType, label: "Corbeille", icon: Trash2 },
                                    ].map(folder => (
                                        <button
                                            key={folder.id}
                                            onClick={() => { setCurrentFolder(folder.id); setSelectedLetter(null); }}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                                                currentFolder === folder.id
                                                    ? "bg-muted font-medium"
                                                    : "text-muted-foreground hover:bg-muted/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <folder.icon className="w-4 h-4" />
                                                {folder.label}
                                            </div>
                                            {folder.count && folder.count > 0 && (
                                                <Badge className="h-5 min-w-5 rounded-full text-[10px]">{folder.count}</Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <Button onClick={() => setShowComposeEmail(true)} className="w-full mt-4 shadow-lg">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nouveau courrier
                                </Button>
                            </>
                        )}

                        {activeSection === "colis" && (
                            <>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Statut</p>
                                <div className="space-y-2">
                                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50">
                                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                            <Package className="w-4 h-4" />
                                            <span className="text-sm font-semibold">{availablePackages} à retirer</span>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200/50">
                                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                            <Truck className="w-4 h-4" />
                                            <span className="text-sm font-semibold">{accountPackages.filter(p => p.status === "transit").length} en transit</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 rounded-lg bg-muted/30 text-center">
                                    <QrCode className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                                    <p className="text-xs font-mono text-muted-foreground">{selectedAccount.address.qrCode}</p>
                                </div>
                            </>
                        )}

                        {activeSection === "emails" && (
                            <>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Dossiers</p>
                                <div className="space-y-1">
                                    {[
                                        { id: "inbox" as EmailFolderType, label: "Boîte de réception", icon: Inbox, count: unreadEmails },
                                        { id: "starred" as EmailFolderType, label: "Favoris", icon: Star },
                                        { id: "sent" as EmailFolderType, label: "Envoyés", icon: Send },
                                        { id: "archive" as EmailFolderType, label: "Archives", icon: Archive },
                                        { id: "trash" as EmailFolderType, label: "Corbeille", icon: Trash2 },
                                    ].map(folder => (
                                        <button
                                            key={folder.id}
                                            onClick={() => { setEmailFolder(folder.id); setSelectedConversationId(null); }}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                                                emailFolder === folder.id
                                                    ? "bg-muted font-medium"
                                                    : "text-muted-foreground hover:bg-muted/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <folder.icon className={cn("w-4 h-4", folder.id === "starred" && emailFolder === folder.id && "text-amber-500 fill-amber-500")} />
                                                {folder.label}
                                            </div>
                                            {folder.count && folder.count > 0 && (
                                                <Badge className="h-5 min-w-5 rounded-full text-[10px]">{folder.count}</Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <Button onClick={() => setShowComposeEmail(true)} className="w-full mt-4 shadow-lg">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nouveau message
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Back Button */}
                    {(selectedLetter || selectedConversationId) && (
                        <div className="p-4 border-t border-border/50">
                            <Button variant="outline" onClick={() => { setSelectedLetter(null); setSelectedConversationId(null); }} className="w-full">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div ref={previewContainerRef} className="flex-1 flex flex-col bg-background">
                    {/* COURRIERS */}
                    {activeSection === "courriers" && (
                        selectedLetter ? (
                            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-muted/5">
                                <div
                                    style={{ transform: `scale(${previewScale})`, transformOrigin: 'center center' }}
                                    className="bg-white shadow-2xl rounded-sm border"
                                >
                                    <div className="w-[595px] min-h-[842px] p-12">
                                        <div className="flex justify-between mb-8">
                                            <div className="text-xs text-muted-foreground whitespace-pre-line">{selectedLetter.senderAddress}</div>
                                            <div className="text-xs font-semibold text-right whitespace-pre-line">{selectedLetter.recipientAddress}</div>
                                        </div>
                                        <div className="text-xs text-muted-foreground text-right mb-8">
                                            Libreville, le {format(selectedLetter.createdAt, "dd MMMM yyyy", { locale: fr })}
                                        </div>
                                        <div className="text-lg font-serif font-bold mb-6 pb-3 border-b">
                                            Objet : {selectedLetter.subject}
                                        </div>
                                        <div className="text-sm leading-7 whitespace-pre-wrap text-justify">
                                            {selectedLetter.content}
                                        </div>
                                        {selectedLetter.attachments.length > 0 && (
                                            <div className="mt-8 pt-4 border-t">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Pièces jointes</p>
                                                {selectedLetter.attachments.map((a, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 text-xs">
                                                        <FileText className="w-4 h-4 text-primary" />
                                                        <span className="flex-1 font-medium">{a.name}</span>
                                                        <span className="text-muted-foreground">{a.size}</span>
                                                        <Button variant="ghost" size="sm"><Download className="w-3.5 h-3.5" /></Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {selectedLetter.type === "action_required" && selectedLetter.folder === "inbox" && (
                                            <div className="mt-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                                                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-destructive">Action requise</p>
                                                    <p className="text-xs text-destructive/80">Réponse attendue avant le {selectedLetter.dueDate ? format(selectedLetter.dueDate, "dd/MM/yyyy") : "prochainement"}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-serif font-bold">{currentFolder === "inbox" ? "Réception" : currentFolder === "sent" ? "Expédiés" : currentFolder === "pending" ? "À traiter" : "Corbeille"}</h2>
                                        <p className="text-xs text-muted-foreground">{filteredLetters.length} courrier(s)</p>
                                    </div>
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="Rechercher..." className="pl-9 bg-muted/30 border-none" />
                                    </div>
                                </div>
                                <ScrollArea className="flex-1">
                                    {filteredLetters.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                                            <Mail className="w-12 h-12 opacity-20 mb-3" />
                                            <p className="text-sm">Aucun courrier</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/50">
                                            {filteredLetters.map(letter => (
                                                <button
                                                    key={letter.id}
                                                    onClick={() => { setSelectedLetter(letter); if (!letter.isRead) setLetters(prev => prev.map(l => l.id === letter.id ? { ...l, isRead: true } : l)); }}
                                                    className={cn(
                                                        "w-full flex items-start gap-4 p-4 text-left hover:bg-muted/30 transition-colors",
                                                        !letter.isRead && "bg-primary/5"
                                                    )}
                                                >
                                                    <Avatar className="mt-1">
                                                        <AvatarFallback className={letter.type === "action_required" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}>
                                                            {letter.sender.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <span className={cn("font-semibold text-sm truncate", !letter.isRead && "text-foreground")}>{letter.sender}</span>
                                                            <span className="text-xs text-muted-foreground shrink-0">{formatDistanceToNow(letter.createdAt, { addSuffix: true, locale: fr })}</span>
                                                        </div>
                                                        <p className={cn("text-sm truncate", !letter.isRead ? "font-medium" : "text-muted-foreground")}>{letter.subject}</p>
                                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{letter.content.substring(0, 80)}...</p>
                                                    </div>
                                                    {letter.type === "action_required" && !letter.isRead && (
                                                        <Badge variant="destructive" className="shrink-0">Urgent</Badge>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        )
                    )}

                    {/* COLIS */}
                    {activeSection === "colis" && (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-border/50">
                                <h2 className="font-serif font-bold">Mes Colis</h2>
                                <p className="text-xs text-muted-foreground">{accountPackages.length} colis en suivi</p>
                            </div>
                            <ScrollArea className="flex-1 p-4">
                                {accountPackages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                                        <Package className="w-12 h-12 opacity-20 mb-3" />
                                        <p className="text-sm">Aucun colis</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {accountPackages.map(pkg => (
                                            <Card key={pkg.id} className={cn("p-4 flex items-center gap-4", pkg.status === "available" && "border-amber-200 bg-amber-50/50 dark:bg-amber-500/5")}>
                                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", pkg.status === "available" ? "bg-amber-500/10" : "bg-blue-500/10")}>
                                                    {pkg.status === "available" ? <Package className="w-6 h-6 text-amber-600" /> : <Truck className="w-6 h-6 text-blue-600" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold">{pkg.description}</p>
                                                    <p className="text-xs text-muted-foreground">De: {pkg.sender}</p>
                                                    <p className="text-xs font-mono text-muted-foreground mt-1">{pkg.trackingNumber}</p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={pkg.status === "available" ? "bg-amber-500" : "bg-blue-500"}>
                                                        {pkg.status === "available" ? "À retirer" : "En transit"}
                                                    </Badge>
                                                    {pkg.estimatedDelivery && (
                                                        <p className="text-xs text-muted-foreground mt-2">Arrivée: {format(pkg.estimatedDelivery, "dd/MM")}</p>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    )}

                    {/* EMAILS */}
                    {activeSection === "emails" && (
                        selectedConversationId && selectedConversation ? (
                            <div className="flex-1 flex flex-col">
                                {/* Chat Header */}
                                <div className="p-4 border-b border-border/50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{selectedConversation.participants?.[0]?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-sm">{selectedConversation.participants?.[0]?.name}</h3>
                                            {selectedConversation.subject && <p className="text-xs text-muted-foreground">{selectedConversation.subject}</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <ScrollArea className="flex-1 p-4 bg-muted/5">
                                    <div className="space-y-4">
                                        {messages.map(msg => (
                                            <div key={msg.id} className={cn("flex gap-3", msg.sender_id === currentUserId && "flex-row-reverse")}>
                                                {msg.sender_id !== currentUserId && (
                                                    <Avatar className="w-8 h-8"><AvatarFallback>{msg.sender_name?.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                                                )}
                                                <div className={cn("p-3 rounded-2xl max-w-[70%]", msg.sender_id === currentUserId ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none")}>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <span className={cn("text-[10px] mt-1 block", msg.sender_id === currentUserId ? "text-primary-foreground/70 text-right" : "text-muted-foreground")}>
                                                        {format(new Date(msg.created_at), 'HH:mm')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>

                                {/* Input */}
                                <div className="p-4 border-t border-border/50 bg-background">
                                    <div className="flex gap-2 items-center">
                                        <Button variant="ghost" size="icon"><Paperclip className="w-5 h-5" /></Button>
                                        <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Écrivez votre message..." className="flex-1 rounded-full bg-muted/30 border-none" />
                                        <Button variant="ghost" size="icon"><Mic className="w-5 h-5" /></Button>
                                        <Button size="icon" className="rounded-full shadow-lg"><Send className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-serif font-bold">{emailFolder === "inbox" ? "Boîte de réception" : emailFolder === "starred" ? "Favoris" : emailFolder === "sent" ? "Envoyés" : emailFolder === "archive" ? "Archives" : "Corbeille"}</h2>
                                        <p className="text-xs text-muted-foreground">{conversations.length} conversation(s)</p>
                                    </div>
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="Rechercher..." className="pl-9 bg-muted/30 border-none" />
                                    </div>
                                </div>
                                <ScrollArea className="flex-1">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : conversations.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                                            <MessageCircle className="w-12 h-12 opacity-20 mb-3" />
                                            <p className="text-sm">Aucune conversation</p>
                                            <Button variant="link" size="sm" onClick={() => setShowComposeEmail(true)}>Démarrer une conversation</Button>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/50">
                                            {conversations.map(conv => (
                                                <button
                                                    key={conv.id}
                                                    onClick={() => setSelectedConversationId(conv.id)}
                                                    className={cn("w-full flex items-start gap-4 p-4 text-left hover:bg-muted/30 transition-colors", conv.unread_count > 0 && "bg-primary/5")}
                                                >
                                                    <Avatar>
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            {conv.participants?.[0]?.name?.substring(0, 2).toUpperCase() || "?"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <span className={cn("font-semibold text-sm truncate", conv.unread_count > 0 && "text-foreground")}>{conv.participants?.[0]?.name}</span>
                                                            <span className="text-xs text-muted-foreground shrink-0">{conv.updated_at ? formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: fr }) : ''}</span>
                                                        </div>
                                                        {conv.subject && <p className={cn("text-xs truncate", conv.unread_count > 0 ? "font-medium" : "text-muted-foreground")}>{conv.subject}</p>}
                                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message?.content}</p>
                                                    </div>
                                                    {conv.unread_count > 0 && <Badge className="h-5 min-w-5 rounded-full text-[10px]">{conv.unread_count}</Badge>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        )
                    )}
                </div>
            </Card>

            {/* Compose Modal */}
            <IBoiteComposeMessage
                open={showComposeEmail}
                onOpenChange={setShowComposeEmail}
                onSent={handleMessageSent}
                onError={(err) => toast.error(err)}
            />
        </div>
    );
}
