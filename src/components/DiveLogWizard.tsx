
import { useState } from 'react';
import { FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useCreateDiveLog, useUpdateDiveLog } from "@/hooks/useDiveLogMutations";
import { DiveLogWithFullDetails } from "@/hooks/useDiveLog";
import { uploadSignature } from "@/utils/diveLogUtils";
import { useDiveLogForm } from "@/hooks/useDiveLogForm";
import { useWizardNavigation } from "@/hooks/useWizardNavigation";
import { WizardProgress } from "./dive-log-wizard/WizardProgress";
import { WizardNavigation } from "./dive-log-wizard/WizardNavigation";

import { Step1GeneralData } from './dive-log-wizard/Step1GeneralData';
import { Step2Conditions } from './dive-log-wizard/Step2Conditions';
import { Step3DiveTeam } from './dive-log-wizard/Step3DiveTeam';
import { Step4WorkDetails } from './dive-log-wizard/Step4WorkDetails';
import { Step5Observations } from './dive-log-wizard/Step5Observations';

interface DiveLogWizardProps {
  diveLog?: DiveLogWithFullDetails;
  isEditMode?: boolean;
}

export const DiveLogWizard = ({ diveLog, isEditMode = false }: DiveLogWizardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const createDiveLogMutation = useCreateDiveLog();
  const updateDiveLogMutation = useUpdateDiveLog();

  const methods = useDiveLogForm(isEditMode, diveLog);
  const { handleSubmit, trigger, formState, watch, getValues } = methods;
  
  const { currentStep, nextStep, prevStep, steps, totalSteps } = useWizardNavigation(trigger);

  // Observa si la firma existe (para activar el botón de finalizar)
  const signatureData = watch("signature_data");

  const saveDraft = async () => {
    if (!user) {
      toast({ title: "Error", description: "Debe iniciar sesión para guardar.", variant: "destructive" });
      return;
    }

    setIsSavingDraft(true);

    try {
      const currentValues = getValues();
      
      if (isEditMode && diveLog) {
        // Update existing draft
        updateDiveLogMutation.mutate(
          { id: diveLog.id, data: currentValues, userId: user.id, currentSignatureUrl: diveLog.signature_url },
          {
            onSuccess: () => {
              toast({
                title: "Borrador guardado",
                description: "Los cambios han sido guardados como borrador."
              });
            },
            onError: (error: any) => {
              toast({
                title: "Error al guardar borrador",
                description: error.message,
                variant: "destructive"
              });
            }
          }
        );
      } else {
        // Create new draft
        createDiveLogMutation.mutate(
          { data: currentValues, userId: user.id },
          {
            onSuccess: (result) => {
              toast({
                title: "Borrador guardado",
                description: "El borrador ha sido creado correctamente."
              });
              // Navigate to edit mode of the newly created draft
              navigate(`/dive-logs/${result.id}/edit`);
            },
            onError: (error: any) => {
              toast({
                title: "Error al guardar borrador",
                description: error.message,
                variant: "destructive"
              });
            }
          }
        );
      }
    } catch (error: any) {
      toast({
        title: "Error al guardar borrador",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast({ title: "Error", description: "Debe iniciar sesión para guardar.", variant: "destructive" });
      return;
    }

    if (isEditMode && diveLog) {
      // Update existing dive log
      updateDiveLogMutation.mutate(
        { id: diveLog.id, data, userId: user.id, currentSignatureUrl: diveLog.signature_url },
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
        signatureUrl = await uploadSignature(data.signature_data, user.id);
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
  const isDraftSaving = isSavingDraft || createDiveLogMutation.isPending || (isEditMode && updateDiveLogMutation.isPending && isSavingDraft);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <WizardProgress steps={steps} currentStep={currentStep} />

        {/* Current Step Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep - 1].title}</h2>
        </div>

        {/* Step Content */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white">Paso {currentStep} de {totalSteps}</CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          isFormValid={formState.isValid}
          isSubmitting={isSubmitting}
          isDraftSaving={isDraftSaving}
          isEditMode={isEditMode}
          signatureData={signatureData}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSaveDraft={saveDraft}
        />
      </form>
    </FormProvider>
  );
};
