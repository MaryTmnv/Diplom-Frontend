import { UseFormReturn } from 'react-hook-form';

import { CreateTicketFormData } from '@/shared/lib/schemas/ticketSchemas';
import { cn } from '@/shared/lib/utils/cn';
import { FileUpload } from '@/shared/components/FileUpload/FileUpload';
import { Label } from '@/shared/ui';
import { AlertCircle, Check, Globe, ImageIcon, Info, Languages, Laptop, Lightbulb, MessageSquare, Monitor, Paperclip, Shield } from 'lucide-react';

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
    <div className="space-y-8">
  {/* Подробное описание */}
  <div className="space-y-3">
    <Label htmlFor="description" className="label-required text-[#03045e] font-semibold text-base flex items-center gap-2">
      <MessageSquare className="w-4 h-4 text-[#0077b6]" />
      Подробно опишите проблему
    </Label>
    
    <div className="relative">
      <textarea
        id="description"
        rows={8}
        placeholder="Опишите что произошло, какие действия вы предпринимали, какие ошибки видите..."
        className={cn(
          'w-full rounded-2xl border-2 bg-white px-5 py-4',
          'text-base text-[#03045e] placeholder-[#023e8a]/40',
          'focus:border-[#0077b6] focus:ring-4 focus:ring-[#0077b6]/10 focus:outline-none',
          'resize-none transition-all duration-200',
          errors.description 
            ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
            : 'border-[#90e0ef] hover:border-[#48cae4]'
        )}
        {...register('description')}
        aria-invalid={!!errors.description}
      />
      
      {/* Декоративный градиент */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#caf0f8]/20 to-transparent rounded-b-2xl pointer-events-none" />
    </div>

    <div className="flex items-center justify-between">
      {errors.description ? (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          {errors.description.message}
        </p>
      ) : (
        <p className="text-xs text-[#023e8a]/50 flex items-center gap-1.5">
          <Info className="w-3 h-3" />
          Минимум 10 символов. Чем подробнее, тем быстрее мы поможем!
        </p>
      )}
      
      <div className="flex items-center gap-2">
        {/* Индикатор прогресса заполнения */}
        <div className="w-16 h-1.5 bg-[#90e0ef]/30 rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full rounded-full transition-all duration-300',
              charCount < 10 
                ? 'bg-red-400' 
                : charCount < 50 
                ? 'bg-amber-400' 
                : 'bg-gradient-to-r from-[#0077b6] to-[#00b4d8]'
            )}
            style={{ width: `${Math.min((charCount / 200) * 100, 100)}%` }}
          />
        </div>
        <span
          className={cn(
            'text-xs font-medium tabular-nums',
            charCount < 10 ? 'text-red-500' : 'text-[#023e8a]/50'
          )}
        >
          {charCount} / 5000
        </span>
      </div>
    </div>
  </div>

  {/* Загрузка файлов */}
  <div className="space-y-3">
    <Label className="text-[#03045e] font-semibold text-base flex items-center gap-2">
      <Paperclip className="w-4 h-4 text-[#0077b6]" />
      Прикрепите файлы
      <span className="text-xs font-normal text-[#023e8a]/50 ml-1">(необязательно)</span>
    </Label>
    
    <div className="p-6 border-2 border-dashed border-[#90e0ef] hover:border-[#48cae4] bg-gradient-to-br from-[#caf0f8]/20 to-[#ade8f4]/10 rounded-2xl transition-all duration-300 hover:shadow-md">
      <FileUpload
        onUpload={onFilesUpload}
        maxFiles={5}
        multiple
      />
    </div>
    
    <div className="flex items-start gap-3 p-3 bg-[#caf0f8]/20 rounded-xl">
      <div className="w-6 h-6 bg-[#90e0ef]/50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <ImageIcon className="w-3 h-3 text-[#0077b6]" />
      </div>
      <div>
        <p className="text-xs text-[#023e8a]/70">
          Можно прикрепить скриншоты, документы или другие файлы, которые помогут понять проблему
        </p>
        <p className="text-xs text-[#023e8a]/50 mt-1">
          Максимум 5 файлов, до 10 МБ каждый
        </p>
      </div>
    </div>
  </div>

  {/* Автоматический сбор контекста */}
  <div className="p-5 bg-gradient-to-br from-[#caf0f8]/30 to-[#ade8f4]/20 border border-[#90e0ef]/30 rounded-2xl">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-xl flex items-center justify-center shrink-0 shadow-md">
        <Monitor className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-[#03045e] mb-3">
          Автоматически собранная информация
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-white/60 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-3.5 h-3.5 text-[#0077b6]" />
              <p className="text-xs text-[#023e8a]/50 font-medium">Браузер</p>
            </div>
            <p className="text-sm text-[#03045e] font-medium truncate">
              {navigator.userAgent.split(' ').slice(-2).join(' ')}
            </p>
          </div>
          
          <div className="p-3 bg-white/60 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Laptop className="w-3.5 h-3.5 text-[#0077b6]" />
              <p className="text-xs text-[#023e8a]/50 font-medium">Платформа</p>
            </div>
            <p className="text-sm text-[#03045e] font-medium">
              {navigator.platform}
            </p>
          </div>
          
          <div className="p-3 bg-white/60 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Languages className="w-3.5 h-3.5 text-[#0077b6]" />
              <p className="text-xs text-[#023e8a]/50 font-medium">Язык</p>
            </div>
            <p className="text-sm text-[#03045e] font-medium">
              {navigator.language}
            </p>
          </div>
        </div>
        
        <p className="text-xs text-[#023e8a]/50 mt-3 flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          Эта информация поможет быстрее решить проблему
        </p>
      </div>
    </div>
  </div>

  {/* Подсказки по заполнению */}
  <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50/50 border border-amber-200/50 rounded-2xl">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center shrink-0">
        <Lightbulb className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="font-semibold text-amber-800 text-sm mb-2">
          Советы для быстрого решения
        </p>
        <ul className="text-xs text-amber-700/80 space-y-1.5">
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
            Опишите последовательность действий, которые привели к проблеме
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
            Укажите текст ошибки, если он отображается
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
            Прикрепите скриншот экрана с ошибкой
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

  );
};
