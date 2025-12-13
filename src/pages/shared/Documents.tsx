import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Search, Loader2, AlertCircle, Eye, FolderOpen } from "lucide-react";
import { toast } from "sonner";

// Types
interface Document {
    id: string;
    title: string;
    type: "Bill" | "Report" | "Minutes" | "Decree" | "Other";
    date: string;
    status: "Draft" | "Final" | "Archived";
    size: string;
}

// Mock Data Service
const fetchDocuments = async (): Promise<Document[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: "1", title: "Projet de Loi de Finances 2026", type: "Bill", date: "2025-11-15", status: "Draft", size: "2.4 MB" },
                { id: "2", title: "Rapport de la Commission des Lois", type: "Report", date: "2025-11-10", status: "Final", size: "1.1 MB" },
                { id: "3", title: "PV Séance Plénière du 05/11/2025", type: "Minutes", date: "2025-11-06", status: "Archived", size: "850 KB" },
                { id: "4", title: "Décret portant nomination", type: "Decree", date: "2025-10-28", status: "Final", size: "450 KB" },
                { id: "5", title: "Note de Service Interne", type: "Other", date: "2025-10-15", status: "Final", size: "1.8 MB" },
            ]);
        }, 800);
    });
};

const Documents = () => {
    // State
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("All");

    // Load Data
    const loadDocuments = async () => {
        setLoading(true);
        try {
            const data = await fetchDocuments();
            setDocuments(data);
        } catch (err) {
            toast.error("Erreur de chargement des documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    // Filter Logic
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === "All" || doc.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const handleDownload = (doc: Document) => {
        toast.success(`Téléchargement de ${doc.title} lancé`);
    };

    const handleView = (doc: Document) => {
        toast.info(`Ouverture de ${doc.title}`);
    };

    return (
        <div className="space-y-6 animate-fade-in p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Mes Documents</h1>
                    <p className="text-muted-foreground">Accédez à l'ensemble de vos documents et fichiers.</p>
                </div>
                <Button onClick={loadDocuments} variant="outline" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Actualiser"}
                </Button>
            </div>

            {/* Filters & Search */}
            <Card className="p-4 bg-card border-border/50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Rechercher un document..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {["All", "Bill", "Report", "Minutes", "Decree", "Other"].map((type) => (
                            <Button
                                key={type}
                                variant={filterType === type ? "default" : "outline"}
                                onClick={() => setFilterType(type)}
                                size="sm"
                                className="whitespace-nowrap"
                            >
                                {type === "All" ? "Tous" : type}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-center text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mb-4 opacity-20" />
                    <p>Aucun document trouvé.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredDocuments.map((doc) => (
                        <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow duration-200 border-border/50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{doc.title}</h3>
                                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                                            <span>• {doc.date}</span>
                                            <span>• {doc.size}</span>
                                            <Badge variant={doc.status === "Final" ? "default" : "outline"} className="text-xs ml-2">
                                                {doc.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <Button variant="ghost" size="sm" onClick={() => handleView(doc)} className="flex-1 md:flex-none">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Voir
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDownload(doc)} className="flex-1 md:flex-none">
                                        <Download className="w-4 h-4 mr-2" />
                                        Télécharger
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Documents;
