
import { useState, useEffect } from 'react';
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
import { useUpdateDiveLog } from "@/hooks/useDiveLogMutations";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";

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

interface DiveLogWizardProps {
  diveLog?: DiveLogWithFullDetails;
  isEditMode?: boolean;
}

export const DiveLogWizard = ({ diveLog, isEditMode = false }: DiveLogWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const updateDiveLogMutation = useUpdateDiveLog();

  // Parse weather conditions for edit mode
  const parseWeatherConditions = (conditions: string | null) => {
    if (!conditions) return { weather_condition: undefined, wind_knots: undefined, wave_height_meters: undefined };
    
    const windMatch = conditions.match(/Viento:\s*(\d+)/);
    const waveMatch = conditions.match(/Oleaje:\s*(\d+\.?\d*)/);
    const weatherMatch = conditions.split(',')[0].trim();
    
    return {
      weather_condition: weatherMatch !== 'N/A' ? weatherMatch : undefined,
      wind_knots: windMatch ? parseInt(windMatch[1]) : undefined,
      wave_height_meters: waveMatch ? parseFloat(waveMatch[1]) : undefined
    };
  };

  const getDefaultValues = (): Partial<DiveLogFormValues> => {
    if (isEditMode && diveLog) {
      const weather = parseWeatherConditions(diveLog.weather_conditions);
      const diversManifest = Array.isArray(diveLog.divers_manifest) 
        ? diveLog.divers_manifest as any[]
        : [];

      return {
        log_date: diveLog.log_date,
        center_id: diveLog.center_id,
        supervisor_name: diveLog.profiles?.username || '',
        dive_site_id: diveLog.dive_site_id,
        boat_id: diveLog.boat_id || '',
        weather_condition: weather.weather_condition as any,
        wind_knots: weather.wind_knots,
        wave_height_meters: weather.wave_height_meters,
        divers_manifest: diversManifest.length > 0 ? diversManifest : [{ name: '', license: '', role: 'buzo', working_depth: 0 }],
        observations: diveLog.observations || '',
        departure_time: diveLog.departure_time || '',
        arrival_time: diveLog.arrival_time || '',
        signature_data: diveLog.signature_url || undefined
      };
    }

    return {
      divers_manifest: [{ name: '', license: '', role: 'buzo', working_depth: 0 }],
      log_date: new Date().toISOString().split('T')[0],
      center_id: '',
      dive_site_id: '',
    };
  };

  const methods = useForm<DiveLogFormValues>({
    resolver: zodResolver(diveLogSchema),
    defaultValues: getDefaultValues()
  });

  const { handleSubmit, trigger, formState, watch, reset } = methods;

  // Reset form when diveLog changes (edit mode)
  useEffect(() => {
    if (isEditMode && diveLog) {
      reset(getDefaultValues());
    }
  }, [diveLog, isEditMode, reset]);

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

    if (isEditMode && diveLog) {
      // Update existing dive log
      updateDiveLogMutation.mutate(
        { id: diveLog.id, data, userId: user.id },
        {
          onSuccess: () => {
            navigate(`/dive-logs/${diveLog.id}`);
          }
        }
      );
      return;
    }

    // Create new dive log (existing logic)
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
      supervisor_name: data.supervisor_name,
      dive_site_id: data.dive_site_id,
      boat_id: data.boat_id || null,
      weather_conditions: `${data.weather_condition || 'N/A'}, Viento: ${data.wind_knots || 'N/A'} nudos, Oleaje: ${data.wave_height_meters || 'N/A'} m`,
      divers_manifest: data.divers_manifest,
      observations: data.observations || "",
      signature_url: signatureUrl,
      departure_time: data.departure_time || null,
      arrival_time: data.arrival_time || null,
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
      case 5: return <Step5Observations isEditMode={isEditMode} />;
      default: return null;
    }
  };

  const isSubmitting = isEditMode ? updateDiveLogMutation.isPending : isLoading;

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
                disabled={isSubmitting || !formState.isValid || (isEditMode && !signatureData)}
                className={`${(!formState.isValid || (isEditMode && !signatureData)) ? 'opacity-60 cursor-not-allowed' : 'bg-gold-gradient hover:opacity-90'}`}
              >
                {isSubmitting ? (isEditMode ? "Actualizando..." : "Guardando...") : <>
                  <FileSignature className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Actualizar Bitácora' : (signatureData ? 'Finalizar Bitácora' : 'Crear Bitácora')}
                </>}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
