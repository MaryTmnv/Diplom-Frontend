import { UseFormReturn } from 'react-hook-form';

import { CreateTicketFormData } from '@/shared/lib/schemas/ticketSchemas';
import { cn } from '@/shared/lib/utils/cn';
import { FileUpload } from '@/shared/components/FileUpload/FileUpload';
import { Label } from '@/shared/ui';

interface Step2DetailsProps {
  form: UseFormReturn<CreateTicketFormData>;
  onFilesUpload: (fileIds: string[]) => void;  // ← правильная сигнатура
}

export const Step2Details = ({ form, onFilesUpload }: Step2DetailsProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const description = watch('description');
  const charCount = description?.length || 0;

  return (
    <div className="space-y-6">
      {/* Подробное описание */}
      <div className="space-y-2">
        <Label htmlFor="description" className="label-required">
          Подробно опишите проблему
        </Label>
        
        <textarea
          id="description"
          rows={8}
          placeholder="Опишите что произошло, какие действия вы предпринимали, какие ошибки видите..."
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white px-4 py-3',
            'text-sm text-gray-900 placeholder-gray-400',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none',
            'resize-none transition-colors duration-200',
            errors.description && 'border-red-500 focus:border-red-500 focus:ring-red-200'
          )}
          {...register('description')}
          aria-invalid={!!errors.description}
        />

        <div className="flex items-center justify-between">
          {errors.description ? (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Минимум 10 символов. Чем подробнее, тем быстрее мы поможем!
            </p>
          )}
          
          <span
            className={cn(
              'text-xs',
              charCount < 10 ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {charCount} / 5000
          </span>
        </div>
      </div>

      {/* Загрузка файлов */}
      <div className="space-y-2">
        <Label>Прикрепите файлы (необязательно)</Label>
        <FileUpload
          onUpload={onFilesUpload}  // ← теперь принимает string[]
          maxFiles={5}
          multiple
        />
        <p className="text-xs text-gray-500">
          Можно прикрепить скриншоты, документы или другие файлы, которые помогут понять проблему
        </p>
      </div>

      {/* Автоматический сбор контекста */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-700 font-medium mb-2">
          ℹ️ Автоматически собранная информация
        </p>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Браузер: {navigator.userAgent.split(' ').slice(-2).join(' ')}</p>
          <p>• Платформа: {navigator.platform}</p>
          <p>• Язык: {navigator.language}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Эта информация поможет быстрее решить проблему
        </p>
      </div>
    </div>
  );
};
