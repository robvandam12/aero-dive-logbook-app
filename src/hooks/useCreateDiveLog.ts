
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DiveLogFormValues } from '@/lib/schemas';
import { uploadSignatureToStorage } from '@/utils/signatureStorage';

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

      // Prepare insert data - handle "none" values
      const insertData = {
        supervisor_id: userId,
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
