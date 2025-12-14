import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File as FileIcon, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import iastedStorageService, { UploadedFile } from '@/services/iastedStorageService';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    conversationId: string;
    onUploadComplete?: (file: UploadedFile) => void;
    className?: string;
    maxFiles?: number;
    accept?: Record<string, string[]>;
    autoUpload?: boolean;
}

interface FileWithPreview extends File {
    preview?: string;
}

export function FileUpload({
    conversationId,
    onUploadComplete,
    className,
    maxFiles = 5,
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        'application/pdf': ['.pdf'],
        'text/plain': ['.txt', '.md'],
        'application/msword': ['.doc', '.docx'],
    },
    autoUpload = true
}: FileUploadProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const handleUpload = async (filesToUpload: File[]) => {
        setUploading(true);

        for (const file of filesToUpload) {
            try {
                // Initialize progress
                setProgress(prev => ({ ...prev, [file.name]: 0 }));

                const uploaded = await iastedStorageService.uploadFile(
                    file,
                    conversationId,
                    (p) => setProgress(prev => ({ ...prev, [file.name]: p.percentage }))
                );

                setUploadedFiles(prev => [...prev, uploaded]);
                onUploadComplete?.(uploaded);
                toast.success(`Fichier ${file.name} téléversé`);

                // Remove from pending files after success (optional, or keep as "Completed")
                setFiles(prev => prev.filter(f => f.name !== file.name));

            } catch (error) {
                console.error(error);
                toast.error(`Erreur lors du téléversement de ${file.name}`);
            }
        }

        setUploading(false);
    };

    const onDrop = useCallback((acceptedFiles: FileWithPreview[]) => {
        // Create previews
        const newFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));

        setFiles(prev => [...prev, ...newFiles]);

        if (autoUpload) {
            handleUpload(newFiles);
        }
    }, [autoUpload, conversationId]);

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
        // Also cleanup object URL to avoid memory leaks
        const file = files.find(f => f.name === fileName);
        if (file?.preview) {
            URL.revokeObjectURL(file.preview);
        }
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        maxFiles,
        accept,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
        if (file.type === 'application/pdf') return <FileIcon className="w-8 h-8 text-red-500" />;
        return <FileIcon className="w-8 h-8 text-gray-500" />;
    };

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center cursor-pointer group",
                    isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-border hover:border-primary/50 hover:bg-muted/25",
                    isDragReject && "border-destructive bg-destructive/5",
                    uploading && "pointer-events-none opacity-50"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                        "p-4 rounded-full bg-muted transition-colors group-hover:bg-background shadow-sm",
                        isDragActive && "bg-background"
                    )}>
                        {uploading ? (
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        ) : (
                            <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            {isDragActive ? "Déposez les fichiers ici" : "Glissez-déposez ou cliquez pour ajouter"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5 max-w-[240px] mx-auto">
                            Images, PDF, Documents (Max 10MB)
                        </p>
                    </div>
                </div>
            </div>

            {/* Files List / Preview */}
            {(files.length > 0 || uploadedFiles.length > 0) && (
                <ScrollArea className="max-h-[220px] w-full rounded-md border bg-card">
                    <div className="p-4 space-y-3">
                        {/* Pending / Uploading Files */}
                        {files.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg group animate-in slide-in-from-top-2 duration-200">
                                <div className="flex-shrink-0">
                                    {file.type.startsWith('image/') && file.preview ? (
                                        <img
                                            src={file.preview}
                                            alt={file.name}
                                            className="w-10 h-10 object-cover rounded-md border"
                                            onLoad={() => { URL.revokeObjectURL(file.preview!) }}
                                        />
                                    ) : (
                                        getFileIcon(file)
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-medium truncate max-w-[180px]" title={file.name}>{file.name}</p>
                                        {progress[file.name] !== undefined && (
                                            <span className="text-xs text-muted-foreground">{Math.round(progress[file.name])}%</span>
                                        )}
                                    </div>
                                    <Progress value={progress[file.name] || 0} className="h-1.5" />
                                </div>
                                {!uploading && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}

                        {/* Recently Uploaded Files (Success State) */}
                        {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                                <div className="p-2 bg-green-500/10 rounded-full">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate text-foreground">{file.name}</p>
                                    <p className="text-xs text-green-600 font-medium">Téléversé avec succès</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => window.open(file.url, '_blank')}
                                >
                                    <FileIcon className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}

export default FileUpload;
