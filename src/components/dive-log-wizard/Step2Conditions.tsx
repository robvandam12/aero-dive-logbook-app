
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export const Step2Conditions = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="weather_condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-300">Condición del Tiempo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-ocean-900 border-ocean-700">
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="malo">Malo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="wind_knots"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-300">Viento (nudos)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="wave_height_meters"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-300">Oleaje (m)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="0.0" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2">
        <FormLabel className="text-ocean-300">Compresores Utilizados</FormLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="compressor1_serial"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-ocean-400">Compresor #1</FormLabel>
                <FormControl>
                  <Input placeholder="Número de serie" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="compressor2_serial"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-ocean-400">Compresor #2</FormLabel>
                <FormControl>
                  <Input placeholder="Número de serie" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
