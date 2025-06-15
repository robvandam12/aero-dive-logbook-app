
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
                  className="bg-ocean-950/50 border-ocean-700 text-white hover:border-ocean-600 focus:border-ocean-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
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
                  className="bg-ocean-950/50 border-ocean-700 text-white hover:border-ocean-600 focus:border-ocean-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
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
                <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white hover:border-ocean-600 focus:border-ocean-500 transition-colors">
                  <SelectValue placeholder="Seleccionar tipo de faena" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-ocean-900 border-ocean-700 text-white z-50">
                <SelectItem value="inspeccion" className="hover:bg-ocean-800 focus:bg-ocean-800">Inspección</SelectItem>
                <SelectItem value="soldadura" className="hover:bg-ocean-800 focus:bg-ocean-800">Soldadura Subacuática</SelectItem>
                <SelectItem value="corte" className="hover:bg-ocean-800 focus:bg-ocean-800">Corte Subacuático</SelectItem>
                <SelectItem value="limpieza" className="hover:bg-ocean-800 focus:bg-ocean-800">Limpieza de Casco</SelectItem>
                <SelectItem value="reparacion" className="hover:bg-ocean-800 focus:bg-ocean-800">Reparación</SelectItem>
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
                <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white hover:border-ocean-600 focus:border-ocean-500 transition-colors">
                  <SelectValue placeholder={!centerId ? "Seleccione un centro primero" : "Seleccionar embarcación"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-ocean-900 border-ocean-700 text-white z-50">
                {isLoadingBoats && <SelectItem value="loading" disabled>Cargando...</SelectItem>}
                {boatsError && <SelectItem value="error" disabled>Error al cargar</SelectItem>}
                {!isLoadingBoats && boats?.length === 0 && <SelectItem value="no-boats" disabled>No hay embarcaciones para este centro</SelectItem>}
                {boats?.map(boat => (
                  <SelectItem key={boat.id} value={boat.id} className="hover:bg-ocean-800 focus:bg-ocean-800">{boat.name}</SelectItem>
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
                className="bg-ocean-950/50 border-ocean-700 text-white hover:border-ocean-600 focus:border-ocean-500 transition-colors placeholder:text-ocean-400"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
