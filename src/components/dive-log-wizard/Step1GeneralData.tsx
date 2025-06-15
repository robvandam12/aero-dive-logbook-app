
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCenters } from "@/hooks/useCenters";
import { useDiveSites } from "@/hooks/useDiveSites";

export const Step1GeneralData = () => {
  const { control } = useFormContext();
  const { data: centers, isLoading: isLoadingCenters, error: centersError } = useCenters();
  const { data: diveSites, isLoading: isLoadingDiveSites, error: diveSitesError } = useDiveSites();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="log_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-300">Fecha</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
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
              <FormLabel className="text-ocean-300">Centro</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCenters}>
                <FormControl>
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                    <SelectValue placeholder="Seleccionar centro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-ocean-900 border-ocean-700 text-white">
                  {isLoadingCenters && <SelectItem value="loading" disabled>Cargando...</SelectItem>}
                  {centersError && <SelectItem value="error" disabled>Error al cargar</SelectItem>}
                  {centers?.map(center => (
                    <SelectItem key={center.id} value={center.id}>{center.name}</SelectItem>
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
        name="dive_site_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ocean-300">Punto de Buceo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingDiveSites}>
              <FormControl>
                <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                  <SelectValue placeholder="Seleccionar punto de buceo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-ocean-900 border-ocean-700 text-white">
                {isLoadingDiveSites && <SelectItem value="loading" disabled>Cargando...</SelectItem>}
                {diveSitesError && <SelectItem value="error" disabled>Error al cargar</SelectItem>}
                {diveSites?.map(site => (
                  <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="supervisor_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ocean-300">Supervisor de Buceo</FormLabel>
            <FormControl>
              <Input placeholder="Nombre del supervisor" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
