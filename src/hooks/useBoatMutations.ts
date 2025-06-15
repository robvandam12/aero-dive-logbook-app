
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BoatFormData } from "@/components/admin/BoatForm";
import { Tables } from "@/integrations/supabase/types";

type UseBoatMutationsProps = {
  centerId?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useBoatMutations = ({ centerId, onSuccess, onError }: UseBoatMutationsProps = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSuccess = (message: string) => {
    toast({ title: "Éxito", description: message });
    queryClient.invalidateQueries({ queryKey: ['boats', centerId] });
    onSuccess?.();
  };
  
  const handleError = (error: Error) => {
    toast({ title: "Error", description: error.message, variant: "destructive" });
    onError?.(error);
  };

  const createMutation = useMutation<Tables<'boats'>, Error, { values: BoatFormData & { center_id: string } }>({
    mutationFn: async ({ values }) => {
      const { data, error } = await supabase.from('boats').insert({
        name: values.name,
        registration_number: values.registration_number,
        center_id: values.center_id,
      }).select().single();
      if (error) throw error;
      if (!data) throw new Error("No se pudo crear la embarcación.");
      return data;
    },
    onSuccess: () => handleSuccess("Embarcación creada con éxito."),
    onError: handleError,
  });

  const updateMutation = useMutation<Tables<'boats'>, Error, { id: string; values: BoatFormData }>({
    mutationFn: async ({ id, values }) => {
      const { name, registration_number } = values;
      const valuesForUpdate = { name, registration_number };
      
      const { data, error } = await supabase.from('boats').update(valuesForUpdate).eq('id', id).select().single();
      if (error) throw error;
      if (!data) throw new Error("Embarcación no encontrada tras la actualización.");
      return data;
    },
    onSuccess: () => handleSuccess("Embarcación actualizada con éxito."),
    onError: handleError,
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('boats').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      handleSuccess("Embarcación eliminada.");
    },
    onError: handleError
  });

  return { createMutation, updateMutation, deleteMutation };
};
