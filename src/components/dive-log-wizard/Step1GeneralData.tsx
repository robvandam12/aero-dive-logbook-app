
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCenters } from "@/hooks/useCenters";
import { useDiveSites } from "@/hooks/useDiveSites";
import { useBoats } from "@/hooks/useBoats";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";

export const Step1GeneralData = () => {
  const { control, setValue, watch } = useFormContext();
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { data: centers } = useCenters();
  const { data: diveSites } = useDiveSites();
  
  const selectedCenterId = watch("center_id");
  const { data: boats } = useBoats(selectedCenterId);
  
  // Auto-fill supervisor name with user's username when component mounts
  useEffect(() => {
    if (userProfile?.username && !watch("supervisor_name")) {
      setValue("supervisor_name", userProfile.username);
    }
  }, [userProfile?.username, setValue, watch]);

  // Filter dive sites by selected center - we'll need to add center_id to dive_sites or use a different approach
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
              <FormLabel className="text-white">Fecha de la Bitácora</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  className="bg-slate-800 border-slate-600 text-white"
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
              <FormLabel className="text-white">Centro de Cultivo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Seleccionar centro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {centers?.map((center) => (
                    <SelectItem key={center.id} value={center.id} className="text-white hover:bg-slate-700">
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
              <FormLabel className="text-white">Supervisor de Buceo</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Nombre del supervisor de buceo"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dive_site_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Sitio de Buceo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Seleccionar sitio de buceo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {filteredDiveSites.map((site) => (
                    <SelectItem key={site.id} value={site.id} className="text-white hover:bg-slate-700">
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="boat_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Embarcación (Opcional)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Seleccionar embarcación" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="none" className="text-white hover:bg-slate-700">
                  Sin embarcación
                </SelectItem>
                {filteredBoats.map((boat) => (
                  <SelectItem key={boat.id} value={boat.id} className="text-white hover:bg-slate-700">
                    {boat.name} - {boat.registration_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="departure_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Hora de Salida</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                  className="bg-slate-800 border-slate-600 text-white"
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
              <FormLabel className="text-white">Hora de Llegada</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field} 
                  className="bg-slate-800 border-slate-600 text-white"
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
