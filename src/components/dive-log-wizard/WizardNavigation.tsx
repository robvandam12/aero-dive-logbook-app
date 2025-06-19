
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save, FileSignature } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isFormValid: boolean;
  isSubmitting: boolean;
  isDraftSaving: boolean;
  isEditMode: boolean;
  signatureData?: string;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSaveDraft: () => void;
  onSaveCurrentStep?: () => void;
}

export const WizardNavigation = ({
  currentStep,
  totalSteps,
  isFormValid,
  isSubmitting,
  isDraftSaving,
  isEditMode,
  signatureData,
  onPrevStep,
  onNextStep,
  onSaveDraft,
  onSaveCurrentStep
}: WizardNavigationProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onPrevStep} 
        disabled={currentStep === 1} 
        className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Anterior
      </Button>
      
      <div className="flex space-x-2">
        {!isEditMode && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSaveDraft}
            disabled={isDraftSaving}
            className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {isDraftSaving ? "Guardando..." : "Guardar Borrador"}
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <div className="flex space-x-2">
            {isEditMode && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold-gradient hover:opacity-90"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            )}
            <Button type="button" onClick={onNextStep} className="bg-ocean-gradient hover:opacity-90">
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting || (!isEditMode && !isFormValid) || (isEditMode && !signatureData)}
            className={`${(!isFormValid || (isEditMode && !signatureData)) ? 'opacity-60 cursor-not-allowed' : 'bg-gold-gradient hover:opacity-90'}`}
          >
            {isSubmitting ? (isEditMode ? "Actualizando..." : "Guardando...") : <>
              <FileSignature className="w-4 h-4 mr-2" />
              {isEditMode ? 'Actualizar Bitácora' : (signatureData ? 'Finalizar Bitácora' : 'Crear Bitácora')}
            </>}
          </Button>
        )}
      </div>
    </div>
  );
};
