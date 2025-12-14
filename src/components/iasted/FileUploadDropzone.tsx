import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, X, File, Image, Music, FileText,
    CheckCircle, Loader2, AlertCircle, Download,
    Trash2, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    iastedStorageService,
    UploadedFile,
    UploadProgress
} from "@/services/iastedStorageService";
import { toast } from "sonner";

interface FileUploadProps {
    conversationId: string;
    onFilesUploaded?: (files: UploadedFile[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    acceptedTypes?: string[];
    className?: string;
}

interface FileWithPreview extends File {
    preview?: string;
    id: string;
    status: "pending" | "uploading" | "success" | "error";
    progress: number;
    uploadedFile?: UploadedFile;
    error?: string;
}

/**
 * Composant d'upload de fichiers avec drag-and-drop et preview
 */
const FileUploadDropzone = ({
    conversationId,
    onFilesUploaded,
    maxFiles = 5,
    maxSizeMB = 10,
    acceptedTypes = ["image/*", "audio/*", "application/pdf", "text/*"],
    className,
}: FileUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const getFileIcon = (type: string) => {
        if (type.startsWith("image/")) return Image;
        if (type.startsWith("audio/")) return Music;
        if (type === "application/pdf") return FileText;
        return File;
    };

    const validateFile = (file: File): string | null => {
        if (file.size > maxSizeBytes) {
            return `Fichier trop volumineux (max ${maxSizeMB}MB)`;
        }

        const isAccepted = acceptedTypes.some(type => {
            if (type.endsWith("/*")) {
                return file.type.startsWith(type.replace("/*", "/"));
            }
            return file.type === type;
        });

        if (!isAccepted) {
            return "Type de fichier non autorisé";
        }

        return null;
    };

    const createPreview = (file: File): string | undefined => {
        if (file.type.startsWith("image/")) {
            return URL.createObjectURL(file);
        }
        return undefined;
    };

    const handleFiles = useCallback((newFiles: FileList | File[]) => {
        const fileArray = Array.from(newFiles);

        if (files.length + fileArray.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} fichiers autorisés`);
            return;
        }

        const processedFiles: FileWithPreview[] = fileArray.map(file => {
            const error = validateFile(file);
            return Object.assign(file, {
                id: crypto.randomUUID(),
                preview: error ? undefined : createPreview(file),
                status: error ? "error" : "pending",
                progress: 0,
                error,
            }) as FileWithPreview;
        });

        setFiles(prev => [...prev, ...processedFiles]);
    }, [files.length, maxFiles, maxSizeBytes]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => {
            const file = prev.find(f => f.id === id);
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }
            return prev.filter(f => f.id !== id);
        });
    };

    const uploadFiles = async () => {
        const pendingFiles = files.filter(f => f.status === "pending");
        if (pendingFiles.length === 0) return;

        setIsUploading(true);
        const uploadedFiles: UploadedFile[] = [];

        for (const file of pendingFiles) {
            try {
                setFiles(prev => prev.map(f =>
                    f.id === file.id ? { ...f, status: "uploading" } : f
                ));

                const result = await iastedStorageService.uploadFile(
                    file,
                    conversationId,
                    (progress) => {
                        setFiles(prev => prev.map(f =>
                            f.id === file.id ? { ...f, progress: progress.percentage } : f
                        ));
                    }
                );

                setFiles(prev => prev.map(f =>
                    f.id === file.id
                        ? { ...f, status: "success", progress: 100, uploadedFile: result }
                        : f
                ));

                uploadedFiles.push(result);
            } catch (error) {
                setFiles(prev => prev.map(f =>
                    f.id === file.id
                        ? { ...f, status: "error", error: "Échec de l'upload" }
                        : f
                ));
            }
        }

        setIsUploading(false);

        if (uploadedFiles.length > 0) {
            onFilesUploaded?.(uploadedFiles);
            toast.success(`${uploadedFiles.length} fichier(s) uploadé(s)`);
        }
    };

    const clearCompleted = () => {
        setFiles(prev => prev.filter(f => f.status !== "success" && f.status !== "error"));
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Zone de drop */}
            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                animate={{
                    scale: isDragging ? 1.02 : 1,
                    borderColor: isDragging ? "hsl(var(--primary))" : "hsl(var(--border))",
                }}
                className={cn(
                    "relative p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                    "hover:border-primary hover:bg-primary/5",
                    isDragging && "border-primary bg-primary/10"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(",")}
                    onChange={handleInputChange}
                    className="hidden"
                />

                <div className="flex flex-col items-center text-center">
                    <motion.div
                        animate={{ y: isDragging ? -5 : 0 }}
                        className="p-4 bg-primary/10 rounded-full mb-4"
                    >
                        <Upload className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="font-medium text-foreground mb-1">
                        {isDragging ? "Déposez les fichiers ici" : "Glissez-déposez vos fichiers"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        ou <span className="text-primary">cliquez pour parcourir</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Max {maxFiles} fichiers • {maxSizeMB}MB par fichier
                    </p>
                </div>
            </motion.div>

            {/* Liste des fichiers */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-2"
                    >
                        {files.map((file) => {
                            const FileIcon = getFileIcon(file.type);

                            return (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg border bg-card",
                                        file.status === "error" && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                        file.status === "success" && "border-green-500 bg-green-50 dark:bg-green-950/20"
                                    )}
                                >
                                    {/* Preview ou Icône */}
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                                        {file.preview ? (
                                            <img
                                                src={file.preview}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FileIcon className="h-6 w-6 text-muted-foreground" />
                                        )}
                                    </div>

                                    {/* Infos fichier */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {iastedStorageService.formatFileSize(file.size)}
                                        </p>

                                        {/* Barre de progression */}
                                        {file.status === "uploading" && (
                                            <Progress value={file.progress} className="h-1 mt-2" />
                                        )}

                                        {file.error && (
                                            <p className="text-xs text-red-500 mt-1">{file.error}</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="shrink-0 flex items-center gap-2">
                                        {file.status === "pending" && (
                                            <span className="text-xs text-muted-foreground">En attente</span>
                                        )}
                                        {file.status === "uploading" && (
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        )}
                                        {file.status === "success" && (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                        {file.status === "error" && (
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                        )}

                                        {/* Supprimer */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(file.id);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            {files.some(f => f.status === "pending") && (
                                <Button
                                    onClick={uploadFiles}
                                    disabled={isUploading}
                                    className="flex-1"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Upload en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Uploader ({files.filter(f => f.status === "pending").length})
                                        </>
                                    )}
                                </Button>
                            )}

                            {files.some(f => f.status === "success" || f.status === "error") && (
                                <Button
                                    variant="outline"
                                    onClick={clearCompleted}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Nettoyer
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileUploadDropzone;
