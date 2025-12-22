/**
 * NEO-CORTEX: CORRESPONDANCE ACTOR
 * 
 * Cortex responsable de la gestion des correspondances officielles.
 * Gère le cycle de vie des dossiers : Création, Envoi Interne/Externe, Archivage.
 */

import { BioActor } from '../BioActor';
import { NeuralSignal } from '../synapse';
import { iBoiteService } from '@/services/iboite-service';
import { correspondanceService, SendCorrespondanceParams } from '@/services/correspondance-service';
import { supabase } from '@/integrations/supabase/client';

// État interne de l'acteur
interface CorrespondanceState {
    pendingOperations: number;
    lastOperationTimestamp: number | null;
    errors: string[];
}

// Payloads des signaux
export interface CreateFolderPayload {
    name: string;
    recipientOrg: string;
    recipientName?: string;
    recipientEmail?: string;
    comment?: string;
    isUrgent: boolean;
    documents: Array<{
        name: string;
        file_type: string;
        file_size?: string;
        file?: File;
    }>;
}

export interface SendInternalPayload {
    folderId: string;
    folderName: string;
    comment?: string;
    recipientIds: string[];
    recipientNames: string[];
}

export interface SendExternalPayload {
    folderId: string;
    folderName: string;
    recipientEmail: string;
    recipientName?: string;
    recipientOrg?: string;
    body: string;
    isUrgent: boolean;
}

export interface UpdateStatusPayload {
    folderId: string;
    status: string;
    extra?: Record<string, any>;
}

export interface DeleteFolderPayload {
    folderId: string;
    folderName: string;
}

const ICORRESPONDANCE_BUCKET = 'icorrespondance-documents';

export class CorrespondanceActor extends BioActor<CorrespondanceState> {

    constructor() {
        super('Cortex:Correspondance', {
            pendingOperations: 0,
            lastOperationTimestamp: null,
            errors: []
        });
    }

    protected initialize(): void {
        this.listen('CORRESPONDANCE:CREATE_FOLDER', this.handleCreateFolder.bind(this));
        this.listen('CORRESPONDANCE:SEND_INTERNAL', this.handleSendInternal.bind(this));
        this.listen('CORRESPONDANCE:SEND_EXTERNAL', this.handleSendExternal.bind(this));
        this.listen('CORRESPONDANCE:UPDATE_STATUS', this.handleUpdateStatus.bind(this));
        this.listen('CORRESPONDANCE:DELETE_FOLDER', this.handleDeleteFolder.bind(this));
        this.listen('CORRESPONDANCE:ARCHIVE_FOLDER', this.handleArchiveFolder.bind(this));
    }

    /**
     * Création d'un dossier de correspondance
     */
    private async handleCreateFolder(payload: CreateFolderPayload, signal: NeuralSignal) {
        console.log('📂 [Cortex:Correspondance] Création dossier', payload.name);
        
        this.setState({ pendingOperations: this.state.pendingOperations + 1 });
        this.emit('CORRESPONDANCE:CREATING', { correlationId: signal.id });

        try {
            const { data: session } = await supabase.auth.getSession();
            if (!session?.session?.user?.id) {
                throw new Error('Non authentifié');
            }

            const userId = session.session.user.id;

            // Créer le dossier
            const { data: folder, error } = await (supabase.from as any)('icorrespondance_folders')
                .insert({
                    user_id: userId,
                    name: payload.name,
                    recipient_name: payload.recipientName || null,
                    recipient_organization: payload.recipientOrg,
                    recipient_email: payload.recipientEmail || null,
                    comment: payload.comment || null,
                    is_urgent: payload.isUrgent,
                    is_read: true,
                    status: 'DRAFT',
                })
                .select()
                .single();

            if (error) throw error;

            // Upload et insérer les documents
            for (const doc of payload.documents) {
                let filePath: string | null = null;
                if (doc.file) {
                    filePath = await this.uploadDocument(doc.file, folder.id);
                }

                await (supabase.from as any)('icorrespondance_documents').insert({
                    folder_id: folder.id,
                    name: doc.name,
                    file_type: doc.file_type,
                    file_size: doc.file_size,
                    file_path: filePath,
                    is_generated: false,
                });
            }

            this.setState({
                pendingOperations: this.state.pendingOperations - 1,
                lastOperationTimestamp: Date.now()
            });

            this.emit('CORRESPONDANCE:FOLDER_CREATED', {
                originalSignalId: signal.id,
                folder: { ...folder, documents: payload.documents }
            });

            console.log('✅ [Cortex:Correspondance] Dossier créé', folder.id);

        } catch (error: any) {
            console.error('❌ [Cortex:Correspondance] Erreur création', error);
            this.setState({
                pendingOperations: this.state.pendingOperations - 1,
                errors: [...this.state.errors, error.message]
            });
            this.emit('CORRESPONDANCE:ERROR', {
                originalSignalId: signal.id,
                operation: 'CREATE_FOLDER',
                error: error.message
            });
        }
    }

