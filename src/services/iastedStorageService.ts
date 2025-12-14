import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = "iasted-files";

export interface UploadedFile {
    id: string;
    name: string;
    url: string;
    path: string;
    type: string;
    size: number;
    uploadedAt: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

// Mode Mock pour développement (si bucket pas encore créé)
const USE_MOCK = true;

// Storage local pour le mode mock
const MOCK_FILES_KEY = "iasted_mock_files";

const getMockFiles = (): UploadedFile[] => {
    const stored = localStorage.getItem(MOCK_FILES_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveMockFiles = (files: UploadedFile[]) => {
    localStorage.setItem(MOCK_FILES_KEY, JSON.stringify(files));
};

/**
 * Service pour gérer les fichiers uploadés vers le bucket iasted-files
 */
export const iastedStorageService = {
    /**
     * Génère le chemin de stockage pour un fichier
     * Structure: {user_id}/conversations/{conversation_id}/{filename}
     */
    generatePath(
        userId: string,
        conversationId: string,
        filename: string
    ): string {
        // Nettoyer le nom de fichier
        const cleanFilename = filename
            .replace(/[^a-zA-Z0-9.-]/g, "_")
            .toLowerCase();
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}_${cleanFilename}`;

        return `${userId}/conversations/${conversationId}/${uniqueFilename}`;
    },

    /**
     * Upload un fichier vers le bucket
     */
    async uploadFile(
        file: File,
        conversationId: string,
        onProgress?: (progress: UploadProgress) => void
    ): Promise<UploadedFile> {
        if (USE_MOCK) {
            // Simuler l'upload
            return new Promise((resolve) => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 20;
                    onProgress?.({
                        loaded: (file.size * progress) / 100,
                        total: file.size,
                        percentage: progress,
                    });

                    if (progress >= 100) {
                        clearInterval(interval);

                        // Créer un blob URL pour le mock
                        const blobUrl = URL.createObjectURL(file);

                        const uploadedFile: UploadedFile = {
                            id: crypto.randomUUID(),
                            name: file.name,
                            url: blobUrl,
                            path: `mock/${conversationId}/${file.name}`,
                            type: file.type,
                            size: file.size,
                            uploadedAt: new Date().toISOString(),
                        };

                        // Sauvegarder dans le mock
                        const files = getMockFiles();
                        files.push(uploadedFile);
                        saveMockFiles(files);

                        resolve(uploadedFile);
                    }
                }, 200);
            });
        }

        // Récupérer l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non authentifié");

        const path = this.generatePath(user.id, conversationId, file.name);

        // Upload vers Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(path, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) throw error;

        // Obtenir l'URL publique ou signée
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);

        return {
            id: crypto.randomUUID(),
            name: file.name,
            url: urlData.publicUrl,
            path: data.path,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
        };
    },

    /**
     * Upload plusieurs fichiers
     */
    async uploadFiles(
        files: File[],
        conversationId: string,
        onProgress?: (fileIndex: number, progress: UploadProgress) => void
    ): Promise<UploadedFile[]> {
        const results: UploadedFile[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const result = await this.uploadFile(file, conversationId, (progress) => {
                onProgress?.(i, progress);
            });
            results.push(result);
        }

        return results;
    },

    /**
     * Récupère les fichiers d'une conversation
     */
    async getConversationFiles(conversationId: string): Promise<UploadedFile[]> {
        if (USE_MOCK) {
            return getMockFiles().filter(f => f.path.includes(conversationId));
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non authentifié");

        const folderPath = `${user.id}/conversations/${conversationId}`;

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(folderPath);

        if (error) throw error;

        return (data || []).map((file) => ({
            id: file.id || crypto.randomUUID(),
            name: file.name,
            url: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${folderPath}/${file.name}`).data.publicUrl,
            path: `${folderPath}/${file.name}`,
            type: file.metadata?.mimetype || "application/octet-stream",
            size: file.metadata?.size || 0,
            uploadedAt: file.created_at || new Date().toISOString(),
        }));
    },

    /**
     * Supprime un fichier
     */
    async deleteFile(path: string): Promise<void> {
        if (USE_MOCK) {
            const files = getMockFiles().filter(f => f.path !== path);
            saveMockFiles(files);
            return;
        }

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([path]);

        if (error) throw error;
    },

    /**
     * Télécharge un fichier
     */
    async downloadFile(path: string): Promise<Blob> {
        if (USE_MOCK) {
            const file = getMockFiles().find(f => f.path === path);
            if (!file) throw new Error("Fichier non trouvé");

            const response = await fetch(file.url);
            return response.blob();
        }

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .download(path);

        if (error) throw error;
        return data;
    },

    /**
     * Obtient une URL signée temporaire (pour fichiers privés)
     */
    async getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
        if (USE_MOCK) {
            const file = getMockFiles().find(f => f.path === path);
            return file?.url || "";
        }

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .createSignedUrl(path, expiresIn);

        if (error) throw error;
        return data.signedUrl;
    },

    /**
     * Vérifie si un fichier est une image
     */
    isImage(type: string): boolean {
        return type.startsWith("image/");
    },

    /**
     * Vérifie si un fichier est un audio
     */
    isAudio(type: string): boolean {
        return type.startsWith("audio/");
    },

    /**
     * Vérifie si un fichier est un PDF
     */
    isPDF(type: string): boolean {
        return type === "application/pdf";
    },

    /**
     * Formate la taille du fichier
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    },
};

export default iastedStorageService;
