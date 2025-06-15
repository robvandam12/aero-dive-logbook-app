
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DigitalSignature } from "@/components/DigitalSignature";
import { Badge } from "@/components/ui/badge";

interface Step5ObservationsProps {
  isEditMode?: boolean;
}

export const Step5Observations = ({ isEditMode = false }: Step5ObservationsProps) => {
  const { control, setValue } = useFormContext();

  const handleSaveSignature = (signatureData: string) => {
    setValue("signature_data", signatureData, { shouldValidate: true });
  };
  
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ocean-300">Observaciones Generales</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Observaciones adicionales, incidentes, recomendaciones..."
                rows={4}
                {...field}
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="border-t border-ocean-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-white">Firma de Supervisor</h4>
          <Badge variant="outline" className="border-gold-500 text-gold-400">
            {isEditMode ? "Requerida para Finalizar" : "Opcional"}
          </Badge>
        </div>
        <p className="text-sm text-ocean-400 mb-4">
          {isEditMode 
            ? "La firma digital es requerida para finalizar la bitácora. Firme en el recuadro para habilitar el botón de finalizar."
            : "Puede firmar ahora o después de crear la bitácora. La bitácora se guardará como borrador sin firma."
          }
        </p>
        <DigitalSignature onSave={handleSaveSignature} />
      </div>
    </div>
  );
};
