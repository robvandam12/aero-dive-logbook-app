
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

export const useUpdateDiveLog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data, userId }: { id: string, data: DiveLogFormValues, userId: string }) => {
      let signatureUrl: string | null = null;
      
      // Handle signature upload if new signature provided
      if (data.signature_data && data.signature_data.startsWith('data:')) {
        try {
          const blob = dataURLtoBlob(data.signature_data);
          const fileName = `public/${userId}-${uuidv4()}.png`;
          const { data: fileData, error: uploadError } = await supabase.storage
            .from('signatures')
            .upload(fileName, blob, {
              contentType: 'image/png',
              upsert: false,
            });
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from('signatures').getPublicUrl(fileData.path);
          signatureUrl = urlData.publicUrl;
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
