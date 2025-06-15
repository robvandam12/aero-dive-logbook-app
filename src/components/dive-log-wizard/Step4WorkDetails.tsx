
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export const Step4WorkDetails = () => {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="work_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ocean-300">Tipo de Faena</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                  <SelectValue placeholder="Seleccionar tipo de faena" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-ocean-900 border-ocean-700">
                <SelectItem value="inspeccion">Inspección</SelectItem>
                <SelectItem value="soldadura">Soldadura Subacuática</SelectItem>
                <SelectItem value="corte">Corte Subacuático</SelectItem>
                <SelectItem value="limpieza">Limpieza de Casco</SelectItem>
                <SelectItem value="reparacion">Reparación</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="boat_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ocean-300">Embarcación</FormLabel>
            <FormControl>
              <Input placeholder="Nombre de la embarcación" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="work_details"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ocean-300">Detalle de Trabajos Realizados</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describa detalladamente los trabajos realizados..."
                rows={6}
                {...field}
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
