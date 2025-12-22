/**
 * Page Documents Partagée
 * 
 * Gestion des documents parlementaires avec catégories spécifiques,
 * recherche, filtres et statistiques.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import {
    FileText,
    Download,
    Eye,
    Search,
    Filter,
    Plus,
    FolderOpen,
    Gavel,
    BookOpen,
    FileQuestion,
    FileCheck,
    Loader2,
    Upload,
    AlertCircle
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Types de documents parlementaires
type DocumentType =
    | 'projet_loi'      // Projet de loi
    | 'proposition'     // Proposition de loi
    | 'rapport'         // Rapport de commission
    | 'pv_seance'       // PV de séance
    | 'amendement'      // Amendement
    | 'question'        // Question au gouvernement
    | 'decret'          // Décret
    | 'circulaire';     // Circulaire

type DocumentStatus = 'brouillon' | 'en_examen' | 'adopte' | 'rejete' | 'archive';

export type DocumentContext = 'default' | 'congress' | 'cmp' | 'bureau' | 'an' | 'senat';

interface SharedDocumentsPageProps {
    context?: DocumentContext;
    contextLabel?: string;
}

interface ParliamentaryDocument {
    id: string;
    title: string;
    type: DocumentType;
    date: string;
    reference: string;
    status: DocumentStatus;
    author?: string;
    commission?: string;
    size?: string;
    description?: string;
    context?: DocumentContext[];
}

// Mock data - À remplacer par appel Supabase
const MOCK_DOCUMENTS: ParliamentaryDocument[] = [
    { id: '1', title: "Projet de Loi de Finances 2026", type: 'projet_loi', date: '2025-12-15', reference: 'PL-2025-045', status: 'en_examen', author: 'Gouvernement', commission: 'Finances', context: ['an', 'senat', 'congress', 'cmp'] },
    { id: '2', title: "Rapport sur la réforme de l'éducation", type: 'rapport', date: '2025-12-10', reference: 'RAP-2025-089', status: 'adopte', commission: 'Affaires Sociales', size: '2.4 MB', context: ['an'] },
    { id: '3', title: "PV Séance Plénière du 05/12/2025", type: 'pv_seance', date: '2025-12-06', reference: 'PV-2025-048', status: 'archive', size: '1.1 MB', context: ['an', 'senat', 'congress'] },
    { id: '4', title: "Proposition de loi sur le numérique", type: 'proposition', date: '2025-12-01', reference: 'PPL-2025-012', status: 'en_examen', author: 'Groupe Majoritaire', context: ['an', 'senat'] },
    { id: '5', title: "Amendement au projet de budget", type: 'amendement', date: '2025-11-28', reference: 'AMD-2025-234', status: 'rejete', author: 'Opposition', context: ['an', 'cmp'] },
    { id: '6', title: "Question orale - Politique énergétique", type: 'question', date: '2025-11-25', reference: 'QO-2025-156', status: 'archive', context: ['an'] },
    { id: '7', title: "Décret portant organisation du Parlement", type: 'decret', date: '2025-11-20', reference: 'DEC-2025-008', status: 'adopte', context: ['default'] },
    { id: 'cmp1', title: "Texte de compromis - PJL Finances", type: 'projet_loi', date: '2025-12-22', reference: 'CMP-2025-001', status: 'en_examen', commission: 'CMP', context: ['cmp'] },
    { id: 'cong1', title: "Projet de révision constitutionnelle", type: 'projet_loi', date: '2025-12-23', reference: 'CONST-2025-001', status: 'en_examen', context: ['congress'] },
];

const typeConfig: Record<DocumentType, { label: string; icon: typeof FileText; color: string }> = {
    'projet_loi': { label: 'Projet de loi', icon: Gavel, color: 'bg-blue-500/10 text-blue-500' },
    'proposition': { label: 'Proposition', icon: FileText, color: 'bg-purple-500/10 text-purple-500' },
    'rapport': { label: 'Rapport', icon: BookOpen, color: 'bg-green-500/10 text-green-500' },
    'pv_seance': { label: 'PV Séance', icon: FileCheck, color: 'bg-orange-500/10 text-orange-500' },
    'amendement': { label: 'Amendement', icon: FileText, color: 'bg-yellow-500/10 text-yellow-500' },
    'question': { label: 'Question', icon: FileQuestion, color: 'bg-pink-500/10 text-pink-500' },
    'decret': { label: 'Décret', icon: Gavel, color: 'bg-red-500/10 text-red-500' },
    'circulaire': { label: 'Circulaire', icon: FileText, color: 'bg-gray-500/10 text-gray-500' }
};

const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
    'brouillon': { label: 'Brouillon', color: 'bg-gray-500/10 text-gray-500' },
    'en_examen': { label: 'En examen', color: 'bg-yellow-500/10 text-yellow-500' },
    'adopte': { label: 'Adopté', color: 'bg-green-500/10 text-green-500' },
    'rejete': { label: 'Rejeté', color: 'bg-red-500/10 text-red-500' },
    'archive': { label: 'Archivé', color: 'bg-blue-500/10 text-blue-500' }
};

export default function SharedDocumentsPage({ context = 'default', contextLabel }: SharedDocumentsPageProps) {
    const [documents, setDocuments] = useState<ParliamentaryDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Charger les documents
    useEffect(() => {
        const loadDocuments = async () => {
            setIsLoading(true);
            try {
                // TODO: Remplacer par appel Supabase
                await new Promise(resolve => setTimeout(resolve, 800));
                setDocuments(MOCK_DOCUMENTS);
            } catch (error) {
                console.error('[SharedDocumentsPage] Error loading documents:', error);
                toast.error('Erreur lors du chargement des documents');
            } finally {
                setIsLoading(false);
            }
        };

        loadDocuments();
    }, []);

    // Filtrer les documents
    const filteredDocs = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch =
                doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.reference.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = !selectedType || doc.type === selectedType;

            // Filtre par contexte
            const matchesContext = !doc.context || doc.context.includes(context);

            return matchesSearch && matchesType && matchesContext;
        });
    }, [documents, searchQuery, selectedType, context]);

    // Statistiques
    const stats = useMemo(() => ({
        total: documents.length,
        projets: documents.filter(d => d.type === 'projet_loi' || d.type === 'proposition').length,
        rapports: documents.filter(d => d.type === 'rapport').length,
        enExamen: documents.filter(d => d.status === 'en_examen').length
    }), [documents]);

    const handleView = (doc: ParliamentaryDocument) => {
        toast.info(`Ouverture de ${doc.title}`);
    };

    const handleDownload = (doc: ParliamentaryDocument) => {
        toast.success(`Téléchargement de ${doc.title} lancé`);
    };

    return (
        <div className="space-y-6 p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Mes Documents
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Documents législatifs et administratifs
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setIsUploadOpen(true)}>
                    <Upload className="h-4 w-4" />
                    Nouveau document
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="neu-card border-none cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setSelectedType(null)}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <FolderOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-sm text-muted-foreground">Total documents</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`neu-card border-none cursor-pointer transition-colors ${selectedType === 'projet_loi' ? 'ring-2 ring-primary' : 'hover:bg-muted/30'}`}
                    onClick={() => setSelectedType(selectedType === 'projet_loi' ? null : 'projet_loi')}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Gavel className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.projets}</p>
                                <p className="text-sm text-muted-foreground">Textes de loi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`neu-card border-none cursor-pointer transition-colors ${selectedType === 'rapport' ? 'ring-2 ring-primary' : 'hover:bg-muted/30'}`}
                    onClick={() => setSelectedType(selectedType === 'rapport' ? null : 'rapport')}
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <BookOpen className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.rapports}</p>
                                <p className="text-sm text-muted-foreground">Rapports</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="neu-card border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-yellow-500/10">
                                <AlertCircle className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.enExamen}</p>
                                <p className="text-sm text-muted-foreground">En examen</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par titre ou référence..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedType || 'all'} onValueChange={(v) => setSelectedType(v === 'all' ? null : v as DocumentType)}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Type de document" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {Object.entries(typeConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>{config.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Documents List */}
            <Card className="neu-card border-none">
                <CardHeader>
                    <CardTitle className="text-lg">Documents récents</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredDocs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <FileText className="h-12 w-12 opacity-20 mb-3" />
                                <p className="text-sm">Aucun document trouvé</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredDocs.map((doc) => {
                                    const typeInfo = typeConfig[doc.type];
                                    const statusInfo = statusConfig[doc.status];
                                    const IconComponent = typeInfo.icon;

                                    return (
                                        <div
                                            key={doc.id}
                                            className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className={typeInfo.color}>
                                                            <IconComponent className="h-3 w-3 mr-1" />
                                                            {typeInfo.label}
                                                        </Badge>
                                                        <Badge variant="outline" className={statusInfo.color}>
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-semibold">{doc.title}</h3>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                        <span>Réf: {doc.reference}</span>
                                                        <span>{new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                                                        {doc.commission && <span>• {doc.commission}</span>}
                                                        {doc.size && <span>• {doc.size}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => handleView(doc)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => handleDownload(doc)}>
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Nouveau document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Titre du document</Label>
                            <Input placeholder="Titre..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(typeConfig).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Description optionnelle..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Fichier</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Cliquez ou glissez un fichier ici
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Annuler</Button>
                        <Button onClick={() => { toast.success('Document ajouté'); setIsUploadOpen(false); }}>
                            <Upload className="h-4 w-4 mr-2" />
                            Ajouter
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
