import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, FileText, Download, Search, Filter } from "lucide-react";

export const DocumentsSection = () => {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Documents</h1>
                <p className="text-muted-foreground">
                    Bibliothèque numérique : Rapports, Journaux Officiels et Textes de Loi
                </p>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Rechercher un document..." className="pl-9" />
                </div>
                <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filtres</Button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">

                {/* Folders */}
                <div className="space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Dossiers</h3>
                    {[
                        { name: "Projets de Loi 2025", count: 12 },
                        { name: "Rapports Commissions", count: 8 },
                        { name: "Journal Officiel", count: 45 },
                        { name: "Notes de Synthèse", count: 5 },
                        { name: "Mes Archives", count: 23 },
                    ].map((folder, i) => (
                        <div key={i} className="flex items-center justify-between p-3 neu-raised rounded-xl cursor-pointer hover:text-primary transition-colors group">
                            <div className="flex items-center gap-3">
                                <FolderOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                <span className="font-medium text-sm">{folder.name}</span>
                            </div>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{folder.count}</span>
                        </div>
                    ))}
                </div>

                {/* Files Grid */}
                <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: "Projet de Loi Finances 2025", type: "PDF", size: "2.4 MB", date: "Hier" },
                        { title: "Rapport Commission Lois", type: "DOCX", size: "1.1 MB", date: "28 Nov" },
                        { title: "JO - Séance du 25 Nov", type: "PDF", size: "5.8 MB", date: "26 Nov" },
                        { title: "Note - Impact Écologique", type: "PDF", size: "800 KB", date: "20 Nov" },
                        { title: "Amendement n°42 - PL Finances", type: "PDF", size: "120 KB", date: "18 Nov" },
                        { title: "Compte Rendu - Mission Oyem", type: "DOCX", size: "3.2 MB", date: "15 Nov" },
                    ].map((file, i) => (
                        <Card key={i} className="p-4 neu-raised hover:scale-[1.02] transition-transform group cursor-pointer">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 neu-inset rounded-lg">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
                            </div>
                            <h4 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">{file.title}</h4>
                            <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                                <span>{file.type} • {file.size}</span>
                                <span>{file.date}</span>
                            </div>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
};
