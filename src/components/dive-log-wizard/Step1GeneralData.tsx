
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCenters } from "@/hooks/useCenters";
import { useDiveSites } from "@/hooks/useDiveSites";
import { useUserManagement } from "@/hooks/useUserManagement";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect } from "react";

export const Step1GeneralData = () => {
  const { control, setValue, watch } = useFormContext();
  const { user, userProfile } = useAuth();
  const { data: centers, isLoading: isLoadingCenters, error: centersError } = useCenters();
  const { data: diveSites, isLoading: isLoadingDiveSites, error: diveSitesError } = useDiveSites();
  const { data: users, isLoading: isLoadingUsers } = useUserManagement();

  const isAdmin = userProfile?.role === 'admin';
  const supervisors = users?.filter(user => user.role === 'supervisor' && user.is_active) || [];

  // Auto-fill supervisor name for non-admin users
  useEffect(() => {
    if (!isAdmin && userProfile?.username && !watch("supervisor_name")) {
      setValue("supervisor_name", userProfile.username);
    }
  }, [isAdmin, userProfile, setValue, watch]);

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
                <Input 
                  type="date" 
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
          name="center_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-ocean-300">Centro</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCenters}>
                <FormControl>
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white hover:border-ocean-600 focus:border-ocean-500 transition-colors">
                    <SelectValue placeholder="Seleccionar centro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-ocean-900 border-ocean-700 text-white z-50">
                  {isLoadingCenters && <SelectItem value="loading" disabled>Cargando...</SelectItem>}
                  {centersError && <SelectItem value="error" disabled>Error al cargar</SelectItem>}
                  {centers?.map(center => (
                    <SelectItem key={center.id} value={center.id} className="hover:bg-ocean-800 focus:bg-ocean-800">{center.name}</SelectItem>
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
                <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white hover:border-ocean-600 focus:border-ocean-500 transition-colors">
                  <SelectValue placeholder="Seleccionar punto de buceo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-ocean-900 border-ocean-700 text-white z-50">
                {isLoadingDiveSites && <SelectItem value="loading" disabled>Cargando...</SelectItem>}
                {diveSitesError && <SelectItem value="error" disabled>Error al cargar</SelectItem>}
                {diveSites?.map(site => (
                  <SelectItem key={site.id} value={site.id} className="hover:bg-ocean-800 focus:bg-ocean-800">{site.name}</SelectItem>
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
              {isAdmin ? (
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoadingUsers}
                >
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white hover:border-ocean-600 focus:border-ocean-500 transition-colors">
                    <SelectValue placeholder="Seleccionar supervisor" />
                  </SelectTrigger>
                  <SelectContent className="bg-ocean-900 border-ocean-700 text-white z-50">
                    {isLoadingUsers && <SelectItem value="loading" disabled>Cargando...</SelectItem>}
                    {supervisors.map(supervisor => (
                      <SelectItem 
                        key={supervisor.id} 
                        value={supervisor.full_name || supervisor.email}
                        className="hover:bg-ocean-800 focus:bg-ocean-800"
                      >
                        {supervisor.full_name || supervisor.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input 
                  placeholder="Nombre del supervisor" 
                  {...field} 
                  className="bg-ocean-950/50 border-ocean-700 text-white hover:border-ocean-600 focus:border-ocean-500 transition-colors placeholder:text-ocean-400"
                  readOnly={!isAdmin}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
