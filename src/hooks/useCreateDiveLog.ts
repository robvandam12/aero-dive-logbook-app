
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

      // Helper function to convert empty strings to null for UUIDs
      const toNullIfEmpty = (value: string | undefined) => {
        return value && value.trim() !== '' ? value : null;
      };

      // Prepare insert data - handle empty strings and "none" values
      const insertData = {
        supervisor_id: userId,
        supervisor_name: data.supervisor_name,
        log_date: data.log_date,
        center_id: toNullIfEmpty(data.center_id),
        dive_site_id: toNullIfEmpty(data.dive_site_id),
        boat_id: toNullIfEmpty(data.boat_id),
        weather_conditions: `${data.weather_condition || 'N/A'}, Viento: ${data.wind_knots || 'N/A'} nudos, Oleaje: ${data.wave_height_meters || 'N/A'} m`,
        divers_manifest: data.divers_manifest,
        observations: data.observations || "",
        departure_time: data.departure_time || null,
        arrival_time: data.arrival_time || null,
        work_type: data.work_type || null,
        work_details: data.work_details || null,
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
