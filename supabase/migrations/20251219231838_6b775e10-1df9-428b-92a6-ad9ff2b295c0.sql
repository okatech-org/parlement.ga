-- Create storage bucket for parliamentarian photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'parliamentarian-photos', 
  'parliamentarian-photos', 
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Allow public read access to photos
CREATE POLICY "Public can view parliamentarian photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'parliamentarian-photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload parliamentarian photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'parliamentarian-photos');

-- Allow admins to update photos
CREATE POLICY "Admins can update parliamentarian photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'parliamentarian-photos' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete photos
CREATE POLICY "Admins can delete parliamentarian photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'parliamentarian-photos' AND public.has_role(auth.uid(), 'admin'));