    /**
     * Envoi interne via iBoîte
     */
    private async handleSendInternal(payload: SendInternalPayload, signal: NeuralSignal) {
        console.log('📨 [Cortex:Correspondance] Envoi interne', payload.folderId);

        this.setState({ pendingOperations: this.state.pendingOperations + 1 });
        this.emit('CORRESPONDANCE:SENDING', { correlationId: signal.id, mode: 'internal' });

        try {
            const conversation = await iBoiteService.createConversation({
                type: 'PRIVATE',
                subject: payload.folderName,
                participantIds: payload.recipientIds,
                initialMessage: payload.comment || `Dossier: ${payload.folderName}`,
            });

            if (!conversation) {
                throw new Error('Échec de création de la conversation iBoîte');
            }

            // Mise à jour du statut
            await this.updateFolderInDb(payload.folderId, 'SENT', {
                is_internal: true,
                iboite_conversation_id: conversation.id,
                sent_at: new Date().toISOString(),
            });

            this.setState({
                pendingOperations: this.state.pendingOperations - 1,
                lastOperationTimestamp: Date.now()
            });

            this.emit('CORRESPONDANCE:SENT', {
                originalSignalId: signal.id,
                mode: 'internal',
                folderId: payload.folderId,
                conversationId: conversation.id,
                recipients: payload.recipientNames
            });

            console.log('✅ [Cortex:Correspondance] Envoyé via iBoîte');

        } catch (error: any) {
            console.error('❌ [Cortex:Correspondance] Erreur envoi interne', error);
            this.setState({
                pendingOperations: this.state.pendingOperations - 1,
                errors: [...this.state.errors, error.message]
            });
            this.emit('CORRESPONDANCE:ERROR', {
                originalSignalId: signal.id,
                operation: 'SEND_INTERNAL',
                error: error.message
            });
        }
    }

