
import { useState } from "react";
import { UseFormTrigger } from "react-hook-form";
import { DiveLogFormValues } from "@/lib/schemas";

const steps = [
  { id: 1, title: 'Datos Generales', fields: ['log_date', 'center_id', 'supervisor_name', 'dive_site_id'] },
  { id: 2, title: 'Condiciones', fields: ['weather_condition', 'wind_knots', 'wave_height_meters', 'compressor1_serial', 'compressor2_serial'] },
  { id: 3, title: 'Equipo de Buceo', fields: ['divers_manifest'] },
  { id: 4, title: 'Detalle de Trabajos', fields: ['work_type', 'boat_id', 'work_details'] },
  { id: 5, title: 'Observaciones', fields: ['observations', 'signature_data'] }
];

export const useWizardNavigation = (trigger: UseFormTrigger<DiveLogFormValues>) => {
  const [currentStep, setCurrentStep] = useState(1);

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

  return {
    currentStep,
    nextStep,
    prevStep,
    steps,
    totalSteps: steps.length
  };
};
