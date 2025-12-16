import { useState, useRef, useEffect } from "react";
import {
    ArrowLeftRight, CheckCircle, XCircle, Minus, Send,
    Users, FileText, Clock, MessageSquare, AlertTriangle,
    ChevronLeft, ChevronRight, Vote, Bookmark, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface CMPWorkspaceProps {
    cmpId?: string;
}

interface Article {
    number: number;
    assemblyText: string;
    senateText: string;
    compromiseText: string;
    status: "pending" | "adopted" | "rejected" | "reserved";
    hasDiff: boolean;
}

interface ChatMessage {
    id: string;
    sender: string;
    senderChamber: "ASSEMBLY" | "SENATE";
    message: string;
    timestamp: string;
    isSystem?: boolean;
}

/**
 * War Room de la CMP - Outil de fusion des textes législatifs
 * Interface en 3 colonnes + chat sécurisé
 */
const CMPWorkspace = ({ cmpId }: CMPWorkspaceProps) => {
    const { t } = useLanguage();
    const [currentArticle, setCurrentArticle] = useState(0);
    const [chatMessage, setChatMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Données simulées de la CMP
    const cmpInfo = {
        reference: "CMP-2024-007",
        title: "Projet de Loi de Finances 2025",
        deadline: "22 Décembre 2024",
        daysLeft: 8,
        members: {
            assembly: 7,
            senate: 7,
        },
        progress: 45,
        articlesTotal: 12,
        articlesAdopted: 5,
        articlesReserved: 1,
    };

    // Articles avec diff (simulés)
    const [articles, setArticles] = useState<Article[]>([
        {
            number: 1,
            assemblyText: "Article 1er\n\nLe budget général de l'État pour l'exercice 2025 est arrêté en recettes à 3 200 milliards de FCFA.\n\nLes recettes sont réparties comme suit :\n- Recettes fiscales : 2 100 milliards\n- Recettes pétrolières : 800 milliards\n- Autres recettes : 300 milliards",
            senateText: "Article 1er\n\nLe budget général de l'État pour l'exercice 2025 est arrêté en recettes à 3 350 milliards de FCFA.\n\nLes recettes sont réparties comme suit :\n- Recettes fiscales : 2 200 milliards\n- Recettes pétrolières : 850 milliards\n- Autres recettes : 300 milliards",
            compromiseText: "",
            status: "pending",
            hasDiff: true,
        },
        {
            number: 2,
            assemblyText: "Article 2\n\nLes dépenses totales sont fixées à 3 150 milliards de FCFA.\n\nLe déficit budgétaire prévu est de 50 milliards de FCFA, soit 1,5% du PIB.",
            senateText: "Article 2\n\nLes dépenses totales sont fixées à 3 300 milliards de FCFA.\n\nLe déficit budgétaire prévu est de 50 milliards de FCFA, soit 1,5% du PIB.\n\nUne réserve de précaution de 30 milliards est constituée.",
            compromiseText: "",
            status: "pending",
            hasDiff: true,
        },
        {
            number: 3,
            assemblyText: "Article 3\n\nLa dotation aux collectivités locales est fixée à 150 milliards de FCFA.",
            senateText: "Article 3\n\nLa dotation aux collectivités locales est fixée à 200 milliards de FCFA, conformément aux recommandations du Sénat sur la décentralisation.",
            compromiseText: "Article 3\n\nLa dotation aux collectivités locales est fixée à 175 milliards de FCFA, avec une clause de révision annuelle.",
            status: "adopted",
            hasDiff: true,
        },
    ]);

    // Chat de la CMP
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            sender: "Système",
            senderChamber: "ASSEMBLY",
            message: `${t('congress.cmpWorkspace.chat.systemWelcome')} ${cmpInfo.reference}.`,
            timestamp: "10:00",
            isSystem: true,
        },
        {
            id: "2",
            sender: "Paul Nguema",
            senderChamber: "ASSEMBLY",
            message: "Je propose qu'on examine l'article 3 en premier, c'est le plus sensible sur la dotation aux collectivités.",
            timestamp: "10:05",
        },
        {
            id: "3",
            sender: "Marie Obame",
            senderChamber: "SENATE",
            message: "D'accord avec le rapporteur. Le Sénat insiste sur les 200 milliards pour les collectivités.",
            timestamp: "10:08",
        },
        {
            id: "4",
            sender: "Jean Mba",
            senderChamber: "ASSEMBLY",
            message: "Nous pourrions trouver un compromis à 175 milliards avec une clause de révision ?",
            timestamp: "10:12",
        },
    ]);

    // Scroll automatique du chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    // Naviguer entre les articles
    const goToArticle = (direction: "prev" | "next") => {
        if (direction === "prev" && currentArticle > 0) {
            setCurrentArticle(currentArticle - 1);
        } else if (direction === "next" && currentArticle < articles.length - 1) {
            setCurrentArticle(currentArticle + 1);
        }
    };

    // Simuler un vote sur l'article
    const voteOnArticle = (decision: "adopt" | "reject" | "reserve") => {
        const newArticles = [...articles];
        newArticles[currentArticle].status =
            decision === "adopt" ? "adopted" :
                decision === "reject" ? "rejected" : "reserved";
        setArticles(newArticles);
    };

    // Envoyer un message
    const sendMessage = () => {
        if (!chatMessage.trim()) return;

        setChatMessages([
            ...chatMessages,
            {
                id: Date.now().toString(),
                sender: "Vous",
                senderChamber: "ASSEMBLY", // À dynamiser
                message: chatMessage,
                timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            }
        ]);
        setChatMessage("");
    };

    const article = articles[currentArticle];

    // Fonction simple de diff (surlignage des différences)
    const highlightDiff = (text1: string, text2: string): { text: string; isDiff: boolean }[] => {
        // Simplification : on compare ligne par ligne
        const lines1 = text1.split("\n");
        const lines2 = text2.split("\n");

        return lines1.map((line, i) => ({
            text: line,
            isDiff: lines2[i] !== line
        }));
    };

    const assemblyDiff = highlightDiff(article.assemblyText, article.senateText);
    const senateDiff = highlightDiff(article.senateText, article.assemblyText);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            {/* Header CMP */}
            <header className="bg-gradient-to-r from-amber-600 to-amber-500 text-white border-b sticky top-0 z-50 shadow-lg">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ArrowLeftRight className="h-6 w-6" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-white/20">{cmpInfo.reference}</Badge>
                                    <Badge variant="outline" className="border-white/50 text-white">
                                        🔒 {t('congress.cmpWorkspace.header.confidential')}
                                    </Badge>
                                </div>
                                <h1 className="font-bold">{cmpInfo.title}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                                <p className="text-amber-100">{t('congress.cmpWorkspace.header.deadline')}: {cmpInfo.deadline}</p>
                                <p className="font-bold">{cmpInfo.daysLeft} {t('congress.cmpWorkspace.header.daysLeft')}</p>
                            </div>
                            <div className="text-center px-4 border-l border-amber-400">
                                <p className="text-2xl font-bold">{cmpInfo.progress}%</p>
                                <p className="text-xs text-amber-100">{t('congress.cmpWorkspace.header.completed')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Barre de progression des articles */}
            <div className="bg-white dark:bg-slate-800 border-b px-4 py-2">
                <div className="container mx-auto flex items-center gap-4">
                    <span className="text-sm font-medium">{t('congress.cmpWorkspace.header.articles')}:</span>
                    <div className="flex gap-1 flex-1">
                        {articles.map((art, idx) => (
                            <button
                                key={art.number}
                                onClick={() => setCurrentArticle(idx)}
                                className={cn(
                                    "h-8 flex-1 rounded text-xs font-medium transition-all",
                                    idx === currentArticle && "ring-2 ring-offset-1 ring-blue-500",
                                    art.status === "adopted" && "bg-green-500 text-white",
                                    art.status === "rejected" && "bg-red-500 text-white",
                                    art.status === "reserved" && "bg-amber-500 text-white",
                                    art.status === "pending" && "bg-slate-200 dark:bg-slate-700",
                                    art.hasDiff && art.status === "pending" && "border-2 border-red-400"
                                )}
                            >
                                Art. {art.number}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {cmpInfo.articlesAdopted}
                        </span>
                        <span className="flex items-center gap-1">
                            <Bookmark className="h-4 w-4 text-amber-500" />
                            {cmpInfo.articlesReserved}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Zone de travail 3 colonnes */}
                    <div className="lg:col-span-3">
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => goToArticle("prev")}
                                            disabled={currentArticle === 0}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div>
                                            <CardTitle>Article {article.number}</CardTitle>
                                            <CardDescription>
                                                {article.hasDiff
                                                    ? t('congress.cmpWorkspace.status.divergence')
                                                    : t('congress.cmpWorkspace.status.identical')}
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => goToArticle("next")}
                                            disabled={currentArticle === articles.length - 1}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Badge
                                        className={cn(
                                            article.status === "adopted" && "bg-green-500",
                                            article.status === "rejected" && "bg-red-500",
                                            article.status === "reserved" && "bg-amber-500",
                                            article.status === "pending" && "bg-slate-500"
                                        )}
                                    >
                                        {article.status === "adopted" && t('congress.cmpWorkspace.status.adopted')}
                                        {article.status === "rejected" && t('congress.cmpWorkspace.status.rejected')}
                                        {article.status === "reserved" && t('congress.cmpWorkspace.status.reserved')}
                                        {article.status === "pending" && t('congress.cmpWorkspace.status.pending')}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="grid md:grid-cols-3 divide-x divide-border">
                                    {/* Colonne Assemblée */}
                                    <div className="bg-primary/5">
                                        <div className="bg-primary text-white p-3 text-center font-bold">
                                            🟢 {t('congress.cmpWorkspace.columns.assembly')}
                                        </div>
                                        <ScrollArea className="h-[400px] p-4">
                                            <div className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                                                {assemblyDiff.map((line, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "py-0.5 px-1 rounded",
                                                            line.isDiff && "bg-red-100 dark:bg-red-900/30 border-l-2 border-red-500"
                                                        )}
                                                    >
                                                        {line.text || "\u00A0"}
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    {/* Colonne Compromis (Éditable) */}
                                    <div className="bg-blue-50/50 dark:bg-blue-950/20">
                                        <div className="bg-blue-900 text-white p-3 text-center font-bold">
                                            ✍️ {t('congress.cmpWorkspace.columns.compromise')}
                                        </div>
                                        <div className="p-4">
                                            <Textarea
                                                className="min-h-[380px] font-mono text-sm resize-none border-blue-200 focus:border-blue-500"
                                                placeholder={t('congress.cmpWorkspace.columns.compromisePlaceholder')}
                                                value={articles[currentArticle].compromiseText}
                                                onChange={(e) => {
                                                    const newArticles = [...articles];
                                                    newArticles[currentArticle].compromiseText = e.target.value;
                                                    setArticles(newArticles);
                                                }}
                                                disabled={article.status !== "pending"}
                                            />
                                        </div>
                                    </div>

                                    {/* Colonne Sénat */}
                                    <div className="bg-red-50/50 dark:bg-red-950/10">
                                        <div className="bg-red-800 text-white p-3 text-center font-bold">
                                            🔴 {t('congress.cmpWorkspace.columns.senate')}
                                        </div>
                                        <ScrollArea className="h-[400px] p-4">
                                            <div className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                                                {senateDiff.map((line, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "py-0.5 px-1 rounded",
                                                            line.isDiff && "bg-red-100 dark:bg-red-900/30 border-l-2 border-red-500"
                                                        )}
                                                    >
                                                        {line.text || "\u00A0"}
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </div>

                                {/* Boutons de vote */}
                                {article.status === "pending" && (
                                    <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">
                                            {t('congress.cmpWorkspace.actions.decision')}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => voteOnArticle("reserve")}
                                            >
                                                <Bookmark className="h-4 w-4 mr-2" />
                                                {t('congress.cmpWorkspace.actions.reserve')}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => voteOnArticle("reject")}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                {t('congress.cmpWorkspace.actions.reject')}
                                            </Button>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => voteOnArticle("adopt")}
                                                disabled={!articles[currentArticle].compromiseText.trim()}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                {t('congress.cmpWorkspace.actions.adopt')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chat Sécurisé CMP */}
                    <div className="lg:col-span-1">
                        <Card className="h-full flex flex-col">
                            <CardHeader className="bg-slate-800 text-white py-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    {t('congress.cmpWorkspace.chat.title')}
                                    <Badge variant="outline" className="ml-auto border-white/30 text-white text-[10px]">
                                        14 {t('congress.cmpWorkspace.chat.members')}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <ScrollArea className="flex-1 p-3 max-h-[450px]">
                                <div className="space-y-3">
                                    {chatMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "p-2 rounded-lg",
                                                msg.isSystem && "bg-slate-100 dark:bg-slate-800 text-center italic text-sm",
                                                !msg.isSystem && msg.senderChamber === "ASSEMBLY" && "bg-primary/10 border-l-2 border-primary",
                                                !msg.isSystem && msg.senderChamber === "SENATE" && "bg-red-50 dark:bg-red-950/30 border-l-2 border-red-500"
                                            )}
                                        >
                                            {!msg.isSystem && (
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className="font-bold">{msg.sender}</span>
                                                    <span className="text-muted-foreground">{msg.timestamp}</span>
                                                </div>
                                            )}
                                            <p className="text-sm">{msg.message}</p>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                            </ScrollArea>
                            <div className="p-3 border-t">
                                <div className="flex gap-2">
                                    <Textarea
                                        placeholder={t('congress.cmpWorkspace.chat.placeholder')}
                                        className="min-h-[60px] resize-none text-sm"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                    />
                                    <Button size="icon" onClick={sendMessage}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CMPWorkspace;
