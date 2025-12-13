import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText, Eye } from "lucide-react";

const LegislativeTracking = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const documents = [
        { id: 1, title: "Projet de Loi de Finances 2026", type: "Bill", status: "Voting", date: "2025-12-01" },
        { id: 2, title: "Loi sur la Protection des Données", type: "Bill", status: "Review", date: "2025-11-28" },
        { id: 3, title: "Amendement - Article 45 Code Civil", type: "Amendment", status: "Draft", date: "2025-11-25" },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Suivi Législatif</h1>
                <p className="text-muted-foreground">Consultez les textes en cours d'examen (Lecture seule).</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Rechercher un texte..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Documents List */}
            <div className="space-y-4">
                {documents.map((doc) => (
                    <Card key={doc.id} className="p-6 hover:shadow-md transition-all duration-200 border-border/50 opacity-90">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 bg-gray-100 dark:bg-muted rounded-lg">
                                    <FileText className="w-6 h-6 text-gray-500" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{doc.title}</h3>
                                        <Badge variant="outline">
                                            {doc.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {doc.type} • {doc.date}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                                <Eye className="w-4 h-4" />
                                Lecture seule
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default LegislativeTracking;
