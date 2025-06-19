
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DiveLogFormValues } from '@/lib/schemas';
import { uploadSignatureToStorage, deleteSignatureFromStorage } from '@/utils/signatureStorage';

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

      // Prepare update data - handle "none" values
      const updateData = {
        supervisor_name: data.supervisor_name,
        log_date: data.log_date,
        center_id: data.center_id,
        dive_site_id: data.dive_site_id,
        boat_id: data.boat_id === 'none' || !data.boat_id ? null : data.boat_id,
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
