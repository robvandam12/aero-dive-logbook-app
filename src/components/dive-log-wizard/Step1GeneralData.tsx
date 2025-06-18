
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCenters } from "@/hooks/useCenters";
import { useDiveSites } from "@/hooks/useDiveSites";
import { useBoats } from "@/hooks/useBoats";

export const Step1GeneralData = () => {
  const { control, watch } = useFormContext();
  const { data: centers } = useCenters();
  const { data: diveSites } = useDiveSites();
  
  const selectedCenterId = watch("center_id");
  const { data: boats } = useBoats(selectedCenterId);

  const filteredDiveSites = diveSites || [];
  const filteredBoats = boats || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="log_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-200">Fecha de la Bitácora</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="center_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-200">Centro de Cultivo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]">
                    <SelectValue placeholder="Seleccionar centro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-ocean-900 border-ocean-700">
                  {centers?.map((center) => (
                    <SelectItem key={center.id} value={center.id} className="text-white hover:bg-ocean-700">
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="supervisor_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-200">Supervisor de Buceo</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Nombre del supervisor de buceo"
                  className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="supervisor_license"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-200">N° Matrícula Supervisor</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Número de matrícula"
                  className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="center_manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-200">Jefe de Centro</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Nombre del jefe de centro"
                  className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="center_assistant"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-200">Asistente de Centro</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Nombre del asistente de centro"
                  className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="dive_site_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-200">Sitio de Buceo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]">
                    <SelectValue placeholder="Seleccionar sitio de buceo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-ocean-900 border-ocean-700">
                  {filteredDiveSites.map((site) => (
                    <SelectItem key={site.id} value={site.id} className="text-white hover:bg-ocean-700">
                      {site.name}
                    </SelectItem>
                  ))}
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
              <FormLabel className="text-ocean-200">Embarcación (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]">
                    <SelectValue placeholder="Seleccionar embarcación" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-ocean-900 border-ocean-700">
                  <SelectItem value="none" className="text-white hover:bg-ocean-700">
                    Sin embarcación
                  </SelectItem>
                  {filteredBoats.map((boat) => (
                    <SelectItem key={boat.id} value={boat.id} className="text-white hover:bg-ocean-700">
                      {boat.name} - {boat.registration_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="departure_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-200">Hora de Salida</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                  className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
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
              <FormLabel className="text-ocean-200">Hora de Llegada</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                  className="bg-ocean-950/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
