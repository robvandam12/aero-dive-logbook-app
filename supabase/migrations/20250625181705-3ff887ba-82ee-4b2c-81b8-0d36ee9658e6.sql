
-- Create storage bucket for temporary PDF files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('temp-pdfs', 'temp-pdfs', false);

-- Create policy to allow authenticated users to upload PDFs
CREATE POLICY "Allow authenticated users to upload temp PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'temp-pdfs');

-- Create policy to allow authenticated users to read temp PDFs  
CREATE POLICY "Allow authenticated users to read temp PDFs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'temp-pdfs');

-- Create policy to allow service role to manage temp PDFs
CREATE POLICY "Allow service role to manage temp PDFs"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'temp-pdfs')
WITH CHECK (bucket_id = 'temp-pdfs');

-- Create policy to allow authenticated users to delete their own temp PDFs
CREATE POLICY "Allow users to delete temp PDFs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'temp-pdfs');
