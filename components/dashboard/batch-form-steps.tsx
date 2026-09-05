'use client';

import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface FormStepsProps {
  currentStep: number;
  steps: Step[];
  onStepChange: (step: number) => void;
}

export function FormSteps({ currentStep, steps, onStepChange }: FormStepsProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Scrollable progress bar on mobile */}
      <div className="overflow-x-auto -mx-1 px-1 pb-2 scrollbar-hide">
        <div className="flex items-center min-w-0 gap-0">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                {/* Step circle + label */}
                <div className="flex flex-col items-center min-w-0 shrink-0">
                  <button
                    onClick={() => onStepChange(index)}
                    disabled={index > currentStep}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all shrink-0
                      ${isCompleted 
                        ? 'bg-primary text-primary-foreground' 
                        : isCurrent 
                          ? 'bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20' 
                          : 'bg-muted text-muted-foreground'
                      }
                      ${index > currentStep ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}
                    `}
                  >
                    {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : index + 1}
                  </button>
                  <div className="mt-1.5 sm:mt-2 text-center w-14 sm:w-auto">
                    <p className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider leading-tight ${
                      isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 sm:mx-2 min-w-2 transition-all ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Current step description */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">{steps[currentStep].description}</p>
      </div>
    </div>
  );
}

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  canProceed?: boolean;
  submitLabel?: string;
}

export function StepNavigation({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSubmit,
  isSubmitting = false,
  canProceed = true,
  submitLabel = 'Submit Batch'
}: StepNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  
  return (
    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-border/50">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className="gap-2 w-full sm:w-auto"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>
      
      <Button
        type="button"
        onClick={isLastStep ? onSubmit : onNext}
        disabled={!canProceed || isSubmitting}
        className="gap-2 w-full sm:w-auto sm:min-w-[160px]"
      >
        {isSubmitting ? (
          'Processing...'
        ) : isLastStep ? (
          submitLabel
        ) : (
          <>
            Next
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}
