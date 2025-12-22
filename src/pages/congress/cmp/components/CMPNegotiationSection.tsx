import { useState } from "react";
import { FileText, MessageSquare, Save, History, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NegotiationText {
    id: string;
    article: string;
    versionAN: string;
    versionSenate: string;
    status: 'agreed' | 'conflict' | 'pending';
    compromise?: string;
}

const MOCK_NEGOTIATION_DATA: NegotiationText[] = [
    {
        id: "art-1",
        article: "Article 1",
        versionAN: "L'État garantit l'accès aux services numériques pour tous les citoyens sur l'ensemble du territoire, y compris les zones rurales isolées.",
        versionSenate: "L'État favorise le déploiement des infrastructures numériques afin de permettre l'accès aux services essentiels, dans la mesure des disponibilités budgétaires.",
        status: 'conflict',
        compromise: ""
    },
    {
        id: "art-2",
        article: "Article 2",
        versionAN: "Les opérateurs sont tenus de fournir une qualité de service minimale définie par décret.",
        versionSenate: "Les opérateurs sont tenus de fournir une qualité de service minimale définie par décret.",
        status: 'agreed',
        compromise: "Les opérateurs sont tenus de fournir une qualité de service minimale définie par décret."
    }
];

export const CMPNegotiationSection = () => {
    const [selectedArticle, setSelectedArticle] = useState<NegotiationText>(MOCK_NEGOTIATION_DATA[0]);
    const [compromiseDraft, setCompromiseDraft] = useState(selectedArticle.compromise || "");

    return (
        <div className="flex h-[calc(100vh-140px)] gap-4">
            {/* Sidebar List */}
            <Card className="w-1/4 flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Articles en discussion</CardTitle>
                    <CardDescription>Loi Numérique 2025</CardDescription>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                        {MOCK_NEGOTIATION_DATA.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setSelectedArticle(item);
                                    setCompromiseDraft(item.compromise || "");
                                }}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedArticle.id === item.id
                                        ? "bg-accent border-primary"
                                        : "hover:bg-muted border-transparent"
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold">{item.article}</span>
                                    {item.status === 'agreed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                    {item.status === 'conflict' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {item.status === 'agreed' ? "Accord trouvé ✅" : "Divergence de vues ⚠️"}
                                </p>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-muted/20">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Accord: 50%</span>
                        <span>Restant: 1</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-green-500 w-1/2" />
                    </div>
                </div>
            </Card>

            {/* Main Work Area */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Comparison View */}
                <div className="grid grid-cols-2 gap-4 h-1/2">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="py-3 px-4 bg-muted/20">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm font-bold text-blue-700">Version Assemblée</CardTitle>
                                <Badge variant="outline" className="text-blue-600 bg-blue-50">AN</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 overflow-y-auto h-[200px]">
                            <p className="text-sm leading-relaxed">{selectedArticle.versionAN}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="py-3 px-4 bg-muted/20">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm font-bold text-orange-700">Version Sénat</CardTitle>
                                <Badge variant="outline" className="text-orange-600 bg-orange-50">Sénat</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 overflow-y-auto h-[200px]">
                            <p className="text-sm leading-relaxed">{selectedArticle.versionSenate}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Compromise Editor */}
                <Card className="flex-1 flex flex-col border-2 border-purple-500/20">
                    <CardHeader className="py-3 bg-purple-500/5 border-b">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <GitMerge className="h-5 w-5 text-purple-600" />
                                <CardTitle className="text-base font-bold">Rédaction du Compromis</CardTitle>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <History className="h-4 w-4" />
                                    Historique
                                </Button>
                                <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
                                    <Save className="h-4 w-4" />
                                    Enregistrer
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <Textarea
                            className="h-full border-none resize-none p-4 focus-visible:ring-0 text-base"
                            placeholder="Rédigez ici la proposition de texte commune..."
                            value={compromiseDraft}
                            onChange={(e) => setCompromiseDraft(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Collaboration Panel */}
            <Card className="w-1/5 flex flex-col">
                <CardHeader className="py-3 border-b">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Discussion
                    </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-3">
                    <div className="space-y-4">
                        <div className="bg-muted p-2 rounded-lg text-xs">
                            <div className="font-bold flex justify-between mb-1">
                                <span>Président AN</span>
                                <span className="text-gray-500">10:00</span>
                            </div>
                            <p>Le terme "garantit" est trop fort juridiquement pour nous.</p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-lg text-xs ml-4 border border-blue-100">
                            <div className="font-bold flex justify-between mb-1">
                                <span className="text-blue-700">Vous</span>
                                <span className="text-gray-500">10:05</span>
                            </div>
                            <p>Proposons "promeut" ou "assure" ?</p>
                        </div>
                    </div>
                </ScrollArea>
                <div className="p-2 border-t">
                    <Button size="sm" className="w-full" variant="secondary">Message...</Button>
                </div>
            </Card>
        </div>
    );
};

// Missing Icon import fix
import { GitMerge } from "lucide-react";
