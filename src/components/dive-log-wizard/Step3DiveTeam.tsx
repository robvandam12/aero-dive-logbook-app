
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash } from "lucide-react";

export const Step3DiveTeam = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "divers_manifest",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-white">Equipo de Buceo</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-ocean-600 text-ocean-300"
          onClick={() => append({ name: "", license: "", role: "buzo", working_depth: 0 })}
        >
          Agregar Buzo
        </Button>
      </div>
      <div className="space-y-3">
        {fields.map((item, index) => (
          <Card key={item.id} className="glass">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                <FormField
                  control={control}
                  name={`divers_manifest.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ocean-300 text-sm">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`divers_manifest.${index}.license`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ocean-300 text-sm">Matrícula</FormLabel>
                      <FormControl>
                        <Input placeholder="Matrícula" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`divers_manifest.${index}.role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ocean-300 text-sm">Puesto</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                            <SelectValue placeholder="Puesto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-ocean-900 border-ocean-700">
                          <SelectItem value="buzo">Buzo</SelectItem>
                          <SelectItem value="buzo-emergencia">Buzo de Emergencia</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`divers_manifest.${index}.working_depth`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ocean-300 text-sm">Prof. (m)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} className="bg-ocean-950/50 border-ocean-700 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-6 text-rose-400 hover:bg-rose-900/50">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
