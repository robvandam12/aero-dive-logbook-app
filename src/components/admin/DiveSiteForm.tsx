
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diveSiteSchema, DiveSiteFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tables } from "@/integrations/supabase/types";
import { useEffect } from "react";

interface DiveSiteFormProps {
  onSubmit: (values: DiveSiteFormValues) => void;
  isSubmitting: boolean;
  initialData?: Tables<'dive_sites'> | null;
}

export const DiveSiteForm = ({ onSubmit, isSubmitting, initialData }: DiveSiteFormProps) => {
  const form = useForm<DiveSiteFormValues>({
    resolver: zodResolver(diveSiteSchema),
    defaultValues: {
      name: initialData?.name || "",
      location: initialData?.location || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: initialData?.name || "",
      location: initialData?.location || "",
    });
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Punto de Buceo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: La Lobera" {...field} className="text-black" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación / Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Ej: Cerca de la costa, con fondo rocoso..." {...field} className="text-black" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full bg-ocean-gradient hover:opacity-90">
          {isSubmitting ? 'Guardando...' : 'Guardar Punto de Buceo'}
        </Button>
      </form>
    </Form>
  );
};
