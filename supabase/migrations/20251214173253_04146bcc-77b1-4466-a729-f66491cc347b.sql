-- Update bucket configuration (bucket already exists)
UPDATE storage.buckets 
SET 
  file_size_limit = 52428800, -- 50MB
  allowed_mime_types = ARRAY['image/*', 'audio/*', 'application/pdf', 'text/*']
WHERE id = 'iasted-files';

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can upload to their folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- INSERT: authenticated users can upload to their user_id folder
CREATE POLICY "Users can upload to their folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'iasted-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- SELECT: users can only read their own files
CREATE POLICY "Users can read their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'iasted-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- DELETE: users can delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'iasted-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);