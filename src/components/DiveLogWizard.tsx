
import { useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diveLogSchema, DiveLogFormValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save, FileSignature } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

import { Step1GeneralData } from './dive-log-wizard/Step1GeneralData';
import { Step2Conditions } from './dive-log-wizard/Step2Conditions';
import { Step3DiveTeam } from './dive-log-wizard/Step3DiveTeam';
import { Step4WorkDetails } from './dive-log-wizard/Step4WorkDetails';
import { Step5Observations } from './dive-log-wizard/Step5Observations';

const steps = [
  { id: 1, title: 'Datos Generales', fields: ['log_date', 'center_id', 'supervisor_name', 'dive_site_id'] },
  { id: 2, title: 'Condiciones', fields: ['weather_condition', 'wind_knots', 'wave_height_meters', 'compressor1_serial', 'compressor2_serial'] },
  { id: 3, title: 'Equipo de Buceo', fields: ['divers_manifest'] },
  { id: 4, title: 'Detalle de Trabajos', fields: ['work_type', 'boat_id', 'work_details'] },
  { id: 5, title: 'Observaciones', fields: ['observations', 'signature_data'] }
];

function dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export const DiveLogWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const methods = useForm<DiveLogFormValues>({
    resolver: zodResolver(diveLogSchema),
    defaultValues: {
      divers_manifest: [{ name: '', license: '', role: 'buzo', working_depth: 0 }],
      log_date: new Date().toISOString().split('T')[0],
      center_id: '',
      dive_site_id: '',
    }
  });

  const { handleSubmit, trigger, formState, watch, getValues } = methods;

  // Observa si la firma existe (para activar el botón de finalizar)
  const signatureData = watch("signature_data");

  const nextStep = async () => {
    const fieldsToValidate = steps[currentStep - 1].fields;
    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: DiveLogFormValues) => {
    if (!user) {
      toast({ title: "Error", description: "Debe iniciar sesión para guardar.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    let signatureUrl: string | null = null;
    if (data.signature_data) {
      try {
        const blob = dataURLtoBlob(data.signature_data);
        const fileName = `public/${user.id}-${uuidv4()}.png`;
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('signatures')
          .upload(fileName, blob, {
            contentType: 'image/png',
            upsert: false,
          });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('signatures').getPublicUrl(fileData.path);
        signatureUrl = urlData.publicUrl;
      } catch (error: any) {
        toast({ title: "Error al subir la firma", description: error.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }
    }

    // Construir datos finales para la bitácora
    const diveLogData = {
      log_date: data.log_date,
      center_id: data.center_id,
      supervisor_id: user.id,
      supervisor_name: data.supervisor_name, // Se agrega para no perder el dato
      dive_site_id: data.dive_site_id,
      boat_id: data.boat_id || null,
      weather_conditions: `${data.weather_condition || 'N/A'}, Viento: ${data.wind_knots || 'N/A'} nudos, Oleaje: ${data.wave_height_meters || 'N/A'} m`,
      divers_manifest: data.divers_manifest,
      work_type: data.work_type || null,
      work_details: data.work_details,
      observations: data.observations || "",
      signature_url: signatureUrl,
    };

    const { error } = await supabase.from('dive_logs').insert(diveLogData);

    setIsLoading(false);

    if (error) {
      toast({ title: "Error al guardar la bitácora", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bitácora guardada con éxito", description: "La bitácora ha sido creada." });
      navigate('/dashboard');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1GeneralData />;
      case 2: return <Step2Conditions />;
      case 3: return <Step3DiveTeam />;
      case 4: return <Step4WorkDetails />;
      case 5: return <Step5Observations />;
      default: return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${currentStep >= step.id ? 'bg-ocean-gradient text-white' : 'bg-ocean-800 text-ocean-400'}`}>
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${currentStep > step.id ? 'bg-ocean-500' : 'bg-ocean-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep - 1].title}</h2>
        </div>

        {/* Step Content */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Paso {currentStep} de {steps.length}</CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1} className="border-ocean-600 text-ocean-300 hover:bg-ocean-800">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" className="border-ocean-600 text-ocean-300 hover:bg-ocean-800">
              <Save className="w-4 h-4 mr-2" />
              Guardar Borrador
            </Button>
            {currentStep < 5 ? (
              <Button type="button" onClick={nextStep} className="bg-ocean-gradient hover:opacity-90">
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !formState.isValid || !signatureData}
                className={`${(!formState.isValid || !signatureData) ? 'opacity-60 cursor-not-allowed' : 'bg-gold-gradient hover:opacity-90'}`}
              >
                {isLoading ? "Finalizando..." : <>
                  <FileSignature className="w-4 h-4 mr-2" />
                  Finalizar Bitácora
                </>}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
