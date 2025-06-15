
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useEffect } from "react";

const centerSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido." }),
  location: z.string().min(1, { message: "La ubicación es requerida." }),
});

export type CenterFormData = z.infer<typeof centerSchema>;
type Center = Tables<'centers'>;

interface CenterFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (data: CenterFormData) => void;
  defaultValues?: Center;
  isPending: boolean;
}

export const CenterForm = ({ isOpen, setIsOpen, onSubmit, defaultValues, isPending }: CenterFormProps) => {
  const form = useForm<CenterFormData>({
    resolver: zodResolver(centerSchema),
    defaultValues: { name: '', location: '' },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({ name: '', location: '' });
    }
  }, [defaultValues, form, isOpen]);

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] glass text-white border-ocean-700/30">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Editar' : 'Crear'} Centro de Buceo</DialogTitle>
          <DialogDescription className="text-ocean-300">
            {defaultValues ? 'Actualiza los detalles del centro.' : 'Añade un nuevo centro al sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Centro</FormLabel>
                  <FormControl>
                    <Input className="bg-ocean-900/50 border-ocean-700 text-white" placeholder="Ej: Buceo Profundo Co." {...field} />
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
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input className="bg-ocean-900/50 border-ocean-700 text-white" placeholder="Ej: Cancún, México" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
