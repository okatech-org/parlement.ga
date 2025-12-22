/**
 * Hook useCorrespondanceActor
 * 
 * Façade React pour interagir avec le CorrespondanceActor via signaux Neocortex.
 * Encapsule l'émission de signaux et l'écoute des réponses.
 */

import { useEffect, useCallback, useState } from 'react';
import { NeuralSystem } from '@/neocortex/synapse';
import { 
    correspondanceActor, 
    CreateFolderPayload, 
    SendInternalPayload, 
    SendExternalPayload,
    DeleteFolderPayload
} from '@/neocortex/actors/CorrespondanceActor';
import { toast } from 'sonner';

interface UseCorrespondanceActorReturn {
    isOperating: boolean;
    createFolder: (payload: CreateFolderPayload) => void;
    sendInternal: (payload: SendInternalPayload) => void;
    sendExternal: (payload: SendExternalPayload) => void;
    archiveFolder: (folderId: string, folderName: string) => void;
    deleteFolder: (folderId: string, folderName: string) => void;
}

interface CallbackHandlers {
    onFolderCreated?: (folder: any) => void;
    onSent?: (result: any) => void;
    onArchived?: (result: any) => void;
    onDeleted?: (result: any) => void;
    onError?: (error: string) => void;
}

export function useCorrespondanceActor(handlers: CallbackHandlers = {}): UseCorrespondanceActorReturn {
    const [isOperating, setIsOperating] = useState(false);

    useEffect(() => {
        // Écoute des signaux de succès/erreur
        const subscriptions = [
            NeuralSystem.subscribe('CORRESPONDANCE:CREATING', () => {
                setIsOperating(true);
            }),
            NeuralSystem.subscribe('CORRESPONDANCE:SENDING', () => {
                setIsOperating(true);
            }),
            NeuralSystem.subscribe('CORRESPONDANCE:FOLDER_CREATED', (signal) => {
                setIsOperating(false);
                toast.success('Dossier créé avec succès');
                handlers.onFolderCreated?.(signal.payload.folder);
            }),
            NeuralSystem.subscribe('CORRESPONDANCE:SENT', (signal) => {
                setIsOperating(false);
                const mode = signal.payload.mode;
                if (mode === 'internal') {
                    toast.success(`Envoyé via iBoîte à ${signal.payload.recipients?.join(', ')}`);
                } else {
                    toast.success(`Envoyé par email à ${signal.payload.recipientEmail}`);
                }
                handlers.onSent?.(signal.payload);
            }),
            NeuralSystem.subscribe('CORRESPONDANCE:ARCHIVED', (signal) => {
                setIsOperating(false);
                toast.success(`${signal.payload.folderName} archivé`);
                handlers.onArchived?.(signal.payload);
            }),
            NeuralSystem.subscribe('CORRESPONDANCE:DELETED', (signal) => {
                setIsOperating(false);
                toast.success(`${signal.payload.folderName} supprimé`);
                handlers.onDeleted?.(signal.payload);
            }),
            NeuralSystem.subscribe('CORRESPONDANCE:ERROR', (signal) => {
                setIsOperating(false);
                toast.error(signal.payload.error || 'Une erreur est survenue');
                handlers.onError?.(signal.payload.error);
            }),
        ];

        // Cleanup
        return () => {
            subscriptions.forEach(sub => sub.unsubscribe());
        };
    }, [handlers.onFolderCreated, handlers.onSent, handlers.onArchived, handlers.onDeleted, handlers.onError]);

    const createFolder = useCallback((payload: CreateFolderPayload) => {
        NeuralSystem.dispatch({
            type: 'CORRESPONDANCE:CREATE_FOLDER',
            source: 'UI:ICorrespondancePage',
            payload,
            priority: 'COGNITIVE',
            confidence: 1.0
        });
    }, []);

    const sendInternal = useCallback((payload: SendInternalPayload) => {
        NeuralSystem.dispatch({
            type: 'CORRESPONDANCE:SEND_INTERNAL',
            source: 'UI:ICorrespondancePage',
            payload,
            priority: 'COGNITIVE',
            confidence: 1.0
        });
    }, []);

    const sendExternal = useCallback((payload: SendExternalPayload) => {
        NeuralSystem.dispatch({
            type: 'CORRESPONDANCE:SEND_EXTERNAL',
            source: 'UI:ICorrespondancePage',
            payload,
            priority: 'COGNITIVE',
            confidence: 1.0
        });
    }, []);

    const archiveFolder = useCallback((folderId: string, folderName: string) => {
        NeuralSystem.dispatch({
            type: 'CORRESPONDANCE:ARCHIVE_FOLDER',
            source: 'UI:ICorrespondancePage',
            payload: { folderId, folderName },
            priority: 'COGNITIVE',
            confidence: 1.0
        });
    }, []);

    const deleteFolder = useCallback((folderId: string, folderName: string) => {
        NeuralSystem.dispatch({
            type: 'CORRESPONDANCE:DELETE_FOLDER',
            source: 'UI:ICorrespondancePage',
            payload: { folderId, folderName },
            priority: 'COGNITIVE',
            confidence: 1.0
        });
    }, []);

    return {
        isOperating,
        createFolder,
        sendInternal,
        sendExternal,
        archiveFolder,
        deleteFolder,
    };
}
