import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { TicketFormSteps } from './TicketFormSteps';
import { Step1Description } from './Step1Description';
import { Step2Details } from './Step2Details';
import { Step3Confirmation } from './Step3Confirmation';
import { createTicketSchema, CreateTicketFormData } from '@/shared/lib/schemas/ticketSchemas';
import { useCreateTicket } from '../../hooks/useCreateTicket';
import { ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Card, CardContent, Button } from '@/shared/ui';

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
    <div className="max-w-3xl mx-auto">
      {/* Индикатор шагов */}
      <TicketFormSteps currentStep={currentStep} steps={steps} />

      {/* Форма */}
      <Card>
        <CardContent className="p-6">
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
                uploadedFileIds={uploadedFileIds}  // ← передаём ID
              />
            )}

            {/* Навигация */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {/* Назад */}
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1 || isPending}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>

              {/* Далее / Отправить */}
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNext}>
                  Далее
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
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
        <p className="text-center text-xs text-gray-500 mt-4">
          💾 Черновик автоматически сохраняется
        </p>
      )}
    </div>
  );
};
