
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useBoats } from "@/hooks/useBoats";

export const Step4WorkDetails = () => {
  const { control, watch } = useFormContext();
  const centerId = watch("center_id");
  const { data: boats, isLoading: isLoadingBoats, error: boatsError } = useBoats(centerId);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="departure_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-300">Hora de Salida</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="bg-ocean-950/50 border-ocean-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="arrival_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-300">Hora de Llegada</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="bg-ocean-950/50 border-ocean-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="work_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ocean-300">Tipo de Faena</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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
        name="boat_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ocean-300">Embarcación</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingBoats || !centerId}>
              <FormControl>
                <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                  <SelectValue placeholder={!centerId ? "Seleccione un centro primero" : "Seleccionar embarcación"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-ocean-900 border-ocean-700 text-white">
                {isLoadingBoats && <SelectItem value="loading" disabled>Cargando...</SelectItem>}
                {boatsError && <SelectItem value="error" disabled>Error al cargar</SelectItem>}
                {!isLoadingBoats && boats?.length === 0 && <SelectItem value="no-boats" disabled>No hay embarcaciones para este centro</SelectItem>}
                {boats?.map(boat => (
                  <SelectItem key={boat.id} value={boat.id}>{boat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
