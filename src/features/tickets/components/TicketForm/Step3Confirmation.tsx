import { UseFormReturn } from 'react-hook-form';
import { CreateTicketFormData } from '@/shared/lib/schemas/ticketSchemas';
import { getCategoryLabel, getCategoryIcon } from '../../utils/ticketHelpers';

import { FileText, Tag, MessageSquare, Bell, Check, CheckCircle, ClipboardCheck, Clock, FileX, Hash, Paperclip, Pencil, Timer, Zap } from 'lucide-react';
import { Button, Card, CardContent } from '@/shared/ui';

interface Step3ConfirmationProps {
  form: UseFormReturn<CreateTicketFormData>;
  uploadedFileIds: string[];  
  goToStep?: (step: number) => void;
}

export const Step3Confirmation = ({ form, uploadedFileIds, goToStep }: Step3ConfirmationProps) => {
  const { watch } = form;
  
  const title = watch('title');
  const description = watch('description');
  const category = watch('category');

  return (
    <div className="space-y-8">
  {/* Заголовок */}
  <div className="text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-[#00b4d8] to-[#0077b6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
      <ClipboardCheck className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-2xl font-bold text-[#03045e] mb-2">
      Проверьте данные перед отправкой
    </h3>
    <p className="text-[#023e8a]/60">
      Убедитесь, что вся информация указана корректно
    </p>
  </div>

  {/* Превью заявки */}
  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#caf0f8]/10">
    <CardContent className="p-0">
      {/* Заголовок заявки */}
      <div className="p-5 border-b border-[#90e0ef]/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#caf0f8] rounded-xl flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-[#0077b6]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#023e8a]/50 font-medium mb-1">Заголовок</p>
            <p className="font-bold text-[#03045e] text-lg">{title}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => goToStep?.(1)}
            className="text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg"
          >
            <Pencil className="w-3.5 h-3.5 mr-1" />
            Изменить
          </Button>
        </div>
      </div>

      {/* Категория */}
      <div className="p-5 border-b border-[#90e0ef]/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#ade8f4] rounded-xl flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-[#0077b6]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#023e8a]/50 font-medium mb-1">Категория</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0077b6] to-[#023e8a] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-lg filter brightness-0 invert">
                  {getCategoryIcon(category)}
                </span>
              </div>
              <span className="font-semibold text-[#03045e]">
                {getCategoryLabel(category)}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => goToStep?.(1)}
            className="text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg"
          >
            <Pencil className="w-3.5 h-3.5 mr-1" />
            Изменить
          </Button>
        </div>
      </div>

      {/* Описание */}
      <div className="p-5 border-b border-[#90e0ef]/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#90e0ef] rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[#0077b6]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#023e8a]/50 font-medium">Описание</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => goToStep?.(2)}
                className="text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg"
              >
                <Pencil className="w-3.5 h-3.5 mr-1" />
                Изменить
              </Button>
            </div>
            <div className="p-4 bg-[#caf0f8]/20 rounded-xl border border-[#90e0ef]/30">
              <p className="text-sm text-[#03045e] whitespace-pre-wrap leading-relaxed">
                {description}
              </p>
            </div>
            <p className="text-xs text-[#023e8a]/40 mt-2">
              {description.length} символов
            </p>
          </div>
        </div>
      </div>

      {/* Файлы */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#48cae4] rounded-xl flex items-center justify-center shrink-0">
            <Paperclip className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#023e8a]/50 font-medium mb-2">Прикреплённые файлы</p>
            
            {uploadedFileIds.length > 0 ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700">
                    {uploadedFileIds.length} {uploadedFileIds.length === 1 ? 'файл загружен' : 'файлов загружено'}
                  </p>
                  <p className="text-xs text-green-600/70">
                    Файлы будут прикреплены к заявке
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-[#caf0f8]/20 border border-[#90e0ef]/30 rounded-xl">
                <div className="w-8 h-8 bg-[#90e0ef]/30 rounded-lg flex items-center justify-center">
                  <FileX className="w-4 h-4 text-[#023e8a]/40" />
                </div>
                <p className="text-sm text-[#023e8a]/50">
                  Файлы не прикреплены
                </p>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => goToStep?.(2)}
            className="text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg"
          >
            <Pencil className="w-3.5 h-3.5 mr-1" />
            Изменить
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Статус готовности */}
  <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
      <Check className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="font-semibold text-green-700">Заявка готова к отправке</p>
      <p className="text-xs text-green-600/70">Все обязательные поля заполнены</p>
    </div>
  </div>

  {/* Информационное сообщение */}
  <div className="p-6 bg-gradient-to-br from-[#caf0f8]/40 to-[#ade8f4]/20 border border-[#48cae4]/30 rounded-2xl">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-[#0077b6] to-[#023e8a] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
        <Clock className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-[#03045e] text-lg mb-3">
          Что произойдёт дальше?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
            <div className="w-8 h-8 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center shrink-0">
              <Hash className="w-4 h-4 text-[#0077b6]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#03045e]">Уникальный номер</p>
              <p className="text-xs text-[#023e8a]/60">Заявка получит номер для отслеживания</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
            <div className="w-8 h-8 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-[#0077b6]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#03045e]">Быстрый старт</p>
              <p className="text-xs text-[#023e8a]/60">Оператор начнёт работу за ~15 минут</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
            <div className="w-8 h-8 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-[#0077b6]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#03045e]">Уведомления</p>
              <p className="text-xs text-[#023e8a]/60">Вы получите уведомление об обновлениях</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
            <div className="w-8 h-8 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center shrink-0">
              <Timer className="w-4 h-4 text-[#0077b6]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#03045e]">Среднее время</p>
              <p className="text-xs text-[#023e8a]/60">Решение занимает около 45 минут</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Дополнительная подсказка */}
  <div className="text-center">
    <p className="text-xs text-[#023e8a]/40">
      Нажимая «Отправить заявку», вы соглашаетесь с{' '}
      <a href="/terms" className="text-[#0077b6] hover:underline">
        условиями использования
      </a>
    </p>
  </div>
</div>

  );
};
