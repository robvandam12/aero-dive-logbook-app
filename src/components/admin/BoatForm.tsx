
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boatSchema, BoatFormValues } from "@/lib/schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

export type BoatFormData = BoatFormValues;
type Boat = Tables<'boats'>;

interface BoatFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (data: BoatFormData) => void;
  defaultValues?: Boat;
  isPending: boolean;
}

export const BoatForm = ({ isOpen, setIsOpen, onSubmit, defaultValues, isPending }: BoatFormProps) => {
  const form = useForm<BoatFormData>({
    resolver: zodResolver(boatSchema),
    defaultValues: { name: '', registration_number: '' },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name,
        registration_number: defaultValues.registration_number,
      });
    } else {
      form.reset({ name: '', registration_number: '' });
    }
  }, [defaultValues, form, isOpen]);

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] glass text-white border-ocean-700/30">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Editar' : 'Crear'} Embarcación</DialogTitle>
          <DialogDescription className="text-ocean-300">
            {defaultValues ? 'Actualiza los detalles de la embarcación.' : 'Añade una nueva embarcación al sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Embarcación</FormLabel>
                  <FormControl>
                    <Input className="bg-ocean-900/50 border-ocean-700 text-white" placeholder="Ej: Rayo Veloz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registration_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Matrícula</FormLabel>
                  <FormControl>
                    <Input className="bg-ocean-900/50 border-ocean-700 text-white" placeholder="Ej: AB-123-CD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending} className="bg-ocean-gradient hover:opacity-90">
                {isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
