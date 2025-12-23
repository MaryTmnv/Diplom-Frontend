import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TicketFormSteps } from './TicketFormSteps';
import { Step1Description } from './Step1Description';
import { Step2Details } from './Step2Details';
import { Step3Confirmation } from './Step3Confirmation';
import { createTicketSchema, CreateTicketFormData } from '@/shared/lib/schemas/ticketSchemas';
import { useCreateTicket } from '../../hooks/useCreateTicket';
import { ArrowLeft, ArrowRight, Send, Loader2, CheckCircle, FileText, Lightbulb, Save, Settings } from 'lucide-react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Card, CardContent, Button } from '@/shared/ui';
import { cn } from '@/shared/lib/utils/cn';

const steps = [
  { number: 1, title: 'Проблема', description: 'Что случилось?' },
  { number: 2, title: 'Детали', description: 'Подробности' },
  { number: 3, title: 'Отправка', description: 'Проверка' },
];

export const TicketForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);  // ← ID файлов
  
  // Сохраняем черновик в localStorage
  const [draft, saveDraft, clearDraft] = useLocalStorage<Partial<CreateTicketFormData>>(
    'ticket-draft',
    {}
  );
   const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };
  const { mutate: createTicket, isPending } = useCreateTicket();

  const form = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: draft.title || '',
      description: draft.description || '',
      category: draft.category,
      attachmentIds: [],
      contextData: {},
    },
  });

  const { handleSubmit, trigger, watch } = form;

  // Сохраняем черновик при изменении
  useEffect(() => {
    const subscription = watch((value) => {
      saveDraft(value as Partial<CreateTicketFormData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, saveDraft]);

  // Валидация текущего шага
  const validateStep = async (): Promise<boolean> => {
    if (currentStep === 1) {
      return await trigger(['title', 'category']);
    }
    if (currentStep === 2) {
      return await trigger(['description']);
    }
    return true;
  };

  // Следующий шаг
  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Предыдущий шаг
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Обработка загрузки файлов (получаем ID с сервера)
  const handleFilesUpload = (fileIds: string[]) => {
    setUploadedFileIds(fileIds);
  };

  // Отправка формы
  const onSubmit = (data: CreateTicketFormData) => {
    // Собираем контекст устройства
    const contextData = {
      device: navigator.platform,
      browser: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString(),
    };

    createTicket(
      {
        ...data,
        attachmentIds: uploadedFileIds.length > 0 ? uploadedFileIds : undefined,
        contextData,
      },
      {
        onSuccess: () => {
          // Очищаем черновик после успешной отправки
          clearDraft();
          setUploadedFileIds([]);
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
  {/* Индикатор шагов */}
  <TicketFormSteps currentStep={currentStep} steps={steps} />

  {/* Форма */}
  <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
    {/* Заголовок текущего шага */}
    <div className="bg-gradient-to-r from-[#03045e] to-[#023e8a] px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
          {currentStep === 1 && <FileText className="w-5 h-5 text-white" />}
          {currentStep === 2 && <Settings className="w-5 h-5 text-white" />}
          {currentStep === 3 && <CheckCircle className="w-5 h-5 text-white" />}
        </div>
        <div>
          <p className="text-[#90e0ef] text-xs font-medium">Шаг {currentStep} из {steps.length}</p>
          <h2 className="text-white font-bold text-lg">
            {currentStep === 1 && 'Опишите проблему'}
            {currentStep === 2 && 'Детали заявки'}
            {currentStep === 3 && 'Подтверждение'}
          </h2>
        </div>
      </div>
    </div>

    <CardContent className="p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Шаг 1 */}
        {currentStep === 1 && <Step1Description form={form} />}

        {/* Шаг 2 */}
        {currentStep === 2 && (
          <Step2Details form={form} onFilesUpload={handleFilesUpload} />
        )}

        {/* Шаг 3 */}
        {currentStep === 3 && (
          <Step3Confirmation 
            form={form} 
            uploadedFileIds={uploadedFileIds}
            goToStep={goToStep} 
          />
        )}

        {/* Навигация */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#90e0ef]/30">
          {/* Назад */}
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1 || isPending}
            className={cn(
              'gap-2 rounded-xl transition-all duration-200',
              currentStep === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>

          {/* Индикатор прогресса (мобильный) */}
          <div className="flex items-center gap-1.5 md:hidden">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index + 1 === currentStep
                    ? 'w-6 bg-gradient-to-r from-[#0077b6] to-[#023e8a]'
                    : index + 1 < currentStep
                    ? 'bg-[#0077b6]'
                    : 'bg-[#90e0ef]'
                )}
              />
            ))}
          </div>

          {/* Далее / Отправить */}
          {currentStep < 3 ? (
            <Button 
              type="button" 
              onClick={handleNext}
              className="gap-2 bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-lg hover:shadow-xl rounded-xl px-6 transition-all duration-300"
            >
              Далее
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isPending}
              className="gap-2 bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-lg hover:shadow-xl rounded-xl px-6 transition-all duration-300 disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Отправить заявку
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </CardContent>
  </Card>

  {/* Подсказка о черновике */}
  {draft.title && (
    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#caf0f8]/30 rounded-xl">
      <div className="w-6 h-6 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center">
        <Save className="w-3 h-3 text-[#0077b6]" />
      </div>
      <p className="text-sm text-[#023e8a]/70">
        Черновик автоматически сохраняется
      </p>
    </div>
  )}

  {/* Подсказка */}
  <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-gradient-to-r from-[#caf0f8]/40 to-[#ade8f4]/20">
    <CardContent className="p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#48cae4]/30 rounded-xl flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-[#0077b6]" />
        </div>
        <div>
          <p className="text-sm text-[#023e8a]/80">
            <span className="font-semibold text-[#03045e]">Совет:</span> Чем подробнее вы опишете проблему, 
            тем быстрее мы сможем вам помочь. Прикрепите скриншоты, если это возможно.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

  );
};
