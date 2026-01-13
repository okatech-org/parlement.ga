/**
 * iBoîte - Boîte aux Lettres Souveraine Améliorée
 * 
 * Version fusionnée: Interface visuelle idn.ga + Backend parlement.ga
 * Features: 3 sections (Courriers, Colis, Emails), prévisualisation A4, multi-comptes
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { iBoiteService } from '@/services/iboite-service';
import { IBoiteRecipientSearch, Recipient } from '@/components/iboite/IBoiteRecipientSearch';
import { IBoiteComposeMessage } from '@/components/iboite/IBoiteComposeMessage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
    Package, Mail, MessageCircle, MapPin, Copy, Check, Send, Plus, X,
    Building2, User, Reply, Star, Trash2, Inbox, Clock,
    Truck, Printer, Download, AlertCircle, FileText,
    QrCode, ChevronDown, Home, Briefcase, Users,
    Eye, ArrowLeft, Share2, Paperclip, Archive,
    Forward, ReplyAll, Search, Loader2, MoreVertical
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { IBoiteConversation, IBoiteMessage } from '@/types/environments';

// Types
type SectionType = "courriers" | "colis" | "emails";
type FolderType = "inbox" | "sent" | "pending" | "trash";
type EmailFolderType = "inbox" | "sent" | "starred" | "trash" | "archive";
type AccountType = "personal" | "professional" | "association";

interface Account {
    id: string;
    name: string;
    type: AccountType;
    icon: typeof Home;
    color: string;
    address: {
        label: string;
        fullAddress: string;
        street: string;
        city: string;
        country: string;
        postalCode: string;
        qrCode: string;
    };
    email: string;
}

interface DigitalLetter {
    id: string; accountId: string; folder: FolderType; sender: string; senderAddress: string;
    recipient: string; recipientAddress: string; subject: string; content: string;
    attachments: { name: string; size: string }[]; isRead: boolean; type: "action_required" | "informational" | "standard";
    stampColor: "red" | "blue" | "green"; createdAt: Date; dueDate?: Date;
}

interface PackageDelivery {
    id: string; accountId: string; trackingNumber: string; sender: string; description: string;
    status: "pending" | "transit" | "delivered" | "available"; estimatedDelivery?: Date;
}

// Mock Data pour démo (sera remplacé par données réelles via iBoiteService)
const mockAccounts: Account[] = [
    {
        id: "personal", name: "Personnel", type: "personal", icon: Home,
        color: "from-blue-500 to-indigo-600",
        address: { label: "Compte Personnel", fullAddress: "Point Relais Parlement.ga", street: "Avenue du Palais Léon Mba", city: "Libreville", country: "Gabon", postalCode: "BP 1000", qrCode: "PGA-12345" },
        email: "utilisateur@parlement.ga"
    },
    {
        id: "professional", name: "Officiel", type: "professional", icon: Building2,
        color: "from-emerald-500 to-teal-600",
        address: { label: "Courrier Officiel", fullAddress: "Assemblée Nationale / Sénat", street: "Boulevard Triomphal", city: "Libreville", country: "Gabon", postalCode: "BP 5000", qrCode: "PGA-OFFIC-5000" },
        email: "officiel@parlement.ga"
    }
];

const mockLetters: DigitalLetter[] = [
    { id: "l1", accountId: "personal", folder: "inbox", sender: "Secrétariat Général", senderAddress: "Secrétariat Général\nAssemblée Nationale\nBP 123 Libreville", recipient: "Député", recipientAddress: "Bureau du Député\nBP 1000\nLibreville, GABON", subject: "Convocation - Session Plénière", content: "Monsieur le Député,\n\nVous êtes convoqué à la session plénière extraordinaire qui se tiendra le 15 janvier 2026 à 10h00 dans l'hémicycle.\n\nOrdre du jour :\n- Examen du projet de loi de finances rectificative\n- Questions au gouvernement\n\nVotre présence est obligatoire.\n\nVeuillez agréer, Monsieur le Député, l'expression de notre haute considération.\n\nLe Secrétaire Général", attachments: [], isRead: false, type: "action_required", stampColor: "red", createdAt: new Date(Date.now() - 7200000), dueDate: new Date(Date.now() + 86400000 * 2) },
    { id: "l2", accountId: "personal", folder: "inbox", sender: "Commission des Lois", senderAddress: "Commission des Lois\nAssemblée Nationale\nLibreville", recipient: "Député", recipientAddress: "Bureau du Député\nLibreville", subject: "Rapport d'étude - Projet de Loi n°2025-42", content: "Monsieur le Député,\n\nVeuillez trouver ci-joint le rapport d'étude concernant le projet de loi n°2025-42 relatif à la modernisation de l'administration publique.\n\nLa commission se réunira le 20 janvier pour l'examen de ce texte.\n\nCordialement,\nLe Président de la Commission", attachments: [{ name: "Rapport_PL_2025-42.pdf", size: "2.4 MB" }], isRead: true, type: "informational", stampColor: "blue", createdAt: new Date(Date.now() - 172800000) },
];

const mockPackages: PackageDelivery[] = [
    { id: "pkg1", accountId: "personal", trackingNumber: "GA2026-78901", sender: "Service Documentation", description: "Documents parlementaires", status: "available" },
    { id: "pkg2", accountId: "personal", trackingNumber: "GA2026-78902", sender: "Imprimerie Nationale", description: "Recueil des lois 2025", status: "transit", estimatedDelivery: new Date(Date.now() + 86400000 * 2) },
];

// Context type pour adaptation selon le rôle utilisateur
export type IBoiteContext = 'default' | 'congress' | 'cmp' | 'bureau' | 'an' | 'senat' | 'deputy' | 'senator' | 'questeur' | 'citizen';

interface IBoitePageProps {
    context?: IBoiteContext;
    contextLabel?: string;
}

export default function IBoitePage({ context = 'default', contextLabel }: IBoitePageProps) {
    const [selectedAccount, setSelectedAccount] = useState<Account>(mockAccounts[0]);
    const [activeSection, setActiveSection] = useState<SectionType>("courriers");
    const [currentFolder, setCurrentFolder] = useState<FolderType>("inbox");
    const [emailFolder, setEmailFolder] = useState<EmailFolderType>("inbox");
    const [letters, setLetters] = useState(mockLetters);
    const [selectedLetter, setSelectedLetter] = useState<DigitalLetter | null>(null);
    const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showComposeEmail, setShowComposeEmail] = useState(false);

    // Backend integration pour emails (conversations)
    const [conversations, setConversations] = useState<IBoiteConversation[]>([]);
    const [messages, setMessages] = useState<IBoiteMessage[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Preview container ref for scaling
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const [previewScale, setPreviewScale] = useState(1);

    // Calculate scale for A4 preview
    useEffect(() => {
        const calculateScale = () => {
            if (previewContainerRef.current) {
                const container = previewContainerRef.current;
                const containerWidth = container.clientWidth - 24;
                const containerHeight = container.clientHeight - 24;
                const a4Width = 595;
                const a4Height = 842;
                const scaleX = containerWidth / a4Width;
                const scaleY = containerHeight / a4Height;
                setPreviewScale(Math.min(scaleX, scaleY, 1));
            }
        };
        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [selectedLetter]);

    // Load conversations from backend when switching to emails section
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
                    const convs = await iBoiteService.getConversations({
                        archived: emailFolder === 'archive'
                    });
                    setConversations(convs);
                } catch (error) {
                    console.error('[IBoitePage] Error loading conversations:', error);
                }
                setIsLoading(false);
            };
            loadConversations();
        }
    }, [activeSection, emailFolder]);

    // Load messages when conversation selected
    useEffect(() => {
        if (selectedConversationId) {
            const loadMessages = async () => {
                try {
                    const msgs = await iBoiteService.getMessages(selectedConversationId);
                    setMessages(msgs.reverse());
                    await iBoiteService.markConversationAsRead(selectedConversationId);
                } catch (error) {
                    console.error('[IBoitePage] Error loading messages:', error);
                }
            };
            loadMessages();
        }
    }, [selectedConversationId]);

    // Filtered data
    const accountLetters = letters.filter(l => l.accountId === selectedAccount.id);
    const accountPackages = mockPackages.filter(p => p.accountId === selectedAccount.id);
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

    // Section badges
    const sectionBadges = {
        courriers: unreadLetters,
        colis: availablePackages,
        emails: unreadEmails
    };

    const handleMessageSent = useCallback((conversationId: string) => {
        toast.success('Message envoyé');
        setShowComposeEmail(false);
        // Reload conversations
        iBoiteService.getConversations({ archived: false }).then(setConversations);
    }, []);

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-2 overflow-hidden">

            {/* Left Panel - Controls */}
            <div className={cn(
                "w-72 shrink-0 rounded-xl flex flex-col overflow-hidden",
                "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm",
                "border border-slate-200 dark:border-slate-700"
            )}>
                {/* Account Selector - Compact */}
                <div className="p-2.5 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative">
                        <button
                            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                            className={cn(
                                "w-full flex items-center gap-2 p-2 rounded-lg transition-all",
                                "bg-gradient-to-r text-white shadow-md",
                                selectedAccount.color
                            )}
                        >
                            <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                                <selectedAccount.icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-bold truncate">{selectedAccount.name}</p>
                                <p className="text-xs text-white/70 truncate">{selectedAccount.email}</p>
                            </div>
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", accountDropdownOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {accountDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-50"
                                >
                                    {mockAccounts.map(account => (
                                        <button
                                            key={account.id}
                                            onClick={() => { setSelectedAccount(account); setAccountDropdownOpen(false); setSelectedLetter(null); }}
                                            className={cn(
                                                "w-full flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                                                selectedAccount.id === account.id && "bg-slate-100 dark:bg-white/10"
                                            )}
                                        >
                                            <div className={cn("w-6 h-6 rounded-md bg-gradient-to-r flex items-center justify-center text-white", account.color)}>
                                                <account.icon className="w-3 h-3" />
                                            </div>
                                            <span className="text-sm font-medium text-foreground">{account.name}</span>
                                            {selectedAccount.id === account.id && <Check className="w-3 h-3 text-primary ml-auto" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Context Badge */}
                    {context !== 'default' && (
                        <div className="mt-2 flex items-center gap-1.5">
                            <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                                {contextLabel || context.toUpperCase()}
                            </Badge>
                        </div>
                    )}

                    {/* Address - Ultra Compact */}
                    <div className="mt-2 p-1.5 rounded bg-slate-50 dark:bg-white/5 text-xs text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate">{selectedAccount.address.street}, {selectedAccount.address.city}</span>
                        <button onClick={copyAddress} className="p-0.5 rounded hover:bg-slate-200 ml-auto shrink-0">
                            {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                        </button>
                    </div>
                </div>

                {/* Section Tabs */}
                <div className="p-2.5 border-b border-slate-200 dark:border-slate-700">
                    <div className="space-y-0.5">
                        {[
                            { id: "courriers" as SectionType, label: "Courriers", icon: Mail, color: "text-blue-500" },
                            { id: "colis" as SectionType, label: "Colis", icon: Package, color: "text-amber-500" },
                            { id: "emails" as SectionType, label: "eMails", icon: MessageCircle, color: "text-green-500" },
                        ].map(section => (
                            <button
                                key={section.id}
                                onClick={() => { setActiveSection(section.id); setSelectedLetter(null); setSelectedConversationId(null); }}
                                className={cn(
                                    "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm font-medium transition-all",
                                    activeSection === section.id
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-1.5">
                                    <section.icon className={cn("w-3.5 h-3.5", activeSection === section.id ? "text-primary" : section.color)} />
                                    {section.label}
                                </div>
                                {sectionBadges[section.id] > 0 && (
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded-full text-xs font-bold",
                                        activeSection === section.id ? "bg-primary text-white" : "bg-primary/20 text-primary"
                                    )}>
                                        {sectionBadges[section.id]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Folders + Actions based on section */}
                <div className="flex-1 overflow-auto p-2.5">
                    {activeSection === "courriers" && (
                        <>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Dossiers</p>
                            <div className="space-y-0.5">
                                {[
                                    { id: "inbox" as FolderType, label: "Réception", icon: Inbox, count: unreadLetters },
                                    { id: "sent" as FolderType, label: "Expédiés", icon: Send },
                                    { id: "pending" as FolderType, label: "À traiter", icon: Clock, count: accountLetters.filter(l => l.folder === "pending").length },
                                    { id: "trash" as FolderType, label: "Poubelle", icon: Trash2 },
                                ].map(folder => (
                                    <button
                                        key={folder.id}
                                        onClick={() => { setCurrentFolder(folder.id); setSelectedLetter(null); }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm font-medium transition-all",
                                            currentFolder === folder.id
                                                ? "bg-white dark:bg-white/10 shadow-sm text-foreground"
                                                : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <folder.icon className="w-3.5 h-3.5" />
                                            {folder.label}
                                        </div>
                                        {folder.count && folder.count > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                                                {folder.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* New Letter Button */}
                            <button
                                onClick={() => setShowComposeEmail(true)}
                                className="w-full mt-3 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 shadow-md"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Nouveau courrier
                            </button>

                            {/* Letter Actions - Show when letter selected */}
                            {selectedLetter && (
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Actions</p>
                                    <div className="space-y-1">
                                        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium text-foreground bg-primary/10 hover:bg-primary/20 text-primary">
                                            <Reply className="w-3.5 h-3.5" />
                                            Répondre
                                        </button>
                                        <div className="grid grid-cols-2 gap-1">
                                            <button className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-slate-100 dark:hover:bg-white/5">
                                                <Download className="w-3.5 h-3.5 text-blue-500" />
                                                Télécharger
                                            </button>
                                            <button className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium text-foreground hover:bg-slate-100 dark:hover:bg-white/5">
                                                <Printer className="w-3.5 h-3.5 text-slate-500" />
                                                Imprimer
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => moveLetter(selectedLetter.id, "trash")}
                                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeSection === "colis" && (
                        <>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Statut</p>
                            <div className="space-y-1.5">
                                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                                    <div className="flex items-center gap-1.5 text-amber-600">
                                        <Package className="w-3.5 h-3.5" />
                                        <span className="text-sm font-semibold">{availablePackages} à retirer</span>
                                    </div>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                                    <div className="flex items-center gap-1.5 text-blue-600">
                                        <Truck className="w-3.5 h-3.5" />
                                        <span className="text-sm font-semibold">{accountPackages.filter(p => p.status === "transit").length} en transit</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-center">
                                <QrCode className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                                <p className="text-xs font-mono text-muted-foreground">{selectedAccount.address.qrCode}</p>
                            </div>
                        </>
                    )}

                    {activeSection === "emails" && (
                        <>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Dossiers</p>
                            <div className="space-y-0.5">
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
                                            "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm font-medium transition-all",
                                            emailFolder === folder.id
                                                ? "bg-white dark:bg-white/10 shadow-sm text-foreground"
                                                : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <folder.icon className={cn("w-3.5 h-3.5", folder.id === "starred" && emailFolder === folder.id && "text-amber-500 fill-amber-500")} />
                                            {folder.label}
                                        </div>
                                        {folder.count && folder.count > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                                                {folder.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Compose Email Button */}
                            <button
                                onClick={() => setShowComposeEmail(true)}
                                className="w-full mt-3 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 shadow-md"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Nouveau message
                            </button>
                        </>
                    )}
                </div>

                {/* Back Button when viewing - at bottom */}
                {(selectedLetter || selectedConversationId) && (
                    <div className="p-2.5 border-t border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => { setSelectedLetter(null); setSelectedConversationId(null); }}
                            className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-white/10 hover:bg-slate-200"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Retour à la liste
                        </button>
                    </div>
                )}
            </div>

            {/* Right Panel - Content - FULL HEIGHT FOR PDF */}
            <div
                ref={previewContainerRef}
                className={cn(
                    "flex-1 rounded-xl flex flex-col overflow-hidden",
                    "bg-slate-100/50 dark:bg-slate-800/30",
                    "border border-slate-200 dark:border-slate-700"
                )}
            >
                {/* COURRIERS SECTION */}
                {activeSection === "courriers" && (
                    selectedLetter ? (
                        /* Letter Preview - FULL SCREEN */
                        <div className="flex-1 overflow-auto p-3 flex items-center justify-center bg-slate-200/50 dark:bg-slate-900/50">
                            <div
                                style={{ transform: `scale(${previewScale})`, transformOrigin: 'center center' }}
                                className="bg-white shadow-2xl rounded-sm"
                            >
                                <div className="w-[595px] min-h-[842px] p-10">
                                    {/* Letter Header */}
                                    <div className="flex justify-between mb-6">
                                        <div className="text-xs text-slate-600 whitespace-pre-line">{selectedLetter.senderAddress}</div>
                                        <div className="text-xs font-semibold text-right whitespace-pre-line">{selectedLetter.recipientAddress}</div>
                                    </div>
                                    <div className="text-xs text-slate-600 text-right mb-5">
                                        Libreville, le {format(selectedLetter.createdAt, "dd MMMM yyyy", { locale: fr })}
                                    </div>
                                    <div className="text-base font-bold mb-5 pb-2 border-b border-slate-200">
                                        Objet : {selectedLetter.subject}
                                    </div>
                                    <div className="text-sm leading-6 whitespace-pre-wrap text-justify">
                                        {selectedLetter.content}
                                    </div>
                                    {selectedLetter.attachments.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-slate-200">
                                            <p className="text-xs font-bold text-slate-600 uppercase mb-2">Pièces jointes</p>
                                            <div className="space-y-1.5">
                                                {selectedLetter.attachments.map((a, i) => (
                                                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-slate-50 border text-xs">
                                                        <FileText className="w-4 h-4 text-blue-500" />
                                                        <span className="flex-1 font-medium">{a.name}</span>
                                                        <span className="text-slate-500">{a.size}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* Action Required Badge on document */}
                                    {selectedLetter.type === "action_required" && selectedLetter.folder === "inbox" && (
                                        <div className="mt-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-red-700">Action requise</p>
                                                <p className="text-xs text-red-600">Réponse attendue avant le {selectedLetter.dueDate ? format(selectedLetter.dueDate, "dd/MM/yyyy") : "prochainement"}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Letter List */
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="py-2 px-3 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
                                <h2 className="text-sm font-bold text-foreground">
                                    {currentFolder === "inbox" ? "Réception" : currentFolder === "sent" ? "Expédiés" : currentFolder === "pending" ? "À traiter" : "Poubelle"}
                                </h2>
                                <p className="text-xs text-muted-foreground">{filteredLetters.length} courrier(s)</p>
                            </div>
                            <div className="flex-1 overflow-auto p-3">
                                {filteredLetters.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                        <Mail className="w-10 h-10 mb-2 opacity-30" />
                                        <p className="text-xs">Aucun courrier</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {filteredLetters.map(letter => (
                                            <motion.button
                                                key={letter.id}
                                                onClick={() => { setSelectedLetter(letter); if (!letter.isRead) setLetters(prev => prev.map(l => l.id === letter.id ? { ...l, isRead: true } : l)); }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={cn(
                                                    "relative rounded-lg overflow-hidden text-left transition-all",
                                                    "bg-white dark:bg-white/5 hover:bg-slate-50",
                                                    "border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md",
                                                    !letter.isRead && "ring-2 ring-primary/30"
                                                )}
                                            >
                                                <div className="relative h-20 bg-[#f5f2eb] dark:bg-[#e8e4dc] overflow-hidden">
                                                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#ebe7df] to-[#dfd9ce]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
                                                    <div className="absolute top-2 left-0 right-0 bottom-0 bg-[#f5f2eb] dark:bg-[#e8e4dc] border-t border-black/5 p-2 flex flex-col justify-end">
                                                        {letter.type === "action_required" && !letter.isRead && (
                                                            <span className="absolute top-0.5 right-1 text-xs font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">URGENT</span>
                                                        )}
                                                        {letter.folder === "pending" && (
                                                            <span className="absolute top-0.5 right-1 text-xs font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">À TRAITER</span>
                                                        )}
                                                        <div className="bg-white/70 p-1.5 rounded">
                                                            <p className="text-xs font-semibold text-slate-800 truncate">{letter.folder === "sent" ? letter.recipient : letter.sender}</p>
                                                            <p className="text-xs text-slate-500 truncate">{letter.subject}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-2 py-1.5 bg-white dark:bg-slate-900/50 flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(letter.createdAt, { addSuffix: true, locale: fr })}
                                                    </p>
                                                    {letter.folder !== "pending" && letter.folder !== "trash" && letter.folder !== "sent" && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); moveLetter(letter.id, "pending"); }}
                                                            className="p-1 rounded hover:bg-amber-100 text-amber-600"
                                                            title="Marquer à traiter"
                                                        >
                                                            <Clock className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )}

                {/* COLIS SECTION */}
                {activeSection === "colis" && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="py-2 px-3 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
                            <h2 className="text-sm font-bold text-foreground">Mes Colis</h2>
                            <p className="text-xs text-muted-foreground">{accountPackages.length} colis</p>
                        </div>
                        <div className="flex-1 overflow-auto p-3">
                            {accountPackages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <Package className="w-10 h-10 mb-2 opacity-30" />
                                    <p className="text-xs">Aucun colis</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {accountPackages.map(pkg => (
                                        <motion.div
                                            key={pkg.id}
                                            whileHover={{ scale: 1.01 }}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                                                "bg-white dark:bg-white/5",
                                                "border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-lg flex items-center justify-center",
                                                pkg.status === "available" ? "bg-amber-500/10" : "bg-blue-500/10"
                                            )}>
                                                {pkg.status === "available" ? (
                                                    <Package className="w-6 h-6 text-amber-500" />
                                                ) : (
                                                    <Truck className="w-6 h-6 text-blue-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{pkg.description}</p>
                                                <p className="text-xs text-muted-foreground">De: {pkg.sender}</p>
                                                <p className="text-xs font-mono text-muted-foreground mt-0.5">{pkg.trackingNumber}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white",
                                                    pkg.status === "available" ? "bg-amber-500" : "bg-blue-500"
                                                )}>
                                                    {pkg.status === "available" ? "À retirer" : "En transit"}
                                                </span>
                                                {pkg.estimatedDelivery && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Arrivée: {format(pkg.estimatedDelivery, "dd/MM")}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* EMAILS SECTION */}
                {activeSection === "emails" && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="py-2 px-3 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
                            <h2 className="text-sm font-bold text-foreground">
                                {emailFolder === "inbox" ? "Boîte de réception" : emailFolder === "starred" ? "Favoris" : emailFolder === "sent" ? "Envoyés" : emailFolder === "archive" ? "Archives" : "Corbeille"}
                            </h2>
                            <p className="text-xs text-muted-foreground">{conversations.length} conversation(s)</p>
                        </div>
                        <ScrollArea className="flex-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : conversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                                    <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
                                    <p className="text-xs">Aucune conversation</p>
                                    <Button variant="link" size="sm" onClick={() => setShowComposeEmail(true)}>
                                        Démarrer une conversation
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {conversations.map(conv => {
                                        const participant = conv.participants?.[0];
                                        return (
                                            <button
                                                key={conv.id}
                                                onClick={() => setSelectedConversationId(conv.id)}
                                                className={cn(
                                                    "w-full flex items-start gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                                                    conv.unread_count > 0 && "bg-blue-50/50 dark:bg-blue-500/5",
                                                    selectedConversationId === conv.id && "bg-accent"
                                                )}
                                            >
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                                                    <Building2 className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className={cn("text-sm truncate", conv.unread_count > 0 ? "font-bold text-foreground" : "text-muted-foreground")}>
                                                            {participant?.name || 'Conversation'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground shrink-0">
                                                            {conv.updated_at ? formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: fr }) : ''}
                                                        </span>
                                                    </div>
                                                    {conv.subject && (
                                                        <p className={cn("text-xs truncate", conv.unread_count > 0 ? "font-semibold text-foreground" : "text-muted-foreground")}>{conv.subject}</p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message?.content || 'Nouvelle conversation'}</p>
                                                </div>
                                                {conv.unread_count > 0 && (
                                                    <Badge variant="default" className="h-5 min-w-5 rounded-full text-[10px] shrink-0">
                                                        {conv.unread_count}
                                                    </Badge>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                )}
            </div>

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
