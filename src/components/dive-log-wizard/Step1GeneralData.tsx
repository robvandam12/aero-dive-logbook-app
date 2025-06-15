
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export const Step1GeneralData = () => {
  const { control } = useFormContext();

  // TODO: Fetch centers and supervisors from Supabase
  const centers = [
    { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Puerto Valparaíso' },
    { id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef0', name: 'Puerto San Antonio' },
    { id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef1', name: 'Puerto Talcahuano' },
  ];

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                    <SelectValue placeholder="Seleccionar centro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-ocean-900 border-ocean-700 text-white">
                  {centers.map(center => (
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
