
interface Step {
  id: number;
  title: string;
  fields: string[];
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
}

export const WizardProgress = ({ steps, currentStep }: WizardProgressProps) => {
  return (
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
  );
};
