import { UseFormReturn } from 'react-hook-form';
import { getCategoryLabel, getCategoryIcon } from '../../utils/ticketHelpers';
import { cn } from '@/shared/lib/utils/cn';
import { CreateTicketFormData } from '@/shared/lib/schemas/ticketSchemas';
import { Label, Input } from '@/shared/ui';
import { TicketCategory } from '../../types/tickets.types';

interface Step1DescriptionProps {
  form: UseFormReturn<CreateTicketFormData>;
}

const categories = [
  TicketCategory.CARDS,
  TicketCategory.DEPOSITS,
  TicketCategory.LOANS,
  TicketCategory.MOBILE_APP,
  TicketCategory.PAYMENTS,
  TicketCategory.SECURITY,
  TicketCategory.OTHER,
];

export const Step1Description = ({ form }: Step1DescriptionProps) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const selectedCategory = watch('category');

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="space-y-2">
        <Label htmlFor="title" className="label-required">
          Кратко опишите проблему
        </Label>
        <Input
          id="title"
          placeholder="Например: Не могу войти в приложение"
          {...register('title')}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
        <p className="text-xs text-gray-500">
          От 5 до 200 символов
        </p>
      </div>

      {/* Категория */}
      <div className="space-y-3">
        <Label className="label-required">Выберите категорию</Label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setValue('category', category, { shouldValidate: true })}
              className={cn(
                'p-4 rounded-lg border-2 transition-all text-left',
                'hover:border-primary-300 hover:bg-primary-50',
                selectedCategory === category
                  ? 'border-primary-600 bg-primary-50 shadow-sm'
                  : 'border-gray-200 bg-white'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <span className="font-medium text-sm">
                  {getCategoryLabel(category)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {errors.category && (
          <p className="text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Подсказка */}
      {selectedCategory && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
          <p className="text-sm text-blue-900 font-medium mb-2">
            💡 Прежде чем создавать заявку
          </p>
          <p className="text-sm text-blue-700">
            Возможно, ответ на ваш вопрос уже есть в{' '}
            <a
              href="/knowledge-base"
              target="_blank"
              className="underline font-medium hover:text-blue-900"
            >
              базе знаний
            </a>
            . Это поможет решить проблему быстрее!
          </p>
        </div>
      )}
    </div>
  );
};
