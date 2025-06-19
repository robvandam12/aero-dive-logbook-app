
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

export const Step3DiveTeam = () => {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "divers_manifest"
  });

  const addDiver = () => {
    append({ 
      name: '', 
      license: '', 
      role: 'buzo', 
      working_depth: 0,
      standard_depth: true,
      start_time: '',
      end_time: '',
      dive_time: '',
      work_performed: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Equipo de Buceo</h3>
        <Button 
          type="button" 
          onClick={addDiver}
          className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Buzo
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Buzo {index + 1}</CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`divers_manifest.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ocean-200">Identificación/Nombre</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Nombre completo del buzo"
                          className="bg-ocean-900/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                        />
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
                      <FormLabel className="text-ocean-200">N° Matrícula</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Número de matrícula"
                          className="bg-ocean-900/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`divers_manifest.${index}.role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ocean-200">Cargo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-ocean-900/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]">
                            <SelectValue placeholder="Seleccionar cargo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-ocean-900 border-ocean-700">
                          <SelectItem value="buzo" className="text-white hover:bg-ocean-700">Buzo</SelectItem>
                          <SelectItem value="asistente" className="text-white hover:bg-ocean-700">Asistente</SelectItem>
                          <SelectItem value="supervisor_equipo" className="text-white hover:bg-ocean-700">Supervisor de Equipo</SelectItem>
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
                      <FormLabel className="text-ocean-200">Profundidad de Trabajo (m)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="Profundidad en metros"
                          className="bg-ocean-900/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name={`divers_manifest.${index}.start_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ocean-200">Hora Inicio</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="time"
                          className="bg-ocean-900/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`divers_manifest.${index}.end_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ocean-200">Hora Término</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="time"
                          className="bg-ocean-900/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`divers_manifest.${index}.dive_time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ocean-200">Tiempo Total</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: 45 min"
                          className="bg-ocean-900/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name={`divers_manifest.${index}.work_performed`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ocean-200">Trabajo Realizado</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describa el trabajo específico realizado por este buzo..."
                        rows={3}
                        className="bg-ocean-900/50 border-ocean-700 text-white focus:border-[#6555FF] focus:ring-[#6555FF] placeholder:text-ocean-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`divers_manifest.${index}.standard_depth`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#6555FF] data-[state=checked]:border-[#6555FF]"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-ocean-200">
                        Buceo Estándar (Profundidad estándar según protocolo)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8">
          <p className="text-ocean-300 mb-4">No hay buzos agregados</p>
          <Button 
            type="button" 
            onClick={addDiver}
            className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Buzo
          </Button>
        </div>
      )}
    </div>
  );
};
