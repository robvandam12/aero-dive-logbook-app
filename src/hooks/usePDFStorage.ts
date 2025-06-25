
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePDFStorage = () => {
  const { toast } = useToast();

  const uploadPDFToStorage = useCallback(async (
    pdfBlob: Blob,
    diveLogId: string
  ): Promise<string | null> => {
    try {
      const fileName = `dive-log-${diveLogId}-${Date.now()}.pdf`;
      
      console.log(`Uploading PDF to storage: ${fileName}`);
      
      const { data, error } = await supabase.storage
        .from('temp-pdfs')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) {
        console.error('Error uploading PDF to storage:', error);
        return null;
      }

      console.log(`PDF uploaded successfully: ${data.path}`);
      return data.path;
    } catch (error) {
      console.error('Error in uploadPDFToStorage:', error);
      return null;
    }
  }, []);

  const deletePDFFromStorage = useCallback(async (filePath: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from('temp-pdfs')
        .remove([filePath]);

      if (error) {
        console.warn('Error deleting PDF from storage:', error);
      } else {
        console.log(`PDF deleted from storage: ${filePath}`);
      }
    } catch (error) {
      console.warn('Error in deletePDFFromStorage:', error);
    }
  }, []);

  const getPDFFromStorage = useCallback(async (filePath: string): Promise<Blob | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('temp-pdfs')
        .download(filePath);

      if (error) {
        console.error('Error downloading PDF from storage:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPDFFromStorage:', error);
      return null;
    }
  }, []);

  return {
    uploadPDFToStorage,
    deletePDFFromStorage,
    getPDFFromStorage
  };
};
