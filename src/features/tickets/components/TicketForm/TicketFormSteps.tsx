import { cn } from '@/shared/lib/utils/cn';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface TicketFormStepsProps {
  currentStep: number;
  steps: Step[];
}

export const TicketFormSteps = ({ currentStep, steps }: TicketFormStepsProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                  currentStep > step.number
                    ? 'bg-primary-600 text-white'
                    : currentStep === step.number
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                    : 'bg-gray-200 text-gray-500'
                )}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              
              {/* Step info */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    'text-sm font-medium',
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4 transition-all',
                  currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
