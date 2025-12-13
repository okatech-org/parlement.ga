import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const SecretaryDocuments = () => {
    const documents = [
        {
            title: "Projet de Loi de Finances 2024",
            type: "Projet de Loi",
            date: "2024-03-10",
            size: "2.4 MB",
            tag: "Finance"
        },
        {
            title: "Compte Rendu - Séance du 08 Mars",
            type: "Compte Rendu",
            date: "2024-03-09",
            size: "1.1 MB",
            tag: "Séance"
        },
        {
            title: "Amendement n°12 - Code du Travail",
            type: "Amendement",
            date: "2024-03-08",
            size: "0.5 MB",
            tag: "Législation"
        },
        {
            title: "Note de Synthèse - Commission des Finances",
            type: "Note",
            date: "2024-03-05",
            size: "0.8 MB",
            tag: "Commission"
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Documents Parlementaires</h1>
                    <p className="text-muted-foreground">Accès aux textes de loi, comptes rendus et archives.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input placeholder="Rechercher un document..." className="pl-10 bg-white dark:bg-card border-none shadow-sm" />
                    </div>
                    <Button variant="outline" size="icon" className="bg-white dark:bg-card border-none shadow-sm">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {documents.map((doc, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-all duration-300 border-none shadow-sm bg-white dark:bg-card group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 group-hover:bg-indigo-100 transition-colors">
                                    <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{doc.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                        <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium">{doc.tag}</span>
                                        <span>•</span>
                                        <span>{doc.type}</span>
                                        <span>•</span>
                                        <span>{doc.date}</span>
                                        <span>•</span>
                                        <span>{doc.size}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="hover:bg-indigo-50 hover:text-indigo-600">
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:bg-indigo-50 hover:text-indigo-600">
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

export default SecretaryDocuments;
