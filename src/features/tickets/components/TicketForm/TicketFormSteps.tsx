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
     <div className="relative">
      {/* Линия прогресса (фон) */}
      <div className="absolute top-6 left-0 right-0 h-1 bg-[#90e0ef]/30 rounded-full mx-12" />
      
      {/* Линия прогресса (заполненная) */}
      <div 
        className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#0077b6] to-[#023e8a] rounded-full mx-12 transition-all duration-500"
        style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 6rem)` }}
      />

      {/* Шаги */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={index} className="flex flex-col items-center">
              {/* Круг с номером */}
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-lg',
                  isCompleted && 'bg-gradient-to-br from-[#0077b6] to-[#023e8a] text-white',
                  isCurrent && 'bg-gradient-to-br from-[#00b4d8] to-[#0096c7] text-white ring-4 ring-[#48cae4]/30 scale-110',
                  isPending && 'bg-[#caf0f8] text-[#023e8a]/50'
                )}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  stepNumber
                )}
              </div>

              {/* Название шага */}
              <p
                className={cn(
                  'mt-3 text-sm font-medium text-center max-w-[100px] transition-colors duration-300',
                  isCompleted && 'text-[#0077b6]',
                  isCurrent && 'text-[#03045e] font-semibold',
                  isPending && 'text-[#023e8a]/40'
                )}
              >
                {step.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
