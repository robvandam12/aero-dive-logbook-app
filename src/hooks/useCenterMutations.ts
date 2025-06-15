
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CenterFormValues } from "@/lib/schemas";
import { Tables } from "@/integrations/supabase/types";

type UseCenterMutationsProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCenterMutations = ({ onSuccess, onError }: UseCenterMutationsProps = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSuccess = (message: string) => {
    toast({ title: "Éxito", description: message });
    queryClient.invalidateQueries({ queryKey: ['centers'] });
    onSuccess?.();
  };
  
  const handleError = (error: Error) => {
    toast({ title: "Error", description: error.message, variant: "destructive" });
    onError?.(error);
  };

  const createMutation = useMutation<Tables<'centers'>, Error, { values: CenterFormValues }>({
    mutationFn: async ({ values }) => {
      const { data, error } = await supabase.from('centers').insert({
        name: values.name,
        location: values.location,
      }).select().single();
      if (error) throw error;
      if (!data) throw new Error("No se pudo crear el centro.");
      return data;
    },
    onSuccess: () => handleSuccess("Centro creado con éxito."),
    onError: handleError,
  });

  const updateMutation = useMutation<Tables<'centers'>, Error, { id: string; values: CenterFormValues }>({
    mutationFn: async ({ id, values }) => {
      const { name, location } = values;
      const valuesForUpdate = { name, location };
      
      const { data, error } = await supabase.from('centers').update(valuesForUpdate).eq('id', id).select().single();
      if (error) throw error;
      if (!data) throw new Error("Centro no encontrado tras la actualización.");
      return data;
    },
    onSuccess: () => handleSuccess("Centro actualizado con éxito."),
    onError: handleError,
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('centers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      handleSuccess("Centro eliminado.");
    },
    onError: handleError
  });

  return { createMutation, updateMutation, deleteMutation };
};
