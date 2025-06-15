
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { DiveLogFormValues } from '@/lib/schemas';
import { v4 as uuidv4 } from 'uuid';

function dataURLtoBlob(dataurl: string) {
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

const uploadSignatureToStorage = async (signatureData: string, userId: string): Promise<string> => {
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

const deleteSignatureFromStorage = async (signatureUrl: string): Promise<void> => {
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

export const useCreateDiveLog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ data, userId }: { data: DiveLogFormValues, userId: string }) => {
      let signatureUrl: string | null = null;
      
      // Handle signature upload if provided
      if (data.signature_data && data.signature_data.startsWith('data:')) {
        try {
          signatureUrl = await uploadSignatureToStorage(data.signature_data, userId);
        } catch (error: any) {
          throw new Error(`Error al subir la firma: ${error.message}`);
        }
      }

      // Prepare insert data
      const insertData = {
        supervisor_id: userId,
        log_date: data.log_date,
        center_id: data.center_id,
        dive_site_id: data.dive_site_id,
        boat_id: data.boat_id || null,
        weather_conditions: `${data.weather_condition || 'N/A'}, Viento: ${data.wind_knots || 'N/A'} nudos, Oleaje: ${data.wave_height_meters || 'N/A'} m`,
        divers_manifest: data.divers_manifest,
        observations: data.observations || "",
        departure_time: data.departure_time || null,
        arrival_time: data.arrival_time || null,
        signature_url: signatureUrl
      };

      const { data: result, error } = await supabase
        .from('dive_logs')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diveLogs'] });
      queryClient.invalidateQueries({ queryKey: ['recentDiveLogs'] });
      toast({
        title: "Bitácora creada",
        description: "La bitácora ha sido creada correctamente."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useUpdateDiveLog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data, userId, currentSignatureUrl }: { 
      id: string, 
      data: DiveLogFormValues, 
      userId: string,
      currentSignatureUrl?: string | null
    }) => {
      let signatureUrl: string | null = currentSignatureUrl || null;
      
      // Handle signature upload if new signature provided
      if (data.signature_data && data.signature_data.startsWith('data:')) {
        try {
          // Upload new signature
          signatureUrl = await uploadSignatureToStorage(data.signature_data, userId);
          
          // Delete old signature if it exists
          if (currentSignatureUrl) {
            await deleteSignatureFromStorage(currentSignatureUrl);
          }
        } catch (error: any) {
          throw new Error(`Error al subir la firma: ${error.message}`);
        }
      }

      // Prepare update data
      const updateData = {
        log_date: data.log_date,
        center_id: data.center_id,
        dive_site_id: data.dive_site_id,
        boat_id: data.boat_id || null,
        weather_conditions: `${data.weather_condition || 'N/A'}, Viento: ${data.wind_knots || 'N/A'} nudos, Oleaje: ${data.wave_height_meters || 'N/A'} m`,
        divers_manifest: data.divers_manifest,
        observations: data.observations || "",
        departure_time: data.departure_time || null,
        arrival_time: data.arrival_time || null,
        ...(signatureUrl && { signature_url: signatureUrl })
      };

      const { error } = await supabase
        .from('dive_logs')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['diveLog', data.id] });
      queryClient.invalidateQueries({ queryKey: ['diveLogs'] });
      toast({
        title: "Bitácora actualizada",
        description: "La bitácora ha sido actualizada correctamente."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useDeleteDiveLog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, signatureUrl }: { id: string, signatureUrl?: string | null }) => {
      // Delete signature from storage if it exists
      if (signatureUrl) {
        await deleteSignatureFromStorage(signatureUrl);
      }

      const { error } = await supabase
        .from('dive_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diveLogs'] });
      queryClient.invalidateQueries({ queryKey: ['recentDiveLogs'] });
      toast({
        title: "Bitácora eliminada",
        description: "La bitácora ha sido eliminada correctamente."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
