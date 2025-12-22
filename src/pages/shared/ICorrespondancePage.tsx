/**
 * iCorrespondance Page - Parlement.ga
 * 
 * Gestion des dossiers de correspondance officielle avec:
 * - Persistance en base Supabase
 * - Envoi interne via iBoîte (collaborateurs)
 * - Envoi externe via email (correspondanceService)
 * 
 * NEOCORTEX: Cette page utilise le pattern Actor via useCorrespondanceActor
 * pour les opérations d'écriture (création, envoi, archivage, suppression).
 * Les lectures restent directes vers Supabase pour simplicité.
 * 
 * Réservé au personnel parlementaire (AN + Sénat)
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useCorrespondanceActor } from '@/hooks/useCorrespondanceActor';
import { IBoiteRecipientSearch, Recipient } from '@/components/iboite/IBoiteRecipientSearch';
import {
    FolderOpen, FileText, ArrowLeft, Search, Plus,
    Clock, Paperclip, Download, Eye, Send, CheckCircle,
    AlertCircle, Loader2, Upload, Trash2, Archive, Mail,
    Users, FolderClosed, MoreVertical
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ============================================================
// TYPES
// ============================================================

interface ICorrespondanceFolder {
    id: string;
    user_id?: string;
    name: string;
    reference_number?: string;
    recipient_name?: string;
    recipient_organization?: string;
    recipient_email?: string;
    recipient_user_id?: string;
    comment?: string;
    status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'ARCHIVED';
    is_urgent: boolean;
    is_read: boolean;
    is_internal: boolean;
    iboite_conversation_id?: string;
    sent_at?: string;
    created_at: string;
    updated_at?: string;
    documents: ICorrespondanceDocument[];
}

interface ICorrespondanceDocument {
    id: string;
    folder_id?: string;
    name: string;
    file_path?: string;
    file_type: 'pdf' | 'doc' | 'image' | 'other';
    file_size?: string;
    file_url?: string;
    is_generated?: boolean;
    url?: string;
    file?: File;
}

interface SendDialogRecipient {
    type: 'USER' | 'SERVICE';
    id: string;
    displayName: string;
    subtitle?: string;
}

type FilterType = 'all' | 'draft' | 'sent' | 'archived';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'Brouillon', color: 'bg-gray-500/10 text-gray-500' },
    PENDING_APPROVAL: { label: 'En attente', color: 'bg-yellow-500/10 text-yellow-500' },
    APPROVED: { label: 'Approuvé', color: 'bg-blue-500/10 text-blue-500' },
    SENT: { label: 'Envoyé', color: 'bg-green-500/10 text-green-500' },
    ARCHIVED: { label: 'Archivé', color: 'bg-purple-500/10 text-purple-500' },
};

const DOC_TYPE_CONFIG: Record<string, { color: string; label: string }> = {
    pdf: { color: 'text-red-500', label: 'PDF' },
    doc: { color: 'text-blue-500', label: 'DOC' },
    image: { color: 'text-green-500', label: 'IMG' },
    other: { color: 'text-gray-500', label: 'FILE' },
};

// Storage bucket name
const ICORRESPONDANCE_BUCKET = 'icorrespondance-documents';

// ============================================================
// COMPONENT
// ============================================================

export default function ICorrespondancePage() {
    // State
    const [folders, setFolders] = useState<ICorrespondanceFolder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<ICorrespondanceFolder | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Modal states
    const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
    const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
    const [sendMode, setSendMode] = useState<'internal' | 'external' | null>(null);

    // New folder form
    const [newFolderData, setNewFolderData] = useState({
        name: '',
        recipientOrg: '',
        recipientName: '',
        recipientEmail: '',
        comment: '',
        isUrgent: false,
    });
    const [newFolderDocs, setNewFolderDocs] = useState<ICorrespondanceDocument[]>([]);

    // Send dialog state
    const [sendRecipients, setSendRecipients] = useState<SendDialogRecipient[]>([]);
    const [externalEmail, setExternalEmail] = useState('');
    const [externalName, setExternalName] = useState('');
    const [externalOrg, setExternalOrg] = useState('');

    // ============================================================
    // NEOCORTEX ACTOR INTEGRATION
    // ============================================================

    const handleFolderCreated = useCallback((folder: any) => {
        setFolders(prev => [folder, ...prev]);
        setNewFolderData({ name: '', recipientOrg: '', recipientName: '', recipientEmail: '', comment: '', isUrgent: false });
        setNewFolderDocs([]);
        setIsNewFolderOpen(false);
    }, []);

    const handleSent = useCallback((result: any) => {
        setFolders(prev => prev.map(f => 
            f.id === result.folderId 
                ? { ...f, status: 'SENT' as const, sent_at: new Date().toISOString() } 
                : f
        ));
        setIsSendDialogOpen(false);
        setSelectedFolder(null);
    }, []);

    const handleArchived = useCallback((result: any) => {
        setFolders(prev => prev.map(f => 
            f.id === result.folderId 
                ? { ...f, status: 'ARCHIVED' as const } 
                : f
        ));
        setSelectedFolder(null);
    }, []);

    const handleDeleted = useCallback((result: any) => {
        setFolders(prev => prev.filter(f => f.id !== result.folderId));
        setSelectedFolder(null);
    }, []);

    const { 
        isOperating, 
        createFolder: emitCreateFolder, 
        sendInternal: emitSendInternal, 
        sendExternal: emitSendExternal,
        archiveFolder: emitArchiveFolder,
        deleteFolder: emitDeleteFolder 
    } = useCorrespondanceActor({
        onFolderCreated: handleFolderCreated,
        onSent: handleSent,
        onArchived: handleArchived,
        onDeleted: handleDeleted,
    });

    // ============================================================
    // SUPABASE OPERATIONS
    // ============================================================

    const loadFolders = async () => {
        setIsInitialLoading(true);
        try {
            const { data: session } = await supabase.auth.getSession();
            if (!session?.session?.user?.id) {
                console.log('📂 [iCorrespondance] No session');
                setFolders([]);
                return;
            }

            const { data: foldersData, error } = await (supabase.from as any)('icorrespondance_folders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ [iCorrespondance] Load error:', error);
                setFolders([]);
                return;
            }

            // Load documents for each folder
            const foldersWithDocs: ICorrespondanceFolder[] = await Promise.all(
                (foldersData || []).map(async (folder: any) => {
                    const { data: docsData } = await (supabase.from as any)('icorrespondance_documents')
                        .select('*')
                        .eq('folder_id', folder.id);

                    return {
                        ...folder,
                        documents: (docsData || []).map((doc: any) => ({
                            ...doc,
                            file_type: doc.file_type || 'pdf',
                        })),
                    };
                })
            );

            setFolders(foldersWithDocs);
            console.log('✅ [iCorrespondance] Loaded', foldersWithDocs.length, 'folders');
        } catch (err) {
            console.error('❌ [iCorrespondance] Error:', err);
            setFolders([]);
        } finally {
            setIsInitialLoading(false);
        }
    };

    // NOTE: Les opérations d'écriture (create, update, delete) sont maintenant
    // gérées par CorrespondanceActor via le hook useCorrespondanceActor.
    // Seule loadFolders reste ici pour les lectures initiales.

    // ============================================================

    useEffect(() => {
        loadFolders();
    }, []);

    const filteredFolders = useMemo(() => {
        return folders
            .filter(folder => {
                const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (folder.recipient_organization || '').toLowerCase().includes(searchTerm.toLowerCase());

                switch (filter) {
                    case 'draft': return matchesSearch && folder.status === 'DRAFT';
                    case 'sent': return matchesSearch && folder.status === 'SENT';
                    case 'archived': return matchesSearch && folder.status === 'ARCHIVED';
                    default: return matchesSearch && folder.status !== 'ARCHIVED';
                }
            })
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [folders, searchTerm, filter]);

    const stats = useMemo(() => ({
        total: folders.length,
        draft: folders.filter(f => f.status === 'DRAFT').length,
        sent: folders.filter(f => f.status === 'SENT').length,
        urgent: folders.filter(f => f.is_urgent && f.status !== 'ARCHIVED').length,
    }), [folders]);

    const handleCreateFolder = () => {
        if (!newFolderData.name.trim() || !newFolderData.recipientOrg.trim()) {
            return; // Validation will show in UI
        }

        // Émettre le signal via Neocortex
        emitCreateFolder({
            name: newFolderData.name,
            recipientOrg: newFolderData.recipientOrg,
            recipientName: newFolderData.recipientName,
            recipientEmail: newFolderData.recipientEmail,
            comment: newFolderData.comment,
            isUrgent: newFolderData.isUrgent,
            documents: newFolderDocs.map(doc => ({
                name: doc.name,
                file_type: doc.file_type,
                file_size: doc.file_size,
                file: doc.file,
            })),
        });
    };

    const handleSelectFolder = async (folder: ICorrespondanceFolder) => {
        if (!folder.is_read) {
            await (supabase.from as any)('icorrespondance_folders')
                .update({ is_read: true })
                .eq('id', folder.id);
            setFolders(prev => prev.map(f => f.id === folder.id ? { ...f, is_read: true } : f));
        }
        setSelectedFolder({ ...folder, is_read: true });
    };

    const handleOpenSendDialog = (folder: ICorrespondanceFolder) => {
        setSelectedFolder(folder);
        setExternalEmail(folder.recipient_email || '');
        setExternalName(folder.recipient_name || '');
        setExternalOrg(folder.recipient_organization || '');
        setSendRecipients([]);
        setSendMode(null);
        setIsSendDialogOpen(true);
    };

    const handleSendCorrespondance = () => {
        if (!selectedFolder) return;

        if (sendMode === 'internal' && sendRecipients.length > 0) {
            // Émettre signal d'envoi interne via Neocortex
            emitSendInternal({
                folderId: selectedFolder.id,
                folderName: selectedFolder.name,
                comment: selectedFolder.comment,
                recipientIds: sendRecipients.map(r => r.id),
                recipientNames: sendRecipients.map(r => r.displayName),
            });
        } else if (sendMode === 'external' && externalEmail) {
            // Émettre signal d'envoi externe via Neocortex
            emitSendExternal({
                folderId: selectedFolder.id,
                folderName: selectedFolder.name,
                recipientEmail: externalEmail,
                recipientName: externalName,
                recipientOrg: externalOrg,
                body: selectedFolder.comment || '',
                isUrgent: selectedFolder.is_urgent,
            });
        }
    };

    const handleArchiveFolder = (folder: ICorrespondanceFolder) => {
        // Émettre signal d'archivage via Neocortex
        emitArchiveFolder(folder.id, folder.name);
    };

    const handleDeleteFolder = (folder: ICorrespondanceFolder) => {
        if (!confirm(`Supprimer "${folder.name}" ?`)) return;
        // Émettre signal de suppression via Neocortex
        emitDeleteFolder(folder.id, folder.name);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newDocs: ICorrespondanceDocument[] = Array.from(files).map(file => ({
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            file_type: file.type.includes('pdf') ? 'pdf' :
                file.type.includes('doc') ? 'doc' :
                    file.type.includes('image') ? 'image' : 'other',
            file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            url: URL.createObjectURL(file),
            file: file,
        }));

        setNewFolderDocs(prev => [...prev, ...newDocs]);
    };

    const handleRecipientSelect = (recipients: Recipient[]) => {
        const newRecipients: SendDialogRecipient[] = recipients.map(recipient => ({
            type: recipient.type === 'USER' ? 'USER' : 'SERVICE',
            id: recipient.id,
            displayName: recipient.displayName,
            subtitle: recipient.email,
        }));
        setSendRecipients(newRecipients);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="space-y-6 p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        iCorrespondance
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestion des correspondances officielles
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setIsNewFolderOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Nouveau dossier
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="neu-card border-none cursor-pointer" onClick={() => setFilter('all')}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <FolderOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-sm text-muted-foreground">Total dossiers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={`neu-card border-none cursor-pointer ${filter === 'draft' ? 'ring-2 ring-primary' : ''}`} onClick={() => setFilter('draft')}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gray-500/10">
                                <FileText className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.draft}</p>
                                <p className="text-sm text-muted-foreground">Brouillons</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={`neu-card border-none cursor-pointer ${filter === 'sent' ? 'ring-2 ring-primary' : ''}`} onClick={() => setFilter('sent')}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.sent}</p>
                                <p className="text-sm text-muted-foreground">Envoyés</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="neu-card border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-500/10">
                                <AlertCircle className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.urgent}</p>
                                <p className="text-sm text-muted-foreground">Urgents</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par nom ou destinataire..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="draft">Brouillons</SelectItem>
                        <SelectItem value="sent">Envoyés</SelectItem>
                        <SelectItem value="archived">Archivés</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Folder List */}
                <Card className="neu-card border-none lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Dossiers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px]">
                            {isInitialLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : filteredFolders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <FolderClosed className="h-12 w-12 opacity-20 mb-3" />
                                    <p className="text-sm">Aucun dossier</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredFolders.map((folder) => (
                                        <div
                                            key={folder.id}
                                            onClick={() => handleSelectFolder(folder)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedFolder?.id === folder.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                                                } ${!folder.is_read ? 'font-semibold' : ''}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {folder.is_urgent && (
                                                            <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                                                        )}
                                                        <span className="truncate text-sm">{folder.name}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {folder.recipient_organization}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className={STATUS_CONFIG[folder.status]?.color || ''} variant="outline">
                                                            {STATUS_CONFIG[folder.status]?.label}
                                                        </Badge>
                                                        {folder.documents.length > 0 && (
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Paperclip className="h-3 w-3" />
                                                                {folder.documents.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Folder Detail */}
                <Card className="neu-card border-none lg:col-span-2">
                    <CardContent className="pt-6">
                        {selectedFolder ? (
                            <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">{selectedFolder.name}</h2>
                                        <p className="text-muted-foreground">
                                            À: {selectedFolder.recipient_organization}
                                            {selectedFolder.recipient_name && ` - ${selectedFolder.recipient_name}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedFolder.status === 'DRAFT' && (
                                            <Button onClick={() => handleOpenSendDialog(selectedFolder)} className="gap-2">
                                                <Send className="h-4 w-4" />
                                                Envoyer
                                            </Button>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleArchiveFolder(selectedFolder)}>
                                                    <Archive className="h-4 w-4 mr-2" />
                                                    Archiver
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteFolder(selectedFolder)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Badge className={STATUS_CONFIG[selectedFolder.status]?.color}>
                                        {STATUS_CONFIG[selectedFolder.status]?.label}
                                    </Badge>
                                    {selectedFolder.is_urgent && (
                                        <Badge variant="destructive">Urgent</Badge>
                                    )}
                                    {selectedFolder.is_internal && (
                                        <Badge variant="outline">
                                            <Users className="h-3 w-3 mr-1" />
                                            Interne
                                        </Badge>
                                    )}
                                </div>

                                {selectedFolder.comment && (
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm">{selectedFolder.comment}</p>
                                    </div>
                                )}

                                {selectedFolder.documents.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-3">Documents attachés</h3>
                                        <div className="space-y-2">
                                            {selectedFolder.documents.map((doc) => (
                                                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className={`h-5 w-5 ${DOC_TYPE_CONFIG[doc.file_type]?.color}`} />
                                                        <div>
                                                            <p className="text-sm font-medium">{doc.name}</p>
                                                            {doc.file_size && (
                                                                <p className="text-xs text-muted-foreground">{doc.file_size}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="ghost">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedFolder.sent_at && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        Envoyé le {new Date(selectedFolder.sent_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                                <FolderOpen className="h-16 w-16 opacity-20 mb-4" />
                                <p>Sélectionnez un dossier</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* New Folder Dialog */}
            <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Nouveau dossier de correspondance</DialogTitle>
                        <DialogDescription>
                            Créez un nouveau dossier pour organiser votre correspondance officielle.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nom du dossier *</Label>
                            <Input
                                value={newFolderData.name}
                                onChange={(e) => setNewFolderData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ex: Demande de subvention - Association XYZ"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Organisation destinataire *</Label>
                                <Input
                                    value={newFolderData.recipientOrg}
                                    onChange={(e) => setNewFolderData(prev => ({ ...prev, recipientOrg: e.target.value }))}
                                    placeholder="Ministère, Institution..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nom du contact</Label>
                                <Input
                                    value={newFolderData.recipientName}
                                    onChange={(e) => setNewFolderData(prev => ({ ...prev, recipientName: e.target.value }))}
                                    placeholder="M. / Mme..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email (pour envoi externe)</Label>
                            <Input
                                type="email"
                                value={newFolderData.recipientEmail}
                                onChange={(e) => setNewFolderData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                                placeholder="email@exemple.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Commentaire / Objet</Label>
                            <Textarea
                                value={newFolderData.comment}
                                onChange={(e) => setNewFolderData(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Description du dossier..."
                                rows={3}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="urgent"
                                checked={newFolderData.isUrgent}
                                onCheckedChange={(checked) => setNewFolderData(prev => ({ ...prev, isUrgent: checked as boolean }))}
                            />
                            <Label htmlFor="urgent" className="text-sm cursor-pointer">
                                Marquer comme urgent
                            </Label>
                        </div>

                        <div className="space-y-2">
                            <Label>Documents</Label>
                            <div className="border-2 border-dashed rounded-lg p-4">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Cliquez pour ajouter des fichiers</span>
                                </label>
                            </div>
                            {newFolderDocs.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {newFolderDocs.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                            <div className="flex items-center gap-2">
                                                <FileText className={`h-4 w-4 ${DOC_TYPE_CONFIG[doc.file_type]?.color}`} />
                                                <span className="text-sm">{doc.name}</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setNewFolderDocs(prev => prev.filter(d => d.id !== doc.id))}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>Annuler</Button>
                        <Button onClick={handleCreateFolder} disabled={isOperating || !newFolderData.name.trim() || !newFolderData.recipientOrg.trim()}>
                            {isOperating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            Créer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Send Dialog */}
            <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Envoyer la correspondance</DialogTitle>
                        <DialogDescription>
                            Choisissez le mode d'envoi pour "{selectedFolder?.name}"
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant={sendMode === 'internal' ? 'default' : 'outline'}
                                className="h-20 flex-col gap-2"
                                onClick={() => setSendMode('internal')}
                            >
                                <Users className="h-6 w-6" />
                                <span>Interne (iBoîte)</span>
                            </Button>
                            <Button
                                variant={sendMode === 'external' ? 'default' : 'outline'}
                                className="h-20 flex-col gap-2"
                                onClick={() => setSendMode('external')}
                            >
                                <Mail className="h-6 w-6" />
                                <span>Externe (Email)</span>
                            </Button>
                        </div>

                        {sendMode === 'internal' && (
                            <div className="space-y-2">
                                <Label>Sélectionner les destinataires</Label>
                                <IBoiteRecipientSearch
                                    onSelect={handleRecipientSelect}
                                    selectedRecipients={sendRecipients.map(r => ({
                                        type: r.type as any,
                                        id: r.id,
                                        displayName: r.displayName,
                                        email: r.subtitle,
                                    }))}
                                    multiple={true}
                                />
                                {sendRecipients.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {sendRecipients.map((r) => (
                                            <Badge key={r.id} variant="secondary" className="gap-1">
                                                {r.displayName}
                                                <button
                                                    onClick={() => setSendRecipients(prev => prev.filter(x => x.id !== r.id))}
                                                    className="ml-1 hover:text-destructive"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {sendMode === 'external' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email *</Label>
                                    <Input
                                        type="email"
                                        value={externalEmail}
                                        onChange={(e) => setExternalEmail(e.target.value)}
                                        placeholder="destinataire@exemple.com"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nom</Label>
                                        <Input
                                            value={externalName}
                                            onChange={(e) => setExternalName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Organisation</Label>
                                        <Input
                                            value={externalOrg}
                                            onChange={(e) => setExternalOrg(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>Annuler</Button>
                        <Button
                            onClick={handleSendCorrespondance}
                            disabled={isOperating || !sendMode || (sendMode === 'internal' && sendRecipients.length === 0) || (sendMode === 'external' && !externalEmail)}
                        >
                            {isOperating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                            Envoyer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