    /**
     * Envoi externe via email
     */
    private async handleSendExternal(payload: SendExternalPayload, signal: NeuralSignal) {
        console.log('📧 [Cortex:Correspondance] Envoi externe', payload.recipientEmail);

        this.setState({ pendingOperations: this.state.pendingOperations + 1 });
        this.emit('CORRESPONDANCE:SENDING', { correlationId: signal.id, mode: 'external' });

        try {
            const result = await correspondanceService.sendCorrespondance({
                recipientEmail: payload.recipientEmail,
                recipientName: payload.recipientName,
                recipientOrg: payload.recipientOrg,
                subject: payload.folderName,
                body: payload.body,
                isUrgent: payload.isUrgent,
            });

            if (!result.success) {
                throw new Error(result.error || 'Échec de l\'envoi email');
            }

            // Mise à jour du statut
            await this.updateFolderInDb(payload.folderId, 'SENT', {
                is_internal: false,
                recipient_email: payload.recipientEmail,
                sent_at: new Date().toISOString(),
            });

            this.setState({
                pendingOperations: this.state.pendingOperations - 1,
                lastOperationTimestamp: Date.now()
            });

            this.emit('CORRESPONDANCE:SENT', {
                originalSignalId: signal.id,
                mode: 'external',
                folderId: payload.folderId,
                messageId: result.messageId,
                recipientEmail: payload.recipientEmail
            });

            console.log('✅ [Cortex:Correspondance] Envoyé par email');

        } catch (error: any) {
            console.error('❌ [Cortex:Correspondance] Erreur envoi externe', error);
            this.setState({
                pendingOperations: this.state.pendingOperations - 1,
                errors: [...this.state.errors, error.message]
            });
            this.emit('CORRESPONDANCE:ERROR', {
                originalSignalId: signal.id,
                operation: 'SEND_EXTERNAL',
                error: error.message
            });
        }
    }

    /**
     * Mise à jour du statut d'un dossier
     */
    private async handleUpdateStatus(payload: UpdateStatusPayload, signal: NeuralSignal) {
        try {
            await this.updateFolderInDb(payload.folderId, payload.status, payload.extra);
            this.emit('CORRESPONDANCE:STATUS_UPDATED', {
                originalSignalId: signal.id,
                folderId: payload.folderId,
                status: payload.status
            });
        } catch (error: any) {
            this.emit('CORRESPONDANCE:ERROR', {
                originalSignalId: signal.id,
                operation: 'UPDATE_STATUS',
                error: error.message
            });
        }
    }

    /**
     * Archivage d'un dossier
     */
    private async handleArchiveFolder(payload: { folderId: string; folderName: string }, signal: NeuralSignal) {
        console.log('📦 [Cortex:Correspondance] Archivage', payload.folderName);
        
        try {
            await this.updateFolderInDb(payload.folderId, 'ARCHIVED');
            this.emit('CORRESPONDANCE:ARCHIVED', {
                originalSignalId: signal.id,
                folderId: payload.folderId,
                folderName: payload.folderName
            });
        } catch (error: any) {
            this.emit('CORRESPONDANCE:ERROR', {
                originalSignalId: signal.id,
                operation: 'ARCHIVE',
                error: error.message
            });
        }
    }

    /**
     * Suppression d'un dossier
     */
    private async handleDeleteFolder(payload: DeleteFolderPayload, signal: NeuralSignal) {
        console.log('🗑️ [Cortex:Correspondance] Suppression', payload.folderName);

        try {
            const { error } = await (supabase.from as any)('icorrespondance_folders')
                .delete()
                .eq('id', payload.folderId);

            if (error) throw error;

            this.emit('CORRESPONDANCE:DELETED', {
                originalSignalId: signal.id,
                folderId: payload.folderId,
                folderName: payload.folderName
            });

        } catch (error: any) {
            this.emit('CORRESPONDANCE:ERROR', {
                originalSignalId: signal.id,
                operation: 'DELETE',
                error: error.message
            });
        }
    }

    // ============================================================
    // HELPERS
    // ============================================================

    private async uploadDocument(file: File, folderId: string): Promise<string | null> {
        try {
            const filePath = `${folderId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const { error } = await supabase.storage
                .from(ICORRESPONDANCE_BUCKET)
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (error) {
                console.error('Upload error:', error);
                return null;
            }
            return filePath;
        } catch (err) {
            console.error('Upload error:', err);
            return null;
        }
    }

    private async updateFolderInDb(folderId: string, status: string, extra?: Record<string, any>) {
        const { error } = await (supabase.from as any)('icorrespondance_folders')
            .update({ status, ...extra, updated_at: new Date().toISOString() })
            .eq('id', folderId);

        if (error) throw error;
    }
}

// Singleton de l'acteur
export const correspondanceActor = new CorrespondanceActor();
