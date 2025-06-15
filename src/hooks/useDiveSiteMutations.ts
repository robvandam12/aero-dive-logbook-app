
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DiveSiteFormValues } from "@/lib/schemas";
import { Tables } from "@/integrations/supabase/types";

type UseDiveSiteMutationsProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDiveSiteMutations = ({ onSuccess, onError }: UseDiveSiteMutationsProps = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSuccess = (message: string) => {
    toast({ title: "Éxito", description: message });
    queryClient.invalidateQueries({ queryKey: ['dive_sites'] });
    onSuccess?.();
  };
  
  const handleError = (error: Error) => {
    toast({ title: "Error", description: error.message, variant: "destructive" });
    onError?.(error);
  };

  const createMutation = useMutation<Tables<'dive_sites'>, Error, { values: DiveSiteFormValues }>({
    mutationFn: async ({ values }) => {
      const { data, error } = await supabase.from('dive_sites').insert(values).select().single();
      if (error) throw error;
      if (!data) throw new Error("No se pudo crear el punto de buceo.");
      return data;
    },
    onSuccess: () => handleSuccess("Punto de buceo creado con éxito."),
    onError: handleError,
  });

  const updateMutation = useMutation<Tables<'dive_sites'>, Error, { id: string; values: DiveSiteFormValues }>({
    mutationFn: async ({ id, values }) => {
      const { data, error } = await supabase.from('dive_sites').update(values).eq('id', id).select().single();
      if (error) throw error;
      if (!data) throw new Error("Punto de buceo no encontrado tras la actualización.");
      return data;
    },
    onSuccess: () => handleSuccess("Punto de buceo actualizado con éxito."),
    onError: handleError,
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('dive_sites').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      handleSuccess("Punto de buceo eliminado.");
    },
    onError: handleError
  });

  return { createMutation, updateMutation, deleteMutation };
};
