import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PhotoMap {
  [memberId: string]: string;
}

export const useBureauPhotos = () => {
  const [photos, setPhotos] = useState<PhotoMap>({});
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage
        .from('parliamentarian-photos')
        .list('bureau', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error('Error fetching bureau photos:', error);
        return;
      }

      const photoMap: PhotoMap = {};
      for (const file of data || []) {
        if (file.name) {
          // Extract member ID from filename (e.g., "1.jpg" -> "1")
          const memberId = file.name.split('.')[0];
          const { data: urlData } = supabase.storage
            .from('parliamentarian-photos')
            .getPublicUrl(`bureau/${file.name}`);
          
          // Add cache-busting parameter
          photoMap[memberId] = `${urlData.publicUrl}?t=${file.updated_at || Date.now()}`;
        }
      }

      setPhotos(photoMap);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const updatePhoto = (memberId: string, url: string) => {
    setPhotos(prev => ({
      ...prev,
      [memberId]: url
    }));
  };

  const getPhotoUrl = (memberId: string): string | undefined => {
    return photos[memberId];
  };

  return {
    photos,
    loading,
    updatePhoto,
    getPhotoUrl,
    refetch: fetchPhotos
  };
};
