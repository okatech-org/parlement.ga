import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Loader2, X, Camera, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ParliamentarianPhotoUploadProps {
  memberId: string;
  memberName: string;
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
  variant?: "button" | "icon";
}

export const ParliamentarianPhotoUpload: React.FC<ParliamentarianPhotoUploadProps> = ({
  memberId,
  memberName,
  currentPhotoUrl,
  onPhotoUploaded,
  variant = "icon"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error("Format non supporté. Utilisez JPEG, PNG ou WebP.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La taille maximale est de 5 Mo.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Generate a unique filename
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const fileName = `bureau/${memberId}.${fileExt}`;

      // Delete existing photo if any
      await supabase.storage
        .from('parliamentarian-photos')
        .remove([fileName]);

      // Upload new photo
      const { error: uploadError } = await supabase.storage
        .from('parliamentarian-photos')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('parliamentarian-photos')
        .getPublicUrl(fileName);

      // Add cache-busting parameter
      const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      
      onPhotoUploaded(photoUrl);
      toast.success(`Photo de ${memberName} mise à jour`);
      setIsOpen(false);
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors de l'upload de la photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error("Format non supporté. Utilisez JPEG, PNG ou WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La taille maximale est de 5 Mo.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const clearPreview = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {variant === "button" ? (
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="w-4 h-4" />
            Changer la photo
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-full bg-background/80 shadow-sm hover:bg-background"
          >
            <Camera className="w-3 h-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Photo de {memberName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Current photo preview */}
          {currentPhotoUrl && !preview && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Photo actuelle</p>
              <img
                src={currentPhotoUrl}
                alt={memberName}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-border"
              />
            </div>
          )}

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
          >
            {preview ? (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Aperçu"
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={clearPreview}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Glissez-déposez une photo ici ou
                </p>
                <label className="cursor-pointer">
                  <span className="text-primary hover:underline text-sm font-medium">
                    parcourez vos fichiers
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  JPEG, PNG ou WebP • Max 5 Mo
                </p>
              </>
            )}
          </div>

          {/* Upload button */}
          {preview && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Valider cette photo
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
