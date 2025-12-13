import { supabase } from '@/integrations/supabase/client';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  storagePath: string;
}

export const iastedStorageService = {
  async uploadFile(file: File, sessionId?: string): Promise<UploadedFile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${sessionId || 'general'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('iasted-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('iasted-files')
        .getPublicUrl(filePath);

      // For private buckets, we need to create a signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('iasted-files')
        .createSignedUrl(filePath, 3600 * 24); // 24 hours

      const fileUrl = signedUrlData?.signedUrl || urlData.publicUrl;

      return {
        id: crypto.randomUUID(),
        name: file.name,
        url: fileUrl,
        type: file.type,
        size: file.size,
        storagePath: filePath
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  },

  async getSignedUrl(storagePath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('iasted-files')
        .createSignedUrl(storagePath, 3600); // 1 hour

      if (error) {
        console.error('Error getting signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  },

  async deleteFile(storagePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('iasted-files')
        .remove([storagePath]);

      if (error) {
        console.error('Error deleting file:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  },

  async listUserFiles(userId: string, sessionId?: string): Promise<UploadedFile[]> {
    try {
      const path = sessionId ? `${userId}/${sessionId}` : userId;
      
      const { data, error } = await supabase.storage
        .from('iasted-files')
        .list(path, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error listing files:', error);
        return [];
      }

      const files: UploadedFile[] = [];
      for (const file of data || []) {
        if (file.name) {
          const filePath = `${path}/${file.name}`;
          const { data: signedUrlData } = await supabase.storage
            .from('iasted-files')
            .createSignedUrl(filePath, 3600);

          files.push({
            id: file.id || crypto.randomUUID(),
            name: file.name,
            url: signedUrlData?.signedUrl || '',
            type: file.metadata?.mimetype || 'application/octet-stream',
            size: file.metadata?.size || 0,
            storagePath: filePath
          });
        }
      }

      return files;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
};
