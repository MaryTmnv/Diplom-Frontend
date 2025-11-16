import { UseFormReturn } from 'react-hook-form';
import { CreateTicketFormData } from '@/shared/lib/schemas/ticketSchemas';
import { getCategoryLabel, getCategoryIcon } from '../../utils/ticketHelpers';

import { FileText, Tag, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui';

interface Step3ConfirmationProps {
  form: UseFormReturn<CreateTicketFormData>;
  uploadedFileIds: string[];  // ← ID файлов
}

export const Step3Confirmation = ({ form, uploadedFileIds }: Step3ConfirmationProps) => {
  const { watch } = form;
  
  const title = watch('title');
  const description = watch('description');
  const category = watch('category');

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Проверьте данные перед отправкой
        </h3>
        <p className="text-sm text-gray-600">
          Убедитесь, что вся информация указана корректно
        </p>
      </div>

      {/* Превью заявки */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Заголовок */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <MessageSquare className="w-4 h-4" />
              <span>Заголовок</span>
            </div>
            <p className="font-semibold text-gray-900">{title}</p>
          </div>

          {/* Категория */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Tag className="w-4 h-4" />
              <span>Категория</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{getCategoryIcon(category)}</span>
              <span className="font-medium text-gray-900">
                {getCategoryLabel(category)}
              </span>
            </div>
          </div>

          {/* Описание */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <FileText className="w-4 h-4" />
              <span>Описание</span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
              {description}
            </p>
          </div>

          {/* Файлы */}
          {uploadedFileIds.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <FileText className="w-4 h-4" />
                <span>Прикреплённые файлы ({uploadedFileIds.length})</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span>✅</span>
                <span>Файлы успешно загружены</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Информационное сообщение */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 font-medium mb-1">
          ⏱️ Что произойдёт дальше?
        </p>
        <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
          <li>Заявка будет создана и получит уникальный номер</li>
          <li>Оператор начнёт работу в течение 15 минут</li>
          <li>Вы получите уведомление о каждом обновлении</li>
          <li>Среднее время решения: 45 минут</li>
        </ul>
      </div>
    </div>
  );
};
