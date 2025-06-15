
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export function dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export const uploadSignatureToStorage = async (signatureData: string, userId: string): Promise<string> => {
  const blob = dataURLtoBlob(signatureData);
  const fileName = `${userId}/${uuidv4()}.png`;
  
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('signatures')
    .upload(fileName, blob, {
      contentType: 'image/png',
      upsert: false,
    });
    
  if (uploadError) throw uploadError;
  
  const { data: urlData } = supabase.storage
    .from('signatures')
    .getPublicUrl(fileData.path);
    
  return urlData.publicUrl;
};

export const deleteSignatureFromStorage = async (signatureUrl: string): Promise<void> => {
  if (!signatureUrl || !signatureUrl.includes('/signatures/')) return;
  
  // Extract file path from URL
  const urlParts = signatureUrl.split('/signatures/');
  if (urlParts.length < 2) return;
  
  const filePath = urlParts[1];
  
  const { error } = await supabase.storage
    .from('signatures')
    .remove([filePath]);
    
  if (error) {
    console.warn('Failed to delete old signature:', error);
  }
};
