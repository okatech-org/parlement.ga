import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText, Gavel, Download, Eye, ThumbsUp, ThumbsDown, MinusCircle } from "lucide-react";
import { toast } from "sonner";

const LegislativeTools = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const documents = [
        { id: 1, title: "Projet de Loi de Finances 2026", type: "Bill", status: "Voting", date: "2025-12-01" },
        { id: 2, title: "Loi sur la Protection des Données", type: "Bill", status: "Review", date: "2025-11-28" },
        { id: 3, title: "Amendement - Article 45 Code Civil", type: "Amendment", status: "Draft", date: "2025-11-25" },
    ];

    const handleVote = (type: 'for' | 'against' | 'abstain', docTitle: string) => {
        toast.success(`Vote "${type}" enregistré pour : ${docTitle}`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Outils Législatifs</h1>
                <p className="text-muted-foreground">Accédez aux textes de loi, amendements et interface de vote.</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Rechercher un texte, un amendement..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Documents List */}
            <div className="space-y-4">
                {documents.map((doc) => (
                    <Card key={doc.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{doc.title}</h3>
                                        <Badge variant={doc.status === "Voting" ? "destructive" : "secondary"}>
                                            {doc.status === "Voting" ? "Vote en cours" : doc.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {doc.type} • {doc.date}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {doc.status === "Voting" && (
                                    <div className="flex gap-2 mr-4 border-r pr-4 border-border">
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleVote('for', doc.title)}>
                                            <ThumbsUp className="w-4 h-4 mr-2" /> Pour
                                        </Button>
                                        <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleVote('against', doc.title)}>
                                            <ThumbsDown className="w-4 h-4 mr-2" /> Contre
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleVote('abstain', doc.title)}>
                                            <MinusCircle className="w-4 h-4 mr-2" /> Abst.
                                        </Button>
                                    </div>
                                )}
                                <Button variant="ghost" size="icon">
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default LegislativeTools;
